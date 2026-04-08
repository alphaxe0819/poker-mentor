import { describe, it, expect } from 'vitest'
import { isDailyLimitReached, isUserPaid, type UserProfile } from '../lib/auth'

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'test-user',
    email: 'test@example.com',
    name: 'Test',
    is_paid: false,
    player_type: 'tournament',
    daily_plays_date: null,
    daily_plays_count: 0,
    promo_expires_at: null,
    ...overrides,
  }
}

function getLocalDateString(): string {
  const now = new Date()
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  return utc8.toISOString().slice(0, 10)
}

describe('isUserPaid', () => {
  it('returns true for is_paid user', () => {
    const profile = makeProfile({ is_paid: true })
    expect(isUserPaid(profile)).toBe(true)
  })

  it('returns false for free user with no promo', () => {
    const profile = makeProfile()
    expect(isUserPaid(profile)).toBe(false)
  })

  it('returns true for free user with active promo', () => {
    const future = new Date(Date.now() + 86400000).toISOString()
    const profile = makeProfile({ promo_expires_at: future })
    expect(isUserPaid(profile)).toBe(true)
  })

  it('returns false for free user with expired promo', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const profile = makeProfile({ promo_expires_at: past })
    expect(isUserPaid(profile)).toBe(false)
  })
})

describe('isDailyLimitReached', () => {
  it('returns false for paid users', () => {
    const profile = makeProfile({ is_paid: true, daily_plays_date: getLocalDateString(), daily_plays_count: 10 })
    expect(isDailyLimitReached(profile)).toBe(false)
  })

  it('returns false for free user on new day', () => {
    const profile = makeProfile({ daily_plays_date: '2020-01-01', daily_plays_count: 5 })
    expect(isDailyLimitReached(profile)).toBe(false)
  })

  it('returns false for free user with 0 plays today', () => {
    const profile = makeProfile({ daily_plays_date: getLocalDateString(), daily_plays_count: 0 })
    expect(isDailyLimitReached(profile)).toBe(false)
  })

  it('returns true for free user who reached limit today', () => {
    const profile = makeProfile({ daily_plays_date: getLocalDateString(), daily_plays_count: 1 })
    expect(isDailyLimitReached(profile)).toBe(true)
  })

  it('returns true for free user who exceeded limit today', () => {
    const profile = makeProfile({ daily_plays_date: getLocalDateString(), daily_plays_count: 3 })
    expect(isDailyLimitReached(profile)).toBe(true)
  })

  it('returns false when daily_plays_date is null', () => {
    const profile = makeProfile({ daily_plays_date: null, daily_plays_count: 0 })
    expect(isDailyLimitReached(profile)).toBe(false)
  })

  it('returns false for user with active promo', () => {
    const future = new Date(Date.now() + 86400000).toISOString()
    const profile = makeProfile({ promo_expires_at: future, daily_plays_date: getLocalDateString(), daily_plays_count: 1 })
    expect(isDailyLimitReached(profile)).toBe(false)
  })
})
