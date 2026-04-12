// src/lib/hu/botAI.ts
import type { Action, HandState, MatchConfig, Position } from './types'
import { handToCanonical } from './handToCanonical'
import { formatBoard } from './cards'
import { getGTOAction } from '../gto/getGTOAction'
import { preloadDB } from '../gto/gtoData_index'
import {
  getHUPostflopAction,
  sampleMixedAction,
  type PostflopRole,
} from '../gto/getHUPostflopAction'
import type { Personality } from '../gto/huHeuristics'

/**
 * Top-level bot decision function.
 * Returns an Action ready for engine.applyAction().
 */
export function decideBotAction(
  hand: HandState,
  _config: MatchConfig,
  personality: Personality
): Action {
  const botPos = hand.toAct
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const handClass = handToCanonical(bot.holeCards)
  const isFacingBet = (hand.currentBetBB - bot.streetCommitBB) > 0

  if (hand.street === 'preflop') {
    return decidePreflop(hand, botPos, handClass)
  }

  return decidePostflop(hand, botPos, handClass, isFacingBet, personality)
}

// ── Preflop ─────────────────────────────────────────

function decidePreflop(
  hand: HandState,
  botPos: Position,
  handClass: string
): Action {
  const scenario = preflopScenarioFromActions(hand, botPos)

  // Special case: BB vs SB limp — no GTO chart for this spot.
  // GTO almost never limps in HU, so when hero limps as BTN,
  // bot (BB) should mostly check (see flop) or raise with strong hands.
  if (scenario === 'BB_LIMP') {
    return decideBBvsLimp(hand, botPos, handClass)
  }

  const stackBB = botPos === hand.hero.position
    ? hand.hero.stackBB + hand.hero.streetCommitBB
    : hand.villain.stackBB + hand.villain.streetCommitBB

  const positionLabel = botPos === 'btn' ? 'SB' : 'BB'
  const result = getGTOAction(handClass, 'tournament', 'hu', stackBB, positionLabel, scenario)

  return rangeActionToEngineAction(result, hand, botPos)
}

/** BB facing SB limp: check most hands, raise premium (iso-raise) */
function decideBBvsLimp(_hand: HandState, botPos: Position, handClass: string): Action {
  // Premium hands → raise to 3BB (iso-raise)
  const isoRaiseHands = new Set([
    'AA','KK','QQ','JJ','TT','99',
    'AKs','AKo','AQs','AQo','AJs',
    'KQs',
  ])
  if (isoRaiseHands.has(handClass)) {
    return { kind: 'raise', amount: 3, actor: botPos, street: 'preflop' }
  }
  // Everything else → check (take free flop)
  return { kind: 'check', actor: botPos, street: 'preflop' }
}

function preflopScenarioFromActions(hand: HandState, botPos: Position): string {
  const preflop = hand.actions.filter(a => a.street === 'preflop')
  const raises = preflop.filter(a => a.kind === 'raise' || a.kind === 'bet').length

  if (botPos === 'btn') {
    if (raises === 0) return 'RFI'
    if (raises === 1) return 'vs_BB_3bet'
    if (raises === 2) return 'vs_BB_5bet'
  } else {
    // BB
    if (raises === 0) return 'BB_LIMP'  // BTN limped → BB has option (check or raise)
    if (raises === 1) return 'vs_SB_open'
    if (raises === 2) return 'vs_SB_4bet'
  }
  return 'RFI'
}

/**
 * Check if bot is pot-committed (invested > 33% of starting stack).
 * When pot-committed, bot should never fold — always call or jam.
 */
function isPotCommitted(hand: HandState, botPos: Position): boolean {
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const totalStack = bot.stackBB + bot.committedBB
  return totalStack > 0 && (bot.committedBB / totalStack) > 0.33
}

/**
 * Clamp raise amount to effective stack. If raise would leave < 4BB behind, jam instead.
 */
function clampRaiseOrJam(raiseAmount: number, hand: HandState, botPos: Position): Action {
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const totalStack = bot.stackBB + bot.streetCommitBB  // what they can raise to
  if (raiseAmount >= totalStack - 3 || bot.stackBB <= 4) {
    // Jam — raising almost full stack or short stack
    return { kind: 'allin', actor: botPos, street: hand.street }
  }
  return { kind: 'raise', amount: raiseAmount, actor: botPos, street: hand.street }
}

function rangeActionToEngineAction(
  result: { action: string; freq?: number; note: string },
  hand: HandState,
  botPos: Position
): Action {
  const { action, freq } = result
  const committed = isPotCommitted(hand, botPos)

  // ── Pot-committed override: NEVER fold when > 33% of stack invested ──
  function noFold(fallback: Action): Action {
    if (committed && fallback.kind === 'fold') {
      return { kind: 'call', actor: botPos, street: hand.street }
    }
    return fallback
  }

  // Handle mixed strategy
  if (action === 'mixed') {
    const pct = freq ?? 50
    if (Math.random() * 100 < pct) {
      return clampRaiseOrJam(defaultRaiseAmount(hand), hand, botPos)
    }
    return noFold({ kind: 'fold', actor: botPos, street: hand.street })
  }
  if (action === 'mixed_3b') {
    const pct = freq ?? 50
    if (Math.random() * 100 < pct) {
      return clampRaiseOrJam(defaultRaiseAmount(hand), hand, botPos)
    }
    return { kind: 'call', actor: botPos, street: hand.street }
  }

  if (action === 'r' || action === '3b' || action === '4b') {
    return clampRaiseOrJam(defaultRaiseAmount(hand), hand, botPos)
  }
  if (action === 'c') return { kind: 'call', actor: botPos, street: hand.street }
  if (action === 'f') return noFold({ kind: 'fold', actor: botPos, street: hand.street })
  if (action === 'allin') return { kind: 'allin', actor: botPos, street: hand.street }

  // Raw DB format fallback (should not normally reach here if using getGTOAction)
  if (action.startsWith('mr:')) {
    const pct = parseInt(action.split(':')[1], 10)
    if (Math.random() * 100 < pct) {
      return { kind: 'raise', amount: defaultRaiseAmount(hand), actor: botPos, street: hand.street }
    }
    return { kind: 'fold', actor: botPos, street: hand.street }
  }
  if (action.startsWith('mix_3b:')) {
    const pct = parseInt(action.split(':')[1], 10)
    if (Math.random() * 100 < pct) {
      return { kind: 'raise', amount: defaultRaiseAmount(hand), actor: botPos, street: hand.street }
    }
    return { kind: 'call', actor: botPos, street: hand.street }
  }

  return { kind: 'fold', actor: botPos, street: hand.street }
}

function defaultRaiseAmount(hand: HandState): number {
  // HU 40BB preflop sizings: open 2.5BB, 3bet 9BB, 4bet 22BB
  const raises = hand.actions
    .filter(a => a.street === 'preflop' && (a.kind === 'raise' || a.kind === 'bet'))
    .length
  if (raises === 0) return 2.5
  if (raises === 1) return 9
  if (raises === 2) return 22
  return 999  // beyond — caller should switch to all-in
}

// ── Postflop ────────────────────────────────────────

function decidePostflop(
  hand: HandState,
  botPos: Position,
  handClass: string,
  isFacingBet: boolean,
  personality: Personality
): Action {
  const role = postflopRole(hand, botPos, isFacingBet)
  if (!role) {
    // Unknown role → safe default
    return isFacingBet
      ? { kind: 'fold', actor: botPos, street: hand.street }
      : { kind: 'check', actor: botPos, street: hand.street }
  }

  const decision = getHUPostflopAction({
    street: hand.street as 'flop' | 'turn' | 'river',
    potType: 'srp',
    board: formatBoard(hand.board),
    hand: handClass,
    role,
    potBB: hand.potBB,
    effectiveStackBB: Math.min(hand.hero.stackBB, hand.villain.stackBB),
    personality,
  })

  // Sample mixed strategy
  const finalCode = sampleMixedAction(decision)
  return postflopCodeToAction(finalCode, hand, botPos)
}

function postflopRole(hand: HandState, botPos: Position, isFacingBet: boolean): PostflopRole | null {
  // v1.0 only supports flop SRP roles
  if (hand.street !== 'flop') return null

  if (botPos === 'btn' && !isFacingBet) return 'btn_cbet'

  if (botPos === 'bb' && isFacingBet) {
    // Determine c-bet size bucket
    const facingAmount = hand.currentBetBB
    const potBefore = Math.max(0.01, hand.potBB - facingAmount)
    const ratio = facingAmount / potBefore
    const stack = Math.min(hand.hero.stackBB, hand.villain.stackBB)
    if (facingAmount >= stack * 0.95) return 'bb_facing_cbet_allin'
    if (ratio >= 0.95) return 'bb_facing_cbet_large'
    if (ratio >= 0.4) return 'bb_facing_cbet_mid'
    return 'bb_facing_cbet_small'
  }
  return null
}

function postflopCodeToAction(code: string, hand: HandState, botPos: Position): Action {
  if (code === 'x') return { kind: 'check', actor: botPos, street: hand.street }
  if (code === 'c') return { kind: 'call', actor: botPos, street: hand.street }
  if (code === 'f') return { kind: 'fold', actor: botPos, street: hand.street }
  if (code === 'allin') return { kind: 'allin', actor: botPos, street: hand.street }

  if (code === 'b33') return { kind: 'bet', amount: hand.potBB * 0.33, actor: botPos, street: hand.street }
  if (code === 'b50') return { kind: 'bet', amount: hand.potBB * 0.5, actor: botPos, street: hand.street }
  if (code === 'b100') return { kind: 'bet', amount: hand.potBB, actor: botPos, street: hand.street }

  if (code === 'r' || code === 'rbig') {
    const target = hand.currentBetBB * (code === 'rbig' ? 3 : 2.5)
    return { kind: 'raise', amount: target, actor: botPos, street: hand.street }
  }

  return { kind: 'check', actor: botPos, street: hand.street }
}

// ── Preload helper ──────────────────────────────────

/** Call once before match starts to load preflop GTO data into cache */
export async function preloadBotData(): Promise<void> {
  await preloadDB('tourn_hu', 40)
}
