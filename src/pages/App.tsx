import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, isDailyLimitReached, incrementDailyPlays, isUserPaid } from '../lib/auth'
import type { UserProfile } from '../lib/auth'
import type { User } from '@supabase/supabase-js'
import AuthPage from './AuthPage'
import BottomNav from '../components/BottomNav'
import DailyLimitScreen from '../components/DailyLimitScreen'
import TrainTab from '../tabs/TrainTab'
import QuizScreen from '../components/QuizScreen'
import QuizDetailScreen from '../components/QuizDetailScreen'
import OnboardingScreen from '../components/OnboardingScreen'
import { loadCourseProgressFromSupabase, markOnboardingDone as syncMarkOnboardingDone, loadOnboardingFromSupabase } from '../lib/courseSync'
import { initLemonSqueezy, getSubscription, isSubscriptionActive } from '../lib/lemonsqueezy'

// Lazy-loaded tabs & pages (code splitting)
const StatsTab       = lazy(() => import('../tabs/StatsTab'))
const AnalysisTab    = lazy(() => import('../tabs/AnalysisTab'))
const ProfileTab     = lazy(() => import('../tabs/ProfileTab'))
const CourseTab      = lazy(() => import('../tabs/CourseTab'))
const CoachScreen    = lazy(() => import('../components/CoachScreen'))
const UpgradePage    = lazy(() => import('./UpgradePage'))
const SharePage      = lazy(() => import('./SharePage'))
const AdminDashboard = lazy(() => import('./AdminDashboard'))

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-gray-600 text-sm">載入中...</div>
  </div>
)

type Tab = 'coach' | 'train' | 'stats' | 'analysis' | 'profile'
type TrainSubTab = 'practice' | 'course'
type AppMode = 'loading' | 'auth' | 'guest' | 'quiz-detail' | 'onboarding' | 'app' | 'upgrade'

export default function App() {
  if (window.location.pathname === '/share') {
    return <Suspense fallback={<LazyFallback />}><SharePage /></Suspense>
  }

  if (window.location.pathname === '/admin') {
    return <Suspense fallback={<LazyFallback />}><AdminDashboard /></Suspense>
  }

  const [appMode,   setAppMode]   = useState<AppMode>('loading')
  const [user,      setUser]      = useState<User | null>(null)
  const [profile,   setProfile]   = useState<UserProfile | null>(null)
  const [tab,       setTab]       = useState<Tab>('train')
  const [trainSubTab, setTrainSubTab] = useState<TrainSubTab>('practice')
  const [showLimit, setShowLimit] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login')
  const [points, setPoints] = useState(0)
  const [pendingQuizResult, setPendingQuizResult] = useState<import('../data/quizQuestions').QuizResult | null>(null)
  const [postQuizMode, setPostQuizMode] = useState<'onboarding' | 'app'>('app')

  const refreshPoints = useCallback(async () => {
    if (!user) return
    const { getPoints } = await import('../lib/points')
    const p = await getPoints(user.id)
    setPoints(p)
  }, [user])

  // Checkout 完成後刷新訂閱狀態
  const refreshSubscription = async () => {
    if (!user) return
    const sub = await getSubscription(user.id)
    if (sub && isSubscriptionActive(sub)) {
      const p = await getProfile()
      setProfile(p)
      setShowLimit(false)
      setAppMode('app')
    }
  }

  async function initUser(userId: string) {
    const [migratedPoints] = await Promise.all([
      import('../lib/points').then(m => m.migrateLocalPoints(userId)),
      loadCourseProgressFromSupabase(),
    ])
    setPoints(migratedPoints)

    // Daily login + auto-claim quiz reward (fire and forget, don't block)
    import('../lib/missions').then(async (m) => {
      await m.checkDailyLogin(userId)
      await m.claimQuizReward(userId)
      // Refresh points after potential rewards
      const { getPoints } = await import('../lib/points')
      const p = await getPoints(userId)
      setPoints(p)
    })

    const done = await loadOnboardingFromSupabase(userId)
    return done
  }

  useEffect(() => {
    // 初始化 Lemon Squeezy checkout overlay
    initLemonSqueezy(refreshSubscription)

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        const p = await getProfile()
        setProfile(p)
        const onboardingDone = await initUser(data.session.user.id)
        setAppMode(onboardingDone ? 'app' : 'onboarding')
      } else {
        setAppMode('auth')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        setUser(session.user)
        // 新用戶的 profile 可能還沒建好（Google OAuth 或註冊延遲）
        let p = await getProfile()
        if (!p) {
          await new Promise(r => setTimeout(r, 1000))
          p = await getProfile()
        }
        // 如果仍然沒有 profile（Google 登入首次），自動建立
        if (!p && session.user.email) {
          await supabase.from('profiles').upsert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            is_paid: false,
            player_type: 'tournament',
            daily_plays_count: 0,
            onboarding_done: false,
          })
          p = await getProfile()
        }
        // Process pending referral (from Google OAuth)
        const pendingRef = localStorage.getItem('pending_referral')
        if (pendingRef && session.user) {
          import('../lib/missions').then(m => m.recordReferral(session.user!.id, pendingRef))
          localStorage.removeItem('pending_referral')
        }
        // Sync quiz result from localStorage to profile (must run after profile exists)
        let hasQuizResult = false
        if (p && session.user) {
          const { loadQuizResultLocal, clearQuizResultLocal, computeQuizResult: _c } = await import('../data/quizQuestions')
          const quizResult = loadQuizResultLocal()
          if (quizResult) {
            await supabase.from('profiles').update({
              quiz_style: quizResult.style,
              quiz_level: quizResult.level,
              quiz_dimensions: quizResult.dimensions,
            }).eq('id', session.user.id)
            clearQuizResultLocal()
            p = await getProfile()
            setPendingQuizResult(quizResult)
            hasQuizResult = true
          }
        }
        setProfile(p)
        setShowLimit(false)
        const onboardingDone = await initUser(session.user.id)
        setTab('train')
        if (hasQuizResult) {
          // Show quiz detail screen first, then proceed to onboarding or app
          setPostQuizMode(onboardingDone ? 'app' : 'onboarding')
          setAppMode('quiz-detail')
        } else {
          // 不覆蓋正在進行中的 onboarding
          setAppMode(prev => prev === 'onboarding' ? prev : onboardingDone ? 'app' : 'onboarding')
        }
      } else {
        setUser(null)
        setProfile(null)
        setShowLimit(false)
        setAppMode('auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleStartRound = async (): Promise<boolean> => {
    if (!user) return false

    let currentProfile = profile
    if (!currentProfile) {
      currentProfile = await getProfile()
      setProfile(currentProfile)
    }

    if (!currentProfile) return true

    if (isUserPaid(currentProfile)) return true

    if (isDailyLimitReached(currentProfile)) {
      setShowLimit(true)
      return false
    }

    // 計數移到 onRoundComplete，開始時只檢查額度
    return true
  }

  if (appMode === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
           style={{ background: '#0a0a0a' }}>
        <div className="text-gray-600 text-sm">載入中...</div>
        <button
          onClick={() => {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
          }}
          className="text-xs text-gray-700 underline mt-4">
          卡住了？點此重新載入
        </button>
      </div>
    )
  }

  if (appMode === 'auth') {
    return (
      <AuthPage
        initialMode={authInitialMode}
        onSuccess={() => { setTab('train'); setAppMode('app') }}
        onGuest={() => setAppMode('guest')}
      />
    )
  }

  if (appMode === 'guest') {
    return (
      <QuizScreen
        onFinish={() => { setAuthInitialMode('login'); setAppMode('auth') }}
        onRegister={() => { setAuthInitialMode('register'); setAppMode('auth') }}
      />
    )
  }

  if (appMode === 'quiz-detail' && pendingQuizResult) {
    return (
      <QuizDetailScreen
        result={pendingQuizResult}
        onContinue={() => {
          setPendingQuizResult(null)
          setTab('train')
          setTrainSubTab('course')
          if (postQuizMode === 'onboarding' && user) {
            setAppMode('onboarding')
          } else {
            setAppMode('app')
          }
        }}
      />
    )
  }

  if (appMode === 'upgrade') {
    return (
      <Suspense fallback={<LazyFallback />}>
        <UpgradePage
          onBack={() => setAppMode('app')}
          userId={user?.id ?? ''}
          userEmail={user?.email ?? ''}
          onRedeemed={async () => {
            const p = await getProfile()
            setProfile(p)
            setAppMode('app')
          }}
        />
      </Suspense>
    )
  }

  if (appMode === 'onboarding' && user) {
    return (
      <OnboardingScreen
        userName={profile?.name ?? '玩家'}
        quizStyle={profile?.quiz_style}
        quizLevel={profile?.quiz_level}
        onComplete={() => {
          syncMarkOnboardingDone(user.id)
          // Reward referrer if this user was referred
          import('../lib/missions').then(m => m.rewardReferrer(user.id))
          setAppMode('app')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        <div style={{ display: tab === 'train' ? 'block' : 'none' }}>
          {/* Sub-tab toggle: 練習 / 課程 */}
          <div className="flex px-4 pt-3 pb-1 gap-1">
            {([['practice', '練習'], ['course', '課程']] as [TrainSubTab, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setTrainSubTab(key)}
                className="flex-1 py-2 rounded-full text-xs font-medium transition"
                style={{
                  background: trainSubTab === key ? '#7c3aed' : '#111',
                  color: trainSubTab === key ? '#fff' : '#555',
                }}>
                {label}
              </button>
            ))}
          </div>

          {trainSubTab === 'practice' && (
            showLimit ? (
              <DailyLimitScreen
                onUpgrade={() => { setShowLimit(false); setAppMode('upgrade') }}
              />
            ) : (
              <TrainTab
                isTabActive={tab === 'train' && trainSubTab === 'practice'}
                guestMode={false}
                userId={user?.id ?? null}
                userName={profile?.name ?? '玩家'}
                isPaid={profile ? isUserPaid(profile) : false}
                points={points}
                onStartRound={handleStartRound}
                onPointsChanged={refreshPoints}
                onRoundComplete={async () => {
                  if (!user) return
                  const currentProfile = await getProfile()
                  if (currentProfile && !isUserPaid(currentProfile)) {
                    await incrementDailyPlays(user.id, currentProfile)
                  }
                  const latestProfile = await getProfile()
                  setProfile(latestProfile)
                  if (!latestProfile || isUserPaid(latestProfile)) return
                  if (isDailyLimitReached(latestProfile)) {
                    setShowLimit(true)
                  }
                }}
              />
            )
          )}

          {trainSubTab === 'course' && (
            <Suspense fallback={<LazyFallback />}>
              <CourseTab points={points} userId={user?.id ?? null} onPointsChanged={refreshPoints} />
            </Suspense>
          )}
        </div>
        {user && (
          <div style={{ display: tab === 'coach' ? 'block' : 'none' }}>
            <Suspense fallback={<LazyFallback />}>
              <CoachScreen
                userId={user.id}
                points={points}
                coachOnboardingDone={profile?.coach_onboarding_done ?? false}
                onPointsChanged={refreshPoints}
                onOnboardingDone={async () => {
                  const p = await getProfile()
                  setProfile(p)
                }}
              />
            </Suspense>
          </div>
        )}
        <Suspense fallback={<LazyFallback />}>
          {tab === 'stats'    && <StatsTab userId={user?.id ?? null} isPaid={profile ? isUserPaid(profile) : false} onNavigateAnalysis={() => setTab('analysis')} />}
          {tab === 'analysis' && <AnalysisTab userId={user?.id ?? null} isPaid={profile ? isUserPaid(profile) : false} points={points} onPointsChanged={refreshPoints} />}
          {tab === 'profile'  && <ProfileTab points={points} userId={user?.id ?? null} onPointsChanged={refreshPoints} onPromoRedeemed={async () => {
            const p = await getProfile()
            setProfile(p)
          }} />}
        </Suspense>
      </div>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  )
}
