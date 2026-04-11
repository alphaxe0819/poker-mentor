// src/lib/hu/engine.ts
import type {
  MatchConfig, MatchState, HandState, PlayerState, Position,
  Action,
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

// ── Apply action ────────────────────────────────────

/** Returns updated MatchState with action applied */
export function applyAction(match: MatchState, action: Action): MatchState {
  if (!match.currentHand) throw new Error('No current hand')
  const hand: HandState = {
    ...match.currentHand,
    hero: { ...match.currentHand.hero },
    villain: { ...match.currentHand.villain },
    board: [...match.currentHand.board],
    actions: [...match.currentHand.actions],
  }

  const isHero = action.actor === hand.hero.position
  const player = isHero ? hand.hero : hand.villain

  // Record action
  hand.actions.push({ ...action })

  switch (action.kind) {
    case 'fold': {
      player.hasFolded = true
      hand.isComplete = true
      break
    }
    case 'check': {
      // No chip movement
      break
    }
    case 'call': {
      const toCall = hand.currentBetBB - player.streetCommitBB
      const callAmount = Math.min(toCall, player.stackBB)
      player.stackBB -= callAmount
      player.committedBB += callAmount
      player.streetCommitBB += callAmount
      hand.potBB += callAmount
      if (player.stackBB === 0) player.isAllIn = true
      break
    }
    case 'bet':
    case 'raise': {
      const target = action.amount ?? 0
      const additional = target - player.streetCommitBB
      const amount = Math.min(additional, player.stackBB)
      player.stackBB -= amount
      player.committedBB += amount
      player.streetCommitBB += amount
      hand.potBB += amount
      hand.currentBetBB = player.streetCommitBB
      if (player.stackBB === 0) player.isAllIn = true
      break
    }
    case 'allin': {
      const amount = player.stackBB
      player.stackBB = 0
      player.committedBB += amount
      player.streetCommitBB += amount
      hand.potBB += amount
      hand.currentBetBB = Math.max(hand.currentBetBB, player.streetCommitBB)
      player.isAllIn = true
      break
    }
  }

  if (!hand.isComplete) {
    if (isStreetClosed(hand)) {
      const advanced = advanceStreet(hand)
      return { ...match, currentHand: advanced }
    }
    // Pass turn to other player
    hand.toAct = hand.toAct === 'btn' ? 'bb' : 'btn'
  }

  return { ...match, currentHand: hand }
}

/** A street is closed when both players have acted at least once on this street and bets are matched */
function isStreetClosed(hand: HandState): boolean {
  if (hand.hero.streetCommitBB !== hand.villain.streetCommitBB) return false

  const actionsThisStreet = hand.actions.filter(a => a.street === hand.street)
  const heroActed = actionsThisStreet.some(a => a.actor === hand.hero.position)
  const villainActed = actionsThisStreet.some(a => a.actor === hand.villain.position)
  return heroActed && villainActed
}

// ── Advance street ──────────────────────────────────

export function advanceStreet(hand: HandState): HandState {
  // Reset street commitments for the new street
  const next: HandState = {
    ...hand,
    hero: { ...hand.hero, streetCommitBB: 0 },
    villain: { ...hand.villain, streetCommitBB: 0 },
    currentBetBB: 0,
    minRaiseBB: 1,
    actions: hand.actions,
    board: [...hand.board],
  }

  // Reveal community cards: build a new deck excluding known cards, then deal
  const knownCards = [
    ...hand.hero.holeCards,
    ...hand.villain.holeCards,
    ...hand.board,
  ]
  const knownKeys = new Set(knownCards.map(c => c.rank + c.suit))
  const remaining = newDeck().filter(c => !knownKeys.has(c.rank + c.suit))
  const deck = shuffleDeck(remaining)

  if (hand.street === 'preflop') {
    next.street = 'flop'
    next.board = [...hand.board, ...dealCards(deck, 3)]
  } else if (hand.street === 'flop') {
    next.street = 'turn'
    next.board = [...hand.board, ...dealCards(deck, 1)]
  } else if (hand.street === 'turn') {
    next.street = 'river'
    next.board = [...hand.board, ...dealCards(deck, 1)]
  } else if (hand.street === 'river') {
    next.street = 'showdown'
    next.isComplete = true
  }

  // OOP (BB) acts first postflop
  if (next.street !== 'preflop' && next.street !== 'showdown') {
    next.toAct = 'bb'
  }
  return next
}
