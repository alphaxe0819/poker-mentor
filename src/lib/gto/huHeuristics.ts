// =============================================================
// HU Postflop Heuristic Fallback
// =============================================================
// 當沒有 GTO 資料時的後備決策邏輯。
// 根據手牌 vs board 的強度分類 → 機率分佈 → 個性修正 → 抽樣動作。
//
// 個性（personality）：
//   standard   — 平衡
//   rock       — 過度緊（fold/check 加權）
//   aggressive — 過度兇（bet/raise 加權）
//
// 注意：這是 fallback，不是 GTO。決策品質明顯遜於有資料的 spot，
// 但保證 bot 在任何情境都能行動，不會卡住。
// =============================================================

export type Personality = 'standard' | 'rock' | 'aggressive'

export type Street = 'flop' | 'turn' | 'river'

export type PostflopRole =
  // Flop roles
  | 'btn_cbet'
  | 'bb_facing_cbet_small'
  | 'bb_facing_cbet_mid'
  | 'bb_facing_cbet_large'
  | 'bb_facing_cbet_allin'
  // Turn/River roles
  | 'btn_bet'
  | 'btn_check'
  | 'bb_bet'
  | 'bb_check'
  | 'btn_facing_bet_small'
  | 'btn_facing_bet_large'
  | 'bb_facing_bet_small'
  | 'bb_facing_bet_mid'
  | 'bb_facing_bet_large'
  | 'btn_facing_raise'
  | 'bb_facing_raise'

export interface HeuristicContext {
  street: Street
  /** 翻牌字串，例如 'As7d2c' 或 'As,7d,2c' */
  board: string
  /** 玩家手牌類別，例如 'AA' / 'AKs' / 'AKo' */
  hand: string
  role: PostflopRole
  potBB: number
  effectiveStackBB: number
  personality: Personality
}

export interface HeuristicResult {
  action: string  // 'x' / 'c' / 'f' / 'r' / 'b33' / 'b50' / 'b100' / 'allin'
  reason: string
}

// ── 手牌強度分類 ────────────────────────────────────────

export type HandStrength =
  | 'NUTS'          // 葫蘆 / 同花順 / 四條
  | 'MONSTER'       // top set / 兩對 (高)
  | 'STRONG_VALUE'  // 頂對頂 kicker / 超對
  | 'THIN_VALUE'    // 頂對弱 kicker / 第二對 / 弱超對
  | 'WEAK_PAIR'     // 第三對 / 底對 / 口袋小對
  | 'STRONG_DRAW'   // OESD + flush draw / nut flush draw
  | 'WEAK_DRAW'     // gutshot / 弱 flush draw
  | 'AIR'           // 沒對沒 draw

const RANK_ORDER = '23456789TJQKA'
function rankValue(r: string): number {
  return RANK_ORDER.indexOf(r)
}

/** 解析 board 字串 → 卡片陣列 */
function parseBoard(board: string): { rank: string; suit: string }[] {
  const cleaned = board.replace(/[,\s]/g, '')
  const cards = []
  for (let i = 0; i < cleaned.length; i += 2) {
    cards.push({ rank: cleaned[i], suit: cleaned[i + 1] })
  }
  return cards
}

/** 主分類函式 */
export function classifyHand(hand: string, board: string): HandStrength {
  const cards = parseBoard(board)
  const ranks = cards.map(c => c.rank)
  const suits = cards.map(c => c.suit)
  const isPair = hand.length === 2 && hand[0] === hand[1]
  const suited = hand.length === 3 && hand[2] === 's'
  const r1 = hand[0]
  const r2 = isPair ? hand[0] : hand[1]

  // ── Board 結構
  const boardPaired = new Set(ranks).size < ranks.length
  const topBoardRank = ranks.reduce((a, b) => rankValue(a) > rankValue(b) ? a : b)
  const middleRank = ranks.length === 3
    ? [...ranks].sort((a, b) => rankValue(b) - rankValue(a))[1]
    : ranks[1]

  // ── Suit count（同花 draw 偵測）
  const suitCounts: Record<string, number> = {}
  for (const s of suits) suitCounts[s] = (suitCounts[s] || 0) + 1
  const maxBoardSuit = Math.max(...Object.values(suitCounts))
  const hasFlushBoard = maxBoardSuit >= 2

  // ── 同 rank 連結（straight draw）
  const sortedRankVals = ranks.map(rankValue).sort((a, b) => b - a)
  const boardSpan = sortedRankVals[0] - sortedRankVals[sortedRankVals.length - 1]
  const isConnectedBoard = boardSpan <= 4

  // ──────────────────────────────────────────────
  // 1. 口袋對（pocket pair）
  // ──────────────────────────────────────────────
  if (isPair) {
    const handVal = rankValue(r1)
    const setMade = ranks.includes(r1)

    if (setMade) {
      if (rankValue(r1) >= rankValue(topBoardRank)) return 'NUTS' // 頂 set 在 paired board 接近 nut
      return 'MONSTER'
    }

    // overpair？
    if (handVal > rankValue(topBoardRank)) {
      // 但如果 board 是 paired 或 wet → 降一級
      if (boardPaired || isConnectedBoard) return 'THIN_VALUE'
      return 'STRONG_VALUE'
    }
    // 中對 / 底對
    if (handVal >= rankValue(middleRank)) return 'WEAK_PAIR'
    return 'WEAK_PAIR'
  }

  // ──────────────────────────────────────────────
  // 2. 非對手牌
  // ──────────────────────────────────────────────
  const r1Pair = ranks.includes(r1)
  const r2Pair = ranks.includes(r2)

  // 兩對
  if (r1Pair && r2Pair) {
    const r1IsTop = r1 === topBoardRank
    const r2IsTop = r2 === topBoardRank
    if (r1IsTop || r2IsTop) return 'MONSTER'
    return 'STRONG_VALUE'
  }

  // 單對
  if (r1Pair || r2Pair) {
    const pairedRank = r1Pair ? r1 : r2
    const kicker = r1Pair ? r2 : r1
    const isTopPair = pairedRank === topBoardRank
    const isMidPair = pairedRank === middleRank

    if (isTopPair) {
      const kickerStrong = rankValue(kicker) >= rankValue('T')
      return kickerStrong ? 'STRONG_VALUE' : 'THIN_VALUE'
    }
    if (isMidPair) return 'WEAK_PAIR'
    return 'WEAK_PAIR'
  }

  // ── Draws ──
  // 同花 draw（簡化：suited 手 + board 有 2 同花 → 假設 50% 機率有 flush draw）
  // 但 hand class 不帶花色資訊，所以「有可能」就視為弱 flush draw
  let flushDrawPotential = 0
  if (suited && hasFlushBoard) flushDrawPotential = 1
  else if (suited && maxBoardSuit === 1) flushDrawPotential = 0  // backdoor only

  // Straight draw（簡化）
  const handMin = Math.min(rankValue(r1), rankValue(r2))
  const handMax = Math.max(rankValue(r1), rankValue(r2))
  const handGap = handMax - handMin
  const closeToBoard = ranks.some(r => {
    const v = rankValue(r)
    return Math.abs(v - handMin) <= 2 || Math.abs(v - handMax) <= 2
  })
  let straightDrawPotential = 0
  if (handGap <= 4 && closeToBoard && isConnectedBoard) straightDrawPotential = 1

  const drawScore = flushDrawPotential + straightDrawPotential
  if (drawScore >= 2) return 'STRONG_DRAW'
  if (drawScore === 1) return 'WEAK_DRAW'

  // 高 kicker air
  if (rankValue(r1) >= rankValue('Q') && rankValue(r2) >= rankValue('T')) {
    return 'WEAK_DRAW'  // overcards 算弱 draw（有 6 outs 變 top pair）
  }

  return 'AIR'
}

// ── 機率分佈表 ──────────────────────────────────────────

/**
 * 主動行動時的動作機率分佈。
 * 順序：[check, b33, b50, b100, allin]
 * 總和為 1.0
 */
const ACTING_DISTRIBUTION: Record<HandStrength, number[]> = {
  NUTS:         [0.30, 0.20, 0.20, 0.20, 0.10],  // trap or value
  MONSTER:      [0.10, 0.30, 0.30, 0.25, 0.05],
  STRONG_VALUE: [0.15, 0.40, 0.30, 0.13, 0.02],
  THIN_VALUE:   [0.55, 0.30, 0.13, 0.02, 0.00],
  WEAK_PAIR:    [0.80, 0.18, 0.02, 0.00, 0.00],
  STRONG_DRAW:  [0.30, 0.35, 0.25, 0.08, 0.02],
  WEAK_DRAW:    [0.65, 0.30, 0.05, 0.00, 0.00],
  AIR:          [0.75, 0.15, 0.07, 0.03, 0.00],  // 偶爾 bluff
}

/**
 * 面對下注時的動作機率分佈。
 * 順序：[fold, call, raise(small), allin]
 * 總和為 1.0
 */
const FACING_BET_DISTRIBUTION: Record<HandStrength, number[]> = {
  NUTS:         [0.00, 0.30, 0.55, 0.15],  // slow play or raise
  MONSTER:      [0.00, 0.40, 0.50, 0.10],
  STRONG_VALUE: [0.05, 0.65, 0.25, 0.05],
  THIN_VALUE:   [0.45, 0.50, 0.05, 0.00],
  WEAK_PAIR:    [0.75, 0.23, 0.02, 0.00],
  STRONG_DRAW:  [0.15, 0.65, 0.18, 0.02],
  WEAK_DRAW:    [0.55, 0.42, 0.03, 0.00],
  AIR:          [0.92, 0.05, 0.03, 0.00],
}

// ── 個性修正 ────────────────────────────────────────────

function applyPersonality(dist: number[], personality: Personality, mode: 'acting' | 'facing'): number[] {
  const adjusted = [...dist]

  if (personality === 'rock') {
    if (mode === 'acting') {
      // check ×1.5, raise/bet ×0.5
      adjusted[0] *= 1.5
      for (let i = 1; i < adjusted.length; i++) adjusted[i] *= 0.5
    } else {
      // fold ×1.5, raise ×0.5
      adjusted[0] *= 1.5  // fold
      adjusted[2] *= 0.5  // raise
      adjusted[3] *= 0.5  // allin
    }
  } else if (personality === 'aggressive') {
    if (mode === 'acting') {
      // check ×0.7, bet/raise ×1.5
      adjusted[0] *= 0.7
      for (let i = 1; i < adjusted.length; i++) adjusted[i] *= 1.5
    } else {
      // fold ×0.7, raise ×1.5
      adjusted[0] *= 0.7
      adjusted[2] *= 1.5
      adjusted[3] *= 1.5
    }
  }

  // 重新正規化
  const sum = adjusted.reduce((a, b) => a + b, 0)
  return adjusted.map(v => v / sum)
}

function sample(dist: number[]): number {
  const r = Math.random()
  let acc = 0
  for (let i = 0; i < dist.length; i++) {
    acc += dist[i]
    if (r < acc) return i
  }
  return dist.length - 1
}

// ── Main entry ──────────────────────────────────────────

export function getHeuristicAction(ctx: HeuristicContext): HeuristicResult {
  const strength = classifyHand(ctx.hand, ctx.board)
  const isFacing = ctx.role.startsWith('bb_facing_')

  if (isFacing) {
    const baseDist = FACING_BET_DISTRIBUTION[strength]
    const dist = applyPersonality(baseDist, ctx.personality, 'facing')
    const idx = sample(dist)
    const actions = ['f', 'c', 'r', 'allin']
    return {
      action: actions[idx],
      reason: `${strength} facing bet → ${actions[idx]}`,
    }
  }

  // Acting (主動)
  const baseDist = ACTING_DISTRIBUTION[strength]
  const dist = applyPersonality(baseDist, ctx.personality, 'acting')
  const idx = sample(dist)
  const actions = ['x', 'b33', 'b50', 'b100', 'allin']
  return {
    action: actions[idx],
    reason: `${strength} acting → ${actions[idx]}`,
  }
}
