import { ALL_HANDS } from '../gto/helpers'
import { DB_CASH_6MAX_100BB } from '../gto/gtoData_cash_6max_100bb'
import type { RangeKey } from './types'

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

function rankIdx(ch: string): number {
  const i = RANKS.indexOf(ch as typeof RANKS[number])
  return i === -1 ? 0 : 12 - i
}

export function handScore(hand: string): number {
  const a = rankIdx(hand[0])
  const b = rankIdx(hand[1])
  if (a === b) return 200 + a * 2
  if (hand.endsWith('s')) return 100 + Math.max(a, b) * 4 + Math.min(a, b)
  return Math.max(a, b) * 4 + Math.min(a, b)
}

export const TOTAL_COMBOS = 1326

export function handCombos(hand: string): number {
  if (hand.length === 2) return 6
  return hand.endsWith('s') ? 4 : 12
}

export const HAND_COMBOS: number[] = ALL_HANDS.map(handCombos)

export function gridComboPct(grid: number[]): number {
  let sum = 0
  for (let i = 0; i < 169; i++) if (grid[i] === 1) sum += HAND_COMBOS[i]
  return (sum / TOTAL_COMBOS) * 100
}

type BaselineFilter = 'raise' | 'call'

interface BaselineSource {
  dbKey: string
  filter: BaselineFilter
}

export const RANGE_KEY_TO_BASELINE: Record<RangeKey, BaselineSource> = {
  EP_RAISE: { dbKey: 'cash_6max_100bb_UTG_open', filter: 'raise' },
  MP_RAISE: { dbKey: 'cash_6max_100bb_HJ_open', filter: 'raise' },
  LP_RAISE: { dbKey: 'cash_6max_100bb_BTN_open', filter: 'raise' },
  BL_RAISE: { dbKey: 'cash_6max_100bb_SB_open', filter: 'raise' },

  MP_CALL: { dbKey: 'cash_6max_100bb_HJ_vs_UTG', filter: 'call' },
  LP_CALL: { dbKey: 'cash_6max_100bb_BTN_vs_CO', filter: 'call' },
  BL_CALL: { dbKey: 'cash_6max_100bb_BB_vs_open', filter: 'call' },

  MP_3BET: { dbKey: 'cash_6max_100bb_HJ_vs_UTG', filter: 'raise' },
  LP_3BET: { dbKey: 'cash_6max_100bb_BTN_vs_CO', filter: 'raise' },
  BL_3BET: { dbKey: 'cash_6max_100bb_SB_vs_BTN', filter: 'raise' },

  EP_CALL_3BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: 'call' },
  MP_CALL_3BET: { dbKey: 'cash_6max_100bb_HJ_vs_3bet', filter: 'call' },
  LP_CALL_3BET: { dbKey: 'cash_6max_100bb_BTN_vs_3bet', filter: 'call' },
  BL_CALL_3BET: { dbKey: 'cash_6max_100bb_SB_vs_3bet', filter: 'call' },

  EP_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: 'raise' },
  MP_4BET: { dbKey: 'cash_6max_100bb_HJ_vs_3bet', filter: 'raise' },
  LP_4BET: { dbKey: 'cash_6max_100bb_BTN_vs_3bet', filter: 'raise' },
  BL_4BET: { dbKey: 'cash_6max_100bb_SB_vs_3bet', filter: 'raise' },

  MP_CALL_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: 'raise' },
  LP_CALL_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: 'raise' },
  BL_CALL_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: 'raise' },
}

function weightForMarker(marker: string, filter: BaselineFilter): number {
  if (filter === 'raise') {
    if (marker === 'r') return 1
    if (marker.startsWith('mr:')) return (parseInt(marker.slice(3), 10) || 0) / 100
    return 0
  }
  if (marker === 'c') return 1
  if (marker.startsWith('mc:')) return (parseInt(marker.slice(3), 10) || 0) / 100
  if (marker.startsWith('mr:')) return 1 - (parseInt(marker.slice(3), 10) || 0) / 100
  return 0
}

export function extractBaselineHands(rangeKey: RangeKey): string[] {
  const src = RANGE_KEY_TO_BASELINE[rangeKey]
  const range = DB_CASH_6MAX_100BB[src.dbKey]
  if (!range) return []
  return Object.keys(range).filter(h => weightForMarker(range[h], src.filter) >= 0.5)
}

function weightedBaselineCombos(rangeKey: RangeKey): number {
  const src = RANGE_KEY_TO_BASELINE[rangeKey]
  const range = DB_CASH_6MAX_100BB[src.dbKey]
  if (!range) return 0
  let sum = 0
  for (const h of Object.keys(range)) {
    const w = weightForMarker(range[h], src.filter)
    if (w > 0) sum += handCombos(h) * w
  }
  return sum
}

function combosOfHands(hands: string[]): number {
  let sum = 0
  for (const h of hands) sum += handCombos(h)
  return sum
}

export function findBaselineRange(rangeKey: RangeKey, targetPct: number): number[] {
  const baseHands = extractBaselineHands(rangeKey)
  const grid = new Array(169).fill(0)
  const targetCombos = Math.max(0, Math.min(TOTAL_COMBOS, Math.round((targetPct / 100) * TOTAL_COMBOS)))
  const baselineCombos = combosOfHands(baseHands)

  if (Math.abs(targetCombos - baselineCombos) <= 6) {
    for (const h of baseHands) {
      const idx = ALL_HANDS.indexOf(h)
      if (idx >= 0) grid[idx] = 1
    }
    return grid
  }

  if (targetCombos > baselineCombos) {
    const baseSet = new Set(baseHands)
    const extras = ALL_HANDS
      .filter(h => !baseSet.has(h))
      .sort((a, b) => handScore(b) - handScore(a))
    for (const h of baseHands) {
      const idx = ALL_HANDS.indexOf(h)
      if (idx >= 0) grid[idx] = 1
    }
    let need = targetCombos - baselineCombos
    for (const h of extras) {
      if (need <= 0) break
      const idx = ALL_HANDS.indexOf(h)
      if (idx >= 0) {
        grid[idx] = 1
        need -= handCombos(h)
      }
    }
    return grid
  }

  const sorted = [...baseHands].sort((a, b) => handScore(b) - handScore(a))
  let used = 0
  for (const h of sorted) {
    if (used >= targetCombos) break
    const idx = ALL_HANDS.indexOf(h)
    if (idx >= 0) {
      grid[idx] = 1
      used += handCombos(h)
    }
  }
  return grid
}

export function baselinePctFor(rangeKey: RangeKey): number {
  const combos = weightedBaselineCombos(rangeKey)
  return Math.round((combos / TOTAL_COMBOS) * 1000) / 10
}

export function gridToHands(grid: number[]): string[] {
  return ALL_HANDS.filter((_, i) => grid[i] === 1)
}
