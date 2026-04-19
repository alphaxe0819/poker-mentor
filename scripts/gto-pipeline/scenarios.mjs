/**
 * Multi-format scenario catalog for TexasSolver input generation.
 *
 * Phase 1: HU        — BTN vs BB, 13-40BB (HU simulator)
 * Phase 2: 6-max     — 6 positions, 100BB cash
 * Phase 3: 9-max     — 9 positions, 20-40BB tournament
 *
 * Each scenario defines:
 *   - format:    hu | 6max | 9max
 *   - matchup:   { ip, oop } position names (for file naming + UI)
 *   - pot_type:  srp | 3bp | 4bp
 *   - depth_bb:  nominal stack depth label
 *   - pot_bb:    starting pot on the flop
 *   - effective_stack_bb: remaining chips behind
 *   - ranges:    { ip, oop } range strings
 *   - bet_profile: key into BET_PROFILES (auto-derived if omitted)
 */

// ════════════════════════════════════════════════════════════
// Bet sizing profiles — GTO Wizard standard sizes (% of pot)
// ════════════════════════════════════════════════════════════

export const BET_PROFILES = {
  // SRP deep (SPR > 5): wide sizing tree
  srp_deep: {
    flop:  { bet: [33, 50, 75],  raise: [60],      allin: true },
    turn:  { bet: [50, 75],      raise: [60],      allin: true },
    river: { bet: [50, 75, 100], raise: [60, 100], allin: true, donk_oop: [50] },
  },
  // SRP medium (SPR 2-5): fewer sizes
  srp_medium: {
    flop:  { bet: [33, 75],  raise: [60],  allin: true },
    turn:  { bet: [50, 75],  raise: [60],  allin: true },
    river: { bet: [50, 100], raise: [100], allin: true, donk_oop: [50] },
  },
  // SRP shallow (SPR < 2): simplified
  srp_shallow: {
    flop:  { bet: [50],  raise: [60],  allin: true },
    turn:  { bet: [75],  raise: [60],  allin: true },
    river: { bet: [100], raise: [100], allin: true },
  },
  // 3BP: GTO Wizard standard — 20/56/122 flop
  '3bp': {
    flop:  { bet: [20, 56, 122], raise: [60],      allin: true },
    turn:  { bet: [50, 75],      raise: [60],      allin: true },
    river: { bet: [50, 100],     raise: [60, 100], allin: true, donk_oop: [50] },
  },
  // 3BP shallow (SPR < 2): simplified
  '3bp_shallow': {
    flop:  { bet: [33, 75], raise: [60],  allin: true },
    turn:  { bet: [75],     raise: [60],  allin: true },
    river: { bet: [100],    raise: [100], allin: true },
  },
  // 4BP: GTO Wizard standard — 13/38/67 flop
  '4bp': {
    flop:  { bet: [13, 38, 67], raise: [60],  allin: true },
    turn:  { bet: [50, 100],    raise: [60],  allin: true },
    river: { bet: [100],        raise: [100], allin: true },
  },
  // Fast mode (--fast): single bet size per street, minimal raise tree.
  // Used for breadth-first solver passes — trades precision for coverage.
  srp_fast: {
    flop:  { bet: [50],  raise: [60], allin: true },
    turn:  { bet: [75],  raise: [60], allin: true },
    river: { bet: [75],  raise: [60], allin: true },
  },
  '3bp_fast': {
    flop:  { bet: [50],  raise: [60], allin: true },
    turn:  { bet: [75],  raise: [60], allin: true },
    river: { bet: [100], raise: [60], allin: true },
  },
}

/**
 * Auto-select bet profile from pot_type + SPR.
 */
export function autoBetProfile(pot_type, effective_stack_bb, pot_bb) {
  const spr = effective_stack_bb / pot_bb
  if (pot_type === '4bp') return '4bp'
  if (pot_type === '3bp') return spr < 2 ? '3bp_shallow' : '3bp'
  // SRP
  if (spr > 5) return 'srp_deep'
  if (spr >= 2) return 'srp_medium'
  return 'srp_shallow'
}

// ════════════════════════════════════════════════════════════
// Phase 1: HU — BTN vs BB
// ════════════════════════════════════════════════════════════

// -- SRP Ranges (BTN opens, BB calls) --
// Imported from boards.mjs for backward compat
import { HU_40BB_RANGES, HU_25BB_RANGES, HU_13BB_RANGES } from './boards.mjs'

// -- 3BP Ranges — corrected from RYE data --
// 40BB: BTN calls 3bet = SB "call 3bet" hands (55)
// BB 3bets = value (11) + bluff (14) + call-4bet (8) = 33
const HU_40BB_3BP_RANGES = {
  ip: 'ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,JTs,J9s,J8s,J7s,T9s,T8s,T7s,98s,97s,87s,86s,76s,75s,65s,64s,54s,AJo,ATo,A9o,A8o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o',
  oop: 'AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,KQs,KJs,KTs,QJs,96s,86s,85s,75s,74s,65s,64s,63s,54s,53s,43s,AKo,AQo,AJo,KQo,KJo,65o,64o,54o',
}

// 25BB: BTN calls 3bet = open + call3bet (45)
// BB 3bets = value (16) + bluff (9) + shove (17) = 42
const HU_25BB_3BP_RANGES = {
  ip: 'KK,QQ,JJ,TT,99,88,77,66,55,A9s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo',
  oop: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,KQs,KJs,KTs,74s,63s,53s,43s,42s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,KQo,75o,65o,64o,54o',
}

// -- 4BP Ranges — corrected from RYE data --
// 40BB: BTN 4bets = all pairs + premium broadways (18)
// BB calls 4bet = ATs,KQs,KJs,KTs,QJs + AJo,KQo,KJo (8)
const HU_40BB_4BP_RANGES = {
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,AKo,AQo',
  oop: 'ATs,KQs,KJs,KTs,QJs,AJo,KQo,KJo',
}

export const HU_SCENARIOS = [
  // ── SRP ──
  {
    format: 'hu', matchup: { ip: 'BTN', oop: 'BB' },
    slug: 'hu_40bb_srp', label: 'HU 40BB SRP', depth_bb: 40,
    pot_type: 'srp', pot_bb: 5, effective_stack_bb: 37.5,
    description: 'BTN open 2.5 → BB call → pot 5, eff 37.5',
    ranges: HU_40BB_RANGES,
  },
  {
    format: 'hu', matchup: { ip: 'BTN', oop: 'BB' },
    slug: 'hu_25bb_srp', label: 'HU 25BB SRP', depth_bb: 25,
    pot_type: 'srp', pot_bb: 5, effective_stack_bb: 22.5,
    description: 'BTN open 2.5 → BB call → pot 5, eff 22.5',
    ranges: HU_25BB_RANGES,
  },
  {
    format: 'hu', matchup: { ip: 'BTN', oop: 'BB' },
    slug: 'hu_13bb_srp', label: 'HU 13BB SRP', depth_bb: 13,
    pot_type: 'srp', pot_bb: 5, effective_stack_bb: 10.5,
    description: 'BTN open 2.5 → BB call → pot 5, eff 10.5',
    ranges: HU_13BB_RANGES,
  },
  // ── 3BP ──
  {
    format: 'hu', matchup: { ip: 'BTN', oop: 'BB' },
    slug: 'hu_40bb_3bp', label: 'HU 40BB 3BP', depth_bb: 40,
    pot_type: '3bp', pot_bb: 18, effective_stack_bb: 31,
    description: 'BTN open 2.5 → BB 3b to 9 → BTN call → pot 18, eff 31',
    ranges: HU_40BB_3BP_RANGES,
  },
  {
    format: 'hu', matchup: { ip: 'BTN', oop: 'BB' },
    slug: 'hu_25bb_3bp', label: 'HU 25BB 3BP', depth_bb: 25,
    pot_type: '3bp', pot_bb: 16, effective_stack_bb: 17,
    description: 'BTN open 2.5 → BB 3b to 8 → BTN call → pot 16, eff 17',
    ranges: HU_25BB_3BP_RANGES,
  },
  // ── 4BP ──
  {
    format: 'hu', matchup: { ip: 'BTN', oop: 'BB' },
    slug: 'hu_40bb_4bp', label: 'HU 40BB 4BP', depth_bb: 40,
    pot_type: '4bp', pot_bb: 44, effective_stack_bb: 18,
    description: 'BTN open 2.5 → BB 3b to 9 → BTN 4b to 22 → BB call → pot 44, eff 18',
    ranges: HU_40BB_4BP_RANGES,
  },
]

// ════════════════════════════════════════════════════════════
// Phase 2: 6-max Cash — 100BB
//
// Position order (post-flop): SB → BB → UTG → HJ → CO → BTN
// IP = later position postflop, OOP = earlier position postflop
// (Note BB is OOP vs UTG/HJ/CO/BTN, but IP vs SB)
//
// Ranges pulled from cash_6max_ranges.mjs (mirrored from
// src/lib/gto/gtoData_cash_6max_100bb.ts).
// ════════════════════════════════════════════════════════════

import { srpRangePair, threeBPRangePair } from './cash_6max_ranges.mjs'

// 9-max scenarios still use placeholder ranges (out of scope for 6-max MVP)
const RANGE_PLACEHOLDER = { ip: '', oop: '' }

// Post-flop order: who acts first postflop (lower = earlier)
const POSTFLOP_ORDER = { SB: 0, BB: 1, UTG: 2, HJ: 3, CO: 4, BTN: 5 }

function buildSrpScenario(opener, caller) {
  const { ip_range, oop_range } = srpRangePair(opener, caller)
  const ip = POSTFLOP_ORDER[opener] > POSTFLOP_ORDER[caller] ? opener : caller
  const oop = ip === opener ? caller : opener
  // Pot sizing: normal opens 2.5; SB opens 3. BB/SB blinds contribute to dead money when they fold.
  // - Non-blind opener vs BB: pot = 2.5 + 2.5 + 0.5 (SB dead) = 5.5, eff = 97.5
  // - Non-blind opener vs SB (BB folds): pot = 2.5 + 2.5 + 1 (BB dead) = 6, eff = 97.5
  // - SB vs BB: SB opens 3, BB calls 3: pot = 6, eff = 97
  let pot_bb, effective_stack_bb
  if (opener === 'SB' && caller === 'BB') { pot_bb = 6; effective_stack_bb = 97 }
  else if (caller === 'SB') { pot_bb = 6; effective_stack_bb = 97.5 }
  else if (caller === 'BB') { pot_bb = 5.5; effective_stack_bb = 97.5 }
  else { pot_bb = 6; effective_stack_bb = 97.5 } // cold caller scenarios: both blinds dead
  return {
    format: '6max', matchup: { ip, oop },
    slug: `6max_100bb_srp_${opener.toLowerCase()}_open_${caller.toLowerCase()}_call`,
    label: `6max 100BB SRP ${opener} open / ${caller} call`,
    depth_bb: 100, pot_type: 'srp', pot_bb, effective_stack_bb,
    description: `${opener} open → ${caller} call → flop. Post-flop IP=${ip} OOP=${oop}`,
    ranges: { ip: ip_range, oop: oop_range },
  }
}

function build3bpScenario(opener, threebettor) {
  const rp = threeBPRangePair(opener, threebettor)
  // Pot: 3bettor sizes vary by position — BB 3bs to 11, SB 3bs to 10, IP 3bs to 8.5
  let pot_bb, effective_stack_bb
  if (threebettor === 'BB') { pot_bb = 22; effective_stack_bb = 89 }
  else if (threebettor === 'SB') { pot_bb = 21; effective_stack_bb = 89.5 }
  else { pot_bb = 18; effective_stack_bb = 91.5 } // IP 3bet (CO, BTN, etc)
  return {
    format: '6max', matchup: { ip: rp.ip_pos, oop: rp.oop_pos },
    slug: `6max_100bb_3bp_${opener.toLowerCase()}_open_${threebettor.toLowerCase()}_3b`,
    label: `6max 100BB 3BP ${opener} open / ${threebettor} 3bet / ${opener} call`,
    depth_bb: 100, pot_type: '3bp', pot_bb, effective_stack_bb,
    description: `${opener} open → ${threebettor} 3b → ${opener} call → flop. Post-flop IP=${rp.ip_pos} OOP=${rp.oop_pos}`,
    ranges: { ip: rp.ip_range, oop: rp.oop_range },
  }
}

// 15 SRP matchups (all combinations where we have ranges)
const SRP_MATCHUPS = [
  ['UTG','HJ'], ['UTG','CO'], ['UTG','BTN'], ['UTG','SB'], ['UTG','BB'],
  ['HJ','CO'],  ['HJ','BTN'], ['HJ','SB'],  ['HJ','BB'],
  ['CO','BTN'], ['CO','SB'],  ['CO','BB'],
  ['BTN','SB'], ['BTN','BB'],
  ['SB','BB'],
]

// 10 common 3BP matchups covering BB/SB/IP 3bettor types
const THREEBP_MATCHUPS = [
  ['UTG','BB'], ['HJ','BB'], ['CO','BB'], ['BTN','BB'], ['SB','BB'],  // BB 3bets 5 positions
  ['CO','SB'], ['BTN','SB'],                                          // SB 3bets 2 positions
  ['UTG','HJ'], ['HJ','CO'], ['CO','BTN'],                            // IP 3bets 3 positions
]

export const SIXMAX_SCENARIOS = [
  ...SRP_MATCHUPS.map(([o, c]) => buildSrpScenario(o, c)),
  ...THREEBP_MATCHUPS.map(([o, t]) => build3bpScenario(o, t)),
]

// ════════════════════════════════════════════════════════════
// Phase 3: 9-max Tournament — 20-40BB
//
// Position order: SB → BB → UTG → UTG+1 → UTG+2 → LJ → HJ → CO → BTN
// High-frequency matchups first, expand later
// ════════════════════════════════════════════════════════════

export const NINEMAX_SCENARIOS = [
  // ── SRP 40BB ──
  {
    format: '9max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '9max_40bb_srp_btn_vs_bb', label: '9max 40BB SRP BTN vs BB', depth_bb: 40,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 37,
    description: 'BTN open 2.5 → BB call → pot 5.5, eff 37',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '9max', matchup: { ip: 'CO', oop: 'BB' },
    slug: '9max_40bb_srp_co_vs_bb', label: '9max 40BB SRP CO vs BB', depth_bb: 40,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 37,
    description: 'CO open 2.5 → BB call → pot 5.5, eff 37',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '9max', matchup: { ip: 'HJ', oop: 'BB' },
    slug: '9max_40bb_srp_hj_vs_bb', label: '9max 40BB SRP HJ vs BB', depth_bb: 40,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 37,
    description: 'HJ open 2.5 → BB call → pot 5.5, eff 37',
    ranges: RANGE_PLACEHOLDER,
  },
  // ── SRP 30BB ──
  {
    format: '9max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '9max_30bb_srp_btn_vs_bb', label: '9max 30BB SRP BTN vs BB', depth_bb: 30,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 27,
    description: 'BTN open 2.5 → BB call → pot 5.5, eff 27',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '9max', matchup: { ip: 'CO', oop: 'BB' },
    slug: '9max_30bb_srp_co_vs_bb', label: '9max 30BB SRP CO vs BB', depth_bb: 30,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 27,
    description: 'CO open 2.5 → BB call → pot 5.5, eff 27',
    ranges: RANGE_PLACEHOLDER,
  },
  // ── SRP 20BB ──
  {
    format: '9max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '9max_20bb_srp_btn_vs_bb', label: '9max 20BB SRP BTN vs BB', depth_bb: 20,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 17,
    description: 'BTN open 2.5 → BB call → pot 5.5, eff 17',
    ranges: RANGE_PLACEHOLDER,
  },
  // ── 3BP 40BB ──
  {
    format: '9max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '9max_40bb_3bp_btn_vs_bb', label: '9max 40BB 3BP BTN vs BB', depth_bb: 40,
    pot_type: '3bp', pot_bb: 18.5, effective_stack_bb: 30.5,
    description: 'BTN open 2.5 → BB 3b to 9 → BTN call → pot 18.5, eff 30.5',
    ranges: RANGE_PLACEHOLDER,
  },
  // ── 3BP 30BB ──
  {
    format: '9max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '9max_30bb_3bp_btn_vs_bb', label: '9max 30BB 3BP BTN vs BB', depth_bb: 30,
    pot_type: '3bp', pot_bb: 16.5, effective_stack_bb: 21.5,
    description: 'BTN open 2.5 → BB 3b to 8 → BTN call → pot 16.5, eff 21.5',
    ranges: RANGE_PLACEHOLDER,
  },
]

// ════════════════════════════════════════════════════════════
// Exports — format-based selection
// ════════════════════════════════════════════════════════════

export const ALL_FORMATS = {
  hu:    HU_SCENARIOS,
  '6max': SIXMAX_SCENARIOS,
  '9max': NINEMAX_SCENARIOS,
  all:   [...HU_SCENARIOS, ...SIXMAX_SCENARIOS, ...NINEMAX_SCENARIOS],
}

// Backward compat — old API used by generate-input-v2.mjs
export const ALL_SCENARIOS = {
  srp:  HU_SCENARIOS.filter(s => s.pot_type === 'srp'),
  '3bp': HU_SCENARIOS.filter(s => s.pot_type === '3bp'),
  '4bp': HU_SCENARIOS.filter(s => s.pot_type === '4bp'),
  all:  HU_SCENARIOS,
}
