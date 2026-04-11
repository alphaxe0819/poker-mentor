// src/lib/hu/cards.ts
import type { Card, Rank, Suit } from './types'

export const RANKS: Rank[] = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
export const SUITS: Suit[] = ['c','d','h','s']

const RANK_SET = new Set<string>(RANKS)
const SUIT_SET = new Set<string>(SUITS)

export function parseCard(s: string): Card {
  if (s.length !== 2) throw new Error(`Invalid card string: ${s}`)
  const rank = s[0] as Rank
  const suit = s[1] as Suit
  if (!RANK_SET.has(rank)) throw new Error(`Invalid rank in: ${s}`)
  if (!SUIT_SET.has(suit)) throw new Error(`Invalid suit in: ${s}`)
  return { rank, suit }
}

export function formatCard(c: Card): string {
  return c.rank + c.suit
}

export function parseBoard(s: string): Card[] {
  const cleaned = s.replace(/[,\s]/g, '')
  if (cleaned.length % 2 !== 0) throw new Error(`Invalid board: ${s}`)
  const cards: Card[] = []
  for (let i = 0; i < cleaned.length; i += 2) {
    cards.push(parseCard(cleaned.slice(i, i + 2)))
  }
  return cards
}

export function formatBoard(cards: Card[]): string {
  return cards.map(formatCard).join('')
}

/** A=14, K=13, Q=12, J=11, T=10, 9-2 = numeric */
export function rankValue(r: Rank): number {
  if (r === 'A') return 14
  if (r === 'K') return 13
  if (r === 'Q') return 12
  if (r === 'J') return 11
  if (r === 'T') return 10
  return parseInt(r, 10)
}

export function compareCards(a: Card, b: Card): number {
  return rankValue(a.rank) - rankValue(b.rank)
}
