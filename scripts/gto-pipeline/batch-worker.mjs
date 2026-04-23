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
// T-097 Schema v2: optional filters passed to claim_gto_batch RPC
const gametypeFilter = getArg('--gametype-filter') || null
const depthFilterStr = getArg('--depth-filter')
const depthFilter = depthFilterStr !== null ? parseFloat(depthFilterStr) : null

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

import { BOARDS } from './boards.mjs'
import { getScenarioByGametype } from './scenarios.mjs'

function getBoardConfig(boardKey) {
  return BOARDS.find(b => b.slug === boardKey)
}

// ── TexasSolver input generation ───────────────────────

function buildTurnInput(board, turnCard, scenario) {
  const boardCards = `${board.cards},${turnCard}`  // e.g. 'As,7d,2c,Kh'

  const lines = [
    `set_pot ${scenario.pot_bb}`,
    `set_effective_stack ${scenario.effective_stack_bb}`,
    `set_board ${boardCards}`,
    `set_range_ip ${scenario.ranges.ip}`,
    `set_range_oop ${scenario.ranges.oop}`,
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

/**
 * Encode a TexasSolver action key into GTOW-style code.
 *   CHECK      → X
 *   CALL       → C
 *   FOLD       → F
 *   BET X      → B<pct>   (pct = X / pot_before_bet * 100)
 *   RAISE Y    → R<pct>   (pct = Y / pot_before_raise * 100)
 *   all-in     → RAI      (bet/raise amount ≥ eff_stack * 0.95)
 *
 * `potBefore` = pot size *before* this action; for RAISE it's the pot including
 * the opponent's bet (i.e., pot at the decision node).
 */
function encodeAction(actKey, potBefore, effStack) {
  if (actKey === 'CHECK') return 'X'
  if (actKey === 'CALL') return 'C'
  if (actKey === 'FOLD') return 'F'
  const m = actKey.match(/^(BET|RAISE)\s+([\d.]+)/)
  if (!m) return '?'
  const amt = parseFloat(m[2])
  if (amt >= effStack * 0.95) return 'RAI'
  const pct = Math.round((amt / potBefore) * 100)
  return m[1] === 'BET' ? `B${pct}` : `R${pct}`
}

/**
 * Advance pot/betFacing state after consuming one action.
 * Returns new {pot, betFacing} pair for the child node.
 *
 * Pot accounting model (HU):
 *   - BET X: one player commits X this street. pot += X, next player faces X.
 *   - CALL: current player matches betFacing. pot += betFacing, facing reset to 0.
 *   - RAISE Y: raiser's total this street = Y. pot += Y (raiser adds Y).
 *     Opponent now faces Y - (what they already put in this street).
 *     Simplification: we track betFacing from the *caller's* perspective, so
 *     after RAISE Y, opposite player faces (Y - previous betFacing) to match.
 *   - CHECK / FOLD: no chips added.
 */
function advancePot(pot, betFacing, actKey) {
  if (actKey === 'CHECK') return { pot, betFacing: 0 }
  if (actKey === 'CALL') return { pot: pot + betFacing, betFacing: 0 }
  if (actKey === 'FOLD') return { pot, betFacing }
  const m = actKey.match(/^(BET|RAISE)\s+([\d.]+)/)
  if (!m) return { pot, betFacing }
  const amt = parseFloat(m[2])
  if (m[1] === 'BET') return { pot: pot + amt, betFacing: amt }
  // RAISE: raiser contributes amt; opponent now faces (amt - their prior put-in)
  return { pot: pot + amt, betFacing: amt - betFacing }
}

/**
 * Build per-hand-class aggregation node for one spot's strategy.
 * Returns { hands: {...}, aggregated: {...}, node_type }.
 *
 * Note: EV not included — TexasSolver v0.2.0 JSON does not expose EV per
 * (hand, action). Future work (T-098+) may pull EV from GTOW API or patch
 * solver source. Schema stays jsonb-flexible for later EV addition.
 */
function buildNodeData(node, codeMap, effStack) {
  const classAvg = aggregateToClasses(node.strategy.strategy, node.actions)
  const hands = {}
  for (const [handClass, freqs] of Object.entries(classAvg)) {
    hands[handClass] = node.actions
      .map((a, i) => ({ action: codeMap[a] ?? '?', freq: Number(freqs[i].toFixed(6)) }))
      .filter(x => x.freq > 0.0001)
  }

  // Aggregated freqs (combo-weighted, uniform: 1/169 weight per class).
  const classKeys = Object.keys(classAvg)
  const aggregated = {}
  if (classKeys.length > 0) {
    for (let i = 0; i < node.actions.length; i++) {
      let sum = 0
      for (const k of classKeys) sum += classAvg[k][i]
      aggregated[codeMap[node.actions[i]] ?? '?'] = Number((sum / classKeys.length).toFixed(6))
    }
  }

  return {
    hands,
    aggregated,
    node_type: node.player === 1 ? 'oop_decision' : 'ip_decision',
  }
}

/**
 * Extract solver tree into gto_solutions-shaped spot rows.
 *
 * Output row shape (aligns with schema v2 gto_solutions PK):
 *   { street, flop_actions, turn_actions, river_card, river_actions, node_data, _stats }
 *
 * Caller adds gametype/depth_bb/preflop_actions/board/turn_card from batch.
 *
 * Street handling:
 *   - Turn-solve (batch.street='turn'): root is turn decision; dealcards transition to river.
 *   - River-solve (batch.street='river'): root is river decision; dealcards unexpected.
 *
 * flop_actions is always '' — solver pipeline starts at turn/river; pre-turn play
 * is baked into ranges, not explicitly modeled. Matches schema default.
 */
function extractSpots(data, batch, scenario) {
  const spots = []
  const effStack = scenario.effective_stack_bb
  const potStart = scenario.pot_bb

  function walk(node, ctx) {
    if (!node || ctx.depth > 10) return

    if (node.strategy?.strategy && node.actions) {
      // Use encodeAction (GTOW-spec %) for node_data action codes so they align
      // with turn_actions/river_actions path encoding. ctx.pot is the pot facing
      // this decision node (correct denominator for % bet sizing).
      const codeMap = {}
      for (const a of node.actions) codeMap[a] = encodeAction(a, ctx.pot, effStack)
      const nodeData = buildNodeData(node, codeMap, effStack)
      spots.push({
        street: ctx.street,
        flop_actions: '',
        turn_actions: ctx.turn_actions.join('-'),
        river_card: ctx.river_card,
        river_actions: ctx.river_actions.join('-'),
        node_data: nodeData,
        _stats: {
          hand_count: Object.keys(nodeData.hands).length,
          action_count: node.actions.length,
        },
      })
    }

    if (node.childrens) {
      for (const [actKey, child] of Object.entries(node.childrens)) {
        const encoded = encodeAction(actKey, ctx.pot, effStack)
        const { pot: newPot, betFacing: newBetFacing } = advancePot(ctx.pot, ctx.betFacing, actKey)
        const streetKey = ctx.street === 'river' ? 'river_actions' : 'turn_actions'
        walk(child, {
          ...ctx,
          [streetKey]: [...ctx[streetKey], encoded],
          pot: newPot,
          betFacing: newBetFacing,
          depth: ctx.depth + 1,
        })
      }
    }

    if (node.dealcards) {
      // Street transition: turn → river (for turn-solve batches only)
      for (const [card, child] of Object.entries(node.dealcards)) {
        walk(child, {
          ...ctx,
          street: 'river',
          river_card: card,
          river_actions: [],
          betFacing: 0,
          depth: ctx.depth + 1,
          // pot carries over (turn action already committed both players' chips)
        })
      }
    }
  }

  // T-097 F-stage bug fix: solver always runs turn-first (buildTurnInput gives
  // 4-card board regardless of batch.street), so root = turn decision. Starting
  // ctx.street='river' for a river batch would wrongly tag turn-level decisions
  // as river + lose turn context on dealcard reset → multiple turn paths collapse
  // to same (river_card, river_actions) key. Always start 'turn'; dealcards
  // transition preserves turn_actions history via spread.
  const initialCtx = {
    street: 'turn',
    turn_actions: [],
    river_card: '',
    river_actions: [],
    pot: potStart,
    betFacing: 0,
    depth: 0,
  }
  walk(data, initialCtx)
  return spots
}

// ── Supabase upload (gto_solutions schema v2) ──────────

async function uploadSpots(spots, batch, solverMeta) {
  const CHUNK_SIZE = 100  // jsonb rows ~5-8 KB each → smaller chunks to stay under request size cap

  // Dedup by full path key (defensive — path-aware PK should make this rare,
  // but if solver walk emits duplicate (flop, turn, river, river_actions) tuples
  // we keep first-write-wins to avoid Postgres 42601 upsert-conflict error).
  const seen = new Set()
  const deduped = []
  for (const s of spots) {
    const key = `${s.street}|${s.flop_actions}|${s.turn_actions}|${s.river_card}|${s.river_actions}`
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(s)
  }
  if (deduped.length < spots.length) {
    console.log(`  Dedup: ${spots.length} → ${deduped.length} spots (defensive filter on full path)`)
  } else {
    console.log(`  Spots: ${spots.length} (no dup — path-aware PK working)`)
  }

  let uploaded = 0

  for (let i = 0; i < deduped.length; i += CHUNK_SIZE) {
    const chunk = deduped.slice(i, i + CHUNK_SIZE).map(s => ({
      gametype: batch.gametype,
      depth_bb: batch.depth_bb,
      preflop_actions: batch.preflop_actions,
      board: batch.board,
      flop_actions: s.flop_actions,
      turn_card: batch.turn_card,
      turn_actions: s.turn_actions,
      river_card: s.river_card,
      river_actions: s.river_actions,
      node_data: s.node_data,
      source: 'self_solver',
      solver_config: solverMeta,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('gto_solutions')
      .upsert(chunk, {
        onConflict: 'gametype,depth_bb,preflop_actions,board,flop_actions,turn_card,turn_actions,river_card,river_actions',
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
  if (gametypeFilter) console.log(` Gametype filter: ${gametypeFilter}`)
  if (depthFilter !== null) console.log(` Depth filter: ${depthFilter}bb`)
  console.log('===========================================\n')

  let completed = 0

  while (completed < maxBatches) {
    // 1. 領取任務（v2 RPC 接 gametype / depth filter，無傳 → 走預設全領）
    const rpcArgs = { p_machine_id: machineId }
    if (gametypeFilter) rpcArgs.p_gametype_filter = gametypeFilter
    if (depthFilter !== null) rpcArgs.p_depth_filter = depthFilter

    const { data: claimed, error: claimError } = await supabase.rpc('claim_gto_batch', rpcArgs)

    if (claimError) {
      console.error('Claim RPC error:', claimError.message)
      break
    }

    if (!claimed || claimed.length === 0) {
      console.log('\n✅ No more pending batches. All done!')
      break
    }

    const batch = claimed[0]
    console.log(`\n[${completed + 1}] Claimed: ${batch.street} | ${batch.gametype} | ${batch.board}+${batch.turn_card}${batch.river_card ? '+' + batch.river_card : ''} | preflop=${batch.preflop_actions}`)

    if (dryRun) {
      console.log('  (dry run — skipping solver)')
      await markBatchStatus(batch.id, 'pending', { machine_id: null, claimed_at: null })
      completed++
      continue
    }

    try {
      // 2. 產生 input（v2 batch：gametype 查 scenario 拿 ranges/pot/stack）
      const scenario = getScenarioByGametype(batch.gametype)
      const boardConfig = getBoardConfig(batch.board)
      if (!scenario) throw new Error(`Unknown gametype: ${batch.gametype} (check scenarios.mjs HU_SCENARIOS)`)
      if (!boardConfig) throw new Error(`Unknown board: ${batch.board} (check boards.mjs BOARDS)`)

      const inputContent = buildTurnInput(boardConfig, batch.turn_card, scenario)
      console.log('  Input generated')

      // 3. 跑 solver
      await markBatchStatus(batch.id, 'claimed')
      const solverStart = Date.now()
      const jsonPath = runSolver(inputContent)
      const solverSec = ((Date.now() - solverStart) / 1000).toFixed(1)

      // 4. 解析 JSON + 提取 spots
      console.log('  Parsing JSON...')
      const data = JSON.parse(readFileSync(jsonPath, 'utf8'))
      const spots = extractSpots(data, batch, scenario)
      console.log(`  Extracted ${spots.length} spots`)

      if (spots.length === 0) {
        console.warn('  WARNING: no spots extracted, marking failed')
        await markBatchStatus(batch.id, 'failed', { error_msg: 'No spots extracted from solver output' })
        continue
      }

      // 5. 上傳 gto_solutions
      await markBatchStatus(batch.id, 'uploading')
      const solverMeta = {
        solver_version: 'texas_0.2.0',
        solver_seconds: Number(solverSec),
        // EV limitation: TexasSolver v0.2.0 JSON 無 ev 欄位，node_data.hands items 只含
        // {action, freq}。未來 GTOW API fill 或 solver patch 可補，schema jsonb 彈性保留。
        ev_available: false,
      }
      const uploaded = await uploadSpots(spots, batch, solverMeta)
      console.log(`  Uploaded ${uploaded} spots`)

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
