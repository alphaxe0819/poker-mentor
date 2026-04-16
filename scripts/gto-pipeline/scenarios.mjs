/**
 * Preflop scenario catalog for TexasSolver input generation.
 *
 * Each scenario defines:
 *   - preflop_action: SRP (single-raised pot), 3BP (3-bet pot), 4BP (4-bet pot)
 *   - pot_bb: starting pot when flop comes out
 *   - effective_stack_bb: remaining chips behind
 *   - ranges.ip / ranges.oop: preflop ranges that reached the flop
 *
 * Ranges are TIGHTER in 3BP than SRP, and tighter still in 4BP.
 */

// ════════════════════════════════════════════════════════════
// SRP (Single-Raised Pot) — BTN opens, BB calls
// Already defined in boards.mjs as HU_*_RANGES + STACK_RATIOS
// Re-exported here for consistency
// ════════════════════════════════════════════════════════════

import { HU_40BB_RANGES, HU_25BB_RANGES, HU_13BB_RANGES } from './boards.mjs'

export const SRP_SCENARIOS = [
  {
    slug: '40bb_srp',
    label: 'HU 40BB SRP',
    pot_bb: 5,
    effective_stack_bb: 37.5,
    preflop_action: 'srp',
    description: 'BTN open 2.5 → BB call → pot 5, eff 37.5',
    ranges: HU_40BB_RANGES,
  },
  {
    slug: '25bb_srp',
    label: 'HU 25BB SRP',
    pot_bb: 5,
    effective_stack_bb: 22.5,
    preflop_action: 'srp',
    description: 'BTN open 2.5 → BB call → pot 5, eff 22.5',
    ranges: HU_25BB_RANGES,
  },
  {
    slug: '13bb_srp',
    label: 'HU 13BB SRP',
    pot_bb: 5,
    effective_stack_bb: 10.5,
    preflop_action: 'srp',
    description: 'BTN open 2.5 → BB call → pot 5, eff 10.5',
    ranges: HU_13BB_RANGES,
  },
]

// ════════════════════════════════════════════════════════════
// 3BP (3-bet pot) — BTN opens, BB 3-bets, BTN calls
// BTN = IP (in position, call the 3bet)
// BB = OOP (out of position, 3bet aggressor)
// ════════════════════════════════════════════════════════════

// 40BB: BTN open 2.5 → BB 3b to 9 → BTN call → pot 18, eff 31
const HU_40BB_3BP_RANGES = {
  // BTN calls the 3bet — suited broadways + pairs + suited connectors
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A5s,A4s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,98s,87s,76s,65s,AKo,AQo',
  // BB 3bets for value + bluffs (polar)
  oop: 'AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,A5s,A4s,A3s,A2s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,98s,87s,76s,65s,54s,AKo,AQo,AJo,KQo',
}

// 25BB: BTN open 2.5 → BB 3b to 8 → BTN call → pot 16, eff 17
const HU_25BB_3BP_RANGES = {
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,QJs,JTs,T9s,98s,AKo,AQo',
  oop: 'AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,A5s,A4s,KQs,KJs,QJs,JTs,T9s,98s,AKo,AQo,AJo,KQo',
}

export const THREE_BET_SCENARIOS = [
  {
    slug: '40bb_3bp',
    label: 'HU 40BB 3BP',
    pot_bb: 18,
    effective_stack_bb: 31,
    preflop_action: '3bp',
    description: 'BTN open 2.5 → BB 3b to 9 → BTN call → pot 18, eff 31',
    ranges: HU_40BB_3BP_RANGES,
  },
  {
    slug: '25bb_3bp',
    label: 'HU 25BB 3BP',
    pot_bb: 16,
    effective_stack_bb: 17,
    preflop_action: '3bp',
    description: 'BTN open 2.5 → BB 3b to 8 → BTN call → pot 16, eff 17',
    ranges: HU_25BB_3BP_RANGES,
  },
]

// ════════════════════════════════════════════════════════════
// 4BP (4-bet pot) — BTN opens, BB 3bets, BTN 4bets, BB calls
// Very tight polar ranges, short stacks after preflop
// ════════════════════════════════════════════════════════════

// 40BB: BTN open 2.5 → BB 3b to 9 → BTN 4b to 22 → BB call → pot 44, eff 18
const HU_40BB_4BP_RANGES = {
  // BTN 4bets for value + bluffs
  ip: 'AA,KK,QQ,JJ,TT,AKs,AQs,AJs,A5s,A4s,KQs,AKo,AQo',
  // BB calls the 4bet — premium only
  oop: 'AA,KK,QQ,JJ,TT,AKs,AQs,AJs,KQs,AKo,AQo',
}

export const FOUR_BET_SCENARIOS = [
  {
    slug: '40bb_4bp',
    label: 'HU 40BB 4BP',
    pot_bb: 44,
    effective_stack_bb: 18,
    preflop_action: '4bp',
    description: 'BTN open 2.5 → BB 3b to 9 → BTN 4b to 22 → BB call → pot 44, eff 18',
    ranges: HU_40BB_4BP_RANGES,
  },
]

// ════════════════════════════════════════════════════════════
// Scenario groups — pick what to generate
// ════════════════════════════════════════════════════════════

export const ALL_SCENARIOS = {
  srp: SRP_SCENARIOS,
  '3bp': THREE_BET_SCENARIOS,
  '4bp': FOUR_BET_SCENARIOS,
  all: [...SRP_SCENARIOS, ...THREE_BET_SCENARIOS, ...FOUR_BET_SCENARIOS],
}
