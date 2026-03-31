/**
 * GTO Preflop Data
 *
 * Structure: scenario → position → hand → { action, mixed?, ev? }
 *
 * Action meanings (6-max, 2.5bb open, ~100bb effective):
 *   raise = open-raise / 3-bet
 *   call  = call (vs raise), limp (SB vs walk)
 *   fold  = fold
 *
 * TODO (postflop expansion): add flop/turn/river boards keyed by board texture.
 */

import type { RangeMap, Scenario, CoachSource, Position } from '../types'

// ─── Hand Notation ───────────────────────────────────────────────────────────

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
type Rank = typeof RANKS[number]

/** Generate all 169 canonical hand keys (AA, AKs, AKo, …, 22) */
export function allHands(): string[] {
  const hands: string[] = []
  for (let i = 0; i < RANKS.length; i++) {
    for (let j = 0; j < RANKS.length; j++) {
      if (i === j) hands.push(`${RANKS[i]}${RANKS[j]}`)        // pair
      else if (i < j) hands.push(`${RANKS[i]}${RANKS[j]}s`)   // suited (row < col)
      else hands.push(`${RANKS[j]}${RANKS[i]}o`)               // offsuit
    }
  }
  return hands
}

/** Row index of a rank in the 13x13 grid (top = Ace) */
export function rankIndex(r: Rank): number {
  return RANKS.indexOf(r)
}

/** Returns the hand key for grid cell (row, col) */
export function cellToHand(row: number, col: number): string {
  const r = RANKS[row]
  const c = RANKS[col]
  if (row === col) return `${r}${c}`
  if (row < col) return `${r}${c}s`
  return `${c}${r}o`
}

// ─── Stack Depth ─────────────────────────────────────────────────────────────

export const STACK_SIZES = [10, 15, 20, 30, 40, 100] as const

export type StackCategory = 'short' | 'medium' | 'deep30' | 'deep40' | 'deep100'

export function getStackCategory(bb: number): StackCategory {
  if (bb <= 15) return 'short'
  if (bb <= 25) return 'medium'
  if (bb <= 35) return 'deep30'
  if (bb <= 45) return 'deep40'
  return 'deep100'
}

export function randomStack(): number {
  return STACK_SIZES[Math.floor(Math.random() * STACK_SIZES.length)]
}

/** Generate random stacks for all seats given the effective stack */
export function generateSeatStacks(effectiveStack: number, tableSize: number = 6): number[] {
  // slot 0 = hero = effectiveStack, others random 60%-150%
  return Array.from({ length: tableSize }, (_, i) => {
    if (i === 0) return effectiveStack
    const min = Math.round(effectiveStack * 0.6)
    const max = Math.round(effectiveStack * 1.5)
    return min + Math.floor(Math.random() * (max - min + 1))
  })
}

// ─── GTO Ranges (by stack depth) ─────────────────────────────────────────────

function buildRange(raiseSet: Set<string>, mixedMap: Record<string, { raise: number; call: number; fold: number }> = {}, callSet?: Set<string>): RangeMap {
  const range: RangeMap = {}
  for (const hand of allHands()) {
    if (raiseSet.has(hand)) {
      range[hand] = { action: 'raise' }
    } else if (mixedMap[hand]) {
      range[hand] = { action: 'raise', mixed: mixedMap[hand] }
    } else if (callSet?.has(hand)) {
      range[hand] = { action: 'call' }
    } else {
      range[hand] = { action: 'fold' }
    }
  }
  return range
}

// ── UTG ranges ───────────────────────────────────────────────────────────────

// short (10-15BB) — jam or fold
const UTG_SHORT = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AKo','AQs','AQo','AJs','AJo','KQs',
  ]),
)

// medium (20BB)
const UTG_MEDIUM = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AKo','AQs','AQo','AJs','AJo','KQs',
    '77','66','ATs','KJs','QJs','JTs',
  ]),
)

// deep30 (30BB)
const UTG_DEEP30 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AKo','AQs','AQo','AJs','AJo','KQs',
    '77','66','ATs','KJs','QJs','JTs',
    '55','44','A9s','A8s','KTs','QTs','T9s','98s',
  ]),
)

// deep40 (40BB)
const UTG_DEEP40 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AKo','AQs','AQo','AJs','AJo','KQs',
    '77','66','ATs','KJs','QJs','JTs',
    '55','44','A9s','A8s','KTs','QTs','T9s','98s',
    '33','22','A7s','A6s','A5s','K9s','87s','76s',
  ]),
)

// deep100 (100BB) — full GTO range
const UTG_DEEP100 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
    'AKo','AQo','AJo','ATo',
    'KQs','KJs','KTs','K9s','KQo','KJo',
    'QJs','QTs','Q9s','QJo',
    'JTs','J9s','T9s','T8s','98s','97s','87s','86s','76s','65s','54s',
  ]),
  {
    '66': { raise: 80, call: 0, fold: 20 },
    '55': { raise: 60, call: 0, fold: 40 },
    '44': { raise: 40, call: 0, fold: 60 },
    '33': { raise: 30, call: 0, fold: 70 },
    '22': { raise: 20, call: 0, fold: 80 },
    'K8s': { raise: 40, call: 0, fold: 60 },
    'Q8s': { raise: 30, call: 0, fold: 70 },
    'J8s': { raise: 40, call: 0, fold: 60 },
    'A9o': { raise: 60, call: 0, fold: 40 },
    'A8o': { raise: 30, call: 0, fold: 70 },
    'KTo': { raise: 60, call: 0, fold: 40 },
    'QTo': { raise: 40, call: 0, fold: 60 },
    'JTo': { raise: 50, call: 0, fold: 50 },
  },
)

// ── BTN ranges ───────────────────────────────────────────────────────────────

const BTN_SHORT = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77','66','55',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A5s',
    'AKo','AQo','AJo','ATo','A9o','A8o',
    'KQs','KJs','KTs','K9s','KQo','KJo','KTo',
    'QJs','QTs','Q9s','QJo','QTo',
    'JTs','J9s','JTo','T9s','98s','87s','76s','65s','54s',
  ]),
)

const BTN_MEDIUM = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77','66','55',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
    'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A5o',
    'KQs','KJs','KTs','K9s','K8s','K7s','K5s',
    'KQo','KJo','KTo','K9o',
    'QJs','QTs','Q9s','Q8s','QJo','QTo','Q9o',
    'JTs','J9s','J8s','JTo','J9o',
    'T9s','T8s','T9o','98s','97s','98o','87s','86s','76s','75s','65s','64s','54s','53s','43s',
  ]),
  {
    '44': { raise: 80, call: 0, fold: 20 },
    '33': { raise: 60, call: 0, fold: 40 },
    '22': { raise: 50, call: 0, fold: 50 },
  },
)

const BTN_DEEP30 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
    'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o',
    'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s',
    'KQo','KJo','KTo','K9o',
    'QJs','QTs','Q9s','Q8s','Q7s',
    'QJo','QTo','Q9o',
    'JTs','J9s','J8s','JTo','J9o',
    'T9s','T8s','T7s','T9o',
    '98s','97s','96s','98o',
    '87s','86s','87o','76s','75s','65s','64s','54s','53s','43s',
  ]),
  {
    '33': { raise: 70, call: 0, fold: 30 },
    '22': { raise: 50, call: 0, fold: 50 },
  },
)

const BTN_DEEP40 = buildRange(
  new Set(allHands().filter(h => {
    const folds = new Set([
      '72o','73o','74o','75o','82o','83o','84o','85o','92o','93o','94o',
      '32o','42o','43o','52o','53o','62o','63o','64o','65o',
      '72s','82s','92s','32s','42s',
      'T2o','J2o','Q2o','K2o',
    ])
    return !folds.has(h)
  })),
)

const BTN_DEEP100 = buildRange(
  new Set(allHands().filter(h => {
    const folds = new Set([
      '72o','73o','74o','75o','82o','83o','84o','92o','93o','94o',
      '32o','42o','43o','52o','53o','62o','63o','64o',
      '72s','82s','92s','32s',
    ])
    return !folds.has(h)
  })),
)

// ── SB ranges ────────────────────────────────────────────────────────────────

const SB_SHORT = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77',
    'AKs','AQs','AJs','ATs','A9s','A8s','A5s',
    'AKo','AQo','AJo','ATo','A9o',
    'KQs','KJs','KTs','KQo','KJo',
    'QJs','QTs','JTs',
  ]),
)

const SB_MEDIUM = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A5s',
    'AKo','AQo','AJo','ATo','A9o',
    'KQs','KJs','KTs','KQo','KJo',
    'QJs','QTs','JTs','T9s','98s','87s',
  ]),
  {
    '66': { raise: 70, call: 0, fold: 30 },
    '55': { raise: 50, call: 0, fold: 50 },
  },
)

const SB_DEEP30 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88','77',
    'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A5s',
    'AKo','AQo','AJo','ATo','A9o',
    'KQs','KJs','KTs','KQo','KJo',
    'QJs','QTs','JTs','T9s','98s','87s','76s','65s',
  ]),
  {},
  new Set([
    '66','55','44','33',
    'A6s','A4s','A3s','A2s',
    'K9s','Q9s','J9s',
    'KTo','QTo',
    'A8o','A7o',
  ]),
)

const SB_DEEP40 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AQs','AJs','ATs','A9s','A8s',
    'AKo','AQo','AJo','ATo','A9o',
    'KQs','KJs','KTs','KQo','KJo',
    'QJs','QTs','JTs','J9s','T9s','T8s','98s','97s','87s','76s','65s','54s',
  ]),
  {},
  new Set([
    '77','66','55','44','33','22',
    'A7s','A6s','A5s','A4s','A3s','A2s',
    'K9s','K8s','Q9s','Q8s','J8s','T7s','86s','75s','64s','53s',
    'KTo','QTo','JTo',
    'A8o','A7o','K9o','Q9o','J9o','T9o',
  ]),
)

const SB_DEEP100 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99','88',
    'AKs','AQs','AJs','ATs','A9s','A8s',
    'AKo','AQo','AJo','ATo','A9o',
    'KQs','KJs','KTs','KQo','KJo',
    'QJs','QTs','JTs','J9s','T9s','T8s','98s','97s','87s','76s','65s','54s',
  ]),
  {},
  new Set([
    '77','66','55','44','33','22',
    'A7s','A6s','A5s','A4s','A3s','A2s',
    'KTo','QTo','JTo',
    'K9s','K8s','Q9s','Q8s','J8s','T7s','97s','86s','75s','64s','53s',
    'A8o','A7o','K9o','Q9o','J9o','T9o',
  ]),
)

// ── BB ranges ────────────────────────────────────────────────────────────────

const BB_SHORT = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99',
    'AKs','AQs','AJs','AKo','AQo',
    'KQs',
  ]),
  {},
  new Set(allHands().filter(h => {
    const folds = new Set([
      '72o','73o','74o','75o','82o','83o','84o','92o','93o','94o',
      '32o','42o','43o','52o','53o','62o','63o',
    ])
    const raises = new Set([
      'AA','KK','QQ','JJ','TT','99','AKs','AQs','AJs','AKo','AQo','KQs',
    ])
    return !folds.has(h) && !raises.has(h)
  })),
)

const BB_MEDIUM = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT','99',
    'AKs','AQs','AJs','AKo','AQo',
    'KQs',
  ]),
  {},
  new Set(allHands().filter(h => {
    const folds = new Set([
      '72o','73o','74o','75o','82o','83o','84o','92o','93o','94o',
      '32o','42o','43o','52o','53o','62o','63o',
    ])
    const raises = new Set([
      'AA','KK','QQ','JJ','TT','99','AKs','AQs','AJs','AKo','AQo','KQs',
    ])
    return !folds.has(h) && !raises.has(h)
  })),
)

const BB_DEEP30 = buildRange(
  new Set([
    'AA','KK','QQ','JJ','TT',
    'AKs','AQs','AJs','AKo','AQo',
    'KQs','A5s','A4s',
  ]),
  {},
  new Set(allHands().filter(h => {
    const folds = new Set([
      '72o','73o','74o','82o','83o','84o','92o','93o','32o','42o','43o','52o','53o','62o',
    ])
    const raises = new Set([
      'AA','KK','QQ','JJ','TT','AKs','AQs','AJs','AKo','AQo','KQs','A5s','A4s',
    ])
    return !folds.has(h) && !raises.has(h)
  })),
)

const BB_DEEP40 = buildRange(
  new Set([
    'AA','KK','QQ','JJ',
    'AKs','AQs','AJs','AKo','AQo',
    'KQs','A5s','A4s','54s',
  ]),
  {},
  new Set(allHands().filter(h => {
    const folds = new Set(['72o','73o','82o','83o','92o','93o','32o','42o','52o','62o'])
    const raises = new Set([
      'AA','KK','QQ','JJ','AKs','AQs','AJs','AKo','AQo','KQs','A5s','A4s','54s',
    ])
    return !folds.has(h) && !raises.has(h)
  })),
)

const BB_DEEP100 = buildRange(
  new Set([
    'AA','KK','QQ','JJ',
    'AKs','AQs','AJs','AKo','AQo',
    'KQs','A5s','A4s','54s','43s',
  ]),
  {},
  new Set(allHands().filter(h => {
    const folds = new Set(['72o','73o','82o','83o','92o','93o','32o','42o','52o','62o'])
    const raises = new Set([
      'AA','KK','QQ','JJ','AKs','AQs','AJs','AKo','AQo','KQs','A5s','A4s','54s','43s',
    ])
    return !folds.has(h) && !raises.has(h)
  })),
)

// ── Range lookup by stack depth + position ───────────────────────────────────

type PositionKey = 'UTG' | 'BTN' | 'SB' | 'BB'

const GTO_RANGES: Record<StackCategory, Record<PositionKey, RangeMap>> = {
  'short':   { UTG: UTG_SHORT,  BTN: BTN_SHORT,  SB: SB_SHORT,  BB: BB_SHORT },
  'medium':  { UTG: UTG_MEDIUM, BTN: BTN_MEDIUM, SB: SB_MEDIUM, BB: BB_MEDIUM },
  'deep30':  { UTG: UTG_DEEP30, BTN: BTN_DEEP30, SB: SB_DEEP30, BB: BB_DEEP30 },
  'deep40':  { UTG: UTG_DEEP40, BTN: BTN_DEEP40, SB: SB_DEEP40, BB: BB_DEEP40 },
  'deep100': { UTG: UTG_DEEP100,BTN: BTN_DEEP100,SB: SB_DEEP100,BB: BB_DEEP100 },
}

/** Get the appropriate range for a position and stack depth */
export function getRangeForStack(position: Position, stackBB: number): RangeMap {
  const cat = getStackCategory(stackBB)
  // Map HJ/CO to UTG (similar tight ranges, slightly adjusted)
  const posKey: PositionKey =
    position === 'HJ' || position === 'CO' || position === 'UTG+1' || position === 'UTG+2' || position === 'LJ' ? 'UTG' :
    position === 'UTG' || position === 'BTN' || position === 'SB' || position === 'BB' ? position :
    'UTG'
  return GTO_RANGES[cat][posKey]
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export const DEMO_SCENARIOS: Scenario[] = [
  // ── Cash 6-max ────────────────────────────────────────────────────────────
  {
    id: 'utg-open',
    name: 'UTG Open',
    position: 'UTG',
    coachSource: 'gto-wizard-demo',
    description: '翻前 UTG 位置開牌範圍（6-max, 2.5bb）',
    range: UTG_DEEP100,
    gameType: 'cash', tableType: '6max', gtoScenario: 'open',
  },
  {
    id: 'hj-open',
    name: 'HJ Open',
    position: 'HJ',
    coachSource: 'gto-wizard-demo',
    description: '翻前 HJ 位置開牌範圍（6-max, 2.5bb）',
    gameType: 'cash', tableType: '6max', gtoScenario: 'open',
  },
  {
    id: 'co-open',
    name: 'CO Open',
    position: 'CO',
    coachSource: 'gto-wizard-demo',
    description: '翻前 CO 位置開牌範圍（6-max, 2.5bb）',
    gameType: 'cash', tableType: '6max', gtoScenario: 'open',
  },
  {
    id: 'btn-open',
    name: 'BTN Open',
    position: 'BTN',
    coachSource: 'gto-wizard-demo',
    description: '翻前 BTN 位置開牌範圍（6-max, 2.5bb）',
    range: BTN_DEEP100,
    gameType: 'cash', tableType: '6max', gtoScenario: 'open',
  },
  {
    id: 'sb-open',
    name: 'SB vs BB',
    position: 'SB',
    coachSource: 'gto-wizard-demo',
    description: 'SB vs BB 翻前策略（開牌 / Limp / Fold）',
    range: SB_DEEP100,
    gameType: 'cash', tableType: '6max', gtoScenario: 'open',
  },
  {
    id: 'bb-vs-sb',
    name: 'BB vs SB Open',
    position: 'BB',
    coachSource: 'gto-wizard-demo',
    description: 'BB 對抗 SB 開牌的防守範圍（3-bet / Call / Fold）',
    range: BB_DEEP100,
    gameType: 'cash', tableType: '6max', gtoScenario: 'vs_open',
  },

  // ── Tournament 9-max ──────────────────────────────────────────────────────
  {
    id: 'tourn-utg-open',
    name: 'UTG Open',
    position: 'UTG',
    coachSource: 'gto-wizard-demo',
    description: '錦標賽 UTG 開牌（9-max, 依深度切換）',
    gameType: 'tournament', tableType: '9max', gtoScenario: 'open',
  },
  {
    id: 'tourn-hj-open',
    name: 'HJ Open',
    position: 'HJ',
    coachSource: 'gto-wizard-demo',
    description: '錦標賽 HJ 開牌（9-max, 依深度切換）',
    gameType: 'tournament', tableType: '9max', gtoScenario: 'open',
  },
  {
    id: 'tourn-co-open',
    name: 'CO Open',
    position: 'CO',
    coachSource: 'gto-wizard-demo',
    description: '錦標賽 CO 開牌（9-max, 依深度切換）',
    gameType: 'tournament', tableType: '9max', gtoScenario: 'open',
  },
  {
    id: 'tourn-btn-open',
    name: 'BTN Open',
    position: 'BTN',
    coachSource: 'gto-wizard-demo',
    description: '錦標賽 BTN 開牌（9-max, 依深度切換）',
    gameType: 'tournament', tableType: '9max', gtoScenario: 'open',
  },
  {
    id: 'tourn-sb-open',
    name: 'SB Open',
    position: 'SB',
    coachSource: 'gto-wizard-demo',
    description: '錦標賽 SB 開牌（9-max, 依深度切換）',
    gameType: 'tournament', tableType: '9max', gtoScenario: 'open',
  },
  {
    id: 'tourn-bb-vs-open',
    name: 'BB vs Open',
    position: 'BB',
    coachSource: 'gto-wizard-demo',
    description: '錦標賽 BB 防守（9-max, 依深度切換）',
    gameType: 'tournament', tableType: '9max', gtoScenario: 'vs_open',
  },

  // ── Cash 4-max ────────────────────────────────────────────────────────────
  {
    id: '4max-utg-open',
    name: 'UTG Open',
    position: 'UTG',
    coachSource: 'gto-wizard-demo',
    description: '翻前 UTG 開牌（4-max, 100bb）',
    gameType: 'cash', tableType: '4max', gtoScenario: 'open',
  },
  {
    id: '4max-btn-open',
    name: 'BTN Open',
    position: 'BTN',
    coachSource: 'gto-wizard-demo',
    description: '翻前 BTN 開牌（4-max, 100bb）',
    gameType: 'cash', tableType: '4max', gtoScenario: 'open',
  },
  {
    id: '4max-sb-open',
    name: 'SB Open',
    position: 'SB',
    coachSource: 'gto-wizard-demo',
    description: 'SB 開牌（4-max, 100bb）',
    gameType: 'cash', tableType: '4max', gtoScenario: 'open',
  },
  {
    id: '4max-bb-vs-open',
    name: 'BB vs Open',
    position: 'BB',
    coachSource: 'gto-wizard-demo',
    description: 'BB 防守（4-max, 100bb）',
    gameType: 'cash', tableType: '4max', gtoScenario: 'vs_open',
  },
]

// ─── Coach Sources ────────────────────────────────────────────────────────────

export const DEMO_COACHES: CoachSource[] = [
  {
    id: 'gto-wizard-demo',
    name: 'GTO Wizard',
    description: '業界標準 GTO 解算器，翻前範圍精準',
    avatar: '🧙',
    isDemo: true,
  },
  {
    id: 'pio-solver-demo',
    name: 'PioSOLVER',
    description: '深度翻後分析，適合進階研究',
    avatar: '🔬',
    isDemo: true,
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Pick a random hand from a range (weighted by combo count, exclude folds optionally) */
export function pickRandomHand(range: RangeMap, excludeFold = false): string {
  const entries = Object.entries(range).filter(([, v]) =>
    excludeFold ? v.action !== 'fold' : true
  )
  if (entries.length === 0) return 'AKs'
  return entries[Math.floor(Math.random() * entries.length)][0]
}

/** Resolve the "correct" action for a hand, respecting mixed strategy (probabilistic) */
export function resolveAction(range: RangeMap, hand: string): 'raise' | 'call' | 'fold' {
  const data = range[hand]
  if (!data) return 'fold'
  if (!data.mixed) return data.action

  const { raise, call, fold } = data.mixed
  const roll = Math.random() * 100
  if (roll < raise) return 'raise'
  if (roll < raise + call) return 'call'
  if (roll < raise + call + fold) return 'fold'
  return data.action
}

/** Human-readable position label */
export const POSITION_LABELS: Record<Position, string> = {
  UTG: 'Under the Gun',
  'UTG+1': 'Under the Gun +1',
  'UTG+2': 'Under the Gun +2',
  LJ: 'Lojack',
  HJ: 'Hijack',
  CO: 'Cut-Off',
  BTN: 'Button',
  SB: 'Small Blind',
  BB: 'Big Blind',
}

// ─── Preflop Context Generation ──────────────────────────────────────────────

export interface SeatDisplayInfo {
  status: 'folded' | 'raised' | 'posted' | 'waiting' | 'hero'
  bet: number
}

export interface PreflopContext {
  seatInfo: Record<string, SeatDisplayInfo>
  potTotal: number
  scenarioDesc: string
  raiserPos?: string
}

const ACTION_ORDER_6MAX: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const ACTION_ORDER_9MAX: Position[] = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

/**
 * Generate preflop action context for display.
 * Determines who folded, who raised, and pot amounts.
 */
export function generatePreflopContext(
  heroPos: Position,
  gtoScenario?: string,
  tableSize: number = 6,
): PreflopContext {
  const actionOrder = tableSize === 9 ? ACTION_ORDER_9MAX : ACTION_ORDER_6MAX
  const info: Record<string, SeatDisplayInfo> = {}
  let potTotal = 1.5 // SB(0.5) + BB(1)
  let scenarioDesc = ''
  let raiserPos: string | undefined
  const heroIdx = actionOrder.indexOf(heroPos)

  if (gtoScenario === 'vs_open' && heroPos === 'BB') {
    // BB defense: a random position raised
    const possibleRaisers = actionOrder.filter(p => p !== 'BB')
    raiserPos = possibleRaisers[Math.floor(Math.random() * possibleRaisers.length)]
    const raiseBB = 2.5

    for (const pos of actionOrder) {
      if (pos === 'BB') {
        info[pos] = { status: 'hero', bet: 1 }
      } else if (pos === raiserPos) {
        info[pos] = { status: 'raised', bet: raiseBB }
      } else {
        info[pos] = { status: 'folded', bet: 0 }
      }
    }

    potTotal = raiseBB + 1 + 0.5 // raiser + BB blind + SB dead
    scenarioDesc = `${raiserPos} 加注 ${raiseBB}bb`
  } else {
    // RFI (open): folded to hero
    for (let i = 0; i < actionOrder.length; i++) {
      const pos = actionOrder[i]
      if (pos === heroPos) {
        info[pos] = { status: 'hero', bet: pos === 'SB' ? 0.5 : pos === 'BB' ? 1 : 0 }
      } else if (i < heroIdx) {
        info[pos] = { status: 'folded', bet: 0 }
      } else {
        if (pos === 'SB') info[pos] = { status: 'posted', bet: 0.5 }
        else if (pos === 'BB') info[pos] = { status: 'posted', bet: 1 }
        else info[pos] = { status: 'waiting', bet: 0 }
      }
    }

    if (heroIdx === 0) scenarioDesc = '你是第一個行動'
    else scenarioDesc = `Fold 到 ${heroPos}`
  }

  return { seatInfo: info, potTotal, scenarioDesc, raiserPos }
}
