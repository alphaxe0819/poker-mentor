import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  name: string
  is_paid: boolean
  player_type: 'tournament' | 'cash'
  daily_plays_date: string | null
  daily_plays_count: number
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

// 檢查今天免費額度是否用完
export function isDailyLimitReached(profile: UserProfile): boolean {
  if (profile.is_paid) return false
  const today = new Date().toISOString().slice(0, 10)
  if (profile.daily_plays_date !== today) return false
  return profile.daily_plays_count >= 1  // 免費每天 1 關
}

// 更新每日關卡計數
export async function incrementDailyPlays(userId: string, profile: UserProfile): Promise<void> {
  const today = new Date().toISOString().slice(0, 10)
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
