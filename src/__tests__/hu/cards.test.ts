import { describe, it, expect } from 'vitest'
import { parseCard, formatCard, parseBoard, formatBoard, rankValue, compareCards, RANKS } from '../../lib/hu/cards'

describe('cards', () => {
  describe('parseCard', () => {
    it('parses Ace of spades', () => {
      expect(parseCard('As')).toEqual({ rank: 'A', suit: 's' })
    })
    it('parses Ten of clubs', () => {
      expect(parseCard('Tc')).toEqual({ rank: 'T', suit: 'c' })
    })
    it('throws on invalid input', () => {
      expect(() => parseCard('Z9')).toThrow()
      expect(() => parseCard('A')).toThrow()
    })
  })

  describe('formatCard', () => {
    it('formats card to 2-char string', () => {
      expect(formatCard({ rank: 'A', suit: 's' })).toBe('As')
      expect(formatCard({ rank: '2', suit: 'h' })).toBe('2h')
    })
  })

  describe('parseBoard', () => {
    it('parses 3-card flop', () => {
      const cards = parseBoard('AsKh7d')
      expect(cards).toHaveLength(3)
      expect(cards[0]).toEqual({ rank: 'A', suit: 's' })
    })
    it('handles comma separator', () => {
      expect(parseBoard('As,Kh,7d')).toHaveLength(3)
    })
    it('parses 5-card runout', () => {
      expect(parseBoard('AsKh7d2c5s')).toHaveLength(5)
    })
  })

  describe('rankValue', () => {
    it('A is highest', () => {
      expect(rankValue('A')).toBe(14)
    })
    it('2 is lowest', () => {
      expect(rankValue('2')).toBe(2)
    })
    it('T is 10', () => {
      expect(rankValue('T')).toBe(10)
    })
  })

  describe('RANKS constant', () => {
    it('has 13 ranks', () => {
      expect(RANKS).toHaveLength(13)
    })
  })

  describe('formatBoard', () => {
    it('formats single card array', () => {
      expect(formatBoard([{ rank: 'A', suit: 's' }])).toBe('As')
    })
    it('formats multi-card array', () => {
      expect(formatBoard([
        { rank: 'A', suit: 's' },
        { rank: 'K', suit: 'h' },
        { rank: '7', suit: 'd' },
      ])).toBe('AsKh7d')
    })
    it('round-trips with parseBoard', () => {
      const cards = parseBoard('AsKh7d2c5s')
      expect(formatBoard(cards)).toBe('AsKh7d2c5s')
    })
  })

  describe('compareCards', () => {
    it('returns positive when first card outranks second', () => {
      expect(compareCards({ rank: 'A', suit: 's' }, { rank: 'K', suit: 'h' })).toBeGreaterThan(0)
    })
    it('returns negative when first card is lower rank', () => {
      expect(compareCards({ rank: '2', suit: 'c' }, { rank: '3', suit: 'd' })).toBeLessThan(0)
    })
    it('returns zero for equal ranks regardless of suit', () => {
      expect(compareCards({ rank: 'K', suit: 's' }, { rank: 'K', suit: 'h' })).toBe(0)
    })
  })
})
