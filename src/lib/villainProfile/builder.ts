import { findBaselineRange } from './baseline'
import { RANGE_KEYS, type RangeKey, type VillainProfile } from './types'
import { newVillainId } from './storage'

export interface BuildVillainInput {
  name: string
  color: string
  percentChoices: Record<RangeKey, number>
}

export function buildVillainProfile(input: BuildVillainInput): VillainProfile {
  const now = new Date().toISOString()
  const ranges = {} as VillainProfile['ranges']
  for (const key of RANGE_KEYS) {
    const pct = input.percentChoices[key]
    const grid = findBaselineRange(key, pct)
    ranges[key] = { totalPct: pct, grid }
  }
  return {
    version: 'v2',
    id: newVillainId(),
    name: input.name,
    color: input.color,
    createdAt: now,
    updatedAt: now,
    ranges,
    metadata: {
      createdMethod: 'percent_select',
      percentChoices: { ...input.percentChoices },
    },
  }
}
