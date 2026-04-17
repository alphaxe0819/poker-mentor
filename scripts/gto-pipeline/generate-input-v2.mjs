#!/usr/bin/env node
/**
 * Generate TexasSolver input files — multi-format version.
 *
 * Supports three game formats (phases):
 *   hu    — Heads-Up (Phase 1)
 *   6max  — 6-Max Cash 100BB (Phase 2)
 *   9max  — 9-Max Tournament 20-40BB (Phase 3)
 *
 * Usage:
 *   node generate-input-v2.mjs hu                    # HU scenarios only
 *   node generate-input-v2.mjs hu --pot srp           # HU SRP only
 *   node generate-input-v2.mjs hu --pot 3bp           # HU 3BP only
 *   node generate-input-v2.mjs 6max                   # 6-max scenarios
 *   node generate-input-v2.mjs 9max                   # 9-max scenarios
 *   node generate-input-v2.mjs all                    # everything
 *   node generate-input-v2.mjs hu --boards extended   # use 30-board catalog
 *   node generate-input-v2.mjs hu --boards original   # use 12-board catalog (default)
 *   node generate-input-v2.mjs hu --clean             # delete existing inputs first
 *   node generate-input-v2.mjs hu --dry-run           # preview without writing
 */

import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BOARDS } from './boards.mjs'
import { BOARDS_EXTENDED } from './boards-extended.mjs'
import { ALL_FORMATS, BET_PROFILES, autoBetProfile } from './scenarios.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT_DIR = resolve(__dirname, 'inputs')
mkdirSync(INPUT_DIR, { recursive: true })

// ── Parse CLI args ──
const args = process.argv.slice(2)
const formatKey = args.find(a => !a.startsWith('--')) || 'hu'
const potFilter = args.includes('--pot')
  ? args[args.indexOf('--pot') + 1]
  : null
const boardsArg = args.includes('--boards')
  ? args[args.indexOf('--boards') + 1]
  : 'original'
const cleanFirst = args.includes('--clean')
const dryRun = args.includes('--dry-run')

// ── Validate format ──
let scenarios = ALL_FORMATS[formatKey]
if (!scenarios) {
  console.error(`Unknown format: ${formatKey}`)
  console.error(`Available: hu, 6max, 9max, all`)
  process.exit(1)
}

// ── Filter by pot type if requested ──
if (potFilter) {
  scenarios = scenarios.filter(s => s.pot_type === potFilter)
  if (scenarios.length === 0) {
    console.error(`No scenarios match pot type: ${potFilter}`)
    process.exit(1)
  }
}

// ── Skip scenarios with empty ranges ──
const ready = scenarios.filter(s => s.ranges.ip && s.ranges.oop)
const skipped = scenarios.length - ready.length
if (skipped > 0) {
  console.log(`⚠  Skipping ${skipped} scenario(s) with empty ranges (placeholder)\n`)
}

const boards = boardsArg === 'extended' ? BOARDS_EXTENDED : BOARDS

// ── Clean existing inputs if requested ──
if (cleanFirst && !dryRun) {
  const existing = readdirSync(INPUT_DIR).filter(f => f.endsWith('.txt'))
  for (const f of existing) {
    unlinkSync(resolve(INPUT_DIR, f))
  }
  console.log(`🗑  Cleaned ${existing.length} existing input file(s)\n`)
}

// ── Build TexasSolver input content ──
function buildBetLines(profile, pos) {
  const lines = []
  for (const street of ['flop', 'turn', 'river']) {
    const cfg = profile[street]
    if (!cfg) continue

    // Bet sizes
    if (cfg.bet && cfg.bet.length > 0) {
      lines.push(`set_bet_sizes ${pos},${street},bet,${cfg.bet.join(',')}`)
    }
    // Raise sizes
    if (cfg.raise && cfg.raise.length > 0) {
      lines.push(`set_bet_sizes ${pos},${street},raise,${cfg.raise.join(',')}`)
    }
    // Donk bet (OOP only)
    if (pos === 'oop' && cfg.donk_oop && cfg.donk_oop.length > 0) {
      lines.push(`set_bet_sizes oop,${street},donk,${cfg.donk_oop.join(',')}`)
    }
    // Allin
    if (cfg.allin) {
      lines.push(`set_bet_sizes ${pos},${street},allin`)
    }
  }
  return lines
}

function buildInput(board, scenario) {
  const profileKey = scenario.bet_profile
    || autoBetProfile(scenario.pot_type, scenario.effective_stack_bb, scenario.pot_bb)
  const profile = BET_PROFILES[profileKey]
  if (!profile) {
    throw new Error(`Unknown bet profile: ${profileKey} (scenario: ${scenario.slug})`)
  }

  const lines = []
  lines.push(`set_pot ${scenario.pot_bb}`)
  lines.push(`set_effective_stack ${scenario.effective_stack_bb}`)
  lines.push(`set_board ${board.cards}`)
  lines.push(`set_range_ip ${scenario.ranges.ip}`)
  lines.push(`set_range_oop ${scenario.ranges.oop}`)

  // Bet sizes from profile
  lines.push(...buildBetLines(profile, 'oop'))
  lines.push(...buildBetLines(profile, 'ip'))

  // Solver settings
  lines.push('set_allin_threshold 0.67')
  lines.push('build_tree')
  lines.push('set_thread_num 8')
  lines.push('set_accuracy 0.5')
  lines.push('set_max_iteration 200')
  lines.push('set_print_interval 50')
  lines.push('set_use_isomorphism 1')
  lines.push('start_solve')
  lines.push('set_dump_rounds 2')
  lines.push(`dump_result output/${scenario.slug}_${board.slug}.json`)
  return lines.join('\n') + '\n'
}

// ── Generate ──
console.log(`📋 Format:    ${formatKey}`)
console.log(`📋 Pot type:  ${potFilter || 'all'}`)
console.log(`📋 Scenarios: ${ready.length} ready (${skipped} skipped)`)
console.log(`📋 Boards:    ${boardsArg} (${boards.length})`)
console.log(`📋 Total:     ${ready.length * boards.length} input file(s)`)
if (dryRun) console.log(`📋 Mode:      DRY RUN (no files written)`)
console.log('')

let count = 0
for (const scenario of ready) {
  const spr = (scenario.effective_stack_bb / scenario.pot_bb).toFixed(1)
  const profileKey = scenario.bet_profile
    || autoBetProfile(scenario.pot_type, scenario.effective_stack_bb, scenario.pot_bb)
  console.log(`  ${scenario.label}`)
  console.log(`    pot=${scenario.pot_bb} eff=${scenario.effective_stack_bb} SPR=${spr} profile=${profileKey}`)
  console.log(`    IP=${scenario.matchup.ip} OOP=${scenario.matchup.oop}`)

  for (const board of boards) {
    const content = buildInput(board, scenario)
    const filename = `${scenario.slug}_${board.slug}.txt`
    const outPath = resolve(INPUT_DIR, filename)
    if (!dryRun) {
      writeFileSync(outPath, content, 'utf8')
    }
    count++
  }
  console.log(`    ✓ ${boards.length} input files\n`)
}

console.log(`✅ ${dryRun ? 'Would generate' : 'Generated'} ${count} input file(s) in ${INPUT_DIR}`)
if (!dryRun && count > 0) {
  console.log(`\nNext: run TexasSolver batch`)
}
