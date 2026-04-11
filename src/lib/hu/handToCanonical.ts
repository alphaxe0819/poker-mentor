import type { Card } from './types'
import { rankValue } from './cards'

/**
 * Convert dealt hole cards (e.g. AsKh) to canonical hand class (e.g. AKo).
 * - Pair → 2 chars (AA)
 * - Suited → 3 chars (AKs)
 * - Offsuit → 3 chars (AKo)
 * High rank always appears first.
 */
export function handToCanonical(cards: [Card, Card]): string {
  const [a, b] = cards
  if (a.rank === b.rank) return a.rank + b.rank

  // Order high rank first
  const high = rankValue(a.rank) > rankValue(b.rank) ? a : b
  const low = rankValue(a.rank) > rankValue(b.rank) ? b : a
  const suited = a.suit === b.suit
  return high.rank + low.rank + (suited ? 's' : 'o')
}
