import { getDBByGameType } from './gtoData_index'
import { ALL_HANDS } from './helpers'
import type { RangeMap, HandData } from '../../types'

export function getGTOAction(
  hand: string,
  gameType: 'cash' | 'tournament',
  tableType: '6max' | '9max' | '4max' | 'hu',
  stackBB: number,
  position: string,
  scenario: string
): { action: string; freq?: number; note: string } {

  // Map to gameTypeKey format
  const gameTypeKey = gameType === 'cash'
    ? `cash_${tableType}` as string
    : `tourn_${tableType}` as string

  const db = getDBByGameType(stackBB, gameTypeKey)
  if (!db) return { action: 'f', note: '此情境無資料' };

  let canonicalBB: number;
  if (gameType === 'cash') {
    canonicalBB = 100;
  } else if (tableType === 'hu') {
    // HU tournament DB only has 40BB data — always use that key regardless of effective stack
    canonicalBB = 40;
  } else {
    if (stackBB >= 88) canonicalBB = 100;
    else if (stackBB >= 58) canonicalBB = 75;
    else if (stackBB >= 33) canonicalBB = 40;
    else if (stackBB >= 20) canonicalBB = 25;
    else canonicalBB = 15;
  }

  const key = `${gameTypeKey}_${canonicalBB}bb_${position}_${scenario}`;
  const range = db[key];
  if (!range) return { action: 'f', note: '此情境無資料' };

  const val = range[hand];
  if (!val || val === 'f') return { action: 'f', note: '棄牌' };
  if (val === 'r') return { action: 'r', note: '加注' };
  if (val === 'c') return { action: 'c', note: '跟注/Limp' };
  if (val === '3b') return { action: '3b', note: '3-bet' };
  if (val === '4b') return { action: '4b', note: '4-bet' };
  if (val === 'allin') return { action: 'allin', note: '全押' };

  if (val.startsWith('mr:')) {
    const pct = parseInt(val.split(':')[1]);
    return { action: 'mixed', freq: pct, note: `混合：${pct}% 加注 / ${100 - pct}% 棄牌` };
  }
  if (val.includes('_3b')) {
    const pct = parseInt(val.split(':')[1]);
    return { action: 'mixed_3b', freq: pct, note: `混合：${pct}% 3bet / ${100 - pct}% 棄牌` };
  }

  return { action: 'f', note: '棄牌' };
}

/** Build a RangeMap (compatible with existing UI) from the GTO database */
export function buildRangeMap(
  gameType: 'cash' | 'tournament',
  tableType: '6max' | '9max' | '4max' | 'hu',
  stackBB: number,
  position: string,
  scenario: string
): RangeMap {
  const rangeMap: RangeMap = {}
  for (const hand of ALL_HANDS) {
    const result = getGTOAction(hand, gameType, tableType, stackBB, position, scenario)
    const data: HandData = { action: 'fold' }

    if (result.action === 'r' || result.action === '3b' || result.action === '4b' || result.action === 'allin') {
      data.action = 'raise'
    } else if (result.action === 'c') {
      data.action = 'call'
    } else if (result.action === 'mixed' || result.action === 'mixed_3b') {
      data.action = 'raise'
      data.mixed = { raise: result.freq!, call: 0, fold: 100 - result.freq! }
    }

    rangeMap[hand] = data
  }
  return rangeMap
}
