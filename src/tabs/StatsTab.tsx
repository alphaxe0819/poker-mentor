import React, { useMemo, useState, useEffect } from 'react'
import type { Position, Profile } from '../types'
import { isDemoMode, supabase } from '../lib/supabase'

const POSITIONS: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']

interface SavedStats {
  total: number
  correct: number
  accuracy: number
  streak: number
  lastCoach?: string
}

interface RecentRecord {
  position: string
  hand: string
  action_taken: string
  correct_action: string
  is_correct: boolean
  stack_bb: number
  created_at: string
}

interface Props {
  profile?: Profile | null
}

function readLocalStats(): SavedStats | null {
  try {
    const raw = localStorage.getItem('gto_stats')
    if (!raw) return null
    const s = JSON.parse(raw) as SavedStats
    return s.total > 0 ? s : null
  } catch {
    return null
  }
}

function getBarColor(acc: number): string {
  if (acc < 70) return '#ef4444'
  if (acc < 85) return '#f59e0b'
  return '#10b981'
}

const StatsTab: React.FC<Props> = ({ profile }) => {
  const [cloudStats, setCloudStats] = useState<SavedStats | null>(null)
  const [positionStats, setPositionStats] = useState<Record<string, { total: number; correct: number }> | null>(null)
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([])
  const [loading, setLoading] = useState(false)

  // Load from Supabase if not demo mode and not a built-in demo account
  useEffect(() => {
    if (isDemoMode || !supabase || !profile?.id || profile.id.startsWith('demo_')) return

    setLoading(true)

    const loadCloud = async () => {
      try {
        // Total + correct count
        const { data: allRecords } = await supabase!
          .from('training_records')
          .select('position, is_correct')
          .eq('user_id', profile.id)

        if (allRecords && allRecords.length > 0) {
          const total = allRecords.length
          const correct = allRecords.filter(r => r.is_correct).length
          const accuracy = Math.round((correct / total) * 100)

          setCloudStats({
            total,
            correct,
            accuracy,
            streak: 0, // streak is session-based, keep from localStorage
          })

          // Position breakdown
          const posMap: Record<string, { total: number; correct: number }> = {}
          for (const r of allRecords) {
            if (!posMap[r.position]) posMap[r.position] = { total: 0, correct: 0 }
            posMap[r.position].total++
            if (r.is_correct) posMap[r.position].correct++
          }
          setPositionStats(posMap)
        }

        // Recent 20 records
        const { data: recent } = await supabase!
          .from('training_records')
          .select('position, hand, action_taken, correct_action, is_correct, stack_bb, created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (recent) setRecentRecords(recent)
      } finally {
        setLoading(false)
      }
    }

    loadCloud()
  }, [profile])

  // For demo mode, read from localStorage
  const localStats = useMemo(readLocalStats, [])
  const localPositionStats = useMemo(() => {
    try {
      const raw = localStorage.getItem('gto_position_stats')
      if (!raw) return null
      return JSON.parse(raw) as Record<string, { total: number; correct: number }>
    } catch {
      return null
    }
  }, [])

  // Decide which data source
  const useCloud = !isDemoMode && cloudStats !== null
  const stats = useCloud ? cloudStats : localStats
  const posStats = useCloud ? positionStats : localPositionStats

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-muted)',
          fontSize: 14,
        }}
      >
        載入統計資料中...
      </div>
    )
  }

  if (!stats) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '0 32px',
          textAlign: 'center',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 52 }}>📊</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
          尚無訓練紀錄
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          完成幾手練習後，
          <br />
          你的統計數據會顯示在這裡
        </p>
      </div>
    )
  }

  const { total, correct, accuracy, streak } = stats
  const errors = total - correct

  // GTO score circle
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (accuracy / 100) * circumference
  const scoreColor = getBarColor(accuracy)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 24px',
        gap: 14,
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
        訓練統計
        {useCloud && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', marginLeft: 8 }}>
            ☁️ 雲端
          </span>
        )}
      </h2>

      {/* Main score */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '20px',
        }}
      >
        {/* Circle */}
        <div style={{ position: 'relative', width: 116, height: 116, flexShrink: 0 }}>
          <svg width="116" height="116" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="58" cy="58" r={radius} fill="none" stroke="var(--border)" strokeWidth="9" />
            <circle
              cx="58"
              cy="58"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.7s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: '"IBM Plex Mono", monospace',
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {accuracy}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>GTO 準確率</div>
          </div>
        </div>

        {/* Summary numbers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {[
            { label: '總手數', value: total.toString(), color: 'var(--text-primary)' },
            { label: '正確', value: correct.toString(), color: '#10b981' },
            { label: '錯誤', value: errors.toString(), color: '#ef4444' },
            { label: '最長連勝', value: streak >= 1 ? `${streak}` : '0', color: '#f59e0b' },
          ].map(item => (
            <div
              key={item.label}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: '"IBM Plex Mono", monospace',
                  color: item.color,
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2x2 overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: '答對率', value: `${accuracy}%`, color: scoreColor, sub: `${correct}/${total}` },
          {
            label: '連勝紀錄',
            value: streak >= 1 ? `${streak}` : '0',
            color: streak >= 3 ? '#f59e0b' : 'var(--text-primary)',
            sub: streak >= 5 ? '強！' : streak >= 3 ? '不錯！' : '繼續加油',
          },
          {
            label: 'EV 損失',
            value: `${(errors * 0.15).toFixed(1)}bb`,
            color: '#f59e0b',
            sub: '估計值',
          },
          {
            label: '資料來源',
            value: useCloud ? '雲端' : '本機',
            color: 'var(--primary)',
            sub: useCloud ? 'Supabase' : 'localStorage',
            small: true,
          },
        ].map(item => (
          <div
            key={item.label}
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: item.small ? 14 : 22,
                fontWeight: 800,
                fontFamily: item.small ? 'Outfit, sans-serif' : '"IBM Plex Mono", monospace',
                color: item.color,
                lineHeight: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{item.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Position breakdown */}
      {posStats && (
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            位置別準確率
          </div>
          {POSITIONS.filter(pos => posStats[pos]).map(pos => {
            const { total: t, correct: c } = posStats[pos]
            const acc = Math.round((c / t) * 100)
            const barColor = getBarColor(acc)
            return (
              <div key={pos} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  {pos}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: 'var(--border)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${acc}%`,
                      background: barColor,
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 50,
                    fontSize: 11,
                    fontFamily: '"IBM Plex Mono", monospace',
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {t} 手
                </div>
                <div
                  style={{
                    width: 38,
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: '"IBM Plex Mono", monospace',
                    color: barColor,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {acc}%
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Recent 20 records (cloud only) */}
      {useCloud && recentRecords.length > 0 && (
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 4,
            }}
          >
            最近 20 手
          </div>
          {recentRecords.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 0',
                borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: r.is_correct ? '#10b981' : '#ef4444',
                  flexShrink: 0,
                }}
              />
              <span style={{ width: 32, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
                {r.position}
              </span>
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  width: 40,
                  flexShrink: 0,
                }}
              >
                {r.hand}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, flex: 1 }}>
                {r.action_taken === r.correct_action
                  ? r.action_taken
                  : `${r.action_taken} → ${r.correct_action}`}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: '"IBM Plex Mono", monospace',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                {r.stack_bb}bb
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      <div
        style={{
          padding: '14px',
          borderRadius: 14,
          border: '1px dashed rgba(255,255,255,0.06)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        持續練習可以解鎖更詳細的分析
        <br />
        <span style={{ fontSize: 11 }}>（位置別 / 手牌類型 / 趨勢圖）</span>
      </div>
    </div>
  )
}

export default StatsTab
