import type { RangeKey, Position, Action } from './types'

export const PERCENT_OPTIONS: Record<RangeKey, number[]> = {
  EP_RAISE: [5, 8, 12, 16, 22, 30],
  EP_CALL_3BET: [3, 6, 10, 14, 18, 24],
  EP_4BET: [1, 2, 4, 6, 9, 13],
  MP_RAISE: [10, 14, 18, 24, 30, 38],
  MP_CALL: [4, 8, 12, 18, 25, 32],
  MP_3BET: [3, 5, 8, 11, 14, 18],
  MP_CALL_3BET: [3, 6, 10, 14, 18, 24],
  MP_4BET: [1, 2, 4, 6, 9, 13],
  MP_CALL_4BET: [1, 2, 3, 5, 7, 10],
  LP_RAISE: [22, 30, 38, 46, 55, 65],
  LP_CALL: [4, 8, 12, 18, 25, 32],
  LP_3BET: [3, 5, 8, 11, 14, 18],
  LP_CALL_3BET: [3, 6, 10, 14, 18, 24],
  LP_4BET: [1, 2, 4, 6, 9, 13],
  LP_CALL_4BET: [1, 2, 3, 5, 7, 10],
  BL_RAISE: [15, 22, 30, 40, 50, 60],
  BL_CALL: [8, 15, 25, 35, 48, 60],
  BL_3BET: [3, 5, 8, 11, 14, 18],
  BL_CALL_3BET: [3, 6, 10, 14, 18, 24],
  BL_4BET: [1, 2, 4, 6, 9, 13],
  BL_CALL_4BET: [1, 2, 3, 5, 7, 10],
}

export const POSITION_LABEL: Record<Position, string> = {
  EP: '前位',
  MP: '中位',
  LP: '後位',
  BL: '盲注位',
}

export const ACTION_LABEL: Record<Action, string> = {
  RAISE: 'open',
  CALL: '跟注',
  '3BET': '3-bet',
  CALL_3BET: '跟 3-bet',
  '4BET': '4-bet',
  CALL_4BET: '跟 4-bet',
}
