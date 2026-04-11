import { describe, it, expect } from 'vitest'
import { newDeck, shuffleDeck, dealCard, dealCards } from '../../lib/hu/deck'

describe('deck', () => {
  describe('newDeck', () => {
    it('contains 52 cards', () => {
      expect(newDeck()).toHaveLength(52)
    })
    it('contains exactly 4 of each rank', () => {
      const d = newDeck()
      const aces = d.filter(c => c.rank === 'A')
      expect(aces).toHaveLength(4)
    })
    it('contains 13 of each suit', () => {
      const d = newDeck()
      const spades = d.filter(c => c.suit === 's')
      expect(spades).toHaveLength(13)
    })
    it('has no duplicates', () => {
      const d = newDeck()
      const set = new Set(d.map(c => c.rank + c.suit))
      expect(set.size).toBe(52)
    })
  })

  describe('shuffleDeck', () => {
    it('returns a new array of same length', () => {
      const d = newDeck()
      const s = shuffleDeck(d)
      expect(s).toHaveLength(52)
      expect(s).not.toBe(d)
    })
    it('contains the same cards', () => {
      const d = newDeck()
      const s = shuffleDeck(d)
      const dStrs = d.map(c => c.rank + c.suit).sort()
      const sStrs = s.map(c => c.rank + c.suit).sort()
      expect(sStrs).toEqual(dStrs)
    })
    it('does not mutate the input deck', () => {
      const d = newDeck()
      const lenBefore = d.length
      shuffleDeck(d)
      expect(d).toHaveLength(lenBefore)
    })
  })

  describe('dealCard', () => {
    it('removes top card and returns it', () => {
      const d = newDeck()
      const len = d.length
      const card = dealCard(d)
      expect(d).toHaveLength(len - 1)
      expect(card).toBeDefined()
    })
    it('throws when deck is empty', () => {
      expect(() => dealCard([])).toThrow()
    })
  })

  describe('dealCards', () => {
    it('deals N cards from deck', () => {
      const d = newDeck()
      const cards = dealCards(d, 5)
      expect(cards).toHaveLength(5)
      expect(d).toHaveLength(47)
    })
    it('returns empty array when N=0', () => {
      const d = newDeck()
      expect(dealCards(d, 0)).toHaveLength(0)
      expect(d).toHaveLength(52)
    })
  })
})
