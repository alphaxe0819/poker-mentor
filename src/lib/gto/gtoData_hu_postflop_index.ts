// =============================================================
// HU Postflop GTO Data — Index / Aggregator
// =============================================================
// 把 board 個別產出的 const 集中管理。
// 命名規則：HU_<STACK>_<POTTYPE>_<BOARD_SLUG_UPPERCASE>
// =============================================================
//
// ⚠️ T-074 降級 2026-04-21：
// 以下所有 import + DB 都是 **TEST DATA**（scenarios.mjs 手寫 range placeholder
// 跑出來的 solver 結果）。用戶決議以 pokerdinosaur 為正式版 range 來源，
// 正式版 import 進入下方 PROD 區（待 T-075 / T-076 實作）。
// app 邏輯暫時仍指向 TEST DBs，lookup 結果不變，不影響運行。
// =============================================================

// ═══════════════════════════════════════════════════════════
// TEST DATA (scenarios.mjs placeholder range → TexasSolver)
// ═══════════════════════════════════════════════════════════

// HU 40BB SRP — 21 flops (13 base + 8 extras for peer parity with 25bb)
// T-020: 命名統一為 HU_40BB_SRP_<BOARD>（去除 FLOP_ 中綴）
import { HU_40BB_SRP_AS7D2C } from './gtoData_hu_40bb_srp_As7d2c'
import { HU_40BB_SRP_KC8H3S } from './gtoData_hu_40bb_srp_Kc8h3s'
import { HU_40BB_SRP_JC7D2H } from './gtoData_hu_40bb_srp_Jc7d2h'
import { HU_40BB_SRP_9D5C2H } from './gtoData_hu_40bb_srp_9d5c2h'
import { HU_40BB_SRP_KSQD4H } from './gtoData_hu_40bb_srp_KsQd4h'
import { HU_40BB_SRP_TD8H4C } from './gtoData_hu_40bb_srp_Td8h4c'
import { HU_40BB_SRP_JS9C3H } from './gtoData_hu_40bb_srp_Js9c3h'
import { HU_40BB_SRP_JSTC9H } from './gtoData_hu_40bb_srp_JsTc9h'
import { HU_40BB_SRP_9H8D7C } from './gtoData_hu_40bb_srp_9h8d7c'
import { HU_40BB_SRP_TC9C6D } from './gtoData_hu_40bb_srp_Tc9c6d'
import { HU_40BB_SRP_7S7D2H } from './gtoData_hu_40bb_srp_7s7d2h'
import { HU_40BB_SRP_KCKD5H } from './gtoData_hu_40bb_srp_KcKd5h'
import { HU_40BB_SRP_QSJH2H } from './gtoData_hu_40bb_srp_QsJh2h'
// 8 extras（peer parity with HU 25bb SRP）
import { HU_40BB_SRP_5S5C5D } from './gtoData_hu_40bb_srp_5s5c5d'
import { HU_40BB_SRP_6D5H4C } from './gtoData_hu_40bb_srp_6d5h4c'
import { HU_40BB_SRP_8S5H2C } from './gtoData_hu_40bb_srp_8s5h2c'
import { HU_40BB_SRP_8S7S5D } from './gtoData_hu_40bb_srp_8s7s5d'
import { HU_40BB_SRP_9S7S3S } from './gtoData_hu_40bb_srp_9s7s3s'
import { HU_40BB_SRP_AH2D2C } from './gtoData_hu_40bb_srp_Ah2d2c'
import { HU_40BB_SRP_AH5C2D } from './gtoData_hu_40bb_srp_Ah5c2d'
import { HU_40BB_SRP_AH8H3C } from './gtoData_hu_40bb_srp_Ah8h3c'

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

// HU 40BB 3BP — 21 flops (13 base + 8 extras), T-021 marathon 2026-04-21
import { HU_40BB_3BP_AS7D2C } from './gtoData_hu_40bb_3bp_As7d2c'
import { HU_40BB_3BP_KC8H3S } from './gtoData_hu_40bb_3bp_Kc8h3s'
import { HU_40BB_3BP_JC7D2H } from './gtoData_hu_40bb_3bp_Jc7d2h'
import { HU_40BB_3BP_9D5C2H } from './gtoData_hu_40bb_3bp_9d5c2h'
import { HU_40BB_3BP_KSQD4H } from './gtoData_hu_40bb_3bp_KsQd4h'
import { HU_40BB_3BP_TD8H4C } from './gtoData_hu_40bb_3bp_Td8h4c'
import { HU_40BB_3BP_JS9C3H } from './gtoData_hu_40bb_3bp_Js9c3h'
import { HU_40BB_3BP_JSTC9H } from './gtoData_hu_40bb_3bp_JsTc9h'
import { HU_40BB_3BP_9H8D7C } from './gtoData_hu_40bb_3bp_9h8d7c'
import { HU_40BB_3BP_TC9C6D } from './gtoData_hu_40bb_3bp_Tc9c6d'
import { HU_40BB_3BP_7S7D2H } from './gtoData_hu_40bb_3bp_7s7d2h'
import { HU_40BB_3BP_KCKD5H } from './gtoData_hu_40bb_3bp_KcKd5h'
import { HU_40BB_3BP_QSJH2H } from './gtoData_hu_40bb_3bp_QsJh2h'
import { HU_40BB_3BP_5S5C5D } from './gtoData_hu_40bb_3bp_5s5c5d'
import { HU_40BB_3BP_6D5H4C } from './gtoData_hu_40bb_3bp_6d5h4c'
import { HU_40BB_3BP_8S5H2C } from './gtoData_hu_40bb_3bp_8s5h2c'
import { HU_40BB_3BP_8S7S5D } from './gtoData_hu_40bb_3bp_8s7s5d'
import { HU_40BB_3BP_9S7S3S } from './gtoData_hu_40bb_3bp_9s7s3s'
import { HU_40BB_3BP_AH2D2C } from './gtoData_hu_40bb_3bp_Ah2d2c'
import { HU_40BB_3BP_AH5C2D } from './gtoData_hu_40bb_3bp_Ah5c2d'
import { HU_40BB_3BP_AH8H3C } from './gtoData_hu_40bb_3bp_Ah8h3c'

export type HuPostflopRange = Record<string, string>

/**
 * Board slug → 該 board 的全部情境 map
 * 情境 key 格式：hu_40bb_srp_flop_<board>_<role>
 * Role 包括：btn_cbet / bb_facing_cbet_small / bb_facing_cbet_mid /
 *           bb_facing_cbet_large / bb_facing_cbet_allin
 */
export const HU_40BB_FLOP_SRP_DB: Record<string, Record<string, HuPostflopRange>> = {
  // 13 base
  As7d2c: HU_40BB_SRP_AS7D2C,
  Kc8h3s: HU_40BB_SRP_KC8H3S,
  Jc7d2h: HU_40BB_SRP_JC7D2H,
  '9d5c2h': HU_40BB_SRP_9D5C2H,
  KsQd4h: HU_40BB_SRP_KSQD4H,
  Td8h4c: HU_40BB_SRP_TD8H4C,
  Js9c3h: HU_40BB_SRP_JS9C3H,
  JsTc9h: HU_40BB_SRP_JSTC9H,
  '9h8d7c': HU_40BB_SRP_9H8D7C,
  Tc9c6d: HU_40BB_SRP_TC9C6D,
  '7s7d2h': HU_40BB_SRP_7S7D2H,
  KcKd5h: HU_40BB_SRP_KCKD5H,
  QsJh2h: HU_40BB_SRP_QSJH2H,
  // 8 extras (T-020, peer parity with HU 25bb SRP)
  '5s5c5d': HU_40BB_SRP_5S5C5D,
  '6d5h4c': HU_40BB_SRP_6D5H4C,
  '8s5h2c': HU_40BB_SRP_8S5H2C,
  '8s7s5d': HU_40BB_SRP_8S7S5D,
  '9s7s3s': HU_40BB_SRP_9S7S3S,
  Ah2d2c: HU_40BB_SRP_AH2D2C,
  Ah5c2d: HU_40BB_SRP_AH5C2D,
  Ah8h3c: HU_40BB_SRP_AH8H3C,
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

// HU 40BB 3BP — BOARDS_HU 21 flops（與 40BB SRP 同一 board set）
// T-021 marathon 2026-04-21：TexasSolver 實跑 21/21 成功
export const HU_40BB_3BP_DB: Record<string, Record<string, HuPostflopRange>> = {
  // 13 base
  As7d2c: HU_40BB_3BP_AS7D2C,
  Kc8h3s: HU_40BB_3BP_KC8H3S,
  Jc7d2h: HU_40BB_3BP_JC7D2H,
  '9d5c2h': HU_40BB_3BP_9D5C2H,
  KsQd4h: HU_40BB_3BP_KSQD4H,
  Td8h4c: HU_40BB_3BP_TD8H4C,
  Js9c3h: HU_40BB_3BP_JS9C3H,
  JsTc9h: HU_40BB_3BP_JSTC9H,
  '9h8d7c': HU_40BB_3BP_9H8D7C,
  Tc9c6d: HU_40BB_3BP_TC9C6D,
  '7s7d2h': HU_40BB_3BP_7S7D2H,
  KcKd5h: HU_40BB_3BP_KCKD5H,
  QsJh2h: HU_40BB_3BP_QSJH2H,
  // 8 extras (peer parity with HU 25bb 3BP / HU 40bb SRP)
  '5s5c5d': HU_40BB_3BP_5S5C5D,
  '6d5h4c': HU_40BB_3BP_6D5H4C,
  '8s5h2c': HU_40BB_3BP_8S5H2C,
  '8s7s5d': HU_40BB_3BP_8S7S5D,
  '9s7s3s': HU_40BB_3BP_9S7S3S,
  Ah2d2c: HU_40BB_3BP_AH2D2C,
  Ah5c2d: HU_40BB_3BP_AH5C2D,
  Ah8h3c: HU_40BB_3BP_AH8H3C,
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

// ═══════════════════════════════════════════════════════════
// PROD DATA (pokerdinosaur-sourced) — TODO T-075 / T-076
// ═══════════════════════════════════════════════════════════
// TODO: import PROD DBs from src/lib/gto/prod/ 當範圍匯入流程就緒後
// （T-075 pd range 匯入 + T-076 solver 用正式 range 重跑）
// PROD_HU_40BB_FLOP_SRP_DB: Record<string, Record<string, HuPostflopRange>> = {}
// PROD_HU_40BB_3BP_DB: Record<string, Record<string, HuPostflopRange>> = {}
// ...
// 正式版就緒後，`getPostflopDB` 可改讀 PROD DBs，或加 flag 切換。

// ═══════════════════════════════════════════════════════════
// Accessors (目前指向 TEST，正式版就緒後改指 PROD)
// ═══════════════════════════════════════════════════════════

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
