import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, isDailyLimitReached, incrementDailyPlays, isUserPaid } from '../lib/auth'
import type { UserProfile } from '../lib/auth'
import type { User } from '@supabase/supabase-js'
import type { MatchState } from '../lib/hu/types'
import type { FlagsByHand } from '../components/HeadsUpMatchScreen'
import AuthPage from './AuthPage'
import BottomNav from '../components/BottomNav'
import DailyLimitScreen from '../components/DailyLimitScreen'
import TrainTab from '../tabs/TrainTab'
import TrainTabV2 from '../tabs/TrainTabV2'
import { FEATURE_FLAGS } from '../lib/featureFlags'
import QuizScreen from '../components/QuizScreen'
import QuizDetailScreen from '../components/QuizDetailScreen'
import OnboardingScreen from '../components/OnboardingScreen'
import { loadCourseProgressFromSupabase, markOnboardingDone as syncMarkOnboardingDone, loadOnboardingFromSupabase } from '../lib/courseSync'
import { initLemonSqueezy, getSubscription, isSubscriptionActive } from '../lib/lemonsqueezy'
import { HU_ENTRY_COST } from '../lib/hu/config'

// Lazy-loaded tabs & pages (code splitting)
const StatsTab       = lazy(() => import('../tabs/StatsTab'))
const AnalysisTab    = lazy(() => import('../tabs/AnalysisTab'))
const ProfileTab     = lazy(() => import('../tabs/ProfileTab'))
const CourseTab      = lazy(() => import('../tabs/CourseTab'))
const CoachScreen    = lazy(() => import('../components/CoachScreen'))
const UpgradePage    = lazy(() => import('./UpgradePage'))
const SharePage      = lazy(() => import('./SharePage'))
const AdminDashboard = lazy(() => import('./AdminDashboard'))
const ChangelogPage  = lazy(() => import('./ChangelogPage'))
const V2DemoPage     = lazy(() => import('./V2DemoPage'))
const HeadsUpScenarioSelect = lazy(() => import('../components/HeadsUpScenarioSelect'))
const HeadsUpMatchScreen    = lazy(() => import('../components/HeadsUpMatchScreen'))
const HeadsUpMatchScreenV2  = lazy(() => import('../components/v2/HeadsUpMatchScreenV2'))
const HeadsUpReviewScreen   = lazy(() => import('../components/HeadsUpReviewScreen'))

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-gray-600 text-sm">載入中...</div>
  </div>
)

/** Derive hero win/loss from in-memory hand state (post-resolve). */
async function computeHeroWonForHand(hand: import('../lib/hu/types').HandState): Promise<boolean> {
  if (hand.villain.hasFolded) return true
  if (hand.hero.hasFolded) return false
  // Showdown: re-evaluate hand strengths
  const { evaluateHand, compareHands } = await import('../lib/hu/handEvaluator')
  const heroBest = evaluateHand([...hand.hero.holeCards, ...hand.board])
  const villainBest = evaluateHand([...hand.villain.holeCards, ...hand.board])
  return compareHands(heroBest, villainBest) > 0
}

type Tab = 'coach' | 'train' | 'stats' | 'analysis' | 'profile'
type TrainSubTab = 'practice' | 'course'
type AppMode = 'loading' | 'auth' | 'guest' | 'quiz-detail' | 'onboarding' | 'app' | 'upgrade' | 'hu-select' | 'hu-match' | 'hu-review'

export default function App() {
  if (window.location.pathname === '/share') {
    return <Suspense fallback={<LazyFallback />}><SharePage /></Suspense>
  }

  if (window.location.pathname === '/admin') {
    return <Suspense fallback={<LazyFallback />}><AdminDashboard /></Suspense>
  }

  if (window.location.pathname === '/changelog') {
    return <Suspense fallback={<LazyFallback />}><ChangelogPage /></Suspense>
  }

  if (window.location.pathname === '/v2-demo') {
    return <Suspense fallback={<LazyFallback />}><V2DemoPage /></Suspense>
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
  const [huConfig, setHuConfig] = useState<import('../lib/hu/types').MatchConfig | null>(null)
  const [huFinalMatch, setHuFinalMatch] = useState<import('../lib/hu/types').MatchState | null>(null)
  const [huSessionId, setHuSessionId] = useState<string | null>(null)
  const [huFlagsByHand, setHuFlagsByHand] = useState<FlagsByHand>({})
  // huAIBookmarks passed to HeadsUpReviewScreenV2 in Task 8
  // @ts-expect-error TS6133 - used in Task 8
  const [huAIBookmarks, setHuAIBookmarks] = useState<number[]>([])

  const handleHuAbandon = useCallback(() => {
    // Fire-and-forget abandon finalization (non-blocking, non-fatal)
    if (huSessionId && huConfig) {
      import('../lib/hu/sessionStorage').then(async ({ finalizeSession }) => {
        const abandonedMatch: MatchState = {
          config: huConfig,
          handHistory: [],
          currentHand: null,
          playerStackBB: 0,
          botStackBB: 0,
          result: 'in_progress',
          analysisPointsSpent: 0,
          violationPoints: 0,
        }
        try {
          await finalizeSession(huSessionId, abandonedMatch)
        } catch (e) {
          console.error('abandon finalize failed:', e)
        }
      })
    }
    setAppMode('app')
    setHuConfig(null)
    setHuSessionId(null)
    setHuAIBookmarks([])
  }, [huSessionId, huConfig])

  const refreshPoints = useCallback(async () => {
    if (!user) return
    const { getPoints } = await import('../lib/points')
    const p = await getPoints(user.id)
    setPoints(p)
  }, [user])

  const handleHuMatchComplete = useCallback(async (finalState: MatchState, flagsByHand: FlagsByHand, aiBookmarks: number[] = []) => {
    // Charge violation points if any
    if (finalState.violationPoints > 0 && user) {
      try {
        const { spendPoints } = await import('../lib/points')
        await spendPoints(
          user.id,
          finalState.violationPoints,
          'hu_violation',
          `HU 違規金 ${finalState.violationPoints} 點`
        )
        // Refresh balance after deduction
        await refreshPoints()
      } catch (e) {
        console.error('violation points charge failed:', e)
      }
    }

    // Persist hands + finalize session (non-fatal on error)
    if (huSessionId) {
      try {
        const { finalizeSession, logHand } = await import('../lib/hu/sessionStorage')
        for (const hand of finalState.handHistory) {
          const heroWon = await computeHeroWonForHand(hand)
          const flags = flagsByHand[hand.handNumber] ?? []
          await logHand(huSessionId, hand, 0, 0, heroWon, flags)
        }
        await finalizeSession(huSessionId, finalState)
      } catch (e) {
        console.error('session persist failed:', e)
      }
    }

    // Store flags alongside match for the review screen
    setHuFlagsByHand(flagsByHand)
    setHuFinalMatch(finalState)
    setHuAIBookmarks(aiBookmarks)
    setAppMode('hu-review')
  }, [huSessionId, user, refreshPoints])

  const navigateToMissions = useCallback(() => setTab('profile'), [])

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

  // ── HU simulator: scenario select ──
  if (appMode === 'hu-select' && user) {
    return (
      <Suspense fallback={<LazyFallback />}>
        <HeadsUpScenarioSelect
          userPoints={points}
          entryCost={HU_ENTRY_COST}
          onCancel={() => setAppMode('app')}
          onConfirm={async (config) => {
            // Spend entry fee atomically via RPC
            const { spendPoints } = await import('../lib/points')
            const result = await spendPoints(
              user.id,
              HU_ENTRY_COST,
              'hu_entry',
              'HU 對決入場'
            )
            if (!result.success) {
              alert('點數不足')
              return
            }
            setPoints(result.balance)
            // Create DB session + run retention cleanup
            const { createSession, runRetentionCleanup } = await import('../lib/hu/sessionStorage')
            try {
              const session = await createSession(user.id, config, HU_ENTRY_COST)
              setHuSessionId(session.id)
              await runRetentionCleanup(user.id)
            } catch (e) {
              console.error('createSession failed:', e)
              setHuSessionId(null)
            }
            setHuConfig(config)
            setAppMode('hu-match')
          }}
        />
      </Suspense>
    )
  }

  // ── HU simulator: live match ──
  if (appMode === 'hu-match' && huConfig && user) {
    const HuScreen = FEATURE_FLAGS.UI_V2 ? HeadsUpMatchScreenV2 : HeadsUpMatchScreen
    return (
      <Suspense fallback={<LazyFallback />}>
        <HuScreen
          config={huConfig}
          personality="standard"
          onAbandon={handleHuAbandon}
          onMatchComplete={handleHuMatchComplete}
        />
      </Suspense>
    )
  }

  // ── HU simulator: post-game review ──
  if (appMode === 'hu-review' && huFinalMatch && user) {
    const userTier: 'free' | 'basic' | 'pro' =
      profile && isUserPaid(profile) ? 'pro' : 'free'
    return (
      <Suspense fallback={<LazyFallback />}>
        <HeadsUpReviewScreen
          match={huFinalMatch}
          userTier={userTier}
          gtoFlagsByHand={huFlagsByHand}
          onAnalyzeHand={async (idx) => {
            const { analyzeHand } = await import('../lib/hu/analyzeHand')
            const { formatCard, formatBoard } = await import('../lib/hu/cards')
            const hand = huFinalMatch.handHistory[idx]
            const bothShown = !hand.hero.hasFolded && !hand.villain.hasFolded
            const result = await analyzeHand({
              userId: user.id,
              sessionId: huSessionId ?? '',
              handIndex: idx,
              handData: {
                hero_position: hand.hero.position,
                hero_cards: hand.hero.holeCards.map(formatCard).join(''),
                villain_cards: bothShown
                  ? hand.villain.holeCards.map(formatCard).join('')
                  : null,
                board: hand.board.length > 0 ? formatBoard(hand.board) : null,
                action_sequence: hand.actions,
                pot_total_bb: Math.round(hand.potBB),
                hero_won: await computeHeroWonForHand(hand),
              },
            })
            await refreshPoints()
            return result.analysis
          }}
          onBack={() => {
            setAppMode('app')
            setHuConfig(null)
            setHuFinalMatch(null)
            setHuSessionId(null)
            setHuFlagsByHand({})
            setHuAIBookmarks([])
          }}
        />
      </Suspense>
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
            ) : FEATURE_FLAGS.UI_V2 ? (
              <TrainTabV2
                isTabActive={tab === 'train' && trainSubTab === 'practice'}
                guestMode={false}
                userId={user?.id ?? null}
                userName={profile?.name ?? '玩家'}
                isPaid={profile ? isUserPaid(profile) : false}
                points={points}
                onStartRound={handleStartRound}
                onPointsChanged={refreshPoints}
                onNavigateToMissions={navigateToMissions}
                onNavigateToHU={() => setAppMode('hu-select')}
                onRoundComplete={async () => {
                  if (!user) return
                  const currentProfile = await getProfile()
                  if (currentProfile && !isUserPaid(currentProfile)) {
                    await incrementDailyPlays(user.id, currentProfile)
                  }
                  const latestProfile = await getProfile()
                  if (latestProfile) setProfile(latestProfile)
                }}
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
                onNavigateToMissions={navigateToMissions}
                onNavigateToHU={() => setAppMode('hu-select')}
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
              <CourseTab points={points} userId={user?.id ?? null} onPointsChanged={refreshPoints} onNavigateToMissions={navigateToMissions} />
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
                onNavigateToMissions={navigateToMissions}
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
          {tab === 'analysis' && <AnalysisTab userId={user?.id ?? null} isPaid={profile ? isUserPaid(profile) : false} points={points} onPointsChanged={refreshPoints} onNavigateToMissions={navigateToMissions} />}
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
