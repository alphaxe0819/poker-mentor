#!/usr/bin/env node
/**
 * T-096 — Extract solver_postflop_6max + solver_postflop_mtt (jsonb tree)
 *        → gto_solutions (v2, flat by path)
 *
 * 舊 schema：每 row (scenario_slug, flop) 一 row，整棵 solver tree 塞 jsonb
 * 新 schema：每個 decision node 一 row
 *
 * 遞迴 walk tree：
 *   root(flop 首動) → children key 是動作字串（CHECK / BET 1.5 / CALL / FOLD / RAISE 4.0）
 *                  → 或 deal_card（轉/河牌發出，key 格式為 2-char 牌 e.g. 'Kh'）
 *   每個有 strategy 的節點 = 一 row
 *
 * 用法：
 *   node migrate-solver-postflop-to-v2.mjs            # dry-run
 *   node migrate-solver-postflop-to-v2.mjs --live     # 實搬
 *   node migrate-solver-postflop-to-v2.mjs --table solver_postflop_mtt --live  # 單表
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
// T-096b：改用共用 encoder lib（與 batch-worker.mjs 同一份）
import { encodeAction as libEncodeAction, advancePot as libAdvancePot } from '../gto-pipeline/lib/action-encoder.mjs'

// ── .env ──
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const envPath = resolve(__dirname, '..', 'gto-pipeline', '.env')
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  }
} catch { /* ignore */ }

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const args = process.argv.slice(2)
const LIVE = args.includes('--live')
const TABLE_FILTER = args.includes('--table')
  ? args[args.indexOf('--table') + 1]
  : null

// ── Scenario slug → (gametype, depth_bb, preflop_actions) 解析 ──
//
// 常見 slug 格式：
//   hu_40bb_srp / hu_25bb_3bp / hu_40bb_4bp
//   6max_100bb_srp_btn_open_bb_call / 6max_100bb_3bp_btn_open_sb_3b
//   9max_40bb_srp_btn_vs_bb / 9max_30bb_srp_co_vs_bb
//   mtt_40bb_srp_btn_open_bb_call
//
// 對應新 gametype（spec §5）:
//   hu_*      → hu_{depth}bb
//   6max_*    → cash_6max_100bb（目前只有 100bb）
//   9max_*    → mtt_9max_{depth}bb（9-max 在 pipeline 是 MTT 用）
//   mtt_*     → mtt_9max_{depth}bb
//
// preflop_actions 生成規則（GTOW 編碼）：
//   HU SRP:   'R2.5-C'
//   HU 3BP:   'R2.5-R8-C'           （BTN open → BB 3bet → BTN call）
//   HU 4BP:   'R2.5-R8-R22-C'       （BTN → BB 3bet → BTN 4bet → BB call）
//   6max SRP: 按位置序 F 填到 opener 前 + R2.5 + F 到 caller 前 + C
//   6max 3BP: opener 前 F + R2.5 + 中間 F + R8 + ... + C
//   9max/mtt SRP BTN vs BB: F×6 + R2.2 + F + C
//
// 位置順序：
//   6max: UTG-HJ-CO-BTN-SB-BB
//   9max: UTG-UTG1-UTG2-LJ-HJ-CO-BTN-SB-BB

const POS_ORDER_6MAX = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const POS_ORDER_9MAX = ['UTG', 'UTG1', 'UTG2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

function buildPreflopActions(format, potType, openerPos, callerOrThreeBPos, openSize = null) {
  const order = format === '6max' ? POS_ORDER_6MAX : POS_ORDER_9MAX
  const openSizeStr = openSize ?? (format === '6max' ? '2.5' : '2.2')

  const opener = openerPos?.toUpperCase()
  const second = callerOrThreeBPos?.toUpperCase()
  const openIdx = order.indexOf(opener)
  const secondIdx = order.indexOf(second)
  if (openIdx < 0 || secondIdx < 0) return null

  const tokens = order.map(() => 'F')
  tokens[openIdx] = `R${openSizeStr}`
  if (potType === 'srp') {
    tokens[secondIdx] = 'C'                      // flat call
  } else if (potType === '3bp') {
    tokens[secondIdx] = 'R8'                     // 3bet to ~8bb (粗估)
    // 後續 BTN call 假設，但 slug 只寫到 3better 為止 → 不加尾 token
  } else if (potType === '4bp') {
    tokens[secondIdx] = 'R8'
    // 4bet 回 opener 位置
    tokens[openIdx] = `R2.5-R22`                 // 用 chain 表示 opener 兩次動作
  }
  return tokens.join('-')
}

function parseScenarioSlug(slug, matchup) {
  // HU 系列
  let m = slug.match(/^hu_(\d+)bb_(srp|3bp|4bp)$/)
  if (m) {
    const depth = parseInt(m[1], 10)
    const potType = m[2]
    let preflop = 'R2.5-C'
    if (potType === '3bp') preflop = 'R2.5-R8-C'
    if (potType === '4bp') preflop = 'R2.5-R8-R22-C'
    // T-096b：加 pot_type 後綴對齊 T-097 gametype（hu_25bb_srp / hu_40bb_3bp 等）
    return { gametype: `hu_${depth}bb_${potType}`, depth_bb: depth, preflop_actions: preflop }
  }

  // 6max SRP：6max_100bb_srp_{opener}_open_{caller}_call
  m = slug.match(/^6max_(\d+)bb_srp_([a-z]+)_open_([a-z]+)_call$/)
  if (m) {
    const depth = parseInt(m[1], 10)
    const preflop = buildPreflopActions('6max', 'srp', m[2], m[3]) || 'R2.5-C'
    return { gametype: `cash_6max_${depth}bb_srp`, depth_bb: depth, preflop_actions: preflop }
  }

  // 6max 3BP：6max_100bb_3bp_{opener}_open_{3better}_3b
  m = slug.match(/^6max_(\d+)bb_3bp_([a-z]+)_open_([a-z]+)_3b$/)
  if (m) {
    const depth = parseInt(m[1], 10)
    const preflop = buildPreflopActions('6max', '3bp', m[2], m[3]) || 'R2.5-R8'
    return { gametype: `cash_6max_${depth}bb_3bp`, depth_bb: depth, preflop_actions: preflop }
  }

  // 9max SRP：9max_{depth}bb_srp_{ip}_vs_bb
  m = slug.match(/^9max_(\d+)bb_srp_([a-z]+)_vs_([a-z]+)$/)
  if (m) {
    const depth = parseInt(m[1], 10)
    const preflop = buildPreflopActions('9max', 'srp', m[2], m[3]) || 'R2.2-C'
    return { gametype: `mtt_9max_${depth}bb_srp`, depth_bb: depth, preflop_actions: preflop }
  }

  // MTT：mtt_{depth}bb_srp_btn_open_bb_call 等
  m = slug.match(/^mtt_(\d+)bb_srp_([a-z]+)_open_([a-z]+)_call$/)
  if (m) {
    const depth = parseInt(m[1], 10)
    const preflop = buildPreflopActions('9max', 'srp', m[2], m[3]) || 'R2.2-C'
    return { gametype: `mtt_9max_${depth}bb_srp`, depth_bb: depth, preflop_actions: preflop }
  }

  // Fallback：無法 parse 的直接塞 raw slug 當 gametype（不丟資料）
  console.warn(`[parseScenarioSlug] Unknown slug pattern: ${slug} → fallback raw`)
  return {
    gametype: slug,
    depth_bb: 0,
    preflop_actions: matchup ? `R?-C` : 'R?-C',
  }
}

// T-096b：encode / advancePot 全用 lib/action-encoder.mjs（libEncodeAction / libAdvancePot）
// 本檔保留 `isActionKey` wrapper 判斷「可編碼的 action key」與「card deal key」
function isActionKey(key) {
  if (typeof key !== 'string') return false
  if (key === 'CHECK' || key === 'CALL' || key === 'FOLD') return true
  return /^(BET|RAISE)\s+[\d.]+$/.test(key)
}

// 2-char card key 判定：'Kh' / '2c' / 'Tc' 等
function isCardKey(key) {
  if (typeof key !== 'string' || key.length !== 2) return false
  return /^[2-9TJQKA][cdhs]$/.test(key)
}

// ── Tree walk ──
// 狀態：{ flop_actions, turn_card, turn_actions, river_card, river_actions, pot, street }
// street ∈ 'flop' | 'turn' | 'river'
function walkTree(node, state, effStack, ctx, emit) {
  if (!node) return

  // Emit 此節點（if has strategy）
  if (node.strategy && typeof node.strategy === 'object') {
    const hands = {}
    const actions = node.actions || []
    for (const [hand, freqs] of Object.entries(node.strategy)) {
      // freqs 是 [p_action0, p_action1, ...]（already aggregated to hand class by convert-to-db.mjs）
      const entries = []
      for (let i = 0; i < actions.length; i++) {
        const f = Array.isArray(freqs) ? freqs[i] : null
        if (f == null || f < 0.01) continue   // 丟 <1% 噪音
        const encoded = libEncodeAction(actions[i], state.pot, effStack)
        entries.push({ action: encoded, freq: Math.round(f * 10000) / 10000, ev: null })
      }
      if (entries.length > 0) hands[hand] = entries
    }
    if (Object.keys(hands).length > 0) {
      emit({
        ...ctx,
        flop_actions: state.flop_actions,
        turn_card: state.turn_card,
        turn_actions: state.turn_actions,
        river_card: state.river_card,
        river_actions: state.river_actions,
        hands,
        player: node.player,
      })
    }
  }

  // 遞迴 children
  if (!node.children) return
  for (const [childKey, childNode] of Object.entries(node.children)) {
    // Card deal（進下一街；新街 betFacing 重設為 0）
    if (isCardKey(childKey)) {
      const newState = { ...state, betFacing: 0 }
      if (state.street === 'flop') {
        newState.turn_card = childKey
        newState.street = 'turn'
      } else if (state.street === 'turn') {
        newState.river_card = childKey
        newState.street = 'river'
      }
      walkTree(childNode, newState, effStack, ctx, emit)
      continue
    }

    // Action（append 到當前街的 actions，更新 pot + betFacing via lib）
    if (!isActionKey(childKey)) {
      // 未知 key → 略過（不動 state），繼續 walk child
      walkTree(childNode, state, effStack, ctx, emit)
      continue
    }
    const encoded = libEncodeAction(childKey, state.pot, effStack)

    const fieldMap = {
      flop: 'flop_actions',
      turn: 'turn_actions',
      river: 'river_actions',
    }
    const field = fieldMap[state.street]
    const newState = { ...state }
    newState[field] = state[field] ? `${state[field]}-${encoded}` : encoded

    // 用 libAdvancePot（與 batch-worker extractSpots 同一份 pot 模型）
    const { pot: newPot, betFacing: newBetFacing } =
      libAdvancePot(state.pot, state.betFacing ?? 0, childKey)
    newState.pot = newPot
    newState.betFacing = newBetFacing

    walkTree(childNode, newState, effStack, ctx, emit)
  }
}

// ── Main ──

async function migrateTable(tableName) {
  console.log(`\n=== Migrating ${tableName} ===`)
  const { data: rows, error } = await supabase
    .from(tableName)
    .select('scenario_slug, flop, ip_pos, oop_pos, pot_bb, effective_stack_bb, tree, solver_config')
  if (error) {
    console.error(`Fetch ${tableName} failed:`, error.message)
    return 0
  }
  console.log(`  ${rows.length} tree rows`)

  const solutions = []
  let totalNodes = 0
  const statsByGametype = {}

  for (const row of rows) {
    const parsed = parseScenarioSlug(row.scenario_slug, { ip: row.ip_pos, oop: row.oop_pos })
    const initState = {
      flop_actions: '',
      turn_card: '',
      turn_actions: '',
      river_card: '',
      river_actions: '',
      pot: Number(row.pot_bb),
      betFacing: 0,                // T-096b：libAdvancePot 需要此 state
      street: 'flop',
    }
    const ctx = {
      gametype: parsed.gametype,
      depth_bb: parsed.depth_bb,
      preflop_actions: parsed.preflop_actions,
      board: row.flop,
      solver_config: row.solver_config,
      source_slug: row.scenario_slug,
    }

    const nodesForRow = []
    walkTree(row.tree, initState, Number(row.effective_stack_bb), ctx, (n) => {
      nodesForRow.push(n)
    })
    totalNodes += nodesForRow.length
    statsByGametype[parsed.gametype] = (statsByGametype[parsed.gametype] || 0) + nodesForRow.length

    for (const n of nodesForRow) {
      solutions.push({
        gametype: n.gametype,
        depth_bb: n.depth_bb,
        preflop_actions: n.preflop_actions,
        board: n.board,
        flop_actions: n.flop_actions,
        turn_card: n.turn_card || '',
        turn_actions: n.turn_actions,
        river_card: n.river_card || '',
        river_actions: n.river_actions,
        node_data: {
          hands: n.hands,
          aggregated: null,
          node_type: n.player === 0 ? 'ip_decision' : (n.player === 1 ? 'oop_decision' : null),
          migrated_from: tableName,
          source_slug: n.source_slug,
        },
        source: 'self_solver',
        solver_config: n.solver_config,
      })
    }
  }

  console.log(`  Extracted ${totalNodes} decision nodes`)
  console.log(`  Breakdown by gametype:`, statsByGametype)

  if (solutions.length > 0) {
    console.log(`  Sample:`)
    console.log(`    ${solutions[0].gametype} | ${solutions[0].preflop_actions} | ${solutions[0].board}`)
    console.log(`    flop='${solutions[0].flop_actions}' turn=${solutions[0].turn_card}/'${solutions[0].turn_actions}' river=${solutions[0].river_card}/'${solutions[0].river_actions}'`)
    console.log(`    hands keys: ${Object.keys(solutions[0].node_data.hands).length}`)
  }

  // Dedup：同一 PK 會被後者覆蓋，提前 local dedup 避免 chunk 內 conflict
  const pkMap = new Map()
  for (const s of solutions) {
    const pk = [
      s.gametype, s.depth_bb, s.preflop_actions, s.board,
      s.flop_actions, s.turn_card, s.turn_actions, s.river_card, s.river_actions,
    ].join('|')
    pkMap.set(pk, s)  // last-write-wins
  }
  const deduped = [...pkMap.values()]
  if (deduped.length < solutions.length) {
    console.log(`  Local dedup: ${solutions.length} → ${deduped.length} (same path emit multiple times)`)
  }

  if (!LIVE) return deduped.length

  // Live upsert
  const CHUNK = 200   // node_data 較大，壓小 chunk
  let uploaded = 0
  for (let i = 0; i < deduped.length; i += CHUNK) {
    const chunk = deduped.slice(i, i + CHUNK)
    const { error: upErr } = await supabase
      .from('gto_solutions')
      .upsert(chunk, {
        onConflict: 'gametype,depth_bb,preflop_actions,board,flop_actions,turn_card,turn_actions,river_card,river_actions',
      })
    if (upErr) {
      console.error(`  Upsert chunk ${i} failed:`, upErr.message)
      return uploaded
    }
    uploaded += chunk.length
    if (uploaded % 1000 === 0 || uploaded === deduped.length) {
      console.log(`  Uploaded ${uploaded}/${deduped.length}`)
    }
  }
  return uploaded
}

async function main() {
  console.log('===========================================')
  console.log(' T-096 migrate solver_postflop_* → gto_solutions')
  console.log(` Mode: ${LIVE ? 'LIVE' : 'DRY-RUN'}${TABLE_FILTER ? ` (table=${TABLE_FILTER})` : ''}`)
  console.log('===========================================')

  const tables = TABLE_FILTER
    ? [TABLE_FILTER]
    : ['solver_postflop_6max', 'solver_postflop_mtt']

  let grandTotal = 0
  for (const t of tables) {
    const n = await migrateTable(t)
    grandTotal += n
  }

  console.log('\n===========================================')
  console.log(` Total nodes: ${grandTotal}`)

  if (!LIVE) {
    console.log(' [DRY-RUN] 加 --live 實際 upsert 到 gto_solutions')
    return
  }

  // Count 驗證（分 gametype 對照 dry-run 統計；T-096b _srp/_3bp 後綴）
  for (const gt of ['cash_6max_100bb_srp', 'cash_6max_100bb_3bp', 'mtt_9max_40bb_srp']) {
    const { count, error: cntErr } = await supabase
      .from('gto_solutions')
      .select('*', { count: 'exact', head: true })
      .eq('source', 'self_solver')
      .eq('gametype', gt)
    if (cntErr) {
      console.warn(` Count verify ${gt} failed:`, cntErr.message)
    } else {
      console.log(` Verify: gametype='${gt}' count = ${count}`)
    }
  }
  console.log('\n✅ Done')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
