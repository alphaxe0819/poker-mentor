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
  config: MatchConfig,
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
  const stackBB = botPos === hand.hero.position
    ? hand.hero.stackBB + hand.hero.streetCommitBB
    : hand.villain.stackBB + hand.villain.streetCommitBB

  // Map our position to the scenario key format used in gtoData_tourn_hu_40bb.ts
  const positionLabel = botPos === 'btn' ? 'SB' : 'BB'
  const result = getGTOAction(handClass, 'tournament', 'hu', stackBB, positionLabel, scenario)

  return rangeActionToEngineAction(result, hand, botPos)
}

function preflopScenarioFromActions(hand: HandState, botPos: Position): string {
  // Count raises in preflop action history
  const preflop = hand.actions.filter(a => a.street === 'preflop')
  const raises = preflop.filter(a => a.kind === 'raise' || a.kind === 'bet').length

  if (botPos === 'btn') {
    if (raises === 0) return 'RFI'
    if (raises === 1) return 'vs_BB_3bet'
    if (raises === 2) return 'vs_BB_5bet'
  } else {
    // BB
    if (raises === 1) return 'vs_SB_open'
    if (raises === 2) return 'vs_SB_4bet'
  }
  return 'RFI'  // safe fallback
}

function rangeActionToEngineAction(
  result: { action: string; freq?: number; note: string },
  hand: HandState,
  botPos: Position
): Action {
  const { action, freq } = result

  // Handle mixed strategy — getGTOAction returns action:'mixed' with freq for mr: codes,
  // and action:'mixed_3b' with freq for mix_3b: codes
  if (action === 'mixed') {
    const pct = freq ?? 50
    if (Math.random() * 100 < pct) {
      return { kind: 'raise', amount: defaultRaiseAmount(hand), actor: botPos, street: hand.street }
    }
    return { kind: 'fold', actor: botPos, street: hand.street }
  }
  if (action === 'mixed_3b') {
    const pct = freq ?? 50
    if (Math.random() * 100 < pct) {
      return { kind: 'raise', amount: defaultRaiseAmount(hand), actor: botPos, street: hand.street }
    }
    return { kind: 'call', actor: botPos, street: hand.street }
  }

  if (action === 'r' || action === '3b' || action === '4b') {
    return { kind: 'raise', amount: defaultRaiseAmount(hand), actor: botPos, street: hand.street }
  }
  if (action === 'c') return { kind: 'call', actor: botPos, street: hand.street }
  if (action === 'f') return { kind: 'fold', actor: botPos, street: hand.street }
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
