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
// Position order (post-flop): SB → BB → UTG → MP → CO → BTN
// IP = later position, OOP = earlier position
//
// SRP matchups: opener vs BB (most common) + BTN vs SB
// 3BP matchups: 3bettor vs caller
// ════════════════════════════════════════════════════════════

// Ranges TBD — will be populated from purchased data or GTO Wizard
const RANGE_PLACEHOLDER = { ip: '', oop: '' }

export const SIXMAX_SCENARIOS = [
  // ── SRP 100BB ──
  {
    format: '6max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '6max_100bb_srp_btn_vs_bb', label: '6max 100BB SRP BTN vs BB', depth_bb: 100,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 97,
    description: 'BTN open 2.5 → BB call → pot 5.5, eff 97 (0.5 SB dead)',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'CO', oop: 'BB' },
    slug: '6max_100bb_srp_co_vs_bb', label: '6max 100BB SRP CO vs BB', depth_bb: 100,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 97,
    description: 'CO open 2.5 → BB call → pot 5.5, eff 97',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'HJ', oop: 'BB' },
    slug: '6max_100bb_srp_hj_vs_bb', label: '6max 100BB SRP HJ vs BB', depth_bb: 100,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 97,
    description: 'HJ open 2.5 → BB call → pot 5.5, eff 97',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'UTG', oop: 'BB' },
    slug: '6max_100bb_srp_utg_vs_bb', label: '6max 100BB SRP UTG vs BB', depth_bb: 100,
    pot_type: 'srp', pot_bb: 5.5, effective_stack_bb: 97,
    description: 'UTG open 2.5 → BB call → pot 5.5, eff 97',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'BTN', oop: 'SB' },
    slug: '6max_100bb_srp_btn_vs_sb', label: '6max 100BB SRP BTN vs SB', depth_bb: 100,
    pot_type: 'srp', pot_bb: 5, effective_stack_bb: 97.5,
    description: 'BTN open 2.5 → SB call → pot 5, eff 97.5',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'BB', oop: 'SB' },
    slug: '6max_100bb_srp_sb_vs_bb', label: '6max 100BB SRP SB vs BB', depth_bb: 100,
    pot_type: 'srp', pot_bb: 6, effective_stack_bb: 97,
    description: 'SB open 3 → BB call → pot 6, eff 97',
    ranges: RANGE_PLACEHOLDER,
  },
  // ── 3BP 100BB ──
  {
    format: '6max', matchup: { ip: 'BTN', oop: 'BB' },
    slug: '6max_100bb_3bp_btn_vs_bb', label: '6max 100BB 3BP BTN vs BB', depth_bb: 100,
    pot_type: '3bp', pot_bb: 22, effective_stack_bb: 89,
    description: 'BTN open 2.5 → BB 3b to 11 → BTN call → pot 22, eff 89',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'BTN', oop: 'CO' },
    slug: '6max_100bb_3bp_co_vs_btn', label: '6max 100BB 3BP CO vs BTN 3b', depth_bb: 100,
    pot_type: '3bp', pot_bb: 24, effective_stack_bb: 88,
    description: 'CO open 2.5 → BTN 3b to 8.5 → CO call → pot 24, eff 88 (CO OOP)',
    ranges: RANGE_PLACEHOLDER,
  },
  {
    format: '6max', matchup: { ip: 'CO', oop: 'BB' },
    slug: '6max_100bb_3bp_co_vs_bb', label: '6max 100BB 3BP CO vs BB 3b', depth_bb: 100,
    pot_type: '3bp', pot_bb: 22, effective_stack_bb: 89,
    description: 'CO open 2.5 → BB 3b to 11 → CO call → pot 22, eff 89',
    ranges: RANGE_PLACEHOLDER,
  },
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
