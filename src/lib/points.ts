import { supabase } from './supabase'

// ── Types ──────────────────────────────────────────────

export interface PointTransaction {
  id: string
  amount: number
  balance_after: number
  type: string
  description: string
  reference_id: string | null
  created_at: string
}

// ── Queries ────────────────────────────────────────────

/** Get current point balance from Supabase */
export async function getPoints(userId: string): Promise<number> {
  const { data } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single()
  return data?.points ?? 0
}

/** Get recent transaction history */
export async function getTransactionHistory(
  userId: string,
  limit = 20
): Promise<PointTransaction[]> {
  const { data } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as PointTransaction[]
}

// ── Mutations (atomic via RPC) ─────────────────────────

/** Add points atomically. Returns new balance. */
export async function addPoints(
  userId: string,
  amount: number,
  type: string,
  description: string,
  referenceId?: string
): Promise<number> {
  const { data, error } = await supabase.rpc('add_points', {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
    p_reference_id: referenceId ?? null,
  })
  if (error) throw new Error(`addPoints failed: ${error.message}`)
  return data?.[0]?.new_balance ?? 0
}

/** Spend points atomically. Returns success and new balance. */
export async function spendPoints(
  userId: string,
  amount: number,
  type: string,
  description: string
): Promise<{ success: boolean; balance: number }> {
  const { data, error } = await supabase.rpc('spend_points', {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
  })
  if (error) throw new Error(`spendPoints failed: ${error.message}`)
  const row = data?.[0]
  return { success: row?.success ?? false, balance: row?.new_balance ?? 0 }
}

// ── Migration helper ───────────────────────────────────

/**
 * One-time migration: move localStorage points to Supabase.
 * Called on login. After migration, clears localStorage.
 */
export async function migrateLocalPoints(userId: string): Promise<number> {
  const LEGACY_KEY = 'gto_user_points'
  const raw = localStorage.getItem(LEGACY_KEY)
  const localPoints = raw ? parseInt(raw, 10) || 0 : 0

  if (localPoints > 0) {
    const serverPoints = await getPoints(userId)
    if (localPoints > serverPoints) {
      const diff = localPoints - serverPoints
      await addPoints(userId, diff, 'admin', `從本地遷移 ${diff} 點`)
    }
  }

  localStorage.removeItem(LEGACY_KEY)
  return getPoints(userId)
}
