// =============================================================
// HU Postflop Action Lookup
// =============================================================
// 統合 GTO 資料 + fallback 啟發式，給模擬器引擎呼叫的單一進入點。
//
// v1.0：flop SRP 走本地 .ts 檔（13 boards × 3 stacks）
// v2.0：turn/river 走 Supabase gto_postflop 表查詢
//       （getHUPostflopAction 改為 async）
// =============================================================

import { getPostflopDB, findSupportedBoard } from './gtoData_hu_postflop_index'
import { getHeuristicAction, type HeuristicContext, type Personality } from './huHeuristics'
import { getGTOPostflopFromDB, prefetchStreet, clearPostflopCache } from './getGTOPostflopFromDB'

// Re-export for engine / match lifecycle
export { prefetchStreet, clearPostflopCache }

// ── Types ──────────────────────────────────────────────

export type Street = 'flop' | 'turn' | 'river'
export type PotType = 'srp' | '3bp' | '4bp'
export type Player = 'btn' | 'bb'

/** 玩家在當下情境的「角色」決定查哪個 range key */
export type PostflopRole =
  // Flop roles（本地 .ts 檔）
  | 'btn_cbet'              // BB check 後 BTN 的 c-bet 決策
  | 'bb_facing_cbet_small'  // BB 面對 33% c-bet
  | 'bb_facing_cbet_mid'    // BB 面對 50% c-bet
  | 'bb_facing_cbet_large'  // BB 面對 100% c-bet
  | 'bb_facing_cbet_allin'  // BB 面對 all-in c-bet
  // Turn/River roles（Supabase DB）
  | 'btn_bet'               // BTN 主動下注
  | 'btn_check'             // BTN check
  | 'bb_bet'                // BB 主動下注（donk / lead）
  | 'bb_check'              // BB check
  | 'btn_facing_bet_small'  // BTN 面對 BB bet（小）
  | 'btn_facing_bet_large'  // BTN 面對 BB bet（大）
  | 'bb_facing_bet_small'   // BB 面對 BTN bet（小）
  | 'bb_facing_bet_mid'     // BB 面對 BTN bet（中）
  | 'bb_facing_bet_large'   // BB 面對 BTN bet（大）
  | 'btn_facing_raise'      // BTN 面對 raise
  | 'bb_facing_raise'       // BB 面對 raise

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
 * Flop → 本地 .ts 查表（同步）
 * Turn/River → Supabase DB 查表（async）
 * 無資料 → heuristic fallback
 *
 * v2.0: 改為 async（因 turn/river 走 DB）
 */
export async function getHUPostflopAction(ctx: PostflopContext): Promise<ActionDecision> {
  // 1. Flop：走本地 .ts 查表（同步）
  if (ctx.street === 'flop') {
    const gtoResult = lookupFlopGTO(ctx)
    if (gtoResult) return gtoResult
    return runHeuristic(ctx)
  }

  // 2. Turn/River：走 Supabase DB 查表
  if (ctx.potType === 'srp') {
    const dbResult = await lookupTurnRiverGTO(ctx)
    if (dbResult) return dbResult
  }

  // 3. Fallback heuristic
  return runHeuristic(ctx)
}

export interface PostflopContext {
  /** 目前街 */
  street: Street
  /** 底池類型 */
  potType: PotType
  /** 翻牌（5-6 字 string，如 'As7d2c' 或 'As,7d,2c'） */
  board: string
  /** turn card（2 字 string，如 'Kh'）— turn/river 街時必填 */
  turnCard?: string
  /** river card（2 字 string，如 '5c'）— river 街時必填 */
  riverCard?: string
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

// ── Flop GTO Lookup（本地 .ts 檔）─────────────────────

function lookupFlopGTO(ctx: PostflopContext): ActionDecision | null {
  if (ctx.potType !== 'srp') return null

  const boardKey = findSupportedBoard(ctx.board)
  if (!boardKey) return null

  const { db, stackLabel } = getPostflopDB(ctx.effectiveStackBB)
  const boardDb = db[boardKey]
  if (!boardDb) return null

  const scenarioKey = `hu_${stackLabel}_srp_flop_${boardKey}_${ctx.role}`
  const range = boardDb[scenarioKey]
  if (!range) return null

  const rawAction = range[ctx.hand]
  if (!rawAction) {
    return {
      action: 'f',
      isFallback: false,
      note: `GTO: ${ctx.hand} 不在 ${ctx.role} 範圍 → fold`,
    }
  }

  return parseAction(rawAction)
}

// ── Turn/River GTO Lookup（Supabase DB）────────────────

function resolveStackLabel(effectiveStackBB: number): '13bb' | '25bb' | '40bb' {
  if (effectiveStackBB <= 18) return '13bb'
  if (effectiveStackBB <= 32) return '25bb'
  return '40bb'
}

async function lookupTurnRiverGTO(ctx: PostflopContext): Promise<ActionDecision | null> {
  const boardKey = normalizeBoardForDB(ctx.board)
  const turnCard = ctx.turnCard ?? ''
  const riverCard = ctx.riverCard ?? ''
  const stackLabel = resolveStackLabel(ctx.effectiveStackBB)

  if (!turnCard) return null  // turn/river 街沒有 turnCard 就無法查

  const result = await getGTOPostflopFromDB({
    boardKey,
    turnCard,
    riverCard,
    street: ctx.street as 'turn' | 'river',
    stackLabel,
    role: ctx.role,
    handClass: ctx.hand,
  })

  if (!result.actionCode) return null

  return parseAction(result.actionCode)
}

/** 清理 board 字串為 6 字元 slug（去逗號和空格） */
function normalizeBoardForDB(boardStr: string): string {
  return boardStr.replace(/[,\s]/g, '')
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
 *
 * Flop：同步判斷（本地 .ts 檔有沒有該 board）
 * Turn/River：需 async（查 DB 有沒有資料）
 *   → 同步版只回傳 flop 結果，async 版見 isGTOEvaluableAsync
 */
export function isGTOEvaluable(ctx: PostflopContext): boolean {
  if (ctx.potType !== 'srp') return false
  if (ctx.street === 'flop') return findSupportedBoard(ctx.board) !== null
  // turn/river 需要 async 查詢，同步版保守回傳 false
  return false
}

/**
 * Async 版：turn/river 也能判斷是否有 GTO 資料。
 * 實際嘗試查一筆（用 prefetch cache 或 single query），有結果就代表可評估。
 */
export async function isGTOEvaluableAsync(ctx: PostflopContext): Promise<boolean> {
  if (ctx.potType !== 'srp') return false
  if (ctx.street === 'flop') return findSupportedBoard(ctx.board) !== null

  // Turn/River：嘗試查一筆代表性 hand（AA），有結果代表該街有資料
  const boardKey = normalizeBoardForDB(ctx.board)
  const result = await getGTOPostflopFromDB({
    boardKey,
    turnCard: ctx.turnCard ?? '',
    riverCard: ctx.riverCard ?? '',
    street: ctx.street as 'turn' | 'river',
    stackLabel: resolveStackLabel(ctx.effectiveStackBB),
    role: ctx.role,
    handClass: 'AA',
  })
  return result.actionCode !== null
}
