import { describe, it, expect } from 'vitest'
import { ALL_HANDS, makeRange, makeRangeDefaultCall } from '../lib/gto/helpers'

describe('GTO helpers', () => {
  describe('ALL_HANDS', () => {
    it('has exactly 169 hands', () => {
      expect(ALL_HANDS.length).toBe(169)
    })

    it('includes pairs', () => {
      expect(ALL_HANDS).toContain('AA')
      expect(ALL_HANDS).toContain('22')
      expect(ALL_HANDS).toContain('TT')
    })

    it('includes suited hands', () => {
      expect(ALL_HANDS).toContain('AKs')
      expect(ALL_HANDS).toContain('76s')
    })

    it('includes offsuit hands', () => {
      expect(ALL_HANDS).toContain('AKo')
      expect(ALL_HANDS).toContain('72o')
    })

    it('has no duplicates', () => {
      const unique = new Set(ALL_HANDS)
      expect(unique.size).toBe(169)
    })
  })

  describe('makeRange', () => {
    it('raises are marked r', () => {
      const range = makeRange(['AA', 'KK'], ['QQ'])
      expect(range['AA']).toBe('r')
      expect(range['KK']).toBe('r')
    })

    it('calls are marked c', () => {
      const range = makeRange(['AA'], ['QQ', 'JJ'])
      expect(range['QQ']).toBe('c')
      expect(range['JJ']).toBe('c')
    })

    it('unlisted hands are omitted (fold by default)', () => {
      const range = makeRange(['AA'])
      expect(range['72o']).toBeUndefined()
    })

    it('mixed actions are preserved', () => {
      const range = makeRange([], [], { 'TT': 'mr:65' })
      expect(range['TT']).toBe('mr:65')
    })
  })

  describe('makeRangeDefaultCall', () => {
    it('unlisted hands default to call', () => {
      const range = makeRangeDefaultCall(['AA'], ['72o'])
      expect(range['AA']).toBe('r')
      expect(range['72o']).toBeUndefined() // fold
      expect(range['KK']).toBe('c') // default call
    })
  })
})
