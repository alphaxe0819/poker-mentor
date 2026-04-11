// =============================================================
// HU Postflop Action Lookup
// =============================================================
// 統合 13 個 board 的 GTO 資料 + fallback 啟發式。
// 給模擬器引擎呼叫的單一進入點。
//
// v1.0 顆粒度 A：只有 flop SRP 5 個 role 有 GTO 資料，
// 其他 spot（turn / river / 3BP / 4BP / 沒準備的 board）走 heuristic。
// =============================================================

import { HU_40BB_FLOP_SRP_DB, findSupportedBoard } from './gtoData_hu_postflop_index'
import { getHeuristicAction, type HeuristicContext, type Personality } from './huHeuristics'

// ── Types ──────────────────────────────────────────────

export type Street = 'flop' | 'turn' | 'river'
export type PotType = 'srp' | '3bp' | '4bp'
export type Player = 'btn' | 'bb'

/** 玩家在當下情境的「角色」決定查哪個 range key */
export type PostflopRole =
  | 'btn_cbet'              // BB check 後 BTN 的 c-bet 決策
  | 'bb_facing_cbet_small'  // BB 面對 33% c-bet
  | 'bb_facing_cbet_mid'    // BB 面對 50% c-bet
  | 'bb_facing_cbet_large'  // BB 面對 100% c-bet
  | 'bb_facing_cbet_allin'  // BB 面對 all-in c-bet

/** 解析後的決策結果 */
export interface ActionDecision {
  /** 主要動作代碼（x/c/f/r/b33/b50/b100/allin） */
  action: string
  /** 若是混合策略，主動作的頻率（0-100） */
  primaryFreq?: number
  /** 混合策略的次動作 */
  secondary?: string
  /** 是否來自 fallback heuristic（不是 GTO 資料）*/
  isFallback: boolean
  /** 解釋訊息（用於 UI / debug） */
  note: string
}

// ── Public API ──────────────────────────────────────────

/**
 * 主要查詢函式：給定目前情境，回傳 bot 該執行的動作。
 *
 * 若該情境有 GTO 資料 → 從 13 個 board file 查表。
 * 若無 → 走 heuristic（套用個性）。
 */
export function getHUPostflopAction(ctx: PostflopContext): ActionDecision {
  // 1. 嘗試 GTO 查表
  const gtoResult = lookupGTO(ctx)
  if (gtoResult) return gtoResult

  // 2. Fallback heuristic
  return runHeuristic(ctx)
}

export interface PostflopContext {
  /** 目前街 */
  street: Street
  /** 底池類型 */
  potType: PotType
  /** 翻牌（5-6 字 string，如 'As7d2c' 或 'As,7d,2c'） */
  board: string
  /** 玩家手牌 canonical class（'AA' / 'AKs' / 'AKo'） */
  hand: string
  /** 玩家角色 */
  role: PostflopRole
  /** 目前底池大小（BB） */
  potBB: number
  /** 玩家有效籌碼（BB） */
  effectiveStackBB: number
  /** Bot 個性（影響 fallback） */
  personality: Personality
}

// ── GTO Lookup ──────────────────────────────────────────

function lookupGTO(ctx: PostflopContext): ActionDecision | null {
  // v1.0 只有 flop SRP 資料
  if (ctx.street !== 'flop') return null
  if (ctx.potType !== 'srp') return null

  // Board 必須在 13 個之中
  const boardKey = findSupportedBoard(ctx.board)
  if (!boardKey) return null

  // 從 board 的 5 個 scenario 找該 role
  const boardDb = HU_40BB_FLOP_SRP_DB[boardKey]
  if (!boardDb) return null

  const scenarioKey = `hu_40bb_srp_flop_${boardKey}_${ctx.role}`
  const range = boardDb[scenarioKey]
  if (!range) return null

  const rawAction = range[ctx.hand]
  if (!rawAction) {
    // 該 hand 不在範圍 = fold（默認）
    return {
      action: 'f',
      isFallback: false,
      note: `GTO: ${ctx.hand} 不在 ${ctx.role} 範圍 → fold`,
    }
  }

  return parseAction(rawAction)
}

// ── Action 字串解析 ─────────────────────────────────────

/**
 * 解析 converter 產出的 action code。
 * 支援格式：
 *   單一：'x' / 'c' / 'f' / 'r' / 'b33' / 'b50' / 'b100' / 'allin'
 *   混合：'mix:CODE@PCT,CODE'  例如 'mix:b33@60,x' = 60% b33, 40% check
 */
export function parseAction(raw: string): ActionDecision {
  if (!raw.startsWith('mix:')) {
    return {
      action: raw,
      isFallback: false,
      note: `GTO: ${describeAction(raw)}`,
    }
  }

  // 'mix:b33@60,x'
  const body = raw.slice(4)
  const [primary, secondary] = body.split(',')
  const [primaryCode, pctStr] = primary.split('@')
  const pct = parseInt(pctStr, 10) || 50

  return {
    action: primaryCode,
    primaryFreq: pct,
    secondary,
    isFallback: false,
    note: `GTO mix: ${pct}% ${describeAction(primaryCode)} / ${100 - pct}% ${describeAction(secondary)}`,
  }
}

/** 隨機抽樣混合策略：根據 freq 決定真的執行 primary 或 secondary */
export function sampleMixedAction(decision: ActionDecision): string {
  if (decision.primaryFreq === undefined || !decision.secondary) {
    return decision.action
  }
  return Math.random() * 100 < decision.primaryFreq ? decision.action : decision.secondary
}

function describeAction(code: string): string {
  switch (code) {
    case 'x':     return 'check'
    case 'c':     return 'call'
    case 'f':     return 'fold'
    case 'r':     return 'raise'
    case 'rbig':  return 'raise (big)'
    case 'b33':   return 'bet 1/3 pot (小)'
    case 'b50':   return 'bet 1/2 pot (中)'
    case 'b100':  return 'bet pot (大)'
    case 'allin': return 'all-in'
    default:      return code
  }
}

// ── Heuristic Fallback ──────────────────────────────────

function runHeuristic(ctx: PostflopContext): ActionDecision {
  const heuristicCtx: HeuristicContext = {
    street: ctx.street,
    board: ctx.board,
    hand: ctx.hand,
    role: ctx.role,
    potBB: ctx.potBB,
    effectiveStackBB: ctx.effectiveStackBB,
    personality: ctx.personality,
  }
  const action = getHeuristicAction(heuristicCtx)
  return {
    action: action.action,
    isFallback: true,
    note: `Heuristic (${ctx.personality}): ${action.reason}`,
  }
}

// ── 是否為 GTO 資料覆蓋的情境（給 GTO 紅標用）─────────

/**
 * 給賽後報告判定：這個情境玩家的決策是否該被「GTO 紅標」評估。
 * 如果該情境只有 heuristic（沒有真的 GTO 資料），就不評估對錯。
 */
export function isGTOEvaluable(ctx: PostflopContext): boolean {
  if (ctx.street !== 'flop' || ctx.potType !== 'srp') return false
  return findSupportedBoard(ctx.board) !== null
}
