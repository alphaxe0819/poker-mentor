#!/usr/bin/env node
/**
 * T-096 — Extract gto_postflop (flat rows, HU turn/river) → gto_solutions (v2)
 *
 * 舊 schema：每 row 一個 (board, turn, river, street, stack_label, role, hand_class) → action_code
 * 新 schema：每 (board, turn, river, street, stack_label, role) group 一 row，
 *           169 hands 壓進 node_data.hands jsonb
 *
 * 用法：
 *   node migrate-gto-postflop-to-v2.mjs            # dry-run（印統計，不寫 DB）
 *   node migrate-gto-postflop-to-v2.mjs --live     # 實搬
 *
 * 環境變數（從 scripts/gto-pipeline/.env 載入）：
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY   — bypass RLS
 *
 * 已知限制（migration 是 lossy 的）：
 *   - 舊 gto_postflop 沒存 EV → node_data.hands[].ev 全 null（T-097 新 batch 會抓）
 *   - 舊 role 欄位 collapse 了 flop path 資訊 → flop_actions / turn_actions 只能粗估
 *     (role → action 對照表見下方 ROLE_TO_ACTIONS)
 *   - 舊表都是 HU（stack_label ∈ '13bb'/'25bb'/'40bb'）→ gametype='hu_{depth}bb_srp'
 *     （T-096b：加 _srp 後綴對齊 T-097 seed-batches gametype 風格）
 *     preflop_actions 固定 'R2.5-C'（HU SRP BTN open + BB call）
 *   - T-096b：action_code 全部轉 UPPERCASE GTOW spec（x→X, b33→B33, allin→RAI）
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// T-096b：共用 encoder lib（雖然舊 action_code 是 pre-encoded 字串不是
// raw solver "CHECK"/"BET X" 無法直接用 encodeAction，但 import 留著讓未來
// 一致使用，也提醒新舊格式同一來源）
// eslint-disable-next-line no-unused-vars
import { encodeAction, advancePot } from '../gto-pipeline/lib/action-encoder.mjs'

// ── .env loader（抄 batch-worker.mjs 模式）────────────

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
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY (set in scripts/gto-pipeline/.env)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const args = process.argv.slice(2)
const LIVE = args.includes('--live')
const LIMIT = parseInt(args[args.indexOf('--limit') + 1], 10) || null

// ── role → (flop_actions, turn_actions, river_actions) 對照 ────
// 舊 pathToRole 只記「最近一個動作 + player」，loses flop path。
// 遷移時假設 flop 打完進 turn（flop_actions='X-X'），river 同理。
// role 的 player 前綴決定誰在決策（btn=IP, bb=OOP）+ 該街的 action 序列。
//
// 例：street=turn + role='bb_bet' → BB 面對空節點，OOP 首動
//                                    → flop='X-X', turn_actions=''
//     street=turn + role='btn_facing_bet_mid' → BB bet B50, BTN 決策
//                                    → flop='X-X', turn_actions='B50'
//     street=river + role='bb_bet' → flop+turn 打完過, BB 在 river 首動
//                                    → flop='X-X', turn='X-X', river_actions=''
//
// B<pct> 桶：small=B33 / mid=B50 / large=B100（粗估；pathToRole amt 桶界 5/20 對應）
function roleToActions(role, street) {
  // bb_bet / btn_bet 代表「首動或面對 check」
  // bb_facing_bet_{size} 代表 BB 面對 IP 的 bet（但 BB 是 OOP 先動，所以只可能是
  //   BB check → BTN bet → BB decide，即 turn_actions='X-B{size}' / 'X-B{size}-R' 之類）
  //   為簡化統一用 `X-B{size}` 當 BB 面對 bet 的最短 path。
  // btn_facing_bet_{size} 代表 BTN（IP）面對 OOP bet，即 BB bet → BTN decide，
  //   turn_actions='B{size}'
  const sizeMap = { small: 'B33', mid: 'B50', large: 'B100' }

  let seq = ''
  if (role.endsWith('_bet')) {
    // 首動（包含面對 check）；無前置動作
    seq = ''
  } else if (role.includes('facing_bet_')) {
    const bucket = role.split('facing_bet_')[1]
    const sizeCode = sizeMap[bucket] || 'B50'
    if (role.startsWith('bb_')) {
      // BB 面對 bet：BB check → BTN bet → BB decide
      seq = `X-${sizeCode}`
    } else {
      // BTN 面對 bet：BB bet → BTN decide
      seq = sizeCode
    }
  } else {
    // 未知 role → 保守放空字串，仍唯一（因為 role 會寫進 node_data.source_role）
    seq = ''
  }

  // 根據 street 分配到正確欄位
  if (street === 'turn') {
    return { flop_actions: 'X-X', turn_actions: seq, river_actions: '' }
  }
  if (street === 'river') {
    return { flop_actions: 'X-X', turn_actions: 'X-X', river_actions: seq }
  }
  // flop / 未知街：全塞進 flop_actions（安全起見）
  return { flop_actions: seq, turn_actions: '', river_actions: '' }
}

// ── legacy action_code → GTOW UPPERCASE 對照（T-096b）────
// 舊 pickAction 產 lowercase 字面：'x' / 'c' / 'f' / 'b33' / 'b50' / 'b100' /
// 'allin' / 'r' / 'rbig'。GTOW spec §4 要 UPPERCASE：
const LEGACY_CODE_MAP = {
  x: 'X', c: 'C', f: 'F',
  b33: 'B33', b50: 'B50', b100: 'B100',
  allin: 'RAI',
  r: 'R', rbig: 'RBIG',
}
function normalizeLegacyCode(code) {
  if (LEGACY_CODE_MAP[code]) return LEGACY_CODE_MAP[code]
  // 未列舉的 lowercase 單 token → 直接 toUpperCase（b{pct} 等）
  return typeof code === 'string' ? code.toUpperCase() : code
}

// ── action_code 解碼（'b33' / 'mix:b33@60,x' / 'x' / 'c' / 'f' / 'allin' / 'r'）────
// 回傳 [{action, freq, ev: null}]，action 一律 UPPERCASE GTOW（T-096b）
function decodeActionCode(code) {
  if (!code) return []
  if (code.startsWith('mix:')) {
    // 'mix:b33@60,x' → [{B33, 0.6}, {X, 0.4}]
    const body = code.slice(4)
    const parts = body.split(',')
    const first = parts[0]
    const atIdx = first.indexOf('@')
    if (atIdx < 0) {
      return [{ action: normalizeLegacyCode(first), freq: 1.0, ev: null }]
    }
    const firstAction = first.slice(0, atIdx)
    const firstFreq = parseInt(first.slice(atIdx + 1), 10) / 100
    const secondAction = parts[1] || 'x'
    return [
      { action: normalizeLegacyCode(firstAction), freq: Math.round(firstFreq * 10000) / 10000, ev: null },
      { action: normalizeLegacyCode(secondAction), freq: Math.round((1 - firstFreq) * 10000) / 10000, ev: null },
    ]
  }
  return [{ action: normalizeLegacyCode(code), freq: 1.0, ev: null }]
}

// ── Main ────────────────────────────────────────────

async function main() {
  console.log('===========================================')
  console.log(' T-096 migrate gto_postflop → gto_solutions')
  console.log(` Mode: ${LIVE ? 'LIVE' : 'DRY-RUN'}${LIMIT ? ` (limit ${LIMIT})` : ''}`)
  console.log('===========================================\n')

  // 1. 抓全部 gto_postflop（594 rows 可一次讀）
  let query = supabase
    .from('gto_postflop')
    .select('board_key, turn_card, river_card, street, stack_label, role, hand_class, action_code')
    .order('stack_label')
    .order('board_key')
    .order('turn_card')
    .order('river_card')
    .order('street')
    .order('role')
    .order('hand_class')

  if (LIMIT) query = query.limit(LIMIT)

  const { data: rows, error } = await query
  if (error) {
    console.error('Fetch failed:', error.message)
    process.exit(1)
  }
  console.log(`Fetched ${rows.length} gto_postflop rows`)

  // 2. Group by (board, turn, river, street, stack_label, role)
  const groups = new Map()
  for (const r of rows) {
    const key = [r.board_key, r.turn_card, r.river_card, r.street, r.stack_label, r.role].join('|')
    if (!groups.has(key)) {
      groups.set(key, {
        board_key: r.board_key,
        turn_card: r.turn_card,
        river_card: r.river_card,
        street: r.street,
        stack_label: r.stack_label,
        role: r.role,
        hands: {},
      })
    }
    groups.get(key).hands[r.hand_class] = decodeActionCode(r.action_code)
  }
  console.log(`Grouped into ${groups.size} spots (= gto_solutions rows to write)`)

  // 3. 統計
  const statsByStack = {}
  const statsByStreet = {}
  const statsByRole = {}
  for (const g of groups.values()) {
    statsByStack[g.stack_label] = (statsByStack[g.stack_label] || 0) + 1
    statsByStreet[g.street] = (statsByStreet[g.street] || 0) + 1
    statsByRole[g.role] = (statsByRole[g.role] || 0) + 1
  }
  console.log('\nBreakdown by stack_label:', statsByStack)
  console.log('Breakdown by street:', statsByStreet)
  console.log('Breakdown by role:', statsByRole)

  // 4. 組 gto_solutions rows
  const solutions = []
  for (const g of groups.values()) {
    const depth_bb = parseInt(g.stack_label, 10)                 // '25bb' → 25
    // T-096b：gametype 加 _srp 後綴對齊 T-097 (`hu_25bb_srp` 等)
    // 舊 gto_postflop 資料都是 T-045 HU SRP 跑出來的（BTN open + BB call SRP pot），
    // 沒有其他 pot_type 資料，所以固定 _srp。
    const gametype = `hu_${g.stack_label}_srp`                   // 'hu_25bb_srp'
    const { flop_actions, turn_actions, river_actions } = roleToActions(g.role, g.street)

    solutions.push({
      gametype,
      depth_bb,
      preflop_actions: 'R2.5-C',                           // HU SRP BTN open 2.5 + BB call
      board: g.board_key,
      flop_actions,
      turn_card: g.turn_card || '',
      turn_actions,
      river_card: g.river_card || '',
      river_actions,
      node_data: {
        hands: g.hands,
        aggregated: null,                                   // 舊資料無 aggregated，留 null
        node_type: null,
        source_role: g.role,                                // 保留原 role 方便 debug / reverse lookup
        migrated_from: 'gto_postflop',
      },
      source: 'self_solver',
      solver_config: null,
    })
  }

  console.log(`\nBuilt ${solutions.length} gto_solutions rows`)
  console.log('Sample row:')
  console.log(JSON.stringify({
    ...solutions[0],
    node_data: {
      ...solutions[0].node_data,
      hands: `<${Object.keys(solutions[0].node_data.hands).length} hands>`,
    },
  }, null, 2))
  console.log('Sample hand:', Object.entries(solutions[0].node_data.hands).slice(0, 3))

  if (!LIVE) {
    console.log('\n[DRY-RUN] 加 --live 實際 upsert 到 gto_solutions')
    return
  }

  // 5. Live upsert（500 rows/chunk）
  const CHUNK = 500
  let uploaded = 0
  for (let i = 0; i < solutions.length; i += CHUNK) {
    const chunk = solutions.slice(i, i + CHUNK)
    const { error: upErr } = await supabase
      .from('gto_solutions')
      .upsert(chunk, {
        onConflict: 'gametype,depth_bb,preflop_actions,board,flop_actions,turn_card,turn_actions,river_card,river_actions',
      })
    if (upErr) {
      console.error(`Upsert chunk ${i}-${i + chunk.length} failed:`, upErr.message)
      process.exit(1)
    }
    uploaded += chunk.length
    console.log(`  Uploaded ${uploaded}/${solutions.length}`)
  }

  // 6. Count 驗證
  const { count, error: cntErr } = await supabase
    .from('gto_solutions')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'self_solver')
    .like('gametype', 'hu_%_srp')
  if (cntErr) {
    console.warn('Count verify failed:', cntErr.message)
  } else {
    console.log(`\nVerify: gto_solutions WHERE gametype LIKE 'hu_%_srp' AND source='self_solver' count = ${count}`)
    console.log(`Expected: >= ${solutions.length}`)
    if (count < solutions.length) console.warn('⚠ count 少於預期，可能有 upsert 失敗或被 conflict 合併')
  }

  console.log('\n✅ Done')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
