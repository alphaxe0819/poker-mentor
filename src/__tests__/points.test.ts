// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockRpc, mockFrom } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
  mockFrom: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    rpc: mockRpc,
    from: mockFrom,
  },
}))

import { getPoints, addPoints, spendPoints, migrateLocalPoints } from '../lib/points'

describe('points system (Supabase SSOT)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('getPoints fetches from Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { points: 42 } }),
        }),
      }),
    })
    const result = await getPoints('user-1')
    expect(result).toBe(42)
  })

  it('getPoints returns 0 when no profile', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    })
    const result = await getPoints('user-1')
    expect(result).toBe(0)
  })

  it('addPoints calls RPC and returns new balance', async () => {
    mockRpc.mockResolvedValue({ data: [{ new_balance: 55 }], error: null })
    const result = await addPoints('user-1', 10, 'training', '答題正確 +1')
    expect(mockRpc).toHaveBeenCalledWith('add_points', {
      p_user_id: 'user-1',
      p_amount: 10,
      p_type: 'training',
      p_description: '答題正確 +1',
      p_reference_id: null,
    })
    expect(result).toBe(55)
  })

  it('spendPoints returns success when sufficient balance', async () => {
    mockRpc.mockResolvedValue({ data: [{ success: true, new_balance: 20 }], error: null })
    const result = await spendPoints('user-1', 30, 'analysis', 'AI 弱點分析')
    expect(result).toEqual({ success: true, balance: 20 })
  })

  it('spendPoints returns failure when insufficient balance', async () => {
    mockRpc.mockResolvedValue({ data: [{ success: false, new_balance: 10 }], error: null })
    const result = await spendPoints('user-1', 50, 'analysis', 'AI 弱點分析')
    expect(result).toEqual({ success: false, balance: 10 })
  })

  it('addPoints throws on RPC error', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'DB error' } })
    await expect(addPoints('user-1', 10, 'test', 'test')).rejects.toThrow('addPoints failed: DB error')
  })

  it('migrateLocalPoints moves localStorage points to Supabase', async () => {
    localStorage.setItem('gto_user_points', '100')
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { points: 30 } }),
        }),
      }),
    })
    mockRpc.mockResolvedValue({ data: [{ new_balance: 100 }], error: null })

    await migrateLocalPoints('user-1')

    expect(mockRpc).toHaveBeenCalledWith('add_points', expect.objectContaining({
      p_amount: 70,
      p_type: 'admin',
    }))
    expect(localStorage.getItem('gto_user_points')).toBeNull()
  })

  it('migrateLocalPoints does nothing when no local points', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { points: 50 } }),
        }),
      }),
    })

    const result = await migrateLocalPoints('user-1')
    expect(mockRpc).not.toHaveBeenCalled()
    expect(result).toBe(50)
  })
})
