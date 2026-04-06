import { supabase } from './supabase'

// ── 課程進度同步（localStorage + Supabase）──────────────────────────────────

// 取得課程完成數
export function getCourseProgress(courseId: string, total: number): number {
  try {
    const raw = localStorage.getItem(`course_progress_${courseId}`)
    if (!raw) return 0
    const data = JSON.parse(raw)
    return typeof data.completed === 'number' ? Math.min(data.completed, total) : 0
  } catch {
    return 0
  }
}

// 儲存課程進度（同時寫 localStorage + Supabase）
export function saveCourseProgress(courseId: string, completed: number, correct: number, total: number) {
  localStorage.setItem(`course_progress_${courseId}`, JSON.stringify({
    completed, correct, total, lastPlayed: Date.now(),
  }))
  syncCourseProgressToSupabase(courseId, completed, correct, total)
}

// 課程是否已解鎖（高階課程）
export function isCourseUnlocked(courseId: string): boolean {
  return localStorage.getItem(`course_unlocked_${courseId}`) === '1'
}

// 標記課程已解鎖
export function markCourseUnlocked(courseId: string) {
  localStorage.setItem(`course_unlocked_${courseId}`, '1')
  syncCourseUnlockToSupabase(courseId)
}

// 從 Supabase 載入所有課程進度（登入時呼叫）
export async function loadCourseProgressFromSupabase(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)

  if (!data) return

  for (const row of data) {
    // 合併：取較大的完成數
    const localCompleted = getCourseProgress(row.course_id, row.total)
    const serverCompleted = row.completed ?? 0

    if (serverCompleted > localCompleted) {
      localStorage.setItem(`course_progress_${row.course_id}`, JSON.stringify({
        completed: serverCompleted,
        correct: row.correct ?? 0,
        total: row.total ?? 0,
        lastPlayed: row.last_played_at ? new Date(row.last_played_at).getTime() : Date.now(),
      }))
    }

    if (row.unlocked) {
      localStorage.setItem(`course_unlocked_${row.course_id}`, '1')
    }
  }
}

// ── 背景同步 ─────────────────────────────────────────────────────────────────

function syncCourseProgressToSupabase(courseId: string, completed: number, correct: number, total: number) {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return
    supabase
      .from('course_progress')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        completed,
        correct,
        total,
        last_played_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' })
      .then(() => {})
  })
}

function syncCourseUnlockToSupabase(courseId: string) {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return
    supabase
      .from('course_progress')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        unlocked: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' })
      .then(() => {})
  })
}

// 新手教學同步
export function markOnboardingDone(userId: string) {
  localStorage.setItem(`onboarding_done_${userId}`, '1')
  supabase
    .from('profiles')
    .update({ onboarding_done: true })
    .eq('id', userId)
    .then(() => {})
}

export async function loadOnboardingFromSupabase(userId: string): Promise<boolean> {
  const local = localStorage.getItem(`onboarding_done_${userId}`) === '1'
  if (local) return true

  const { data } = await supabase
    .from('profiles')
    .select('onboarding_done')
    .eq('id', userId)
    .single()

  if (data?.onboarding_done) {
    localStorage.setItem(`onboarding_done_${userId}`, '1')
    return true
  }
  return false
}
