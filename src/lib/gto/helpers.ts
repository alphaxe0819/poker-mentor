/**
 * Shared helpers for GTO data files
 */

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'] as const

/** All 169 canonical hand notations */
export const ALL_HANDS: string[] = []
for (let i = 0; i < 13; i++) {
  for (let j = 0; j < 13; j++) {
    if (i === j) ALL_HANDS.push(`${RANKS[i]}${RANKS[j]}`)
    else if (i < j) ALL_HANDS.push(`${RANKS[i]}${RANKS[j]}s`)
    else ALL_HANDS.push(`${RANKS[j]}${RANKS[i]}o`)
  }
}

export type GtoDB = Record<string, Record<string, string>>

/** Build range — unlisted hands default to fold */
export function makeRange(
  raises: string[],
  calls: string[] = [],
  mixed: Record<string, string> = {}
): Record<string, string> {
  const m: Record<string, string> = {}
  const rSet = new Set(raises)
  const cSet = new Set(calls)
  for (const h of ALL_HANDS) {
    if (rSet.has(h)) m[h] = 'r'
    else if (mixed[h]) m[h] = mixed[h]
    else if (cSet.has(h)) m[h] = 'c'
  }
  return m
}

/** Build range — unlisted hands default to call (for BB defense) */
export function makeRangeDefaultCall(
  raises: string[],
  folds: string[],
  mixed: Record<string, string> = {}
): Record<string, string> {
  const m: Record<string, string> = {}
  const rSet = new Set(raises)
  const fSet = new Set(folds)
  for (const h of ALL_HANDS) {
    if (rSet.has(h)) m[h] = 'r'
    else if (mixed[h]) m[h] = mixed[h]
    else if (!fSet.has(h)) m[h] = 'c'
  }
  return m
}

/** Build range — unlisted hands default to raise (for wide open positions) */
export function makeRangeDefaultRaise(
  folds: string[],
  calls: string[] = [],
  mixed: Record<string, string> = {}
): Record<string, string> {
  const m: Record<string, string> = {}
  const fSet = new Set(folds)
  const cSet = new Set(calls)
  for (const h of ALL_HANDS) {
    if (fSet.has(h)) { /* omit — getGTOAction returns fold by default */ }
    else if (mixed[h]) m[h] = mixed[h]
    else if (cSet.has(h)) m[h] = 'c'
    else m[h] = 'r'
  }
  return m
}
