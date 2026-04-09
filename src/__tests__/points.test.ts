// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock supabase before importing points
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null }),
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { points: 0 } }),
        }),
      }),
    }),
  },
}))

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: { VITE_SUPABASE_URL: 'https://test.supabase.co' } } })

import { getPoints, addPoints, spendPoints } from '../lib/points'

describe('points system', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getPoints returns 0 when empty', () => {
    expect(getPoints()).toBe(0)
  })

  it('addPoints increases points', () => {
    expect(addPoints(10)).toBe(10)
    expect(getPoints()).toBe(10)
    expect(addPoints(5)).toBe(15)
    expect(getPoints()).toBe(15)
  })

  it('spendPoints decreases points', () => {
    addPoints(50)
    expect(spendPoints(30)).toBe(true)
    expect(getPoints()).toBe(20)
  })

  it('spendPoints fails when insufficient', () => {
    addPoints(10)
    expect(spendPoints(50)).toBe(false)
    expect(getPoints()).toBe(10)
  })

  it('spendPoints exact amount succeeds', () => {
    addPoints(25)
    expect(spendPoints(25)).toBe(true)
    expect(getPoints()).toBe(0)
  })
})
