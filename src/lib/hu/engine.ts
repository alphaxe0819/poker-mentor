// src/lib/hu/engine.ts
import type {
  MatchConfig, MatchState, HandState, PlayerState, Position,
  Action,
} from './types'
import { newDeck, shuffleDeck, dealCards } from './deck'
import { evaluateHand, compareHands } from './handEvaluator'

/** Round to 1 decimal place to avoid floating-point noise (0.5 BB is smallest unit) */
function r1(n: number): number { return Math.round(n * 10) / 10 }

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
  return [Math.floor(total / 2), total - Math.floor(total / 2)]
}

// ── Deal new hand ───────────────────────────────────

export function dealNewHand(match: MatchState): MatchState {
  const handNumber = match.handHistory.length + 1

  const playerIsBtn = handNumber % 2 === 1
  const heroPosition: Position = playerIsBtn ? 'btn' : 'bb'
  const villainPosition: Position = playerIsBtn ? 'bb' : 'btn'

  const deck = shuffleDeck(newDeck())
  const heroHole = dealCards(deck, 2)
  const villainHole = dealCards(deck, 2)

  const sb = match.config.sbBB
  const bb = match.config.bbBB

  const heroBlind = heroPosition === 'btn' ? sb : bb
  const villainBlind = villainPosition === 'btn' ? sb : bb

  const hero: PlayerState = {
    position: heroPosition,
    stackBB: r1(match.playerStackBB - heroBlind),
    holeCards: [heroHole[0], heroHole[1]],
    committedBB: heroBlind,
    streetCommitBB: heroBlind,
    isAllIn: false,
    hasFolded: false,
  }
  const villain: PlayerState = {
    position: villainPosition,
    stackBB: r1(match.botStackBB - villainBlind),
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
    toAct: 'btn',
    currentBetBB: bb,
    minRaiseBB: bb,
    actions: [],
    isComplete: false,
  }

  return { ...match, currentHand: hand }
}

// ── Apply action ────────────────────────────────────

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

  hand.actions.push({ ...action })

  switch (action.kind) {
    case 'fold': {
      player.hasFolded = true
      hand.isComplete = true
      break
    }
    case 'check': {
      // Guard: cannot check when facing a bet — convert to fold
      const facingBet = hand.currentBetBB > player.streetCommitBB
      if (facingBet) {
        console.warn(`[engine] check attempted facing bet ${hand.currentBetBB} > ${player.streetCommitBB}, converting to fold`)
        player.hasFolded = true
        hand.isComplete = true
      }
      break
    }
    case 'call': {
      const toCall = r1(hand.currentBetBB - player.streetCommitBB)
      const callAmount = r1(Math.min(toCall, player.stackBB))
      player.stackBB = r1(player.stackBB - callAmount)
      player.committedBB = r1(player.committedBB + callAmount)
      player.streetCommitBB = r1(player.streetCommitBB + callAmount)
      hand.potBB = r1(hand.potBB + callAmount)
      if (player.stackBB <= 0) { player.stackBB = 0; player.isAllIn = true }
      break
    }
    case 'bet':
    case 'raise': {
      const target = action.amount ?? 0
      const effectiveTarget = Math.max(target, hand.currentBetBB + hand.minRaiseBB)
      const additional = r1(effectiveTarget - player.streetCommitBB)
      const amount = r1(Math.max(0, Math.min(additional, player.stackBB)))
      player.stackBB = r1(player.stackBB - amount)
      player.committedBB = r1(player.committedBB + amount)
      player.streetCommitBB = r1(player.streetCommitBB + amount)
      hand.potBB = r1(hand.potBB + amount)
      hand.currentBetBB = player.streetCommitBB
      if (player.stackBB <= 0) { player.stackBB = 0; player.isAllIn = true }
      break
    }
    case 'allin': {
      const amount = player.stackBB
      player.stackBB = 0
      player.committedBB = r1(player.committedBB + amount)
      player.streetCommitBB = r1(player.streetCommitBB + amount)
      hand.potBB = r1(hand.potBB + amount)
      hand.currentBetBB = Math.max(hand.currentBetBB, player.streetCommitBB)
      player.isAllIn = true
      break
    }
  }

  if (!hand.isComplete) {
    const bothAllIn = hand.hero.isAllIn && hand.villain.isAllIn
    // "Covered" = one player is all-in AND the other's street commit >= theirs
    const allInCovered = (
      (hand.hero.isAllIn && hand.villain.streetCommitBB >= hand.hero.streetCommitBB) ||
      (hand.villain.isAllIn && hand.hero.streetCommitBB >= hand.villain.streetCommitBB)
    )

    if (bothAllIn || allInCovered || isStreetClosed(hand)) {
      let advanced = advanceStreet(hand)
      while (!advanced.isComplete && (advanced.hero.isAllIn || advanced.villain.isAllIn)) {
        advanced = advanceStreet(advanced)
      }
      return { ...match, currentHand: advanced }
    }
    // Pass turn to other player (but skip if they're all-in AND their bet is covered)
    const nextPlayer = hand.toAct === 'btn' ? 'bb' : 'btn'
    const nextPlayerState = nextPlayer === hand.hero.position ? hand.hero : hand.villain
    const otherPlayerState = nextPlayer === hand.hero.position ? hand.villain : hand.hero
    const nextCovered = nextPlayerState.isAllIn && otherPlayerState.streetCommitBB >= nextPlayerState.streetCommitBB
    if (nextCovered) {
      let advanced = advanceStreet(hand)
      while (!advanced.isComplete && (advanced.hero.isAllIn || advanced.villain.isAllIn)) {
        advanced = advanceStreet(advanced)
      }
      return { ...match, currentHand: advanced }
    }
    hand.toAct = nextPlayer
  }

  return { ...match, currentHand: hand }
}

function isStreetClosed(hand: HandState): boolean {
  if (hand.hero.streetCommitBB !== hand.villain.streetCommitBB) return false
  const actionsThisStreet = hand.actions.filter(a => a.street === hand.street)
  const heroActed = actionsThisStreet.some(a => a.actor === hand.hero.position)
  const villainActed = actionsThisStreet.some(a => a.actor === hand.villain.position)
  return heroActed && villainActed
}

// ── Advance street ──────────────────────────────────

export function advanceStreet(hand: HandState): HandState {
  const next: HandState = {
    ...hand,
    hero: { ...hand.hero, streetCommitBB: 0 },
    villain: { ...hand.villain, streetCommitBB: 0 },
    currentBetBB: 0,
    minRaiseBB: 1,
    actions: hand.actions,
    board: [...hand.board],
  }

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

  if (next.street !== 'preflop' && next.street !== 'showdown') {
    next.toAct = 'bb'
  }
  return next
}

// ── Resolve hand ────────────────────────────────────

export function resolveHand(match: MatchState): MatchState {
  if (!match.currentHand) throw new Error('No current hand to resolve')
  const hand = match.currentHand

  let heroDelta = 0
  let villainDelta = 0

  if (hand.hero.hasFolded) {
    villainDelta = hand.hero.committedBB
    heroDelta = -hand.hero.committedBB
  } else if (hand.villain.hasFolded) {
    heroDelta = hand.villain.committedBB
    villainDelta = -hand.villain.committedBB
  } else {
    const heroBest = evaluateHand([...hand.hero.holeCards, ...hand.board])
    const villainBest = evaluateHand([...hand.villain.holeCards, ...hand.board])
    const cmp = compareHands(heroBest, villainBest)
    // Winner can only win up to what the shorter stack committed (no side pots in HU)
    const effectiveBet = Math.min(hand.hero.committedBB, hand.villain.committedBB)
    if (cmp > 0) {
      heroDelta = effectiveBet
      villainDelta = -effectiveBet
    } else if (cmp < 0) {
      heroDelta = -effectiveBet
      villainDelta = effectiveBet
    }

    console.log(`[resolveHand] hand#${hand.handNumber} showdown: heroPos=${hand.hero.position} heroCommit=${hand.hero.committedBB} villainCommit=${hand.villain.committedBB} effectiveBet=${effectiveBet} heroDelta=${heroDelta} matchStacks=${match.playerStackBB}/${match.botStackBB} pot=${hand.potBB}`)
  }

  const newPlayerStack = r1(match.playerStackBB + heroDelta)
  const newBotStack = r1(match.botStackBB + villainDelta)

  let result: MatchState['result'] = 'in_progress'
  if (newPlayerStack <= 0) result = 'player_lost'
  else if (newBotStack <= 0) result = 'player_won'

  return {
    ...match,
    handHistory: [...match.handHistory, hand],
    currentHand: null,
    playerStackBB: Math.max(0, newPlayerStack),
    botStackBB: Math.max(0, newBotStack),
    result,
  }
}
