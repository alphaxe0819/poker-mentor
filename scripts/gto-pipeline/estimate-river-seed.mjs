#!/usr/bin/env node
/**
 * T-046: Estimate row count for `seed-batches.mjs --include-river`.
 * Dry-run: only computes, does NOT touch DB.
 *
 * Usage: node estimate-river-seed.mjs
 */

import { BOARDS, STACK_RATIOS, generateRiverCards } from './boards.mjs'

const STACKS = STACK_RATIOS.length
let turnCount = 0
let riverCount = 0
const perBoard = []

for (const board of BOARDS) {
  const turns = board.turnCards?.length ?? 0
  if (turns === 0) continue

  let boardRivers = 0
  for (const turnCard of board.turnCards) {
    const rivers = generateRiverCards(board.cards, turnCard)
    boardRivers += rivers.length
  }

  turnCount += turns * STACKS
  riverCount += boardRivers * STACKS
  perBoard.push({
    slug: board.slug,
    turns,
    riverPerTurnAvg: (boardRivers / turns).toFixed(2),
    riverTotal: boardRivers,
    turnRows: turns * STACKS,
    riverRows: boardRivers * STACKS,
  })
}

const total = turnCount + riverCount

console.log('='.repeat(70))
console.log('T-046: seed --include-river row estimate (dry-run, no DB write)')
console.log('='.repeat(70))
console.log()
console.log('Config:')
console.log(`  BOARDS           : ${BOARDS.length} flops`)
console.log(`  STACK_RATIOS     : ${STACKS} (${STACK_RATIOS.map(s => s.slug).join(', ')})`)
console.log(`  turns per flop   : 10 (hard-coded in boards.mjs)`)
console.log(`  rivers per turn  : up to 8 (generateRiverCards picks by rank diversity)`)
console.log()
console.log('Per-board breakdown:')
console.log()
console.log('  slug        | turns | rivers/turn | turn rows (×3 stacks) | river rows (×3 stacks)')
console.log('  ' + '-'.repeat(88))
for (const b of perBoard) {
  console.log(
    `  ${b.slug.padEnd(11)} | ${String(b.turns).padStart(5)} | ${b.riverPerTurnAvg.padStart(11)} | ${String(b.turnRows).padStart(21)} | ${String(b.riverRows).padStart(22)}`
  )
}
console.log()
console.log('Totals (gto_batch_progress rows, one per solver run):')
console.log(`  Turn rows   : ${turnCount}`)
console.log(`  River rows  : ${riverCount}`)
console.log(`  Grand total : ${total}`)
console.log()
console.log('Threshold check (T-046 criterion):')
console.log(`  > 10k rows? : ${total > 10000 ? 'YES — consider phased seed' : 'NO — full seed acceptable'}`)
console.log()
console.log('Downstream cost (if all solved end-to-end):')
console.log(`  gto_postflop rows    : ~${total * 1690} (assuming ~1690 rows per batch: 10 roles × 169 hand_classes)`)
console.log(`  solver wall-time     : ~${(total * 15 / 60).toFixed(0)}-${(total * 20 / 60).toFixed(0)} hr single-machine @ 15-20 min per batch`)
console.log()
