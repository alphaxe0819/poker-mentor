import { describe, it, expect } from 'vitest'
import { evaluateHand, compareHands, HandRank } from '../../lib/hu/handEvaluator'
import { parseBoard } from '../../lib/hu/cards'

describe('handEvaluator', () => {
  describe('evaluateHand 5-card classification', () => {
    it('detects straight flush (royal)', () => {
      const cards = parseBoard('AsKsQsJsTs')
      expect(evaluateHand(cards).rank).toBe(HandRank.STRAIGHT_FLUSH)
    })
    it('detects four of a kind', () => {
      const cards = parseBoard('AsAhAdAc2s')
      expect(evaluateHand(cards).rank).toBe(HandRank.FOUR_OF_A_KIND)
    })
    it('detects full house', () => {
      const cards = parseBoard('AsAhAdKsKh')
      expect(evaluateHand(cards).rank).toBe(HandRank.FULL_HOUSE)
    })
    it('detects flush', () => {
      const cards = parseBoard('As9s7s5s2s')
      expect(evaluateHand(cards).rank).toBe(HandRank.FLUSH)
    })
    it('detects straight (A-high)', () => {
      const cards = parseBoard('AsKhQdJcTs')
      expect(evaluateHand(cards).rank).toBe(HandRank.STRAIGHT)
    })
    it('detects wheel straight (A-2-3-4-5)', () => {
      const cards = parseBoard('As2h3d4c5s')
      expect(evaluateHand(cards).rank).toBe(HandRank.STRAIGHT)
    })
    it('detects three of a kind', () => {
      const cards = parseBoard('AsAhAd5c2s')
      expect(evaluateHand(cards).rank).toBe(HandRank.THREE_OF_A_KIND)
    })
    it('detects two pair', () => {
      const cards = parseBoard('AsAhKdKc2s')
      expect(evaluateHand(cards).rank).toBe(HandRank.TWO_PAIR)
    })
    it('detects pair', () => {
      const cards = parseBoard('AsAh7d5c2s')
      expect(evaluateHand(cards).rank).toBe(HandRank.PAIR)
    })
    it('detects high card', () => {
      const cards = parseBoard('AsKh9d5c2s')
      expect(evaluateHand(cards).rank).toBe(HandRank.HIGH_CARD)
    })
  })

  describe('best 5 from 7', () => {
    it('picks trips on 9 9 9 2 5 with AK hole', () => {
      const cards = parseBoard('9c9d9h2c5sAsKs')
      expect(evaluateHand(cards).rank).toBe(HandRank.THREE_OF_A_KIND)
    })
    it('picks flush over pair when both available', () => {
      // Board: As Ks Qs 7s 2s, Hole: Kh 3c
      // 5-card options include flush (As/Ks/Qs/7s/2s) and pair of K
      const cards = parseBoard('AsKsQs7s2sKh3c')
      expect(evaluateHand(cards).rank).toBe(HandRank.FLUSH)
    })
    it('picks straight from 7 cards when present', () => {
      const cards = parseBoard('AhKdQcJsTh3d2c')
      expect(evaluateHand(cards).rank).toBe(HandRank.STRAIGHT)
    })
  })

  describe('compareHands', () => {
    it('higher pair beats lower pair', () => {
      const a = evaluateHand(parseBoard('AsAh2c3d5h'))
      const b = evaluateHand(parseBoard('KsKh2c3d5h'))
      expect(compareHands(a, b)).toBeGreaterThan(0)
    })
    it('returns negative when first is weaker', () => {
      const a = evaluateHand(parseBoard('KsKh2c3d5h'))
      const b = evaluateHand(parseBoard('AsAh2c3d5h'))
      expect(compareHands(a, b)).toBeLessThan(0)
    })
    it('returns 0 for identical hand strength', () => {
      // Both AKQJT straight (different suits)
      const a = evaluateHand(parseBoard('AhKsQdJcTh'))
      const b = evaluateHand(parseBoard('AdKhQsJsTd'))
      expect(compareHands(a, b)).toBe(0)
    })
    it('flush beats straight', () => {
      const a = evaluateHand(parseBoard('AsKsQs7s2s'))  // flush
      const b = evaluateHand(parseBoard('AhKdQcJsTh'))  // straight
      expect(compareHands(a, b)).toBeGreaterThan(0)
    })
    it('higher kicker breaks pair tie', () => {
      const a = evaluateHand(parseBoard('AsAh7c5d2h'))  // pair AA, kicker 7
      const b = evaluateHand(parseBoard('AdAc6c4d2h'))  // pair AA, kicker 6
      expect(compareHands(a, b)).toBeGreaterThan(0)
    })
  })
})
