#!/usr/bin/env node
/**
 * GTO Batch Worker — 雙機自動解算 + 上傳
 * =============================================================
 * 流程：
 *   1. 連線 Supabase（service_role）
 *   2. 呼叫 claim_gto_batch RPC 領取一個 pending 任務
 *   3. 產生 TexasSolver input file
 *   4. 跑 solver
 *   5. 解析 JSON → extract turn/river 節點
 *   6. Upsert rows 到 gto_postflop
 *   7. 標記 done，回到 2
 *
 * 使用方式：
 *   node batch-worker.mjs --machine DESKTOP-A
 *   node batch-worker.mjs --machine DESKTOP-B --dry-run
 *
 * 環境變數（或 .env）：
 *   SUPABASE_URL          — Supabase project URL
 *   SUPABASE_SERVICE_KEY  — service_role key（bypass RLS）
 *
 * 前置條件：
 *   - TexasSolver 解壓在 scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/
 *   - npm install @supabase/supabase-js dotenv（在 scripts/gto-pipeline/ 下）
 *   - gto_batch_progress 表已建立且有 pending 任務（跑 seed-batches.mjs）
 * =============================================================
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

// ── Config ─────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env if present
try {
  const envPath = resolve(__dirname, '.env')
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) process.env[match[1].trim()] = match[2].trim()
    }
  }
} catch { /* ignore */ }

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  console.error('Set them in scripts/gto-pipeline/.env or environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// CLI args
const args = process.argv.slice(2)
const machineId = getArg('--machine') || `WORKER-${Date.now()}`
const dryRun = args.includes('--dry-run')
const keepJson = args.includes('--keep-json')
const maxBatches = parseInt(getArg('--max') || '0', 10) || Infinity

function getArg(name) {
  const idx = args.indexOf(name)
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null
}

// Solver paths
const SOLVER_DIR = resolve(__dirname, 'TexasSolver-v0.2.0-Windows')
const SOLVER_NESTED = resolve(SOLVER_DIR, 'TexasSolver-v0.2.0-Windows', 'console_solver.exe')
const SOLVER_FLAT = resolve(SOLVER_DIR, 'console_solver.exe')
const SOLVER_EXE_DIR = existsSync(SOLVER_NESTED)
  ? resolve(SOLVER_DIR, 'TexasSolver-v0.2.0-Windows')
  : existsSync(SOLVER_FLAT) ? SOLVER_DIR : null

if (!SOLVER_EXE_DIR && !dryRun) {
  console.error('TexasSolver not found. Download and extract to:')
  console.error(`  ${SOLVER_DIR}/`)
  process.exit(1)
}

const OUTPUT_DIR = resolve(__dirname, 'output')
mkdirSync(OUTPUT_DIR, { recursive: true })
if (SOLVER_EXE_DIR) {
  mkdirSync(resolve(SOLVER_EXE_DIR, 'output'), { recursive: true })
}

// ── Board + Range data ─────────────────────────────────

import { BOARDS, STACK_RATIOS, HU_40BB_RANGES, HU_25BB_RANGES, HU_13BB_RANGES } from './boards.mjs'

function getRanges(slug) {
  if (slug === '13bb') return HU_13BB_RANGES
  if (slug === '25bb') return HU_25BB_RANGES
  return HU_40BB_RANGES
}

function getStackConfig(stackLabel) {
  return STACK_RATIOS.find(s => s.slug === stackLabel)
}

function getBoardConfig(boardKey) {
  return BOARDS.find(b => b.slug === boardKey)
}

// ── TexasSolver input generation ───────────────────────

function buildTurnInput(board, turnCard, stack) {
  const ranges = getRanges(stack.slug)
  const boardCards = `${board.cards},${turnCard}`  // e.g. 'As,7d,2c,Kh'

  const lines = [
    `set_pot ${stack.pot_bb}`,
    `set_effective_stack ${stack.effective_stack_bb}`,
    `set_board ${boardCards}`,
    `set_range_ip ${ranges.ip}`,
    `set_range_oop ${ranges.oop}`,
  ]

  // Turn bet sizes (same as generate-input.mjs turn section)
  for (const pos of ['oop', 'ip']) {
    lines.push(`set_bet_sizes ${pos},turn,bet,50,75`)
    lines.push(`set_bet_sizes ${pos},turn,raise,60`)
    lines.push(`set_bet_sizes ${pos},turn,allin`)
    lines.push(`set_bet_sizes ${pos},river,bet,50,100`)
    if (pos === 'oop') lines.push(`set_bet_sizes oop,river,donk,50`)
    lines.push(`set_bet_sizes ${pos},river,raise,60,100`)
    lines.push(`set_bet_sizes ${pos},river,allin`)
  }

  lines.push('set_allin_threshold 0.67')
  lines.push('build_tree')
  lines.push('set_thread_num 8')
  lines.push('set_accuracy 0.5')
  lines.push('set_max_iteration 200')
  lines.push('set_print_interval 50')
  lines.push('set_use_isomorphism 1')
  lines.push('start_solve')
  lines.push('set_dump_rounds 3')  // flop + turn + river
  lines.push('dump_result output/batch_solve.json')
  return lines.join('\n') + '\n'
}

// ── Solver execution ───────────────────────────────────

function runSolver(inputContent) {
  const inputPath = resolve(SOLVER_EXE_DIR, 'batch_input.txt')
  writeFileSync(inputPath, inputContent, 'utf8')

  const start = Date.now()
  try {
    execSync('.\\console_solver.exe -i batch_input.txt', {
      cwd: SOLVER_EXE_DIR,
      stdio: 'inherit',
      timeout: 30 * 60 * 1000,  // 30 min timeout
    })
  } catch (err) {
    throw new Error(`Solver failed: ${err.message}`)
  }
  const duration = ((Date.now() - start) / 1000).toFixed(1)

  const jsonPath = resolve(SOLVER_EXE_DIR, 'output', 'batch_solve.json')
  if (!existsSync(jsonPath)) {
    throw new Error('Solver produced no output JSON')
  }

  console.log(`  Solver done in ${duration}s`)
  return jsonPath
}

// ── JSON → DB rows conversion ──────────────────────────

const RANK_ORDER = '23456789TJQKA'
function rankIdx(r) { return RANK_ORDER.indexOf(r) }

function comboToClass(combo) {
  if (combo.length !== 4) return null
  const r1 = combo[0], s1 = combo[1], r2 = combo[2], s2 = combo[3]
  if (r1 === r2) return r1 + r2
  const hi = rankIdx(r1) > rankIdx(r2) ? r1 : r2
  const lo = rankIdx(r1) > rankIdx(r2) ? r2 : r1
  return hi + lo + (s1 === s2 ? 's' : 'o')
}

function aggregateToClasses(comboStrategy, actions) {
  const classSum = {}
  const classCount = {}
  for (const [combo, freqs] of Object.entries(comboStrategy)) {
    const cls = comboToClass(combo)
    if (!cls) continue
    if (!classSum[cls]) { classSum[cls] = new Array(actions.length).fill(0); classCount[cls] = 0 }
    for (let i = 0; i < actions.length; i++) classSum[cls][i] += freqs[i]
    classCount[cls]++
  }
  const result = {}
  for (const cls of Object.keys(classSum)) {
    result[cls] = classSum[cls].map(s => s / classCount[cls])
  }
  return result
}

function buildActionCodeMap(actions, effectiveStack) {
  const map = {}
  const bets = []
  const raises = []
  for (const a of actions) {
    if (a === 'CHECK') map[a] = 'x'
    else if (a === 'CALL') map[a] = 'c'
    else if (a === 'FOLD') map[a] = 'f'
    else if (a.startsWith('BET ')) bets.push(a)
    else if (a.startsWith('RAISE ')) raises.push(a)
  }
  bets.sort((a, b) => parseFloat(a.split(' ')[1]) - parseFloat(b.split(' ')[1]))
  raises.sort((a, b) => parseFloat(a.split(' ')[1]) - parseFloat(b.split(' ')[1]))

  const betBuckets = ['b33', 'b50', 'b100']
  let bi = 0
  for (const b of bets) {
    const amt = parseFloat(b.split(' ')[1])
    map[b] = amt >= effectiveStack * 0.95 ? 'allin' : (betBuckets[bi++] || `b${Math.round((amt / 5) * 100)}`)
  }
  for (let i = 0; i < raises.length; i++) {
    const amt = parseFloat(raises[i].split(' ')[1])
    map[raises[i]] = amt >= effectiveStack * 0.95 ? 'allin' : (i === 0 ? 'r' : 'rbig')
  }
  return map
}

function pickAction(actions, freqs, codeMap) {
  const pairs = actions.map((a, i) => ({ action: a, freq: freqs[i] })).sort((a, b) => b.freq - a.freq)
  const top = pairs[0]
  const second = pairs[1]
  const topCode = codeMap[top.action] ?? '?'
  if (top.freq >= 0.7 || !second || second.freq < 0.25) return topCode
  const secondCode = codeMap[second.action] ?? '?'
  return `mix:${topCode}@${Math.round(top.freq * 100)},${secondCode}`
}

/**
 * 從 solver JSON 的 game tree 中提取 turn/river 節點的策略。
 * 回傳: Array<{ role, handClass, actionCode }>
 */
function extractTurnRiverNodes(data, effectiveStack, street) {
  const rows = []

  function walkNode(node, path, depth) {
    if (!node || depth > 6) return  // 限制深度避免無限遞迴

    // 如果此節點有 strategy，提取
    if (node.strategy?.strategy && node.actions) {
      const role = pathToRole(path, node.player)
      if (role) {
        const codeMap = buildActionCodeMap(node.actions, effectiveStack)
        const classAvg = aggregateToClasses(node.strategy.strategy, node.actions)
        for (const [hand, freqs] of Object.entries(classAvg)) {
          const actionCode = pickAction(node.actions, freqs, codeMap)
          rows.push({ role, handClass: hand, actionCode })
        }
      }
    }

    // 遞迴子節點
    if (node.childrens) {
      for (const [actionKey, childNode] of Object.entries(node.childrens)) {
        walkNode(childNode, [...path, actionKey], depth + 1)
      }
    }
  }

  // TexasSolver JSON 結構：
  // root → CHECK/BET children (flop 第一層)
  //   → ... (flop 後續)
  //     → deal_card children (turn)
  //       → CHECK/BET children (turn 決策)
  //         → deal_card children (river)
  //           → CHECK/BET children (river 決策)
  // 我們只需要 turn 和 river 層的 strategy 節點

  walkNode(data, ['root'], 0)
  return rows
}

/**
 * 根據 action path 和 player ID 推斷 role 名稱。
 * player 0 = IP (BTN), player 1 = OOP (BB)
 *
 * 這個函式需要根據實際的 TexasSolver JSON 結構調整。
 * 初版：從 path 中判斷是主動出擊還是面對 bet。
 */
function pathToRole(path, player) {
  const playerName = player === 0 ? 'btn' : 'bb'

  // 找最近的 non-root action
  const actions = path.filter(p => p !== 'root')
  if (actions.length === 0) return null

  const lastAction = actions[actions.length - 1]
  const prevAction = actions.length >= 2 ? actions[actions.length - 2] : null

  // 面對 check → 自己的 bet/check 決策
  if (lastAction === 'CHECK' || !prevAction) {
    return `${playerName}_bet`  // 可以 bet 或 check
  }

  // 面對 bet
  if (lastAction.startsWith('BET ') || lastAction.startsWith('RAISE ')) {
    const amt = parseFloat(lastAction.split(' ')[1])
    // 粗略分桶
    if (amt >= 20) return `${playerName}_facing_bet_large`
    if (amt >= 5) return `${playerName}_facing_bet_mid`
    return `${playerName}_facing_bet_small`
  }

  return `${playerName}_bet`
}

// ── Supabase upload ────────────────────────────────────

async function uploadRows(rows, batch) {
  const CHUNK_SIZE = 500  // Supabase upsert 一次最多建議 500 rows
  let uploaded = 0

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map(r => ({
      board_key: batch.board_key,
      turn_card: batch.turn_card,
      river_card: batch.river_card || '',
      street: batch.street,
      stack_label: batch.stack_label,
      role: r.role,
      hand_class: r.handClass,
      action_code: r.actionCode,
    }))

    const { error } = await supabase
      .from('gto_postflop')
      .upsert(chunk, {
        onConflict: 'board_key,turn_card,river_card,street,stack_label,role,hand_class',
      })

    if (error) throw new Error(`Upsert failed at chunk ${i}: ${error.message}`)
    uploaded += chunk.length
  }

  return uploaded
}

async function markBatchStatus(batchId, status, extra = {}) {
  const { error } = await supabase
    .from('gto_batch_progress')
    .update({ status, ...extra })
    .eq('id', batchId)
  if (error) console.error(`  Failed to mark batch ${batchId} as ${status}:`, error.message)
}

// ── Main loop ──────────────────────────────────────────

async function main() {
  console.log('===========================================')
  console.log(` GTO Batch Worker — ${machineId}`)
  console.log(` Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log('===========================================\n')

  let completed = 0

  while (completed < maxBatches) {
    // 1. 領取任務
    const { data: claimed, error: claimError } = await supabase.rpc('claim_gto_batch', {
      p_machine_id: machineId,
    })

    if (claimError) {
      console.error('Claim RPC error:', claimError.message)
      break
    }

    if (!claimed || claimed.length === 0) {
      console.log('\n✅ No more pending batches. All done!')
      break
    }

    const batch = claimed[0]
    console.log(`\n[${completed + 1}] Claimed: ${batch.street} | ${batch.board_key} + ${batch.turn_card}${batch.river_card ? ' + ' + batch.river_card : ''} | ${batch.stack_label}`)

    if (dryRun) {
      console.log('  (dry run — skipping solver)')
      await markBatchStatus(batch.id, 'pending', { machine_id: null, claimed_at: null })
      completed++
      continue
    }

    try {
      // 2. 產生 input
      const boardConfig = getBoardConfig(batch.board_key)
      const stackConfig = getStackConfig(batch.stack_label)
      if (!boardConfig || !stackConfig) throw new Error(`Unknown board/stack: ${batch.board_key}/${batch.stack_label}`)

      const inputContent = buildTurnInput(boardConfig, batch.turn_card, stackConfig)
      console.log('  Input generated')

      // 3. 跑 solver
      await markBatchStatus(batch.id, 'claimed')
      const jsonPath = runSolver(inputContent)

      // 4. 解析 JSON
      console.log('  Parsing JSON...')
      const data = JSON.parse(readFileSync(jsonPath, 'utf8'))
      const rows = extractTurnRiverNodes(data, stackConfig.effective_stack_bb, batch.street)
      console.log(`  Extracted ${rows.length} rows`)

      if (rows.length === 0) {
        console.warn('  WARNING: no rows extracted, marking failed')
        await markBatchStatus(batch.id, 'failed', { error_msg: 'No rows extracted from solver output' })
        continue
      }

      // 5. 上傳
      await markBatchStatus(batch.id, 'uploading')
      const uploaded = await uploadRows(rows, batch)
      console.log(`  Uploaded ${uploaded} rows`)

      // 6. 完成
      await markBatchStatus(batch.id, 'done', {
        completed_at: new Date().toISOString(),
        row_count: uploaded,
      })
      console.log('  ✅ Done')

      // 清理 JSON
      if (!keepJson) {
        try { unlinkSync(jsonPath) } catch { /* ignore */ }
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`)
      await markBatchStatus(batch.id, 'failed', { error_msg: err.message })
    }

    completed++
  }

  console.log(`\nWorker finished. Completed ${completed} batch(es).`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
