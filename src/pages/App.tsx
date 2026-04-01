import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, isDailyLimitReached, incrementDailyPlays } from '../lib/auth'
import type { UserProfile } from '../lib/auth'
import type { User } from '@supabase/supabase-js'
import AuthPage from './AuthPage'
import UpgradePage from './UpgradePage'
import BottomNav from '../components/BottomNav'
import DailyLimitScreen from '../components/DailyLimitScreen'
import TrainTab from '../tabs/TrainTab'
import QuizTab from '../tabs/QuizTab'
import CoachListTab from '../tabs/CoachListTab'
import StatsTab from '../tabs/StatsTab'
import ProfileTab from '../tabs/ProfileTab'
import GuestTrainTab from '../tabs/GuestTrainTab'
import SharePage from './SharePage'

type Tab = 'train' | 'quiz' | 'coach' | 'stats' | 'profile'
type AppMode = 'loading' | 'auth' | 'guest' | 'app' | 'upgrade'

export default function App() {
  // 分享頁面不需要 auth，直接渲染
  if (window.location.pathname === '/share') {
    return <SharePage />
  }

  const [appMode,  setAppMode]  = useState<AppMode>('loading')
  const [user,     setUser]     = useState<User | null>(null)
  const [profile,  setProfile]  = useState<UserProfile | null>(null)
  const [tab,      setTab]      = useState<Tab>('train')
  const [showLimit, setShowLimit] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        const p = await getProfile()
        setProfile(p)
        setAppMode('app')
      } else {
        setAppMode('auth')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        setUser(session.user)
        const p = await getProfile()
        setProfile(p)
        setAppMode('app')
      } else {
        setUser(null)
        setProfile(null)
        setAppMode('auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 開始新關卡時檢查每日限制
  const handleStartRound = async (): Promise<boolean> => {
    if (!profile || !user) return false
    if (profile.is_paid) return true

    if (isDailyLimitReached(profile)) {
      setShowLimit(true)
      return false
    }

    await incrementDailyPlays(user.id, profile)
    // 更新本地 profile
    const p = await getProfile()
    setProfile(p)
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

  if (showLimit) {
    return (
      <DailyLimitScreen
        onUpgrade={() => { setShowLimit(false); setAppMode('upgrade') }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'train'   && (
          <TrainTab
            guestMode={false}
            userId={user?.id ?? null}
            userName={profile?.name ?? '玩家'}
            isPaid={profile?.is_paid ?? false}
            onStartRound={handleStartRound}
            onRoundComplete={async () => {
              const allowed = await handleStartRound()
              if (!allowed) return
            }}
          />
        )}
        {tab === 'quiz'    && <QuizTab />}
        {tab === 'coach'   && <CoachListTab />}
        {tab === 'stats'   && <StatsTab userId={user?.id ?? null} isPaid={profile?.is_paid ?? false} />}
        {tab === 'profile' && <ProfileTab />}
      </div>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  )
}
