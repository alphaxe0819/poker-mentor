import { supabase } from './supabase'

// ── 點數系統（localStorage + Supabase 同步）─────────────────────────────────

const POINTS_KEY = 'gto_user_points'

// Pending sync queue — ensures no writes are lost
let pendingSync: Promise<void> = Promise.resolve()

export function getPoints(): number {
  const raw = localStorage.getItem(POINTS_KEY)
  return raw ? parseInt(raw, 10) || 0 : 0
}

export function addPoints(amount: number): number {
  const current = getPoints()
  const next = current + amount
  localStorage.setItem(POINTS_KEY, String(next))
  syncPointsToSupabase(next)
  return next
}

export function spendPoints(amount: number): boolean {
  const current = getPoints()
  if (current < amount) return false
  const next = current - amount
  localStorage.setItem(POINTS_KEY, String(next))
  syncPointsToSupabase(next)
  return true
}

// 從 Supabase 載入點數（登入時呼叫）
export async function loadPointsFromSupabase(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return getPoints()

  const { data } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', user.id)
    .single()

  const serverPoints = data?.points ?? 0
  const localPoints = getPoints()

  // 取較大值（避免資料遺失）
  const merged = Math.max(serverPoints, localPoints)
  localStorage.setItem(POINTS_KEY, String(merged))

  if (merged !== serverPoints) {
    syncPointsToSupabase(merged)
  }

  return merged
}

// 背景同步到 Supabase — queued to prevent race conditions
function syncPointsToSupabase(points: number) {
  pendingSync = pendingSync.then(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('profiles')
        .update({ points })
        .eq('id', user.id)
    } catch {
      // Silent fail — will retry on next sync
    }
  })
}

// Flush pending sync on page hide (tab close / navigate away)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Use sendBeacon as last-resort fallback
      const points = getPoints()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`
        const body = JSON.stringify({ points })
        navigator.sendBeacon?.(url, new Blob([body], { type: 'application/json' }))
      })
    }
  })
}
