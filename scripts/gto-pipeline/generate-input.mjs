#!/usr/bin/env node
/**
 * Generate TexasSolver input files for every board × stack-ratio combo
 * defined in boards.mjs.
 *
 * Output: scripts/gto-pipeline/inputs/<stack>_<board>.txt
 *
 * Usage: node generate-input.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BOARDS, STACK_RATIOS, HU_40BB_RANGES } from './boards.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT_DIR = resolve(__dirname, 'inputs')
mkdirSync(INPUT_DIR, { recursive: true })

function buildInput(board, stack) {
  const lines = []
  lines.push(`set_pot ${stack.pot_bb}`)
  lines.push(`set_effective_stack ${stack.effective_stack_bb}`)
  lines.push(`set_board ${board.cards}`)
  lines.push(`set_range_ip ${HU_40BB_RANGES.ip}`)
  lines.push(`set_range_oop ${HU_40BB_RANGES.oop}`)

  // Bet sizes — same for all boards (matches UI buckets 33/50/100 + allin)
  for (const pos of ['oop', 'ip']) {
    lines.push(`set_bet_sizes ${pos},flop,bet,33,50,100`)
    lines.push(`set_bet_sizes ${pos},flop,raise,60`)
    lines.push(`set_bet_sizes ${pos},flop,allin`)
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
  lines.push('set_dump_rounds 2')
  lines.push(`dump_result output/hu_${stack.slug}_srp_flop_${board.slug}.json`)
  return lines.join('\n') + '\n'
}

let count = 0
for (const stack of STACK_RATIOS) {
  for (const board of BOARDS) {
    const content = buildInput(board, stack)
    const filename = `hu_${stack.slug}_srp_flop_${board.slug}.txt`
    const outPath = resolve(INPUT_DIR, filename)
    writeFileSync(outPath, content, 'utf8')
    console.log(`✓ ${filename}  (${board.texture})`)
    count++
  }
}

console.log(`\n✅ Generated ${count} input file(s) in ${INPUT_DIR}`)
