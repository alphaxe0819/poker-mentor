import { describe, it, expect } from 'vitest'
import { handToCanonical } from '../../lib/hu/handToCanonical'
import { parseCard } from '../../lib/hu/cards'

describe('handToCanonical', () => {
  it('pair: AcAh → AA', () => {
    expect(handToCanonical([parseCard('Ac'), parseCard('Ah')])).toBe('AA')
  })
  it('pair: 2c2d → 22', () => {
    expect(handToCanonical([parseCard('2c'), parseCard('2d')])).toBe('22')
  })
  it('suited: AsKs → AKs', () => {
    expect(handToCanonical([parseCard('As'), parseCard('Ks')])).toBe('AKs')
  })
  it('offsuit: AsKh → AKo', () => {
    expect(handToCanonical([parseCard('As'), parseCard('Kh')])).toBe('AKo')
  })
  it('orders by rank (high first) when low rank passed first', () => {
    expect(handToCanonical([parseCard('2s'), parseCard('Ks')])).toBe('K2s')
    expect(handToCanonical([parseCard('5d'), parseCard('Tc')])).toBe('T5o')
  })
  it('handles T and face cards correctly', () => {
    expect(handToCanonical([parseCard('Td'), parseCard('Jd')])).toBe('JTs')
    expect(handToCanonical([parseCard('Qh'), parseCard('Js')])).toBe('QJo')
  })
})
