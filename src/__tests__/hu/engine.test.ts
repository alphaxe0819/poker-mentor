import { describe, it, expect } from 'vitest'
import { createMatch, dealNewHand, applyAction } from '../../lib/hu/engine'
import type { MatchConfig } from '../../lib/hu/types'

describe('engine - match init', () => {
  const config1to1: MatchConfig = {
    totalStackBB: 80,
    stackRatio: '1:1',
    playerSide: 'equal',
    sbBB: 0.5,
    bbBB: 1,
  }

  describe('createMatch', () => {
    it('creates match with 40/40 stacks for 1:1', () => {
      const m = createMatch(config1to1)
      expect(m.playerStackBB).toBe(40)
      expect(m.botStackBB).toBe(40)
      expect(m.result).toBe('in_progress')
      expect(m.handHistory).toHaveLength(0)
      expect(m.currentHand).toBeNull()
    })

    it('handles 1:5 ratio with player short', () => {
      const config: MatchConfig = {
        totalStackBB: 80, stackRatio: '1:5', playerSide: 'short', sbBB: 0.5, bbBB: 1,
      }
      const m = createMatch(config)
      expect(m.playerStackBB + m.botStackBB).toBe(80)
      expect(m.playerStackBB).toBeLessThan(m.botStackBB)
    })

    it('handles 5:1 with player big', () => {
      const config: MatchConfig = {
        totalStackBB: 80, stackRatio: '5:1', playerSide: 'big', sbBB: 0.5, bbBB: 1,
      }
      const m = createMatch(config)
      expect(m.playerStackBB).toBeGreaterThan(m.botStackBB)
      expect(m.playerStackBB + m.botStackBB).toBe(80)
    })

    it('initializes counters at 0', () => {
      const m = createMatch(config1to1)
      expect(m.violationPoints).toBe(0)
      expect(m.analysisPointsSpent).toBe(0)
    })
  })

  describe('dealNewHand', () => {
    it('deals 2 cards to each player', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand).not.toBeNull()
      expect(updated.currentHand!.hero.holeCards).toHaveLength(2)
      expect(updated.currentHand!.villain.holeCards).toHaveLength(2)
    })

    it('hero and villain have unique hole cards', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      const hand = updated.currentHand!
      const all = [...hand.hero.holeCards, ...hand.villain.holeCards]
      const set = new Set(all.map(c => c.rank + c.suit))
      expect(set.size).toBe(4)
    })

    it('posts blinds (SB 0.5, BB 1) → pot 1.5', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand!.potBB).toBe(1.5)
    })

    it('hand 1 starts with player as BTN/SB', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand!.hero.position).toBe('btn')
    })

    it('BTN/SB acts first preflop in HU', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand!.toAct).toBe('btn')
    })

    it('hand 2 alternates positions (player becomes BB)', () => {
      let m = createMatch(config1to1)
      m = dealNewHand(m)
      // Move hand 1 to history to simulate it ending
      m = {
        ...m,
        handHistory: [m.currentHand!],
        currentHand: null,
      }
      m = dealNewHand(m)
      expect(m.currentHand!.hero.position).toBe('bb')
    })

    it('starts at preflop street with empty board', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand!.street).toBe('preflop')
      expect(updated.currentHand!.board).toHaveLength(0)
    })

    it('current bet starts at BB (1)', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand!.currentBetBB).toBe(1)
    })

    it('hand has handNumber = handHistory.length + 1', () => {
      let m = createMatch(config1to1)
      m = dealNewHand(m)
      expect(m.currentHand!.handNumber).toBe(1)
    })

    it('isComplete starts false', () => {
      const m = createMatch(config1to1)
      const updated = dealNewHand(m)
      expect(updated.currentHand!.isComplete).toBe(false)
    })
  })
})

describe('engine - action processing', () => {
  const config1to1: MatchConfig = {
    totalStackBB: 80, stackRatio: '1:1', playerSide: 'equal', sbBB: 0.5, bbBB: 1,
  }

  it('fold ends hand and marks folder', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    const result = applyAction(m, { kind: 'fold', actor: 'btn', street: 'preflop' })
    expect(result.currentHand!.isComplete).toBe(true)
    // Hero is BTN on hand 1, so hero folded
    expect(result.currentHand!.hero.hasFolded).toBe(true)
  })

  it('call matches current bet', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    // BTN posted SB 0.5, faces BB 1. Calling adds 0.5
    const result = applyAction(m, { kind: 'call', actor: 'btn', street: 'preflop' })
    expect(result.currentHand!.hero.streetCommitBB).toBe(1)
    expect(result.currentHand!.potBB).toBe(2)
    expect(result.currentHand!.toAct).toBe('bb')  // Now BB has option
    expect(result.currentHand!.isComplete).toBe(false)
  })

  it('raise increases current bet', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    // BTN raises to 2.5BB total
    const result = applyAction(m, { kind: 'raise', actor: 'btn', amount: 2.5, street: 'preflop' })
    expect(result.currentHand!.currentBetBB).toBe(2.5)
    expect(result.currentHand!.toAct).toBe('bb')
    expect(result.currentHand!.isComplete).toBe(false)
  })

  it('two checks on flop advances to turn', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    // Preflop: BTN call, BB check → goes to flop
    m = applyAction(m, { kind: 'call', actor: 'btn', street: 'preflop' })
    m = applyAction(m, { kind: 'check', actor: 'bb', street: 'preflop' })
    expect(m.currentHand!.street).toBe('flop')
    expect(m.currentHand!.board).toHaveLength(3)
    // BB acts first postflop in HU
    expect(m.currentHand!.toAct).toBe('bb')
  })

  it('check then bet then call advances flop → turn', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    m = applyAction(m, { kind: 'call', actor: 'btn', street: 'preflop' })
    m = applyAction(m, { kind: 'check', actor: 'bb', street: 'preflop' })
    // On flop. BB acts first postflop.
    m = applyAction(m, { kind: 'check', actor: 'bb', street: 'flop' })
    m = applyAction(m, { kind: 'bet', actor: 'btn', amount: 1, street: 'flop' })
    m = applyAction(m, { kind: 'call', actor: 'bb', street: 'flop' })
    expect(m.currentHand!.street).toBe('turn')
    expect(m.currentHand!.board).toHaveLength(4)
  })

  it('all-in caps amount at remaining stack', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    // Hero stack after SB = 39.5BB
    const result = applyAction(m, { kind: 'allin', actor: 'btn', street: 'preflop' })
    expect(result.currentHand!.hero.stackBB).toBe(0)
    expect(result.currentHand!.hero.isAllIn).toBe(true)
    // streetCommit went from 0.5 → 40 (the full stack)
    expect(result.currentHand!.hero.streetCommitBB).toBe(40)
  })

  it('preflop all-in followed by fold ends hand', () => {
    let m = createMatch(config1to1)
    m = dealNewHand(m)
    m = applyAction(m, { kind: 'allin', actor: 'btn', street: 'preflop' })
    m = applyAction(m, { kind: 'fold', actor: 'bb', street: 'preflop' })
    expect(m.currentHand!.isComplete).toBe(true)
    expect(m.currentHand!.villain.hasFolded).toBe(true)
  })
})
