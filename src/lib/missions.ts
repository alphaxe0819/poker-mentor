import { supabase } from './supabase'
import { addPoints } from './points'

// ── Helpers ────────────────────────────────────────────

function getLocalDateString(): string {
  const now = new Date()
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  return utc8.toISOString().slice(0, 10)
}

// ── Types ──────────────────────────────────────────────

export interface MissionStatus {
  // Daily login
  loginToday: boolean
  loginStreak: number
  streakRewardAvailable: boolean  // streak reached 7 but not yet claimed this cycle
  // Milestones
  totalAnswered: number
  claimedMilestones: number[]
  unclaimedMilestones: number[]
  // Referral
  referralCode: string | null
  referralCount: number
  // Quiz
  quizCompleted: boolean
  quizRewardClaimed: boolean
}

export const MILESTONES = [100, 500, 1000, 5000] as const
export const MILESTONE_REWARDS: Record<number, number> = {
  100: 50,
  500: 150,
  1000: 300,
  5000: 1000,
}

// ── Daily Login ────────────────────────────────────────

/**
 * Check and process daily login. Call once per session on auth.
 * Returns points earned (0 if already logged in today).
 */
export async function checkDailyLogin(userId: string): Promise<{ earned: number; streak: number }> {
  const today = getLocalDateString()

  const { data: profile } = await supabase
    .from('profiles')
    .select('last_login_date, login_streak')
    .eq('id', userId)
    .single()

  if (!profile) return { earned: 0, streak: 0 }

  const lastDate = profile.last_login_date
  const oldStreak = profile.login_streak ?? 0

  // Already logged in today
  if (lastDate === today) return { earned: 0, streak: oldStreak }

  // Check if yesterday (streak continues) or gap (streak resets)
  const yesterday = new Date()
  yesterday.setTime(yesterday.getTime() + 8 * 60 * 60 * 1000)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const isConsecutive = lastDate === yesterdayStr
  const newStreak = isConsecutive ? oldStreak + 1 : 1

  // Update profile
  await supabase.from('profiles').update({
    last_login_date: today,
    login_streak: newStreak,
  }).eq('id', userId)

  // Award daily login points
  let earned = 0
  earned += 5
  await addPoints(userId, 5, 'daily_login', '每日登入 +5')

  // 7-day streak bonus (every 7 days)
  if (newStreak > 0 && newStreak % 7 === 0) {
    earned += 50
    await addPoints(userId, 50, 'login_streak', `連續登入 ${newStreak} 天獎勵 +50`)
  }

  return { earned, streak: newStreak }
}

// ── Milestones ─────────────────────────────────────────

/**
 * Check and claim available milestones.
 * Returns total points earned from newly claimed milestones.
 */
export async function claimMilestones(userId: string): Promise<{ earned: number; claimed: number[] }> {
  // Get total answered count
  const { data: records } = await supabase
    .from('answer_records')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const totalAnswered = (records as unknown as number) ?? 0

  // Actually get the count properly
  const { count } = await supabase
    .from('answer_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const total = count ?? 0

  // Get claimed milestones
  const { data: profile } = await supabase
    .from('profiles')
    .select('claimed_milestones')
    .eq('id', userId)
    .single()

  const claimed = profile?.claimed_milestones ?? []
  const newClaims: number[] = []
  let earned = 0

  for (const milestone of MILESTONES) {
    if (total >= milestone && !claimed.includes(milestone)) {
      const reward = MILESTONE_REWARDS[milestone]
      await addPoints(userId, reward, 'milestone', `累計答題 ${milestone} 題獎勵 +${reward}`)
      newClaims.push(milestone)
      earned += reward
    }
  }

  if (newClaims.length > 0) {
    await supabase.from('profiles').update({
      claimed_milestones: [...claimed, ...newClaims],
    }).eq('id', userId)
  }

  return { earned, claimed: newClaims }
}

// ── Quiz Reward ────────────────────────────────────────

/**
 * Claim quiz completion reward (+20 points, one-time).
 * Returns true if reward was claimed.
 */
export async function claimQuizReward(userId: string): Promise<boolean> {
  // Check if user has quiz result
  const { data: profile } = await supabase
    .from('profiles')
    .select('quiz_style')
    .eq('id', userId)
    .single()

  if (!profile?.quiz_style) return false

  // Check if already claimed
  const { data: existing } = await supabase
    .from('point_transactions')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'quiz')
    .limit(1)

  if (existing && existing.length > 0) return false

  await addPoints(userId, 20, 'quiz', '完成撲克 MBTI 測驗 +20')
  return true
}

// ── Referral ───────────────────────────────────────────

/**
 * Ensure user has a referral code. Generates one if missing.
 */
export async function ensureReferralCode(userId: string): Promise<string> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', userId)
    .single()

  if (profile?.referral_code) return profile.referral_code

  // Generate from user ID
  const code = userId.replace(/-/g, '').slice(0, 8).toUpperCase()

  const { error } = await supabase.from('profiles').update({
    referral_code: code,
  }).eq('id', userId)

  // If collision, try longer code
  if (error) {
    const longerCode = userId.replace(/-/g, '').slice(0, 12).toUpperCase()
    await supabase.from('profiles').update({
      referral_code: longerCode,
    }).eq('id', userId)
    return longerCode
  }

  return code
}

/**
 * Record referral for a new user (call during registration).
 * Returns the referrer's user ID if valid.
 */
export async function recordReferral(newUserId: string, referralCode: string): Promise<string | null> {
  // Find referrer
  const { data: referrer } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', referralCode)
    .single()

  if (!referrer) return null
  if (referrer.id === newUserId) return null // can't refer yourself

  // Record on new user's profile
  await supabase.from('profiles').update({
    referred_by: referrer.id,
  }).eq('id', newUserId)

  return referrer.id
}

/**
 * Reward the referrer after the referred user completes onboarding.
 */
export async function rewardReferrer(newUserId: string): Promise<void> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('referred_by')
    .eq('id', newUserId)
    .single()

  if (!profile?.referred_by) return

  // Check if already rewarded (prevent double reward)
  const { data: existing } = await supabase
    .from('point_transactions')
    .select('id')
    .eq('user_id', profile.referred_by)
    .eq('type', 'referral')
    .eq('reference_id', newUserId)
    .limit(1)

  if (existing && existing.length > 0) return

  await addPoints(profile.referred_by, 100, 'referral', '邀請好友註冊 +100', newUserId)
}

/**
 * Get referral count for a user.
 */
export async function getReferralCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', userId)

  return count ?? 0
}

// ── Full Mission Status ────────────────────────────────

/**
 * Get complete mission status for display.
 */
export async function getMissionStatus(userId: string): Promise<MissionStatus> {
  const today = getLocalDateString()

  const { data: profile } = await supabase
    .from('profiles')
    .select('last_login_date, login_streak, claimed_milestones, referral_code, quiz_style')
    .eq('id', userId)
    .single()

  const loginToday = profile?.last_login_date === today
  const loginStreak = profile?.login_streak ?? 0
  const claimed = profile?.claimed_milestones ?? []

  // Total answered
  const { count: totalAnswered } = await supabase
    .from('answer_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const total = totalAnswered ?? 0
  const unclaimed = MILESTONES.filter(m => total >= m && !claimed.includes(m))

  // Referral count
  const referralCount = await getReferralCount(userId)

  // Quiz reward check
  const quizCompleted = !!profile?.quiz_style
  let quizRewardClaimed = false
  if (quizCompleted) {
    const { data: existing } = await supabase
      .from('point_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'quiz')
      .limit(1)
    quizRewardClaimed = (existing?.length ?? 0) > 0
  }

  return {
    loginToday,
    loginStreak,
    streakRewardAvailable: loginStreak > 0 && loginStreak % 7 === 0 && loginToday,
    totalAnswered: total,
    claimedMilestones: claimed,
    unclaimedMilestones: unclaimed,
    referralCode: profile?.referral_code ?? null,
    referralCount,
    quizCompleted,
    quizRewardClaimed,
  }
}
