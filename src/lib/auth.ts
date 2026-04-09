import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  name: string
  is_paid: boolean
  player_type: 'tournament' | 'cash'
  daily_plays_date: string | null
  daily_plays_count: number
  promo_expires_at: string | null
  quiz_style: string | null
  quiz_level: string | null
  quiz_dimensions: Record<string, number> | null
  last_login_date: string | null
  login_streak: number
  claimed_milestones: number[]
  referral_code: string | null
  referred_by: string | null
  coach_onboarding_done: boolean
}

/** 判斷用戶是否為付費狀態（訂閱 或 序號體驗有效） */
export function isUserPaid(profile: UserProfile): boolean {
  if (profile.is_paid) return true
  if (profile.promo_expires_at && new Date(profile.promo_expires_at) > new Date()) return true
  return false
}

// 取得當前用戶 profile
export async function getProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as UserProfile | null
}

function getLocalDateString(): string {
  const now = new Date()
  // 固定使用 UTC+8（台灣/東南亞時區）
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  return utc8.toISOString().slice(0, 10)
}

// 檢查今天免費額度是否用完（目前不限制）
export function isDailyLimitReached(_profile: UserProfile): boolean {
  return false
}

// 更新每日關卡計數
export async function incrementDailyPlays(userId: string, profile: UserProfile): Promise<void> {
  const today = getLocalDateString()
  const isNewDay = profile.daily_plays_date !== today

  await supabase
    .from('profiles')
    .update({
      daily_plays_date: today,
      daily_plays_count: isNewDay ? 1 : profile.daily_plays_count + 1,
    })
    .eq('id', userId)
}

// 儲存答題記錄（付費用戶）
export async function saveAnswerRecord(params: {
  userId: string
  dbKey: string
  hand: string
  chosenAction: string
  gtoAction: string
  isCorrect: boolean
  stackBb: number
  heroPos: string
  scenarioType: 'RFI' | 'vs_raise'
}): Promise<void> {
  await supabase.from('answer_records').insert({
    user_id:       params.userId,
    db_key:        params.dbKey,
    hand:          params.hand,
    chosen_action: params.chosenAction,
    gto_action:    params.gtoAction,
    is_correct:    params.isCorrect,
    stack_bb:      params.stackBb,
    hero_pos:      params.heroPos,
    scenario_type: params.scenarioType,
  })
}

export async function saveShareResult(params: {
  userId: string
  userName: string
  total: number
  correct: number
  score: number
  streak: number
  stackBb: number
}): Promise<string | null> {
  const accuracy = Math.round((params.correct / params.total) * 100)
  const { data, error } = await supabase
    .from('share_results')
    .insert({
      user_id:  params.userId,
      user_name: params.userName,
      total:    params.total,
      correct:  params.correct,
      score:    params.score,
      accuracy,
      streak:   params.streak,
      stack_bb: params.stackBb,
    })
    .select('id')
    .single()

  if (error || !data) return null
  return data.id
}

export async function getShareResult(id: string) {
  const { data } = await supabase
    .from('share_results')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getAnalysisUsage(userId: string, isPaid: boolean): Promise<{
  canUse: boolean
  remaining: number
  totalAnswered: number
  nextUnlockAt: number
}> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('analysis_count, analysis_daily_count, analysis_last_date, analysis_last_answered')
    .eq('id', userId)
    .single()

  if (!profile) return { canUse: false, remaining: 0, totalAnswered: 0, nextUnlockAt: 70 }

  const { data: records } = await supabase
    .from('answer_records')
    .select('id')
    .eq('user_id', userId)

  const totalAnswered = records?.length ?? 0
  const lastAnswered = profile.analysis_last_answered ?? 0
  const newSinceLast = totalAnswered - lastAnswered
  const nextUnlockAt = lastAnswered + 70

  if (isPaid) {
    const today = getLocalDateString()
    const isNewDay = profile.analysis_last_date !== today
    const used = isNewDay ? 0 : (profile.analysis_daily_count ?? 0)
    const remaining = 3 - used
    const hasEnoughNew = newSinceLast >= 70
    const canUse = remaining > 0 && hasEnoughNew
    return { canUse, remaining, totalAnswered, nextUnlockAt }
  } else {
    const used = profile.analysis_count ?? 0
    const unlockThreshold = (used + 1) * 70
    const canUse = totalAnswered >= unlockThreshold
    return { canUse, remaining: canUse ? 1 : 0, totalAnswered, nextUnlockAt: unlockThreshold }
  }
}

export async function incrementAnalysisUsage(userId: string, isPaid: boolean, totalAnswered: number): Promise<void> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('analysis_count, analysis_daily_count, analysis_last_date')
    .eq('id', userId)
    .single()

  if (!profile) return

  const today = getLocalDateString()

  if (isPaid) {
    const isNewDay = profile.analysis_last_date !== today
    await supabase.from('profiles').update({
      analysis_last_date: today,
      analysis_daily_count: isNewDay ? 1 : (profile.analysis_daily_count ?? 0) + 1,
      analysis_last_answered: totalAnswered,
    }).eq('id', userId)
  } else {
    await supabase.from('profiles').update({
      analysis_count: (profile.analysis_count ?? 0) + 1,
      analysis_last_answered: totalAnswered,
    }).eq('id', userId)
  }
}
