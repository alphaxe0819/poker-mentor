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

type BaselineFilter = 'open' | 'call_vs_open' | '3bet' | 'call_vs_3bet' | '4bet'

interface BaselineSource {
  dbKey: string
  filter: BaselineFilter
}

export const RANGE_KEY_TO_BASELINE: Record<RangeKey, BaselineSource> = {
  EP_RAISE: { dbKey: 'cash_6max_100bb_UTG_open', filter: 'open' },
  MP_RAISE: { dbKey: 'cash_6max_100bb_HJ_open', filter: 'open' },
  LP_RAISE: { dbKey: 'cash_6max_100bb_BTN_open', filter: 'open' },
  BL_RAISE: { dbKey: 'cash_6max_100bb_SB_open', filter: 'open' },

  MP_CALL: { dbKey: 'cash_6max_100bb_HJ_vs_UTG', filter: 'call_vs_open' },
  LP_CALL: { dbKey: 'cash_6max_100bb_BTN_vs_CO', filter: 'call_vs_open' },
  BL_CALL: { dbKey: 'cash_6max_100bb_BB_vs_open', filter: 'call_vs_open' },

  MP_3BET: { dbKey: 'cash_6max_100bb_HJ_vs_UTG', filter: '3bet' },
  LP_3BET: { dbKey: 'cash_6max_100bb_BTN_vs_CO', filter: '3bet' },
  BL_3BET: { dbKey: 'cash_6max_100bb_SB_vs_BTN', filter: '3bet' },

  EP_CALL_3BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: 'call_vs_3bet' },
  MP_CALL_3BET: { dbKey: 'cash_6max_100bb_HJ_vs_3bet', filter: 'call_vs_3bet' },
  LP_CALL_3BET: { dbKey: 'cash_6max_100bb_BTN_vs_3bet', filter: 'call_vs_3bet' },
  BL_CALL_3BET: { dbKey: 'cash_6max_100bb_SB_vs_3bet', filter: 'call_vs_3bet' },

  EP_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: '4bet' },
  MP_4BET: { dbKey: 'cash_6max_100bb_HJ_vs_3bet', filter: '4bet' },
  LP_4BET: { dbKey: 'cash_6max_100bb_BTN_vs_3bet', filter: '4bet' },
  BL_4BET: { dbKey: 'cash_6max_100bb_SB_vs_3bet', filter: '4bet' },

  MP_CALL_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: '4bet' },
  LP_CALL_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: '4bet' },
  BL_CALL_4BET: { dbKey: 'cash_6max_100bb_UTG_vs_3bet', filter: '4bet' },
}

function parseMixedWeight(marker: string): number | null {
  const m = marker.match(/^m[rbc]:(\d+)/)
  return m ? parseInt(m[1], 10) / 100 : null
}

function weightForMarker(marker: string, filter: BaselineFilter): number {
  if (!marker) return 0
  const mixed = parseMixedWeight(marker)

  if (filter === 'open') {
    if (marker === 'r') return 1
    if (marker.startsWith('mr:') && !marker.includes('_3b') && !marker.includes('_4b')) return mixed ?? 0
    return 0
  }

  if (filter === 'call_vs_open') {
    if (marker === 'c') return 1
    if (marker.startsWith('mc:')) return mixed ?? 0
    if (marker === '3b' || marker === '4b') return 0
    if (marker.includes('_3b') || marker.includes('_4b')) {
      return mixed !== null ? 1 - mixed : 0
    }
    return 0
  }

  if (filter === '3bet') {
    if (marker === '3b') return 1
    if (marker.includes('_3b')) return mixed ?? 0
    return 0
  }

  if (filter === 'call_vs_3bet') {
    if (marker === 'c') return 1
    if (marker.startsWith('mc:')) return mixed ?? 0
    if (marker.includes('_4b')) return mixed !== null ? 1 - mixed : 0
    return 0
  }

  if (filter === '4bet') {
    if (marker === '4b') return 1
    if (marker.includes('_4b')) return mixed ?? 0
    return 0
  }

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
