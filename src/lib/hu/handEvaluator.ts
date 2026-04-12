// src/lib/hu/handEvaluator.ts
import type { Card } from './types'
import { rankValue } from './cards'

export const HandRank = {
  HIGH_CARD: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL_HOUSE: 7,
  FOUR_OF_A_KIND: 8,
  STRAIGHT_FLUSH: 9,
} as const

export type HandRank = typeof HandRank[keyof typeof HandRank]

export interface HandEval {
  rank: HandRank
  /** Tiebreaker values: ranked descending, used by compareHands */
  tiebreak: number[]
}

/**
 * Evaluate the best 5-card hand from 5+ cards.
 * Caller can pass any combination (e.g. 7 = 2 hole + 5 board).
 */
export function evaluateHand(cards: Card[]): HandEval {
  if (cards.length < 5) throw new Error('Need at least 5 cards')

  if (cards.length === 5) return evaluate5(cards)

  // For 6 or 7 cards: enumerate all 5-combinations and pick the best
  const combos = combinations(cards, 5)
  let best: HandEval | null = null
  for (const combo of combos) {
    const ev = evaluate5(combo)
    if (!best || compareHands(ev, best) > 0) best = ev
  }
  return best!
}

function evaluate5(cards: Card[]): HandEval {
  const ranks = cards.map(c => rankValue(c.rank)).sort((a, b) => b - a)
  const suits = cards.map(c => c.suit)
  const isFlush = suits.every(s => s === suits[0])

  // Wheel: A-2-3-4-5 (rank values 14,5,4,3,2 → treat A as 1)
  const isWheel = ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2
  const isStraight = isWheel || checkStraight(ranks)

  if (isFlush && isStraight) {
    const top = isWheel ? 5 : ranks[0]
    return { rank: HandRank.STRAIGHT_FLUSH, tiebreak: [top] }
  }

  // Count rank multiplicity
  const counts: Record<number, number> = {}
  for (const r of ranks) counts[r] = (counts[r] || 0) + 1
  const groups = Object.entries(counts)
    .map(([r, c]) => ({ r: parseInt(r, 10), c }))
    .sort((a, b) => b.c - a.c || b.r - a.r)

  if (groups[0].c === 4) {
    return { rank: HandRank.FOUR_OF_A_KIND, tiebreak: [groups[0].r, groups[1].r] }
  }
  if (groups[0].c === 3 && groups[1]?.c === 2) {
    return { rank: HandRank.FULL_HOUSE, tiebreak: [groups[0].r, groups[1].r] }
  }
  if (isFlush) {
    return { rank: HandRank.FLUSH, tiebreak: ranks }
  }
  if (isStraight) {
    const top = isWheel ? 5 : ranks[0]
    return { rank: HandRank.STRAIGHT, tiebreak: [top] }
  }
  if (groups[0].c === 3) {
    const kickers = groups.slice(1).map(g => g.r)
    return { rank: HandRank.THREE_OF_A_KIND, tiebreak: [groups[0].r, ...kickers] }
  }
  if (groups[0].c === 2 && groups[1]?.c === 2) {
    const kicker = groups[2].r
    return { rank: HandRank.TWO_PAIR, tiebreak: [groups[0].r, groups[1].r, kicker] }
  }
  if (groups[0].c === 2) {
    const kickers = groups.slice(1).map(g => g.r)
    return { rank: HandRank.PAIR, tiebreak: [groups[0].r, ...kickers] }
  }
  return { rank: HandRank.HIGH_CARD, tiebreak: ranks }
}

function checkStraight(ranksDesc: number[]): boolean {
  const unique = [...new Set(ranksDesc)]
  if (unique.length < 5) return false
  for (let i = 0; i <= unique.length - 5; i++) {
    if (unique[i] - unique[i + 4] === 4) return true
  }
  return false
}

function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = []
  const recurse = (start: number, combo: T[]) => {
    if (combo.length === k) {
      result.push([...combo])
      return
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i])
      recurse(i + 1, combo)
      combo.pop()
    }
  }
  recurse(0, [])
  return result
}

/** Returns >0 if a beats b, <0 if b beats a, 0 if tie */
export function compareHands(a: HandEval, b: HandEval): number {
  if (a.rank !== b.rank) return a.rank - b.rank
  for (let i = 0; i < a.tiebreak.length; i++) {
    if (a.tiebreak[i] !== b.tiebreak[i]) return a.tiebreak[i] - b.tiebreak[i]
  }
  return 0
}
