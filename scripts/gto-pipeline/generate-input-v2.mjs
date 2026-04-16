#!/usr/bin/env node
/**
 * Generate TexasSolver input files for scenarios × boards.
 *
 * v2: Supports multiple preflop scenarios (SRP / 3BP / 4BP) and extended
 *     board catalog (30 boards across 6 texture categories).
 *
 * Output: scripts/gto-pipeline/inputs/hu_<scenarioSlug>_<boardSlug>.txt
 *
 * Usage:
 *   node generate-input-v2.mjs                 # default: SRP only (backward compat)
 *   node generate-input-v2.mjs srp             # only SRP scenarios
 *   node generate-input-v2.mjs 3bp             # only 3-bet pots
 *   node generate-input-v2.mjs 4bp             # only 4-bet pots
 *   node generate-input-v2.mjs all             # all scenarios
 *   node generate-input-v2.mjs srp --boards original   # use original 12 boards
 *   node generate-input-v2.mjs srp --boards extended   # use extended 30 boards
 *
 * Example:
 *   node generate-input-v2.mjs all --boards extended
 *   → 6 scenarios × 30 boards = 180 input files
 */

import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BOARDS } from './boards.mjs'
import { BOARDS_EXTENDED } from './boards-extended.mjs'
import { ALL_SCENARIOS } from './scenarios.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT_DIR = resolve(__dirname, 'inputs')
mkdirSync(INPUT_DIR, { recursive: true })

// ---- Parse args ----
const args = process.argv.slice(2)
const scenarioKey = args.find(a => !a.startsWith('--')) || 'srp'
const boardsArg = args.includes('--boards')
  ? args[args.indexOf('--boards') + 1]
  : 'original'
const cleanFirst = args.includes('--clean')

const scenarios = ALL_SCENARIOS[scenarioKey]
if (!scenarios) {
  console.error(`Unknown scenario: ${scenarioKey}`)
  console.error(`Available: srp, 3bp, 4bp, all`)
  process.exit(1)
}

const boards = boardsArg === 'extended' ? BOARDS_EXTENDED : BOARDS

// ---- Clean existing inputs if requested ----
if (cleanFirst) {
  const existing = readdirSync(INPUT_DIR).filter(f => f.endsWith('.txt'))
  for (const f of existing) {
    unlinkSync(resolve(INPUT_DIR, f))
  }
  console.log(`🗑  Cleaned ${existing.length} existing input file(s)\n`)
}

// ---- Build input file content ----
function buildInput(board, scenario) {
  const lines = []
  lines.push(`set_pot ${scenario.pot_bb}`)
  lines.push(`set_effective_stack ${scenario.effective_stack_bb}`)
  lines.push(`set_board ${board.cards}`)
  lines.push(`set_range_ip ${scenario.ranges.ip}`)
  lines.push(`set_range_oop ${scenario.ranges.oop}`)

  // Bet sizes — scenario-dependent (tighter SPR = fewer sizes)
  const spr = scenario.effective_stack_bb / scenario.pot_bb
  for (const pos of ['oop', 'ip']) {
    // Flop
    if (spr > 3) {
      lines.push(`set_bet_sizes ${pos},flop,bet,33,50,100`)
    } else {
      lines.push(`set_bet_sizes ${pos},flop,bet,50`)
    }
    lines.push(`set_bet_sizes ${pos},flop,raise,60`)
    lines.push(`set_bet_sizes ${pos},flop,allin`)

    // Turn
    if (spr > 2) {
      lines.push(`set_bet_sizes ${pos},turn,bet,50,75`)
    } else {
      lines.push(`set_bet_sizes ${pos},turn,bet,75`)
    }
    lines.push(`set_bet_sizes ${pos},turn,raise,60`)
    lines.push(`set_bet_sizes ${pos},turn,allin`)

    // River
    if (spr > 1) {
      lines.push(`set_bet_sizes ${pos},river,bet,50,100`)
    } else {
      lines.push(`set_bet_sizes ${pos},river,bet,100`)
    }
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
  lines.push('set_dump_rounds 2')
  lines.push(`dump_result output/hu_${scenario.slug}_${board.slug}.json`)
  return lines.join('\n') + '\n'
}

// ---- Generate all combinations ----
console.log(`📋 Scenario: ${scenarioKey} (${scenarios.length} variant(s))`)
console.log(`📋 Boards:   ${boardsArg} (${boards.length} boards)`)
console.log(`📋 Total:    ${scenarios.length * boards.length} input file(s)\n`)

let count = 0
for (const scenario of scenarios) {
  console.log(`  ${scenario.label}`)
  console.log(`    pot=${scenario.pot_bb} eff=${scenario.effective_stack_bb} (SPR ${(scenario.effective_stack_bb / scenario.pot_bb).toFixed(1)})`)
  for (const board of boards) {
    const content = buildInput(board, scenario)
    const filename = `hu_${scenario.slug}_${board.slug}.txt`
    const outPath = resolve(INPUT_DIR, filename)
    writeFileSync(outPath, content, 'utf8')
    count++
  }
  console.log(`    ✓ ${boards.length} input files\n`)
}

console.log(`✅ Generated ${count} input file(s) in ${INPUT_DIR}`)
console.log(`\nNext step: cd scripts/gto-pipeline && powershell -ExecutionPolicy Bypass -File batch-run.ps1`)
