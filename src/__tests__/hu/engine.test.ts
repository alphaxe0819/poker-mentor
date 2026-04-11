import { describe, it, expect } from 'vitest'
import { createMatch, dealNewHand } from '../../lib/hu/engine'
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
