import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Profile, TabId, Scenario } from '../types'
import { isDemoMode, supabase } from '../lib/supabase'
import { APP_VERSION } from '../version'
import { demoAuth, BUILTIN_ACCOUNTS } from '../lib/demoAuth'

import TrainTab from '../tabs/TrainTab'
import CoachListTab from '../tabs/CoachListTab'
import StatsTab from '../tabs/StatsTab'
import QuizTab from '../tabs/QuizTab'
import EditorTab from '../tabs/EditorTab'
import ProfileTab from '../tabs/ProfileTab'
import BottomNav from '../components/BottomNav'

// ─── App Page ─────────────────────────────────────────────────────────────────

const AppPage: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('train')
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedStack, setSelectedStack] = useState(0) // 0 = random
  const [quizTableType, setQuizTableType] = useState<'cash' | 'tournament'>('cash')
  const [loading, setLoading] = useState(true)

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check demo/built-in accounts first (localStorage session)
        const demoUser = demoAuth.getCurrentUser()
        const isBuiltinSession = demoUser && (demoUser.email.toLowerCase() in BUILTIN_ACCOUNTS)

        if (isDemoMode || isBuiltinSession) {
          if (!demoUser) {
            navigate('/')
            return
          }
          setProfile(demoUser)
        } else {
          const { data } = await supabase!.auth.getSession()
          if (!data.session) {
            navigate('/')
            return
          }

          const userId = data.session.user.id
          const { data: profileData } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          if (profileData) {
            setProfile(profileData)
          } else {
            // First login (e.g. Google OAuth) — create profile
            const user = data.session.user
            const newProfile = {
              id: userId,
              email: user.email ?? '',
              name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
              is_coach: false,
            }
            await supabase!.from('profiles').insert(newProfile)
            setProfile({ ...newProfile, created_at: new Date().toISOString() })
          }
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  const handleSelectScenario = useCallback((scenario: Scenario, stack?: number) => {
    setSelectedScenario(scenario)
    if (stack !== undefined) setSelectedStack(stack)
    if (scenario.gameType === 'tournament') {
      setQuizTableType('tournament')
    } else {
      setQuizTableType('cash')
    }
    setActiveTab('train')
  }, [])

  const handleGoToCoaches = useCallback(() => {
    setActiveTab('coaches')
  }, [])

  if (loading) {
    return (
      <div
        style={{
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            animation: 'pulse-glow 2s infinite',
          }}
        >
          ♠
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>載入中...</span>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'max(20px, env(safe-area-inset-top)) 16px 10px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            ♠
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            <span style={{ color: '#ffffff' }}>Poker</span>{' '}
            <span style={{ color: '#9775fa' }}>Mentor</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {profile.is_coach && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: 'white',
              }}
            >
              教練
            </span>
          )}
          {isDemoMode && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: 16,
                background: 'rgba(245,158,11,0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
            >
              DEMO
            </span>
          )}
          <span
            style={{
              fontSize: 10,
              color: '#44445a',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              padding: '2px 6px',
            }}
          >
            {APP_VERSION}
          </span>
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: activeTab === 'train' ? 'hidden' : 'auto',
          /* bottom padding = BottomNav height (~60px) + safe area */
          paddingBottom: 'calc(68px + env(safe-area-inset-bottom))',
        }}
      >
        {activeTab === 'train' && (
          <TrainTab
            scenario={selectedScenario}
            onSelectScenario={handleGoToCoaches}
            onSetScenario={handleSelectScenario}
            profile={profile}
            activeCoachId={selectedScenario?.coachSource ?? null}
            selectedStack={selectedStack}
            onBack={() => setActiveTab('coaches')}
          />
        )}
        {activeTab === 'coaches' && (
          <CoachListTab
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
          />
        )}
        {activeTab === 'stats' && <StatsTab profile={profile} />}
        {activeTab === 'quiz' && (
          <QuizTab
            onGoToTrain={() => setActiveTab('train')}
            tableType={quizTableType}
            onTableTypeChange={setQuizTableType}
          />
        )}
        {activeTab === 'editor' && <EditorTab isCoach={profile.is_coach} />}
        {activeTab === 'profile' && (
          <ProfileTab profile={profile} onProfileUpdate={setProfile} />
        )}
      </div>

      {/* ── Bottom navigation ────────────────────────────────────────────────── */}
      <BottomNav activeTab={activeTab} isCoach={profile.is_coach} onChange={setActiveTab} />
    </div>
  )
}

export default AppPage
