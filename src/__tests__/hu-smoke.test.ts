// src/__tests__/hu-smoke.test.ts
// Smoke tests for HU simulator: raise sizing, showdown flow, match lifecycle
import { describe, it, expect } from 'vitest'
import { createMatch, dealNewHand, applyAction, resolveHand } from '../lib/hu/engine'
import { evaluateHand, compareHands, HandRank } from '../lib/hu/handEvaluator'
import type { MatchConfig, MatchState, Card, Action } from '../lib/hu/types'

// ── Helpers ──

function makeConfig(ratio: MatchConfig['stackRatio'] = '1:1', side: MatchConfig['playerSide'] = 'equal'): MatchConfig {
  return { totalStackBB: 80, stackRatio: ratio, playerSide: side, sbBB: 0.5, bbBB: 1 }
}

function card(rank: string, suit: string): Card {
  return { rank: rank as Card['rank'], suit: suit as Card['suit'] }
}

function startMatch(ratio: MatchConfig['stackRatio'] = '1:1'): MatchState {
  return dealNewHand(createMatch(makeConfig(ratio)))
}

// ── Stack Ratios ──

describe('Stack ratios', () => {
  it('1:1 → 40 vs 40', () => {
    const match = createMatch(makeConfig('1:1'))
    expect(match.playerStackBB).toBe(40)
    expect(match.botStackBB).toBe(40)
  })

  it('1:2 short → 27 vs 53', () => {
    const match = createMatch(makeConfig('1:2', 'short'))
    expect(match.playerStackBB).toBe(27)
    expect(match.botStackBB).toBe(53)
  })

  it('1:5 short → 13 vs 67', () => {
    const match = createMatch(makeConfig('1:5', 'short'))
    expect(match.playerStackBB).toBe(13)
    expect(match.botStackBB).toBe(67)
  })

  it('2:1 big → 53 vs 27', () => {
    const match = createMatch(makeConfig('2:1', 'big'))
    expect(match.playerStackBB).toBe(53)
    expect(match.botStackBB).toBe(27)
  })

  it('5:1 big → 67 vs 13', () => {
    const match = createMatch(makeConfig('5:1', 'big'))
    expect(match.playerStackBB).toBe(67)
    expect(match.botStackBB).toBe(13)
  })
})

// ── Deal & Blind Posting ──

describe('Deal and blind posting', () => {
  it('hand #1: hero is BTN/SB, posts 0.5BB', () => {
    const match = startMatch()
    const hand = match.currentHand!
    expect(hand.handNumber).toBe(1)
    expect(hand.hero.position).toBe('btn')
    expect(hand.hero.committedBB).toBe(0.5)
    expect(hand.hero.stackBB).toBe(39.5)
    expect(hand.villain.position).toBe('bb')
    expect(hand.villain.committedBB).toBe(1)
    expect(hand.villain.stackBB).toBe(39)
    expect(hand.potBB).toBe(1.5)
    expect(hand.currentBetBB).toBe(1) // BB is 1
    expect(hand.toAct).toBe('btn') // BTN acts first preflop HU
  })

  it('hand #2 after resolve: hero is BB', () => {
    let match = startMatch()
    // fold to end hand quickly
    match = applyAction(match, { kind: 'fold', actor: 'btn', street: 'preflop' })
    match = resolveHand(match)
    match = dealNewHand(match)
    const hand = match.currentHand!
    expect(hand.handNumber).toBe(2)
    expect(hand.hero.position).toBe('bb')
    expect(hand.villain.position).toBe('btn')
  })
})

// ── Preflop Raise Sizing ──

describe('Preflop raise sizing', () => {
  it('open raise to 2.5BB → correct chip deduction', () => {
    let match = startMatch()
    // BTN open-raises to 2.5BB
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.hero.streetCommitBB).toBe(2.5)
    expect(hand.hero.stackBB).toBe(37.5) // 40 - 0.5(sb) - 2.0(additional)
    expect(hand.currentBetBB).toBe(2.5)
    expect(hand.potBB).toBe(3.5) // 0.5 + 1 + 2
    expect(hand.toAct).toBe('bb')
  })

  it('3-bet to 9BB after open', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    // BB 3-bets to 9BB
    match = applyAction(match, { kind: 'raise', amount: 9, actor: 'bb', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.villain.streetCommitBB).toBe(9)
    expect(hand.currentBetBB).toBe(9)
    expect(hand.toAct).toBe('btn')
  })

  it('4-bet to 22BB after 3-bet', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'raise', amount: 9, actor: 'bb', street: 'preflop' })
    // BTN 4-bets to 22BB
    match = applyAction(match, { kind: 'raise', amount: 22, actor: 'btn', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.hero.streetCommitBB).toBe(22)
    expect(hand.currentBetBB).toBe(22)
  })

  it('call closes preflop and advances to flop', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.street).toBe('flop')
    expect(hand.board.length).toBe(3)
    expect(hand.potBB).toBe(5) // 2.5 + 2.5
    expect(hand.currentBetBB).toBe(0) // reset for new street
    expect(hand.toAct).toBe('bb') // BB acts first postflop
  })

  it('limp → BB check → advances to flop', () => {
    let match = startMatch()
    // BTN limps (call the BB)
    match = applyAction(match, { kind: 'call', actor: 'btn', street: 'preflop' })
    const afterLimp = match.currentHand!
    expect(afterLimp.toAct).toBe('bb') // BB has option
    // BB checks
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.street).toBe('flop')
    expect(hand.board.length).toBe(3)
    expect(hand.potBB).toBe(2) // 1 + 1 (both put in 1BB)
  })
})

// ── Postflop Bet Sizing ──

describe('Postflop bet sizing', () => {
  function getToFlop(): MatchState {
    let match = startMatch()
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    return match
  }

  it('BB bets 33% pot on flop', () => {
    let match = getToFlop()
    const pot = match.currentHand!.potBB // 5
    const betAmount = Math.round(pot * 0.33 * 10) / 10 // 1.7 (rounded)
    match = applyAction(match, { kind: 'bet', amount: betAmount, actor: 'bb', street: 'flop' })
    const hand = match.currentHand!
    expect(hand.villain.streetCommitBB).toBe(betAmount)
    expect(hand.potBB).toBeCloseTo(5 + betAmount, 1)
    expect(hand.toAct).toBe('btn')
  })

  it('BB bets 100% pot on flop, BTN raises', () => {
    let match = getToFlop()
    const pot = match.currentHand!.potBB // 5
    match = applyAction(match, { kind: 'bet', amount: pot, actor: 'bb', street: 'flop' })
    // BTN raises 2.5x (12.5)
    match = applyAction(match, { kind: 'raise', amount: 12.5, actor: 'btn', street: 'flop' })
    const hand = match.currentHand!
    expect(hand.hero.streetCommitBB).toBe(12.5)
    expect(hand.currentBetBB).toBe(12.5)
    expect(hand.toAct).toBe('bb')
  })

  it('check-check advances to turn', () => {
    let match = getToFlop()
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'flop' })
    match = applyAction(match, { kind: 'check', actor: 'btn', street: 'flop' })
    const hand = match.currentHand!
    expect(hand.street).toBe('turn')
    expect(hand.board.length).toBe(4)
    expect(hand.potBB).toBe(5)
  })
})

// ── All-In Scenarios ──

describe('All-in scenarios', () => {
  it('preflop all-in and call → runs out all 5 board cards', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'allin', actor: 'btn', street: 'preflop' })
    const afterAllin = match.currentHand!
    expect(afterAllin.hero.isAllIn).toBe(true)
    expect(afterAllin.hero.stackBB).toBe(0)
    expect(afterAllin.toAct).toBe('bb')
    // BB calls
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    const hand = match.currentHand!
    // Should auto-advance to showdown
    expect(hand.isComplete).toBe(true)
    expect(hand.board.length).toBe(5)
    expect(hand.street).toBe('showdown')
  })

  it('short stack all-in: 13BB scenario', () => {
    let match = dealNewHand(createMatch(makeConfig('1:5', 'short')))
    // Hero (13BB, BTN) goes all-in
    match = applyAction(match, { kind: 'allin', actor: 'btn', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.hero.isAllIn).toBe(true)
    expect(hand.hero.stackBB).toBe(0)
    expect(hand.hero.committedBB).toBe(13) // full 13BB stack
  })
})

// ── Fold Equity ──

describe('Fold', () => {
  it('hero folds preflop → loses SB, villain wins pot', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'fold', actor: 'btn', street: 'preflop' })
    expect(match.currentHand!.isComplete).toBe(true)
    expect(match.currentHand!.hero.hasFolded).toBe(true)
    const resolved = resolveHand(match)
    expect(resolved.playerStackBB).toBe(39.5) // lost 0.5BB SB
    expect(resolved.botStackBB).toBe(40.5)    // won 0.5BB
  })

  it('villain folds to raise → hero wins pot', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'fold', actor: 'bb', street: 'preflop' })
    expect(match.currentHand!.isComplete).toBe(true)
    const resolved = resolveHand(match)
    expect(resolved.playerStackBB).toBe(41) // won 1BB (villain's BB)
    expect(resolved.botStackBB).toBe(39)
  })
})

// ── Hand Evaluator ──

describe('Hand evaluation', () => {
  it('detects pair', () => {
    const cards = [card('A','s'), card('A','h'), card('K','d'), card('Q','c'), card('J','s')]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.PAIR)
    expect(ev.tiebreak[0]).toBe(14) // pair of aces
  })

  it('detects flush', () => {
    const cards = [card('A','s'), card('K','s'), card('9','s'), card('7','s'), card('2','s')]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.FLUSH)
  })

  it('detects straight', () => {
    const cards = [card('T','s'), card('9','h'), card('8','d'), card('7','c'), card('6','s')]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.STRAIGHT)
    expect(ev.tiebreak[0]).toBe(10)
  })

  it('detects wheel (A-5 straight)', () => {
    const cards = [card('A','s'), card('2','h'), card('3','d'), card('4','c'), card('5','s')]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.STRAIGHT)
    expect(ev.tiebreak[0]).toBe(5) // wheel top is 5
  })

  it('detects full house', () => {
    const cards = [card('K','s'), card('K','h'), card('K','d'), card('Q','c'), card('Q','s')]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.FULL_HOUSE)
    expect(ev.tiebreak[0]).toBe(13) // trip kings
    expect(ev.tiebreak[1]).toBe(12) // queens
  })

  it('detects straight flush', () => {
    const cards = [card('9','h'), card('8','h'), card('7','h'), card('6','h'), card('5','h')]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.STRAIGHT_FLUSH)
  })

  it('picks best 5 from 7 cards', () => {
    // Hole: A♠ K♠, Board: Q♠ J♠ T♠ 2♥ 3♦ → royal flush
    const cards = [
      card('A','s'), card('K','s'),
      card('Q','s'), card('J','s'), card('T','s'),
      card('2','h'), card('3','d'),
    ]
    const ev = evaluateHand(cards)
    expect(ev.rank).toBe(HandRank.STRAIGHT_FLUSH)
    expect(ev.tiebreak[0]).toBe(14) // ace-high straight flush
  })

  it('compareHands: flush beats straight', () => {
    const flush = evaluateHand([card('A','s'), card('K','s'), card('9','s'), card('7','s'), card('2','s')])
    const straight = evaluateHand([card('T','s'), card('9','h'), card('8','d'), card('7','c'), card('6','s')])
    expect(compareHands(flush, straight)).toBeGreaterThan(0)
  })

  it('compareHands: higher pair beats lower pair', () => {
    const pairAces = evaluateHand([card('A','s'), card('A','h'), card('K','d'), card('Q','c'), card('J','s')])
    const pairKings = evaluateHand([card('K','s'), card('K','h'), card('A','d'), card('Q','c'), card('J','s')])
    expect(compareHands(pairAces, pairKings)).toBeGreaterThan(0)
  })

  it('compareHands: same hand = tie', () => {
    const a = evaluateHand([card('A','s'), card('K','d'), card('Q','c'), card('J','s'), card('9','h')])
    const b = evaluateHand([card('A','h'), card('K','c'), card('Q','d'), card('J','h'), card('9','s')])
    expect(compareHands(a, b)).toBe(0)
  })
})

// ── Showdown Flow ──

describe('Showdown flow', () => {
  it('full hand: open → call → check-check × 3 streets → showdown', () => {
    let match = startMatch()
    // preflop: open → call
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    expect(match.currentHand!.street).toBe('flop')

    // flop: check-check
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'flop' })
    match = applyAction(match, { kind: 'check', actor: 'btn', street: 'flop' })
    expect(match.currentHand!.street).toBe('turn')
    expect(match.currentHand!.board.length).toBe(4)

    // turn: check-check
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'turn' })
    match = applyAction(match, { kind: 'check', actor: 'btn', street: 'turn' })
    expect(match.currentHand!.street).toBe('river')
    expect(match.currentHand!.board.length).toBe(5)

    // river: check-check → showdown
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'river' })
    match = applyAction(match, { kind: 'check', actor: 'btn', street: 'river' })
    const hand = match.currentHand!
    expect(hand.isComplete).toBe(true)
    expect(hand.street).toBe('showdown')
    expect(hand.board.length).toBe(5)

    // resolve: one side wins or tie
    const resolved = resolveHand(match)
    expect(resolved.currentHand).toBeNull()
    expect(resolved.handHistory.length).toBe(1)
    // Total chips = 80
    expect(resolved.playerStackBB + resolved.botStackBB).toBe(80)
  })

  it('flop bet → call → turn bet → call → river bet → call → showdown', () => {
    let match = startMatch()
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    // Pot = 5

    // Flop: BB bets 2, BTN calls
    match = applyAction(match, { kind: 'bet', amount: 2, actor: 'bb', street: 'flop' })
    match = applyAction(match, { kind: 'call', actor: 'btn', street: 'flop' })
    expect(match.currentHand!.street).toBe('turn')
    expect(match.currentHand!.potBB).toBe(9) // 5 + 2 + 2

    // Turn: BB bets 4, BTN calls
    match = applyAction(match, { kind: 'bet', amount: 4, actor: 'bb', street: 'turn' })
    match = applyAction(match, { kind: 'call', actor: 'btn', street: 'turn' })
    expect(match.currentHand!.street).toBe('river')
    expect(match.currentHand!.potBB).toBe(17) // 9 + 4 + 4

    // River: BB bets 8, BTN calls
    match = applyAction(match, { kind: 'bet', amount: 8, actor: 'bb', street: 'river' })
    match = applyAction(match, { kind: 'call', actor: 'btn', street: 'river' })
    const hand = match.currentHand!
    expect(hand.isComplete).toBe(true)
    expect(hand.potBB).toBe(33) // 17 + 8 + 8

    const resolved = resolveHand(match)
    expect(resolved.playerStackBB + resolved.botStackBB).toBe(80)
  })
})

// ── Match Lifecycle ──

describe('Match lifecycle', () => {
  it('match ends when one side busts', () => {
    // Use 1:1 ratio, play all-in hands until someone busts
    let match = startMatch()
    let iterations = 0
    while (match.result === 'in_progress' && iterations < 200) {
      // Both go all-in every hand
      match = applyAction(match, { kind: 'allin', actor: match.currentHand!.toAct, street: match.currentHand!.street })
      if (!match.currentHand!.isComplete) {
        const other = match.currentHand!.toAct
        match = applyAction(match, { kind: 'call', actor: other, street: match.currentHand!.street })
      }
      match = resolveHand(match)
      if (match.result !== 'in_progress') break
      match = dealNewHand(match)
      iterations++
    }
    expect(match.result).not.toBe('in_progress')
    expect(['player_won', 'player_lost']).toContain(match.result)
    expect(match.playerStackBB + match.botStackBB).toBe(80)
  })

  it('resolve preserves total chips across multiple hands', () => {
    let match = startMatch()
    for (let i = 0; i < 5; i++) {
      // simple fold to test chip conservation
      match = applyAction(match, { kind: 'fold', actor: match.currentHand!.toAct, street: 'preflop' })
      match = resolveHand(match)
      expect(match.playerStackBB + match.botStackBB).toBe(80)
      if (match.result !== 'in_progress') break
      match = dealNewHand(match)
    }
  })
})

// ── Raise Sizing Edge Cases ──

describe('Raise sizing edge cases', () => {
  it('raise below min is clamped to min-raise', () => {
    let match = startMatch()
    // BTN tries to raise to 1.5 (below min raise of 2BB = BB + min increment)
    match = applyAction(match, { kind: 'raise', amount: 1.5, actor: 'btn', street: 'preflop' })
    const hand = match.currentHand!
    // Engine should clamp: effectiveTarget = max(1.5, currentBet(1) + minRaise(1)) = 2
    expect(hand.hero.streetCommitBB).toBe(2)
  })

  it('bet more than stack → capped at stack', () => {
    // 13BB effective stack
    let match = dealNewHand(createMatch(makeConfig('1:5', 'short')))
    // Hero has 13 - 0.5 = 12.5 BB remaining
    match = applyAction(match, { kind: 'raise', amount: 100, actor: 'btn', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.hero.stackBB).toBe(0)
    expect(hand.hero.isAllIn).toBe(true)
    expect(hand.hero.committedBB).toBe(13) // entire stack
  })
})

// ── Bug Regressions ──

describe('Bug regressions', () => {
  it('no floating-point noise in chip values after multiple operations', () => {
    let match = startMatch() // 40 vs 40
    // BTN open 2.5
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    // BB calls → pot = 5
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.potBB).toBe(5)
    expect(hand.hero.stackBB).toBe(37.5)
    expect(hand.villain.stackBB).toBe(37.5)
    // No trailing decimals
    expect(hand.potBB.toString()).toBe('5')
    expect(hand.hero.stackBB.toString()).toBe('37.5')

    // BB bets 33% pot = 1.65 → should be clean
    const betAmt = Math.round(5 * 0.33 * 10) / 10 // 1.7
    match = applyAction(match, { kind: 'bet', amount: betAmt, actor: 'bb', street: 'flop' })
    const afterBet = match.currentHand!
    expect(afterBet.potBB.toString()).not.toContain('000000')
    expect(afterBet.villain.stackBB.toString()).not.toContain('000000')
  })

  it('all-in showdown: short stack wins only their committed amount', () => {
    // Hero 67BB (big), Villain 13BB (short)
    let match = dealNewHand(createMatch(makeConfig('5:1', 'big')))
    // Hero (BTN) all-in
    match = applyAction(match, { kind: 'allin', actor: 'btn', street: 'preflop' })
    // Villain (BB) calls → all-in for 13BB
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    expect(match.currentHand!.isComplete).toBe(true)

    const resolved = resolveHand(match)
    // Total chips MUST always be conserved (this was the bug)
    expect(resolved.playerStackBB + resolved.botStackBB).toBe(80)

    // Max swing is 13BB (villain's full stack), NOT 67BB
    const heroDelta = resolved.playerStackBB - 67
    expect(Math.abs(heroDelta)).toBeLessThanOrEqual(13)
    // Possible outcomes: hero +13 (win), hero -13 (lose), hero 0 (tie)
    expect([13, -13, 0]).toContain(heroDelta)
  })

  it('all-in for less than current bet does not reopen action', () => {
    // Hero 76BB (BTN), Villain 4BB (BB)
    const config = makeConfig('1:1')
    let match = createMatch(config)
    match = { ...match, playerStackBB: 76, botStackBB: 4 }
    match = dealNewHand(match)
    // Hand: hero BTN posts SB=0.5 (stack 75.5), villain BB posts 1 (stack 3)

    // Preflop: hero raises to 2.5
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    // Villain calls: toCall = 2.5-1 = 1.5, villain.stack = 3-1.5 = 1.5, committed = 2.5
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    expect(match.currentHand!.street).toBe('flop')
    expect(match.currentHand!.villain.stackBB).toBe(1.5)

    // Flop: BB checks, BTN bets 2.5
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'flop' })
    match = applyAction(match, { kind: 'bet', amount: 2.5, actor: 'btn', street: 'flop' })
    // Villain goes all-in for 1.5 (LESS than hero's bet of 2.5)
    match = applyAction(match, { kind: 'allin', actor: 'bb', street: 'flop' })
    const hand = match.currentHand!

    // KEY: hero should NOT get to act again — all-in for less is not a raise
    // The street should advance (or auto-advance through remaining streets)
    expect(hand.toAct).not.toBe('btn')
    // Villain is all-in, hero covers → should advance past flop
    expect(['turn', 'river', 'showdown'].includes(hand.street)).toBe(true)
  })

  it('all-in showdown: big stack loses only effective amount, not full stack', () => {
    let match = dealNewHand(createMatch(makeConfig('5:1', 'big')))
    match = applyAction(match, { kind: 'allin', actor: 'btn', street: 'preflop' })
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })

    const finalHand = match.currentHand!
    const effectiveBet = Math.min(finalHand.hero.committedBB, finalHand.villain.committedBB)
    expect(effectiveBet).toBe(13) // villain's full stack

    const resolved = resolveHand(match)
    expect(resolved.playerStackBB + resolved.botStackBB).toBe(80)
  })

  it('60BB vs 10BB all-in: committedBB accumulates correctly through call', () => {
    // Simulate match where stacks shifted to 60 vs 20 (total 80)
    // Hero BTN (60BB), villain BB (20BB)
    const config = makeConfig('1:1')
    let match = createMatch(config)
    // Manually set stacks as if shifted by prior hands
    match = { ...match, playerStackBB: 60, botStackBB: 20 }
    match = dealNewHand(match)

    const hand = match.currentHand!
    // Hand #1: hero is BTN, posts SB=0.5
    expect(hand.hero.position).toBe('btn')
    expect(hand.hero.committedBB).toBe(0.5)
    expect(hand.hero.stackBB).toBe(59.5)
    expect(hand.villain.committedBB).toBe(1)
    expect(hand.villain.stackBB).toBe(19)

    // Hero all-in
    match = applyAction(match, { kind: 'allin', actor: 'btn', street: 'preflop' })
    expect(match.currentHand!.hero.committedBB).toBe(60)
    expect(match.currentHand!.hero.stackBB).toBe(0)

    // Villain calls (capped at remaining stack)
    match = applyAction(match, { kind: 'call', actor: 'bb', street: 'preflop' })
    const finalHand = match.currentHand!
    expect(finalHand.villain.committedBB).toBe(20) // 1 (BB) + 19 (call)
    expect(finalHand.villain.stackBB).toBe(0)
    expect(finalHand.isComplete).toBe(true)

    // effectiveBet should be 20 (shorter stack), not 1 or 60
    const effectiveBet = Math.min(finalHand.hero.committedBB, finalHand.villain.committedBB)
    expect(effectiveBet).toBe(20)

    const resolved = resolveHand(match)
    expect(resolved.playerStackBB + resolved.botStackBB).toBe(80)

    // Delta is exactly ±20
    const heroDelta = resolved.playerStackBB - 60
    expect([20, -20, 0]).toContain(heroDelta)
  })

  it('chip conservation across 50 random all-in hands', () => {
    let match = dealNewHand(createMatch(makeConfig('1:1')))
    for (let i = 0; i < 50; i++) {
      if (match.result !== 'in_progress') break
      // Both go all-in
      match = applyAction(match, { kind: 'allin', actor: match.currentHand!.toAct, street: match.currentHand!.street })
      if (!match.currentHand!.isComplete) {
        match = applyAction(match, { kind: 'call', actor: match.currentHand!.toAct, street: match.currentHand!.street })
      }
      match = resolveHand(match)
      // CRITICAL: chips must ALWAYS sum to 80
      expect(match.playerStackBB + match.botStackBB).toBe(80)
      if (match.result !== 'in_progress') break
      match = dealNewHand(match)
    }
  })

  it('all-in does not auto-advance when opponent has not called', () => {
    // Reproduces exact bug: hero all-in, villain hasn't acted → should NOT go to showdown
    let match = dealNewHand(createMatch(makeConfig('1:1')))
    // Hero (BTN) goes all-in preflop
    match = applyAction(match, { kind: 'allin', actor: 'btn', street: 'preflop' })
    const hand = match.currentHand!
    // Hand should NOT be complete — villain still needs to act
    expect(hand.isComplete).toBe(false)
    expect(hand.toAct).toBe('bb')
    // Villain has only committed BB (1), not called yet
    expect(hand.villain.committedBB).toBe(1)
    expect(hand.villain.streetCommitBB).toBe(1)
    // Street should still be preflop
    expect(hand.street).toBe('preflop')
  })

  it('check facing a bet is converted to fold (defensive guard)', () => {
    let match = startMatch()
    // BTN raises to 2.5
    match = applyAction(match, { kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' })
    // BB incorrectly tries to check (facing a 2.5 bet) → should be converted to fold
    match = applyAction(match, { kind: 'check', actor: 'bb', street: 'preflop' })
    const hand = match.currentHand!
    expect(hand.isComplete).toBe(true)
    expect(hand.villain.hasFolded).toBe(true)
  })

  it('chip conservation across 50 random mixed-action hands', () => {
    let match = dealNewHand(createMatch(makeConfig('1:2', 'short')))
    for (let i = 0; i < 50; i++) {
      if (match.result !== 'in_progress') break
      const hand = match.currentHand!
      // Alternate between fold, call, and all-in
      const choice = i % 3
      if (choice === 0) {
        match = applyAction(match, { kind: 'fold', actor: hand.toAct, street: hand.street })
      } else if (choice === 1) {
        // Raise then fold
        match = applyAction(match, { kind: 'raise', amount: 2.5, actor: hand.toAct, street: hand.street })
        if (!match.currentHand!.isComplete) {
          match = applyAction(match, { kind: 'fold', actor: match.currentHand!.toAct, street: match.currentHand!.street })
        }
      } else {
        // All-in + call
        match = applyAction(match, { kind: 'allin', actor: hand.toAct, street: hand.street })
        if (!match.currentHand!.isComplete) {
          match = applyAction(match, { kind: 'call', actor: match.currentHand!.toAct, street: match.currentHand!.street })
        }
      }
      match = resolveHand(match)
      expect(match.playerStackBB + match.botStackBB).toBe(80)
      if (match.result !== 'in_progress') break
      match = dealNewHand(match)
    }
  })
})
