import React, { useState } from 'react'
import type { Scenario } from '../types'
import { DEMO_COACHES, DEMO_SCENARIOS, POSITION_LABELS } from '../lib/gtoData'

const GAME_TYPE_OPTIONS = [
  { label: '現金 6-max', value: 'cash_6max', gameType: 'cash' as const, tableType: '6max' as const },
  { label: '錦標賽 9-max', value: 'tournament_9max', gameType: 'tournament' as const, tableType: '9max' as const },
  { label: '現金 4-max', value: 'cash_4max', gameType: 'cash' as const, tableType: '4max' as const },
]

const CASH_STACK_OPTIONS = [
  { label: '100BB', value: 100 },
]

const TOURN_STACK_OPTIONS = [
  { label: '15BB',  value: 15 },
  { label: '25BB',  value: 25 },
  { label: '40BB',  value: 40 },
  { label: '75BB',  value: 75 },
  { label: '100BB', value: 100 },
  { label: '隨機',  value: 0 },
]

interface Props {
  selectedScenario: Scenario | null
  onSelectScenario: (s: Scenario, stack: number) => void
}

const CoachListTab: React.FC<Props> = ({ selectedScenario, onSelectScenario }) => {
  const [expandedCoach, setExpandedCoach] = useState<string | null>(
    DEMO_COACHES[0]?.id ?? null
  )
  const [selectedGameType, setSelectedGameType] = useState('cash_6max')
  const [selectedStack, setSelectedStack] = useState(0) // 0 = random

  const coaches = DEMO_COACHES
  const scenarios = DEMO_SCENARIOS

  const activeGT = GAME_TYPE_OPTIONS.find(o => o.value === selectedGameType)!
  const isTournament = activeGT.gameType === 'tournament'
  const stackOptions = isTournament ? TOURN_STACK_OPTIONS : CASH_STACK_OPTIONS
  const effectiveStack = isTournament ? selectedStack : 100

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '16px 16px 24px',
        gap: 16,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
        }}
      >
        選擇教練
      </h2>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
        選擇 GTO 資料來源，然後選取練習情境
      </p>

      {/* Coach cards */}
      {coaches.map(coach => {
        const isExpanded = expandedCoach === coach.id
        const coachScenarios = scenarios.filter(s =>
          s.coachSource === coach.id &&
          s.gameType === activeGT.gameType &&
          s.tableType === activeGT.tableType
        )

        return (
          <div
            key={coach.id}
            style={{
              borderRadius: 16,
              background: 'var(--surface-card)',
              border: `1px solid ${isExpanded ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Coach header */}
            <button
              onClick={() => setExpandedCoach(isExpanded ? null : coach.id)}
              style={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: isExpanded
                    ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                    : 'var(--surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                  transition: 'background 0.2s',
                  boxShadow: isExpanded ? '0 4px 12px rgba(99,102,241,0.3)' : undefined,
                }}
              >
                {coach.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 3,
                  }}
                >
                  {coach.name}
                  {coach.isDemo && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 10,
                        background: 'rgba(245,158,11,0.15)',
                        color: '#f59e0b',
                        fontWeight: 600,
                        verticalAlign: 'middle',
                      }}
                    >
                      DEMO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {coach.description}
                </div>
              </div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 18,
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                  flexShrink: 0,
                }}
              >
                ▾
              </div>
            </button>

            {/* Expanded: game type + stack selector + scenarios */}
            {isExpanded && (
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {/* Game type selector */}
                <div style={{ padding: '8px 6px 4px' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    遊戲類型
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {GAME_TYPE_OPTIONS.map(opt => {
                      const isActive = selectedGameType === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedGameType(opt.value)
                            // Reset stack for cash games
                            if (opt.gameType === 'cash') setSelectedStack(100)
                            else setSelectedStack(0)
                          }}
                          style={{
                            padding: '5px 12px',
                            borderRadius: 8,
                            border: `1.5px solid ${
                              isActive ? 'rgba(99,102,241,0.5)' : 'var(--border)'
                            }`,
                            background: isActive
                              ? 'rgba(99,102,241,0.15)'
                              : 'transparent',
                            color: isActive ? '#818cf8' : 'var(--text-muted)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            transition: 'all 0.15s',
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Stack depth selector (only for tournament) */}
                {isTournament && (
                  <div style={{ padding: '4px 6px 4px' }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        marginBottom: 8,
                      }}
                    >
                      選擇盲注深度
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {stackOptions.map(opt => {
                        const isActive = selectedStack === opt.value
                        const isRandom = opt.value === 0
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setSelectedStack(opt.value)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 8,
                              border: `1.5px solid ${
                                isActive
                                  ? isRandom ? 'rgba(56,217,169,0.4)' : 'rgba(151,117,250,0.5)'
                                  : 'var(--border)'
                              }`,
                              background: isActive
                                ? isRandom ? 'rgba(56,217,169,0.12)' : 'rgba(151,117,250,0.12)'
                                : 'transparent',
                              color: isActive
                                ? isRandom ? '#38d9a9' : '#9775fa'
                                : 'var(--text-muted)',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: '"IBM Plex Mono", monospace',
                              transition: 'all 0.15s',
                            }}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Cash fixed stack indicator */}
                {!isTournament && (
                  <div style={{ padding: '4px 6px', fontSize: 11, color: 'var(--text-muted)' }}>
                    固定深度：100BB
                  </div>
                )}

                {/* Scenarios */}
                {coachScenarios.length === 0 ? (
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: 13,
                      padding: '16px',
                    }}
                  >
                    此教練暫無情境
                  </p>
                ) : (
                  coachScenarios.map(scenario => {
                    const isActive = selectedScenario?.id === scenario.id
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => onSelectScenario(scenario, effectiveStack)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 12,
                          background: isActive
                            ? 'rgba(99,102,241,0.15)'
                            : 'transparent',
                          border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'all 0.15s',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                        onMouseEnter={e => {
                          if (!isActive)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'rgba(255,255,255,0.04)'
                        }}
                        onMouseLeave={e => {
                          if (!isActive)
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                        }}
                      >
                        {/* Position badge */}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: isActive
                              ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                              : 'var(--surface-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            fontFamily: '"IBM Plex Mono", monospace',
                            flexShrink: 0,
                          }}
                        >
                          {scenario.position}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                              marginBottom: 2,
                            }}
                          >
                            {scenario.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: 'var(--text-secondary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {scenario.description ?? POSITION_LABELS[scenario.position]}
                          </div>
                        </div>

                        {/* Start arrow */}
                        <div
                          style={{
                            fontSize: 14,
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            flexShrink: 0,
                          }}
                        >
                          {isActive ? '✓' : '→'}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Future coaches placeholder */}
      <div
        style={{
          padding: '20px',
          borderRadius: 16,
          border: '1px dashed rgba(255,255,255,0.1)',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 8 }}>➕</div>
        <div style={{ fontSize: 13 }}>更多教練即將上線</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>翻後策略 / PioSOLVER 整合</div>
      </div>
    </div>
  )
}

export default CoachListTab
