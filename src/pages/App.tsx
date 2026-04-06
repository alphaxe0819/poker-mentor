import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, isDailyLimitReached, incrementDailyPlays } from '../lib/auth'
import type { UserProfile } from '../lib/auth'
import type { User } from '@supabase/supabase-js'
import AuthPage from './AuthPage'
import UpgradePage from './UpgradePage'
import BottomNav from '../components/BottomNav'
import DailyLimitScreen from '../components/DailyLimitScreen'
import TrainTab from '../tabs/TrainTab'
import StatsTab from '../tabs/StatsTab'
import AnalysisTab from '../tabs/AnalysisTab'
import ProfileTab from '../tabs/ProfileTab'
import CourseTab from '../tabs/CourseTab'
import GuestTrainTab from '../tabs/GuestTrainTab'
import OnboardingScreen from '../components/OnboardingScreen'
import { loadPointsFromSupabase } from '../lib/points'
import { loadCourseProgressFromSupabase, markOnboardingDone as syncMarkOnboardingDone, loadOnboardingFromSupabase } from '../lib/courseSync'
import SharePage from './SharePage'
import AdminDashboard from './AdminDashboard'

type Tab = 'train' | 'course' | 'stats' | 'analysis' | 'profile'
type AppMode = 'loading' | 'auth' | 'guest' | 'onboarding' | 'app' | 'upgrade'

export default function App() {
  if (window.location.pathname === '/share') {
    return <SharePage />
  }

  if (window.location.pathname === '/admin') {
    return <AdminDashboard />
  }

  const [appMode,   setAppMode]   = useState<AppMode>('loading')
  const [user,      setUser]      = useState<User | null>(null)
  const [profile,   setProfile]   = useState<UserProfile | null>(null)
  const [tab,       setTab]       = useState<Tab>('train')
  const [showLimit, setShowLimit] = useState(false)

  async function initUser(userId: string) {
    // 從 Supabase 同步點數和課程進度
    await Promise.all([
      loadPointsFromSupabase(),
      loadCourseProgressFromSupabase(),
    ])
    const done = await loadOnboardingFromSupabase(userId)
    return done
  }

  useEffect(() => {
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
        const p = await getProfile()
        setProfile(p)
        setShowLimit(false)
        const onboardingDone = await initUser(session.user.id)
        // 不覆蓋正在進行中的 onboarding
        setAppMode(prev => prev === 'onboarding' ? prev : onboardingDone ? 'app' : 'onboarding')
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

    if (currentProfile.is_paid) return true

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
        onSuccess={() => setAppMode('app')}
        onGuest={() => setAppMode('guest')}
      />
    )
  }

  if (appMode === 'guest') {
    return (
      <GuestTrainTab
        onFinish={() => setAppMode('auth')}
        onRegister={() => setAppMode('auth')}
      />
    )
  }

  if (appMode === 'upgrade') {
    return <UpgradePage onBack={() => setAppMode('app')} />
  }

  if (appMode === 'onboarding' && user) {
    return (
      <OnboardingScreen
        userName={profile?.name ?? '玩家'}
        onComplete={() => {
          syncMarkOnboardingDone(user.id)
          setAppMode('app')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        <div style={{ display: tab === 'train' ? 'block' : 'none' }}>
          {showLimit ? (
            <DailyLimitScreen
              onUpgrade={() => { setShowLimit(false); setAppMode('upgrade') }}
            />
          ) : (
            <TrainTab
              isTabActive={tab === 'train'}
              guestMode={false}
              userId={user?.id ?? null}
              userName={profile?.name ?? '玩家'}
              isPaid={profile?.is_paid ?? false}
              onStartRound={handleStartRound}
              onRoundComplete={async () => {
                if (!user) return
                // 完成一關後才計數
                const currentProfile = await getProfile()
                if (currentProfile && !currentProfile.is_paid) {
                  await incrementDailyPlays(user.id, currentProfile)
                }
                const latestProfile = await getProfile()
                setProfile(latestProfile)
                if (!latestProfile || latestProfile.is_paid) return
                if (isDailyLimitReached(latestProfile)) {
                  setShowLimit(true)
                }
              }}
            />
          )}
        </div>
        {tab === 'course'   && <CourseTab />}
        {tab === 'stats'    && <StatsTab userId={user?.id ?? null} isPaid={profile?.is_paid ?? false} onNavigateAnalysis={() => setTab('analysis')} />}
        {tab === 'analysis' && <AnalysisTab userId={user?.id ?? null} isPaid={profile?.is_paid ?? false} />}
        {tab === 'profile'  && <ProfileTab />}
      </div>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  )
}
