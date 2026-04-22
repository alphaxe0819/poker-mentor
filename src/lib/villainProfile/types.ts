export type Position = 'EP' | 'MP' | 'LP' | 'BL'

export type Action = 'RAISE' | 'CALL' | '3BET' | 'CALL_3BET' | '4BET' | 'CALL_4BET'

export type RangeKey =
  | 'EP_RAISE' | 'EP_CALL_3BET' | 'EP_4BET'
  | 'MP_RAISE' | 'MP_CALL' | 'MP_3BET' | 'MP_CALL_3BET' | 'MP_4BET' | 'MP_CALL_4BET'
  | 'LP_RAISE' | 'LP_CALL' | 'LP_3BET' | 'LP_CALL_3BET' | 'LP_4BET' | 'LP_CALL_4BET'
  | 'BL_RAISE' | 'BL_CALL' | 'BL_3BET' | 'BL_CALL_3BET' | 'BL_4BET' | 'BL_CALL_4BET'

export const RANGE_KEYS: RangeKey[] = [
  'EP_RAISE', 'EP_CALL_3BET', 'EP_4BET',
  'MP_RAISE', 'MP_CALL', 'MP_3BET', 'MP_CALL_3BET', 'MP_4BET', 'MP_CALL_4BET',
  'LP_RAISE', 'LP_CALL', 'LP_3BET', 'LP_CALL_3BET', 'LP_4BET', 'LP_CALL_4BET',
  'BL_RAISE', 'BL_CALL', 'BL_3BET', 'BL_CALL_3BET', 'BL_4BET', 'BL_CALL_4BET',
]

export interface RangeData {
  totalPct: number
  grid: number[]
}

export interface VillainProfile {
  version: 'v2'
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
  ranges: Record<RangeKey, RangeData>
  metadata: {
    createdMethod: 'percent_select'
    percentChoices: Record<RangeKey, number>
  }
}

export function parsePosition(key: RangeKey): Position {
  return key.slice(0, 2) as Position
}

export function parseAction(key: RangeKey): Action {
  return key.slice(3) as Action
}
