// src/lib/hu/engine.ts
import type {
  MatchConfig, MatchState, HandState, PlayerState, Position,
} from './types'
import { newDeck, shuffleDeck, dealCards } from './deck'

// ── Match init ──────────────────────────────────────

export function createMatch(config: MatchConfig): MatchState {
  const [playerStack, botStack] = computeStacks(config)
  return {
    config,
    handHistory: [],
    currentHand: null,
    playerStackBB: playerStack,
    botStackBB: botStack,
    result: 'in_progress',
    analysisPointsSpent: 0,
    violationPoints: 0,
  }
}

function computeStacks(config: MatchConfig): [number, number] {
  const total = config.totalStackBB

  if (config.stackRatio === '1:1') {
    const half = Math.floor(total / 2)
    return [half, total - half]
  }

  const [a, b] = config.stackRatio.split(':').map(Number)
  const sum = a + b
  const smallStack = Math.round((Math.min(a, b) / sum) * total)
  const bigStack = total - smallStack

  if (config.playerSide === 'short') return [smallStack, bigStack]
  if (config.playerSide === 'big')   return [bigStack, smallStack]
  // Fallback (shouldn't normally hit for non-1:1 ratios)
  return [Math.floor(total / 2), total - Math.floor(total / 2)]
}

// ── Deal new hand ───────────────────────────────────

export function dealNewHand(match: MatchState): MatchState {
  const handNumber = match.handHistory.length + 1

  // Player position alternates each hand. Odd hand = player BTN/SB
  const playerIsBtn = handNumber % 2 === 1
  const heroPosition: Position = playerIsBtn ? 'btn' : 'bb'
  const villainPosition: Position = playerIsBtn ? 'bb' : 'btn'

  // Shuffle and deal hole cards
  const deck = shuffleDeck(newDeck())
  const heroHole = dealCards(deck, 2)
  const villainHole = dealCards(deck, 2)

  const sb = match.config.sbBB
  const bb = match.config.bbBB

  // Hero stack: subtract blind based on position
  const heroBlind = heroPosition === 'btn' ? sb : bb
  const villainBlind = villainPosition === 'btn' ? sb : bb

  const hero: PlayerState = {
    position: heroPosition,
    stackBB: match.playerStackBB - heroBlind,
    holeCards: [heroHole[0], heroHole[1]],
    committedBB: heroBlind,
    streetCommitBB: heroBlind,
    isAllIn: false,
    hasFolded: false,
  }
  const villain: PlayerState = {
    position: villainPosition,
    stackBB: match.botStackBB - villainBlind,
    holeCards: [villainHole[0], villainHole[1]],
    committedBB: villainBlind,
    streetCommitBB: villainBlind,
    isAllIn: false,
    hasFolded: false,
  }

  const hand: HandState = {
    handNumber,
    street: 'preflop',
    board: [],
    potBB: sb + bb,
    hero,
    villain,
    toAct: 'btn',  // BTN/SB acts first preflop in HU
    currentBetBB: bb,  // BB is the bet to match
    minRaiseBB: bb,
    actions: [],
    isComplete: false,
  }

  return {
    ...match,
    currentHand: hand,
  }
}
