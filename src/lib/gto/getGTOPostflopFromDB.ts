// =============================================================
// Turn/River GTO Lookup via Supabase (PostgREST)
// =============================================================
// Flop 資料仍走本地 .ts 檔（13 boards），
// Turn/River 資料從 Supabase gto_postflop 表查詢。
//
// 兩種查詢模式：
//   1. prefetch — 一次抓該街整組 role × hand（~845 rows）
//   2. single  — 只查單筆（fallback / 未 prefetch 時）
//
// 資料在 session 內 cache，同一街不重複查。
// =============================================================

import { supabase } from '../supabase'

// ── Types ──────────────────────────────────────────────

export interface PostflopDBQuery {
  boardKey: string      // 'As7d2c'
  turnCard: string      // 'Kh'
  riverCard: string     // '5c' or ''
  street: 'turn' | 'river'
  stackLabel: '13bb' | '25bb' | '40bb'
  role: string          // 'btn_bet', 'bb_facing_bet_small', etc.
  handClass: string     // 'AA', 'AKs', 'AKo'
}

export interface PostflopDBResult {
  actionCode: string | null
  isCached: boolean
  isFallback: false
}

// ── Prefetch Cache ─────────────────────────────────────
// Key: "boardKey|turnCard|riverCard|street|stackLabel"
// Value: Map<"role|handClass", actionCode>
const prefetchCache = new Map<string, Map<string, string>>()

function streetKey(q: Pick<PostflopDBQuery, 'boardKey' | 'turnCard' | 'riverCard' | 'street' | 'stackLabel'>): string {
  return `${q.boardKey}|${q.turnCard}|${q.riverCard}|${q.street}|${q.stackLabel}`
}

function handKey(role: string, handClass: string): string {
  return `${role}|${handClass}`
}

/**
 * 當 turn/river card 發出時，一次抓該街全部 role × hand，
 * 存進 cache，後續查詢 0ms。
 *
 * 回傳抓到的 row 數（0 = 該街沒有 GTO 資料）。
 */
export async function prefetchStreet(
  boardKey: string,
  turnCard: string,
  riverCard: string,
  street: 'turn' | 'river',
  stackLabel: '13bb' | '25bb' | '40bb',
): Promise<number> {
  const sk = streetKey({ boardKey, turnCard, riverCard, street, stackLabel })

  // 已經 prefetch 過
  if (prefetchCache.has(sk)) {
    return prefetchCache.get(sk)!.size
  }

  const { data, error } = await supabase
    .from('gto_postflop')
    .select('role, hand_class, action_code')
    .eq('board_key', boardKey)
    .eq('turn_card', turnCard)
    .eq('river_card', riverCard)
    .eq('street', street)
    .eq('stack_label', stackLabel)

  if (error || !data) {
    console.warn('[GTO DB] prefetch failed:', error?.message)
    return 0
  }

  const map = new Map<string, string>()
  for (const row of data) {
    map.set(handKey(row.role, row.hand_class), row.action_code)
  }
  prefetchCache.set(sk, map)
  return map.size
}

/**
 * 查詢單筆 GTO 動作。
 * 優先從 prefetch cache 取，沒有才發 API 請求。
 */
export async function getGTOPostflopFromDB(
  q: PostflopDBQuery,
): Promise<PostflopDBResult> {
  // 1. 從 prefetch cache 查
  const sk = streetKey(q)
  const cached = prefetchCache.get(sk)
  if (cached) {
    const code = cached.get(handKey(q.role, q.handClass))
    return {
      actionCode: code ?? null,
      isCached: true,
      isFallback: false,
    }
  }

  // 2. 單筆 API 查詢
  const { data, error } = await supabase
    .from('gto_postflop')
    .select('action_code')
    .eq('board_key', q.boardKey)
    .eq('turn_card', q.turnCard)
    .eq('river_card', q.riverCard)
    .eq('street', q.street)
    .eq('stack_label', q.stackLabel)
    .eq('role', q.role)
    .eq('hand_class', q.handClass)
    .maybeSingle()

  if (error) {
    console.warn('[GTO DB] lookup failed:', error.message)
    return { actionCode: null, isCached: false, isFallback: false }
  }

  return {
    actionCode: data?.action_code ?? null,
    isCached: false,
    isFallback: false,
  }
}

/**
 * 清除所有 prefetch cache（換場比賽時呼叫）。
 */
export function clearPostflopCache(): void {
  prefetchCache.clear()
}
