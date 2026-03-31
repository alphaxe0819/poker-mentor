import React, { useMemo } from 'react'
import type { TrainSession, Position, Scenario } from '../types'
import { DEMO_SCENARIOS } from '../lib/gtoData'

interface Props {
  sessions: TrainSession[]
  scenario: Scenario | null
  onRepeat: () => void
  onPracticePosition: (pos: Position) => void
  onClose: () => void
}

const POSITIONS: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']

function getBarColor(acc: number): string {
  if (acc < 70) return '#ef4444'
  if (acc < 85) return '#f59e0b'
  return '#10b981'
}

const SessionSummary: React.FC<Props> = ({
  sessions,
  scenario,
  onRepeat,
  onPracticePosition,
  onClose,
}) => {
  const total = sessions.length
  const correct = sessions.filter(s => s.isCorrect).length
  const errors = total - correct
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  const mixedCount = useMemo(() => {
    if (!scenario) return 0
    return sessions.filter(s => scenario.range?.[s.hand]?.mixed != null).length
  }, [sessions, scenario])

  const evLoss = (errors * 0.15).toFixed(2)

  const byPosition = useMemo(() => {
    const map: Partial<Record<Position, { total: number; correct: number }>> = {}
    for (const s of sessions) {
      const pos = DEMO_SCENARIOS.find(sc => sc.id === s.scenarioId)?.position
      if (!pos) continue
      if (!map[pos]) map[pos] = { total: 0, correct: 0 }
      map[pos]!.total++
      if (s.isCorrect) map[pos]!.correct++
    }
    return map
  }, [sessions])

  const posEntries = POSITIONS.filter(pos => byPosition[pos]).map(pos => {
    const stat = byPosition[pos]!
    const acc = Math.round((stat.correct / stat.total) * 100)
    return { pos, acc, total: stat.total }
  })

  const lowestPos = posEntries.length > 0
    ? posEntries.reduce((a, b) => (a.acc < b.acc ? a : b))
    : null

  // Circle SVG
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (accuracy / 100) * circumference
  const scoreColor = getBarColor(accuracy)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: 430,
          background: 'var(--surface-base)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>
            Session 總結
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 22,
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            ✕
          </button>
        </div>

        {/* Score + 2×2 grid */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Circle */}
          <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
            <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--border)" strokeWidth="9" />
              <circle
                cx="55" cy="55" r={radius}
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
                  fontSize: 26,
                  fontWeight: 800,
                  fontFamily: '"IBM Plex Mono", monospace',
                  color: scoreColor,
                  lineHeight: 1,
                }}
              >
                {accuracy}%
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>GTO 分數</div>
            </div>
          </div>

          {/* 2×2 data grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
            {[
              { label: '最佳行動', value: correct, color: '#10b981' },
              { label: '錯誤數',   value: errors,  color: '#ef4444' },
              { label: 'EV 損失',  value: `${evLoss}bb`, color: '#f59e0b' },
              { label: '混合策略', value: mixedCount, color: '#9775fa' },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '8px 10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    fontFamily: '"IBM Plex Mono", monospace',
                    color: item.color,
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Position accuracy bars */}
        {posEntries.length > 0 && (
          <div
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
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
            {posEntries.map(({ pos, acc, total: t }) => {
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
                        transition: 'width 0.45s ease',
                      }}
                    />
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
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                    ({t})
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Smart hint */}
        {lowestPos && (
          <div
            style={{
              background:
                lowestPos.acc < 70 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${
                lowestPos.acc < 70 ? 'rgba(239,68,68,0.28)' : 'rgba(245,158,11,0.28)'
              }`,
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 13,
              color: lowestPos.acc < 70 ? '#ef4444' : '#f59e0b',
              lineHeight: 1.55,
            }}
          >
            💡 {lowestPos.pos} 位置準確率最低（{lowestPos.acc}%），建議重點加強！
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={onRepeat}
            style={{
              flex: 1,
              padding: '13px 0',
              borderRadius: 12,
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            重複 Session
          </button>
          {lowestPos && (
            <button
              onClick={() => onPracticePosition(lowestPos.pos)}
              style={{
                flex: 1,
                padding: '13px 0',
                borderRadius: 12,
                background: 'rgba(99,102,241,0.14)',
                border: '1px solid rgba(99,102,241,0.38)',
                color: 'var(--primary)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              練習 {lowestPos.pos}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionSummary
