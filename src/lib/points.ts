import { supabase } from './supabase'

// ── 點數系統（localStorage + Supabase 同步）─────────────────────────────────

const POINTS_KEY = 'gto_user_points'

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

// 背景同步到 Supabase
function syncPointsToSupabase(points: number) {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return
    supabase
      .from('profiles')
      .update({ points })
      .eq('id', user.id)
      .then(() => {})
  })
}
