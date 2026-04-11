import { describe, it, expect, beforeAll } from 'vitest'
import { decideBotAction, preloadBotData } from '../../lib/hu/botAI'
import { parseCard, parseBoard } from '../../lib/hu/cards'
import type { HandState, MatchConfig, PlayerState } from '../../lib/hu/types'

function makeHero(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    position: 'btn',
    stackBB: 39.5,
    holeCards: [parseCard('2c'), parseCard('7d')],
    committedBB: 0.5,
    streetCommitBB: 0.5,
    isAllIn: false,
    hasFolded: false,
    ...overrides,
  }
}

function makeVillain(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    position: 'bb',
    stackBB: 39,
    holeCards: [parseCard('Ac'), parseCard('As')],
    committedBB: 1,
    streetCommitBB: 1,
    isAllIn: false,
    hasFolded: false,
    ...overrides,
  }
}

function makeHand(overrides: Partial<HandState> = {}): HandState {
  return {
    handNumber: 1,
    street: 'preflop',
    board: [],
    potBB: 1.5,
    hero: makeHero(),
    villain: makeVillain(),
    toAct: 'bb',
    currentBetBB: 1,
    minRaiseBB: 1,
    actions: [],
    isComplete: false,
    ...overrides,
  }
}

const config: MatchConfig = {
  totalStackBB: 80, stackRatio: '1:1', playerSide: 'equal', sbBB: 0.5, bbBB: 1,
}

describe('botAI', () => {
  beforeAll(async () => {
    // Preload HU 40BB preflop DB so GTO lookups work in all tests
    await preloadBotData()
  })

  it('returns a valid action for preflop SB RFI scenario', () => {
    // Bot is BTN (toAct='btn'), no actions yet → SB_RFI
    const hand = makeHand({ toAct: 'btn' })
    const action = decideBotAction(hand, config, 'standard')
    expect(action).toHaveProperty('kind')
    expect(['fold', 'call', 'raise', 'allin', 'check']).toContain(action.kind)
    expect(action.actor).toBe('btn')
  })

  it('returns a valid action when bot is BB facing BTN open', () => {
    // Bot is BB, BTN already raised
    const hand = makeHand({
      toAct: 'bb',
      currentBetBB: 2.5,
      villain: makeVillain({
        holeCards: [parseCard('As'), parseCard('Ks')],
      }),
      actions: [
        { kind: 'raise', actor: 'btn', street: 'preflop', amount: 2.5 },
      ],
    })
    const action = decideBotAction(hand, config, 'standard')
    expect(['fold', 'call', 'raise', 'allin']).toContain(action.kind)
    expect(action.actor).toBe('bb')
  })

  it('plays postflop when board is present and GTO data exists', () => {
    // Bot BTN c-bet decision after BB checks. Use a board we have data for: As7d2c
    const hand = makeHand({
      street: 'flop',
      board: parseBoard('As7d2c'),
      potBB: 5,
      toAct: 'btn',
      currentBetBB: 0,
      hero: makeHero({
        position: 'bb',  // hero is BB this hand to put bot in BTN
        committedBB: 2.5,
        streetCommitBB: 0,
        stackBB: 37.5,
      }),
      villain: makeVillain({
        position: 'btn',
        holeCards: [parseCard('Ac'), parseCard('Ad')],  // bot has aces
        committedBB: 2.5,
        streetCommitBB: 0,
        stackBB: 37.5,
      }),
      actions: [
        { kind: 'raise', actor: 'btn', street: 'preflop', amount: 2.5 },
        { kind: 'call', actor: 'bb', street: 'preflop' },
        { kind: 'check', actor: 'bb', street: 'flop' },
      ],
    })
    const action = decideBotAction(hand, config, 'standard')
    expect(['check', 'bet', 'allin']).toContain(action.kind)
  })

  it('postflop with no GTO data falls back to heuristic', () => {
    // Use a board NOT in our 13: 5h4d3c
    const hand = makeHand({
      street: 'flop',
      board: parseBoard('5h4d3c'),
      potBB: 5,
      toAct: 'bb',
      currentBetBB: 0,
      villain: makeVillain({
        position: 'bb',
        holeCards: [parseCard('Ac'), parseCard('Ad')],
        committedBB: 1,
        streetCommitBB: 0,
        stackBB: 39,
      }),
    })
    const action = decideBotAction(hand, config, 'standard')
    // Should return SOMETHING (heuristic fallback)
    expect(action).toHaveProperty('kind')
    expect(['fold', 'check', 'call', 'bet', 'raise', 'allin']).toContain(action.kind)
  })

  it('bot raises with AA on SB RFI (verifies GTO lookup works)', () => {
    // Bot is BTN/SB, no preflop action history → SB_RFI scenario
    // Bot has AA → must not fold
    const hand = makeHand({
      toAct: 'btn',
      hero: makeHero({
        position: 'bb',
        committedBB: 1,
        streetCommitBB: 1,
      }),
      villain: makeVillain({
        position: 'btn',
        holeCards: [parseCard('Ac'), parseCard('As')],
        committedBB: 0.5,
        streetCommitBB: 0.5,
        stackBB: 39.5,
      }),
    })
    const action = decideBotAction(hand, config, 'standard')
    // AA must NOT fold (it's the strongest hand). It should raise (or call/check minimum).
    expect(action.kind).not.toBe('fold')
  })
})
