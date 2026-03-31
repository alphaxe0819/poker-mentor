import * as DBS from './gtoData_index'
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

  // Select the appropriate database
  let db;
  let canonicalBB: number;

  if (gameType === 'cash') {
    canonicalBB = 100;
    if (tableType === '6max') db = DBS.DB_CASH_6MAX_100BB;
    else if (tableType === '4max') db = DBS.DB_CASH_4MAX_100BB;
    else if (tableType === 'hu') db = DBS.DB_CASH_HU_100BB;
  } else {
    if (stackBB >= 88) { db = DBS.DB_TOURN_100BB; canonicalBB = 100; }
    else if (stackBB >= 58) { db = DBS.DB_TOURN_75BB; canonicalBB = 75; }
    else if (stackBB >= 33) { db = DBS.DB_TOURN_40BB; canonicalBB = 40; }
    else if (stackBB >= 20) { db = DBS.DB_TOURN_25BB; canonicalBB = 25; }
    else { db = DBS.DB_TOURN_15BB; canonicalBB = 15; }
  }

  if (!db) return { action: 'f', note: '此情境無資料' };

  const key = `${gameType}_${tableType}_${canonicalBB!}bb_${position}_${scenario}`;
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
