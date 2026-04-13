// =============================================================
// HU Postflop GTO Data — Index / Aggregator
// =============================================================
// 把 13 個 board 個別產出的 const 集中管理。
// 每個 board 的 const 命名規則：HU_40BB_SRP_FLOP_<BOARD_SLUG_UPPERCASE>
// 來源：scripts/gto-pipeline/ 用 TexasSolver CLI 產生
// =============================================================

import { HU_40BB_SRP_FLOP_AS7D2C } from './gtoData_hu_40bb_srp_flop_As7d2c'
import { HU_40BB_SRP_FLOP_KC8H3S } from './gtoData_hu_40bb_srp_flop_Kc8h3s'
import { HU_40BB_SRP_FLOP_JC7D2H } from './gtoData_hu_40bb_srp_flop_Jc7d2h'
import { HU_40BB_SRP_FLOP_9D5C2H } from './gtoData_hu_40bb_srp_flop_9d5c2h'
import { HU_40BB_SRP_FLOP_KSQD4H } from './gtoData_hu_40bb_srp_flop_KsQd4h'
import { HU_40BB_SRP_FLOP_TD8H4C } from './gtoData_hu_40bb_srp_flop_Td8h4c'
import { HU_40BB_SRP_FLOP_JS9C3H } from './gtoData_hu_40bb_srp_flop_Js9c3h'
import { HU_40BB_SRP_FLOP_JSTC9H } from './gtoData_hu_40bb_srp_flop_JsTc9h'
import { HU_40BB_SRP_FLOP_9H8D7C } from './gtoData_hu_40bb_srp_flop_9h8d7c'
import { HU_40BB_SRP_FLOP_TC9C6D } from './gtoData_hu_40bb_srp_flop_Tc9c6d'
import { HU_40BB_SRP_FLOP_7S7D2H } from './gtoData_hu_40bb_srp_flop_7s7d2h'
import { HU_40BB_SRP_FLOP_KCKD5H } from './gtoData_hu_40bb_srp_flop_KcKd5h'
import { HU_40BB_SRP_FLOP_QSJH2H } from './gtoData_hu_40bb_srp_flop_QsJh2h'

import { HU_25BB_SRP_FLOP_AS7D2C } from './gtoData_hu_25bb_srp_flop_As7d2c'
import { HU_25BB_SRP_FLOP_KC8H3S } from './gtoData_hu_25bb_srp_flop_Kc8h3s'
import { HU_25BB_SRP_FLOP_JC7D2H } from './gtoData_hu_25bb_srp_flop_Jc7d2h'
import { HU_25BB_SRP_FLOP_9D5C2H } from './gtoData_hu_25bb_srp_flop_9d5c2h'
import { HU_25BB_SRP_FLOP_KSQD4H } from './gtoData_hu_25bb_srp_flop_KsQd4h'
import { HU_25BB_SRP_FLOP_TD8H4C } from './gtoData_hu_25bb_srp_flop_Td8h4c'
import { HU_25BB_SRP_FLOP_JS9C3H } from './gtoData_hu_25bb_srp_flop_Js9c3h'
import { HU_25BB_SRP_FLOP_JSTC9H } from './gtoData_hu_25bb_srp_flop_JsTc9h'
import { HU_25BB_SRP_FLOP_9H8D7C } from './gtoData_hu_25bb_srp_flop_9h8d7c'
import { HU_25BB_SRP_FLOP_TC9C6D } from './gtoData_hu_25bb_srp_flop_Tc9c6d'
import { HU_25BB_SRP_FLOP_7S7D2H } from './gtoData_hu_25bb_srp_flop_7s7d2h'
import { HU_25BB_SRP_FLOP_KCKD5H } from './gtoData_hu_25bb_srp_flop_KcKd5h'
import { HU_25BB_SRP_FLOP_QSJH2H } from './gtoData_hu_25bb_srp_flop_QsJh2h'

import { HU_13BB_SRP_FLOP_AS7D2C } from './gtoData_hu_13bb_srp_flop_As7d2c'
import { HU_13BB_SRP_FLOP_KC8H3S } from './gtoData_hu_13bb_srp_flop_Kc8h3s'
import { HU_13BB_SRP_FLOP_JC7D2H } from './gtoData_hu_13bb_srp_flop_Jc7d2h'
import { HU_13BB_SRP_FLOP_9D5C2H } from './gtoData_hu_13bb_srp_flop_9d5c2h'
import { HU_13BB_SRP_FLOP_KSQD4H } from './gtoData_hu_13bb_srp_flop_KsQd4h'
import { HU_13BB_SRP_FLOP_TD8H4C } from './gtoData_hu_13bb_srp_flop_Td8h4c'
import { HU_13BB_SRP_FLOP_JS9C3H } from './gtoData_hu_13bb_srp_flop_Js9c3h'
import { HU_13BB_SRP_FLOP_JSTC9H } from './gtoData_hu_13bb_srp_flop_JsTc9h'
import { HU_13BB_SRP_FLOP_9H8D7C } from './gtoData_hu_13bb_srp_flop_9h8d7c'
import { HU_13BB_SRP_FLOP_TC9C6D } from './gtoData_hu_13bb_srp_flop_Tc9c6d'
import { HU_13BB_SRP_FLOP_7S7D2H } from './gtoData_hu_13bb_srp_flop_7s7d2h'
import { HU_13BB_SRP_FLOP_KCKD5H } from './gtoData_hu_13bb_srp_flop_KcKd5h'
import { HU_13BB_SRP_FLOP_QSJH2H } from './gtoData_hu_13bb_srp_flop_QsJh2h'

export type HuPostflopRange = Record<string, string>

/**
 * Board slug → 該 board 的全部情境 map
 * 情境 key 格式：hu_40bb_srp_flop_<board>_<role>
 * Role 包括：btn_cbet / bb_facing_cbet_small / bb_facing_cbet_mid /
 *           bb_facing_cbet_large / bb_facing_cbet_allin
 */
export const HU_40BB_FLOP_SRP_DB: Record<string, Record<string, HuPostflopRange>> = {
  As7d2c: HU_40BB_SRP_FLOP_AS7D2C,
  Kc8h3s: HU_40BB_SRP_FLOP_KC8H3S,
  Jc7d2h: HU_40BB_SRP_FLOP_JC7D2H,
  '9d5c2h': HU_40BB_SRP_FLOP_9D5C2H,
  KsQd4h: HU_40BB_SRP_FLOP_KSQD4H,
  Td8h4c: HU_40BB_SRP_FLOP_TD8H4C,
  Js9c3h: HU_40BB_SRP_FLOP_JS9C3H,
  JsTc9h: HU_40BB_SRP_FLOP_JSTC9H,
  '9h8d7c': HU_40BB_SRP_FLOP_9H8D7C,
  Tc9c6d: HU_40BB_SRP_FLOP_TC9C6D,
  '7s7d2h': HU_40BB_SRP_FLOP_7S7D2H,
  KcKd5h: HU_40BB_SRP_FLOP_KCKD5H,
  QsJh2h: HU_40BB_SRP_FLOP_QSJH2H,
}

export const HU_25BB_FLOP_SRP_DB: Record<string, Record<string, HuPostflopRange>> = {
  As7d2c: HU_25BB_SRP_FLOP_AS7D2C,
  Kc8h3s: HU_25BB_SRP_FLOP_KC8H3S,
  Jc7d2h: HU_25BB_SRP_FLOP_JC7D2H,
  '9d5c2h': HU_25BB_SRP_FLOP_9D5C2H,
  KsQd4h: HU_25BB_SRP_FLOP_KSQD4H,
  Td8h4c: HU_25BB_SRP_FLOP_TD8H4C,
  Js9c3h: HU_25BB_SRP_FLOP_JS9C3H,
  JsTc9h: HU_25BB_SRP_FLOP_JSTC9H,
  '9h8d7c': HU_25BB_SRP_FLOP_9H8D7C,
  Tc9c6d: HU_25BB_SRP_FLOP_TC9C6D,
  '7s7d2h': HU_25BB_SRP_FLOP_7S7D2H,
  KcKd5h: HU_25BB_SRP_FLOP_KCKD5H,
  QsJh2h: HU_25BB_SRP_FLOP_QSJH2H,
}

export const HU_13BB_FLOP_SRP_DB: Record<string, Record<string, HuPostflopRange>> = {
  As7d2c: HU_13BB_SRP_FLOP_AS7D2C,
  Kc8h3s: HU_13BB_SRP_FLOP_KC8H3S,
  Jc7d2h: HU_13BB_SRP_FLOP_JC7D2H,
  '9d5c2h': HU_13BB_SRP_FLOP_9D5C2H,
  KsQd4h: HU_13BB_SRP_FLOP_KSQD4H,
  Td8h4c: HU_13BB_SRP_FLOP_TD8H4C,
  Js9c3h: HU_13BB_SRP_FLOP_JS9C3H,
  JsTc9h: HU_13BB_SRP_FLOP_JSTC9H,
  '9h8d7c': HU_13BB_SRP_FLOP_9H8D7C,
  Tc9c6d: HU_13BB_SRP_FLOP_TC9C6D,
  '7s7d2h': HU_13BB_SRP_FLOP_7S7D2H,
  KcKd5h: HU_13BB_SRP_FLOP_KCKD5H,
  QsJh2h: HU_13BB_SRP_FLOP_QSJH2H,
}

export function getPostflopDB(effectiveStackBB: number): { db: Record<string, Record<string, HuPostflopRange>>; stackLabel: '13bb' | '25bb' | '40bb' } {
  if (effectiveStackBB <= 18) return { db: HU_13BB_FLOP_SRP_DB, stackLabel: '13bb' }
  if (effectiveStackBB <= 32) return { db: HU_25BB_FLOP_SRP_DB, stackLabel: '25bb' }
  return { db: HU_40BB_FLOP_SRP_DB, stackLabel: '40bb' }
}

export const SUPPORTED_FLOP_BOARDS = Object.keys(HU_40BB_FLOP_SRP_DB)

/**
 * 把實際 board 字串（如 'AsKh7d'）正規化成 lookup key（按規範化排序後的字串）
 * 因為兩張同 rank 的牌出現順序不重要，要確保查表 key 一致。
 *
 * 注意：這個函式假設 input board 已是 5-6 字 string 格式（'AsKh7d' 或 'As,Kh,7d'）。
 */
export function normalizeBoardKey(boardStr: string): string {
  const cleaned = boardStr.replace(/[,\s]/g, '')
  if (cleaned.length !== 6) return cleaned

  // Parse 3 cards
  const cards = [cleaned.slice(0, 2), cleaned.slice(2, 4), cleaned.slice(4, 6)]

  // Sort by rank desc (A=14, K=13...) then suit
  const RANK_ORDER = '23456789TJQKA'
  cards.sort((a, b) => {
    const ra = RANK_ORDER.indexOf(a[0])
    const rb = RANK_ORDER.indexOf(b[0])
    if (rb !== ra) return rb - ra
    return a[1].localeCompare(b[1])
  })
  return cards.join('')
}

/**
 * 找出與 input board 等價的 supported board key。
 * v1.0 沒做 isomorphism (花色等價映射)，所以 input 必須完全匹配某個 supported board。
 */
export function findSupportedBoard(boardStr: string): string | null {
  const normalized = normalizeBoardKey(boardStr)
  for (const key of SUPPORTED_FLOP_BOARDS) {
    if (normalizeBoardKey(key) === normalized) return key
  }
  return null
}
