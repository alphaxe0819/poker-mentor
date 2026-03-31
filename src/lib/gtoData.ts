import { getGTOAction as _getGTOAction } from './gto/getGTOAction'
import * as DBS from './gto/gtoData_index'

export type GameTypeKey = 'cash_6max' | 'tourn_9max' | 'cash_hu' | 'cash_4max'

// 把 TrainTab / QuizTab 用的參數格式轉換成 getGTOAction 的格式
export function getGTOAction(
  gameTypeKey: GameTypeKey | string,
  stackBB: number,
  position: string,
  hand: string,
  scenario: string = 'open'
): string {
  let gameType: 'cash' | 'tournament'
  let tableType: '6max' | '9max' | '4max' | 'hu'

  if (gameTypeKey === 'cash_6max')  { gameType = 'cash';       tableType = '6max' }
  else if (gameTypeKey === 'tourn_9max') { gameType = 'tournament'; tableType = '9max' }
  else if (gameTypeKey === 'cash_hu')   { gameType = 'cash';       tableType = 'hu'   }
  else if (gameTypeKey === 'cash_4max') { gameType = 'cash';       tableType = '4max' }
  else { return 'f' }

  const dbScenario = scenario === 'open' ? 'open' : 'vs_open'

  const result = _getGTOAction(hand, gameType, tableType, stackBB, position, dbScenario)

  if (result.action === 'mixed') return 'r'
  if (result.action === 'mixed_3b') return '3b'
  return result.action
}

export const ACTION_LABELS: Record<string, string> = {
  f:    'Fold（棄牌）',
  c:    'Call（跟注）',
  r:    'Raise（加注）',
  '3b': '3-Bet',
  '4b': '4-Bet',
  '5b': '5-Bet',
  allin:'All-in（全下）',
  limp: 'Limp（平跟）',
}

export function getActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action
}

// ── Step 2 GTO (vs 3bet / 4bet / allin) ───────────────────────────────────

export function getStep2GTOFromDB(
  gameTypeKey: string,
  stackBB: number,
  heroPos: string,
  villainPos: string,
  villainResp: string,
  hand: string,
): string {
  if (gameTypeKey !== 'tourn_9max' || stackBB < 88) {
    return getStep2GTOFallback(villainResp, hand)
  }

  const db = DBS.DB_TOURN_100BB
  let key = ''

  if (villainResp === '3bet') {
    const scenarioSuffix = (() => {
      const early  = ['UTG', 'UTG+1', 'UTG+2']
      const late   = ['CO', 'BTN']
      const blinds = ['SB', 'BB']
      if (early.includes(villainPos))  return 'early'
      if (late.includes(villainPos))   return 'late'
      if (blinds.includes(villainPos)) return 'blinds'
      if (villainPos === 'LJ')         return 'btn'
      if (villainPos === 'HJ')         return 'co'
      return 'late'
    })()
    key = `tournament_9max_100bb_${heroPos}_vs_3bet_${scenarioSuffix}`
  }

  if (!key) return getStep2GTOFallback(villainResp, hand)

  const range = db[key]
  if (!range) return getStep2GTOFallback(villainResp, hand)

  const val = range[hand]
  if (!val || val === 'f') return 'f'
  if (val.startsWith('mr:')) return 'r'
  return val
}

function getStep2GTOFallback(villainResp: string, hand: string): string {
  const premium = new Set(['AA','KK','QQ','JJ','AKs','AKo'])
  const strong  = new Set(['TT','99','AQs','AQo','AJs','KQs'])

  if (villainResp === '3bet') {
    if (premium.has(hand)) return '4b'
    if (strong.has(hand))  return 'c'
    return 'f'
  }
  if (villainResp === '4bet') {
    if (premium.has(hand)) return 'allin'
    return 'f'
  }
  if (villainResp === 'allin') {
    if (premium.has(hand)) return 'c'
    return 'f'
  }
  return 'f'
}

// ── DB lookup helpers ─────────────────────────────────────────────────────

function getDB(gameTypeKey: string, stackBB: number) {
  if (gameTypeKey === 'cash_6max')  return DBS.DB_CASH_6MAX_100BB
  if (gameTypeKey === 'cash_4max')  return DBS.DB_CASH_4MAX_100BB
  if (gameTypeKey === 'cash_hu')    return DBS.DB_CASH_HU_100BB
  if (gameTypeKey === 'tourn_9max') {
    if (stackBB >= 88) return DBS.DB_TOURN_100BB
    if (stackBB >= 58) return DBS.DB_TOURN_75BB
    if (stackBB >= 33) return DBS.DB_TOURN_40BB
    if (stackBB >= 20) return DBS.DB_TOURN_25BB
    return DBS.DB_TOURN_15BB
  }
  return null
}

function getCanonicalBB(gameTypeKey: string, stackBB: number): number {
  if (gameTypeKey !== 'tourn_9max') return 100
  if (stackBB >= 88) return 100
  if (stackBB >= 58) return 75
  if (stackBB >= 33) return 40
  if (stackBB >= 20) return 25
  return 15
}

function getTableType(gameTypeKey: string): string {
  if (gameTypeKey === 'cash_6max')  return '6max'
  if (gameTypeKey === 'cash_4max')  return '4max'
  if (gameTypeKey === 'cash_hu')    return 'hu'
  if (gameTypeKey === 'tourn_9max') return '9max'
  return '6max'
}

export function getTopActions(
  gameTypeKey: string,
  stackBB: number,
  position: string,
  hand: string,
  scenario: string = 'open'
): { action: string; freq: number }[] {
  const db = getDB(gameTypeKey, stackBB)
  if (!db) return [{ action: 'f', freq: 100 }]

  const gameType   = gameTypeKey.startsWith('tourn') ? 'tournament' : 'cash'
  const tableType  = getTableType(gameTypeKey)
  const canonicalBB = getCanonicalBB(gameTypeKey, stackBB)
  const dbScenario  = scenario === 'open' ? 'open' : 'vs_open'
  const key = `${gameType}_${tableType}_${canonicalBB}bb_${position}_${dbScenario}`
  const range = db[key]
  if (!range) return [{ action: 'f', freq: 100 }]

  const val = range[hand]

  if (val && val.startsWith('mr:')) {
    const pct = parseInt(val.split(':')[1])
    return [
      { action: 'r', freq: pct },
      { action: 'f', freq: 100 - pct },
    ]
  }

  if (!val || val === 'f') return [{ action: 'f', freq: 100 }]

  const secondAction =
    val === 'r'    ? 'f' :
    val === 'c'    ? 'f' :
    val === '3b'   ? 'c' :
    val === 'allin'? 'f' : 'f'

  return [
    { action: val,          freq: 100 },
    { action: secondAction, freq: 0   },
  ]
}
