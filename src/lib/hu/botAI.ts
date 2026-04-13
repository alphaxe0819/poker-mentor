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
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const botTotalStack = bot.stackBB + bot.committedBB

  // Special case: BB vs SB limp
  if (scenario === 'BB_LIMP') {
    return decideBBvsLimp(hand, botPos, handClass)
  }

  // Special case: facing an all-in shove — use push/fold calling range
  const facingAllin = hand.actions.some(a =>
    a.street === 'preflop' && a.actor !== botPos && a.kind === 'allin'
  )
  if (facingAllin) {
    return decideFacingAllin(hand, botPos, handClass)
  }

  // Short stack push/fold mode: ≤15BB → shove or fold
  if (botTotalStack <= 15) {
    return decideShortStackPushFold(hand, botPos, handClass, botTotalStack, scenario)
  }

  const positionLabel = botPos === 'btn' ? 'SB' : 'BB'
  const result = getGTOAction(handClass, 'tournament', 'hu', botTotalStack, positionLabel, scenario)

  // Post-process: if GTO says call but it would leave < 4BB behind, jam instead
  const action = rangeActionToEngineAction(result, hand, botPos)
  return ensureNoTinyRemaining(action, hand, botPos)
}

/** BB facing SB limp: check most hands, raise premium (iso-raise) */
function decideBBvsLimp(_hand: HandState, botPos: Position, handClass: string): Action {
  const isoRaiseHands = new Set([
    'AA','KK','QQ','JJ','TT','99',
    'AKs','AKo','AQs','AQo','AJs',
    'KQs',
  ])
  if (isoRaiseHands.has(handClass)) {
    return { kind: 'raise', amount: 3, actor: botPos, street: 'preflop' }
  }
  return { kind: 'check', actor: botPos, street: 'preflop' }
}

/** Facing an all-in shove: use push/fold calling ranges by effective stack depth */
function decideFacingAllin(hand: HandState, botPos: Position, handClass: string): Action {
  const effStack = Math.min(
    hand.hero.stackBB + hand.hero.committedBB,
    hand.villain.stackBB + hand.villain.committedBB,
  )

  let callRange: Set<string>
  if (effStack <= 8) {
    callRange = new Set([
      'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
      'AKs','AKo','AQs','AQo','AJs','AJo','ATs','ATo','A9s','A9o','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
      'KQs','KQo','KJs','KJo','KTs','KTo','K9s',
      'QJs','QJo','QTs','Q9s',
      'JTs','JTo','J9s',
      'T9s','T8s',
      '98s','87s','76s','65s',
    ])
  } else if (effStack <= 15) {
    callRange = new Set([
      'AA','KK','QQ','JJ','TT','99','88','77','66','55',
      'AKs','AKo','AQs','AQo','AJs','AJo','ATs','ATo','A9s','A8s','A7s','A5s','A4s','A3s','A2s',
      'KQs','KQo','KJs','KTs',
      'QJs','QTs',
      'JTs',
      'T9s',
    ])
  } else if (effStack <= 25) {
    callRange = new Set([
      'AA','KK','QQ','JJ','TT','99','88',
      'AKs','AKo','AQs','AQo','AJs','AJo','ATs',
      'KQs','KQo',
    ])
  } else {
    callRange = new Set([
      'AA','KK','QQ','JJ','TT',
      'AKs','AKo','AQs',
    ])
  }

  if (callRange.has(handClass)) {
    return { kind: 'call', actor: botPos, street: 'preflop' }
  }
  return { kind: 'fold', actor: botPos, street: 'preflop' }
}

/** Short stack ≤15BB: push or fold (no standard sizing) */
function decideShortStackPushFold(
  hand: HandState, botPos: Position, handClass: string,
  stackBB: number, scenario: string,
): Action {
  let pushRange: Set<string>
  if (scenario === 'RFI') {
    if (stackBB <= 6) {
      pushRange = new Set([
        'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
        'AKs','AKo','AQs','AQo','AJs','AJo','ATs','ATo','A9s','A9o','A8s','A8o','A7s','A7o','A6s','A5s','A4s','A3s','A2s',
        'KQs','KQo','KJs','KJo','KTs','KTo','K9s','K9o','K8s','K7s','K6s','K5s',
        'QJs','QJo','QTs','QTo','Q9s','Q8s','Q7s',
        'JTs','JTo','J9s','J8s',
        'T9s','T8s','T9o',
        '98s','97s','98o',
        '87s','86s','76s','65s','54s',
      ])
    } else if (stackBB <= 10) {
      pushRange = new Set([
        'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
        'AKs','AKo','AQs','AQo','AJs','AJo','ATs','ATo','A9s','A9o','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
        'KQs','KQo','KJs','KJo','KTs','KTo','K9s','K8s','K7s',
        'QJs','QJo','QTs','Q9s','Q8s',
        'JTs','JTo','J9s',
        'T9s','T8s',
        '98s','87s','76s','65s','54s',
      ])
    } else {
      pushRange = new Set([
        'AA','KK','QQ','JJ','TT','99','88','77','66','55',
        'AKs','AKo','AQs','AQo','AJs','AJo','ATs','ATo','A9s','A8s','A7s','A5s','A4s','A3s','A2s',
        'KQs','KQo','KJs','KTs','K9s',
        'QJs','QTs',
        'JTs',
        'T9s',
        '98s','87s','76s',
      ])
    }
    if (pushRange.has(handClass)) {
      return { kind: 'allin', actor: botPos, street: 'preflop' }
    }
    return { kind: 'fold', actor: botPos, street: 'preflop' }
  }

  // BB facing raise with short stack → push/fold decision
  return decideFacingAllin(hand, botPos, handClass)
}

/** If calling would leave < 4BB behind, jam instead */
function ensureNoTinyRemaining(action: Action, hand: HandState, botPos: Position): Action {
  if (action.kind !== 'call') return action
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const toCall = hand.currentBetBB - bot.streetCommitBB
  const remainingAfterCall = bot.stackBB - toCall
  if (remainingAfterCall >= 0 && remainingAfterCall < 4) {
    return { kind: 'allin', actor: botPos, street: hand.street }
  }
  return action
}

function preflopScenarioFromActions(hand: HandState, botPos: Position): string {
  const preflop = hand.actions.filter(a => a.street === 'preflop')
  // Count only OPPONENT's aggressive actions, not bot's own
  const opponentPos: Position = botPos === 'btn' ? 'bb' : 'btn'
  const opponentAgg = preflop.filter(a =>
    a.actor === opponentPos && (a.kind === 'raise' || a.kind === 'bet' || a.kind === 'allin')
  ).length

  if (botPos === 'btn') {
    if (opponentAgg === 0) return 'RFI'
    if (opponentAgg === 1) return 'vs_BB_3bet'
    return 'vs_BB_5bet'
  } else {
    if (opponentAgg === 0) return 'BB_LIMP'
    if (opponentAgg === 1) return 'vs_SB_open'
    return 'vs_SB_4bet'
  }
}

function isPotCommitted(hand: HandState, botPos: Position): boolean {
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const totalStack = bot.stackBB + bot.committedBB
  return totalStack > 0 && (bot.committedBB / totalStack) > 0.33
}

function clampRaiseOrJam(raiseAmount: number, hand: HandState, botPos: Position): Action {
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const totalStack = bot.stackBB + bot.streetCommitBB
  if (raiseAmount >= totalStack - 3 || bot.stackBB <= 4) {
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

  function noFold(fallback: Action): Action {
    if (committed && fallback.kind === 'fold') {
      return { kind: 'call', actor: botPos, street: hand.street }
    }
    return fallback
  }

  if (action === 'mixed') {
    const pct = freq ?? 50
    if (Math.random() * 100 < pct) {
      return clampRaiseOrJam(defaultRaiseAmount(hand, botPos), hand, botPos)
    }
    return noFold({ kind: 'fold', actor: botPos, street: hand.street })
  }
  if (action === 'mixed_3b') {
    const pct = freq ?? 50
    if (Math.random() * 100 < pct) {
      return clampRaiseOrJam(defaultRaiseAmount(hand, botPos), hand, botPos)
    }
    return { kind: 'call', actor: botPos, street: hand.street }
  }

  if (action === 'r' || action === '3b' || action === '4b') {
    return clampRaiseOrJam(defaultRaiseAmount(hand, botPos), hand, botPos)
  }
  if (action === 'c') return { kind: 'call', actor: botPos, street: hand.street }
  if (action === 'f') return noFold({ kind: 'fold', actor: botPos, street: hand.street })
  if (action === 'allin') return { kind: 'allin', actor: botPos, street: hand.street }

  if (action.startsWith('mr:')) {
    const pct = parseInt(action.split(':')[1], 10)
    if (Math.random() * 100 < pct) {
      return { kind: 'raise', amount: defaultRaiseAmount(hand, botPos), actor: botPos, street: hand.street }
    }
    return { kind: 'fold', actor: botPos, street: hand.street }
  }
  if (action.startsWith('mix_3b:')) {
    const pct = parseInt(action.split(':')[1], 10)
    if (Math.random() * 100 < pct) {
      return { kind: 'raise', amount: defaultRaiseAmount(hand, botPos), actor: botPos, street: hand.street }
    }
    return { kind: 'call', actor: botPos, street: hand.street }
  }

  return { kind: 'fold', actor: botPos, street: hand.street }
}

/** Stack-aware preflop raise sizing */
function defaultRaiseAmount(hand: HandState, botPos: Position): number {
  const bot = botPos === hand.hero.position ? hand.hero : hand.villain
  const effStack = Math.min(
    hand.hero.stackBB + hand.hero.committedBB,
    hand.villain.stackBB + hand.villain.committedBB,
  )
  const raises = hand.actions
    .filter(a => a.street === 'preflop' && (a.kind === 'raise' || a.kind === 'bet'))
    .length

  if (effStack <= 25) {
    if (raises === 0) return 2      // open 2x
    if (raises === 1) return 6      // 3bet to 6BB
    return bot.stackBB + bot.streetCommitBB  // 4bet = jam
  }

  if (raises === 0) return 2.5
  if (raises === 1) return 9
  if (raises === 2) return 22
  return 999
}

// ── Postflop ────────────────────────────────────────

function decidePostflop(
  hand: HandState,
  botPos: Position,
  handClass: string,
  isFacingBet: boolean,
  personality: Personality
): Action {
  // Use specific GTO role if available; otherwise generic role for heuristic fallback
  const role = postflopRole(hand, botPos, isFacingBet)
    ?? (isFacingBet ? 'bb_facing_cbet_mid' as PostflopRole : 'btn_cbet' as PostflopRole)

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

  const finalCode = sampleMixedAction(decision)
  return postflopCodeToAction(finalCode, hand, botPos)
}

function postflopRole(hand: HandState, botPos: Position, isFacingBet: boolean): PostflopRole | null {
  if (hand.street !== 'flop') return null
  if (botPos === 'btn' && !isFacingBet) return 'btn_cbet'
  if (botPos === 'bb' && isFacingBet) {
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

export async function preloadBotData(): Promise<void> {
  await preloadDB('tourn_hu', 40)
}
