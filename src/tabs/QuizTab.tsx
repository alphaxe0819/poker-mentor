import React, { useState, useCallback, useEffect, useRef } from 'react'
import type { Action, Position } from '../types'
import { pickRandomHand, resolveAction, generateSeatStacks, getRangeForStack, STACK_SIZES, generatePreflopContext, type PreflopContext } from '../lib/gtoData'
import PokerFelt from '../components/PokerFelt'
import HoleCards from '../components/HoleCards'

// ─── Types ──────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'exam' | 'result'

interface ExamQuestion {
  hand: string
  position: Position
  stackBB: number
  correctAction: Action
  userAction?: Action
  seatStacks: number[]
  preflopCtx: PreflopContext
}

const QUESTION_COUNTS = [10, 20, 30]
const DEPTH_OPTIONS = [
  { label: '10BB', value: 10 },
  { label: '20BB', value: 20 },
  { label: '30BB', value: 30 },
  { label: '100BB', value: 100 },
  { label: '隨機', value: 0 },
]
const ALL_POSITIONS_6MAX: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const ALL_POSITIONS_9MAX: Position[] = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as Position[]

const ACTIONS: Action[] = ['raise', 'call', 'fold']
const ACTION_LABELS: Record<Action, string> = { raise: 'Raise', call: 'Call', fold: 'Fold' }
const ACTION_EMOJI: Record<Action, string> = { raise: '🔺', call: '📞', fold: '🗑️' }
const ACTION_COLORS: Record<Action, { color: string; bg: string; border: string }> = {
  raise: { color: '#9775fa', bg: 'rgba(151,117,250,0.18)', border: 'rgba(151,117,250,0.5)' },
  call:  { color: '#38d9a9', bg: 'rgba(56,217,169,0.12)',  border: 'rgba(56,217,169,0.5)' },
  fold:  { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)',  border: 'rgba(255,107,107,0.5)' },
}

interface Props {
  onGoToTrain?: () => void
  tableType?: 'cash' | 'tournament'
  onTableTypeChange?: (type: 'cash' | 'tournament') => void
}

// ─── Component ──────────────────────────────────────────────────────────────

const QuizTab: React.FC<Props> = ({ onGoToTrain, tableType = 'cash', onTableTypeChange }) => {
  const [localTableType, setLocalTableType] = useState<'cash' | 'tournament'>(tableType)
  const isNineMax = localTableType === 'tournament'
  const ALL_POSITIONS = isNineMax ? ALL_POSITIONS_9MAX : ALL_POSITIONS_6MAX

  const handleTableTypeChange = (type: 'cash' | 'tournament') => {
    setLocalTableType(type)
    onTableTypeChange?.(type)
    setSelectedPositions(type === 'tournament' ? [...ALL_POSITIONS_9MAX] : [...ALL_POSITIONS_6MAX])
  }

  const [phase, setPhase] = useState<Phase>('setup')

  // Setup state
  const [questionCount, setQuestionCount] = useState(10)
  const [selectedDepth, setSelectedDepth] = useState(0)
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([...ALL_POSITIONS])

  // Exam state
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  // ── Generate questions ────────────────────────────────────────────────────
  const startExam = useCallback(() => {
    const positions = selectedPositions.length > 0 ? selectedPositions : ALL_POSITIONS
    const qs: ExamQuestion[] = []

    for (let i = 0; i < questionCount; i++) {
      const pos = positions[Math.floor(Math.random() * positions.length)]
      const stackBB = selectedDepth === 0
        ? STACK_SIZES[Math.floor(Math.random() * STACK_SIZES.length)]
        : selectedDepth
      const range = getRangeForStack(pos, stackBB)
      const hand = pickRandomHand(range)
      const correctAction = resolveAction(range, hand)
      const seatStacks = generateSeatStacks(stackBB, isNineMax ? 9 : 6)
      const gtoScenario = pos === 'BB' ? 'vs_open' : 'open'
      const preflopCtx = generatePreflopContext(pos, gtoScenario, isNineMax ? 9 : 6)

      qs.push({ hand, position: pos, stackBB, correctAction, seatStacks, preflopCtx })
    }

    setQuestions(qs)
    setCurrentIdx(0)
    setAnswered(false)
    setPhase('exam')
  }, [questionCount, selectedDepth, selectedPositions])

  // ── Answer a question ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((action: Action) => {
    if (answered) return
    setAnswered(true)

    setQuestions(prev => {
      const next = [...prev]
      next[currentIdx] = { ...next[currentIdx], userAction: action }
      return next
    })

    // Auto-advance after 1.5s
    timerRef.current = setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        setPhase('result')
      } else {
        setCurrentIdx(i => i + 1)
        setAnswered(false)
      }
    }, 1500)
  }, [answered, currentIdx, questions.length])

  // ── Toggle position ───────────────────────────────────────────────────────
  const togglePosition = (pos: Position) => {
    setSelectedPositions(prev => {
      if (prev.includes(pos)) {
        const next = prev.filter(p => p !== pos)
        return next.length === 0 ? [...ALL_POSITIONS] : next
      }
      return [...prev, pos]
    })
  }

  const selectAllPositions = selectedPositions.length === ALL_POSITIONS.length

  // ── Results calculation ───────────────────────────────────────────────────
  const correctCount = questions.filter(q => q.userAction === q.correctAction).length
  const totalCount = questions.length
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const wrongQuestions = questions.filter(q => q.userAction !== q.correctAction)

  const getScoreColor = (acc: number) => {
    if (acc >= 90) return '#38d9a9'
    if (acc >= 70) return '#9775fa'
    if (acc >= 50) return '#ffa94d'
    return '#ff6b6b'
  }

  const getComment = (acc: number) => {
    if (acc >= 90) return '優秀！你已掌握 GTO 基礎'
    if (acc >= 70) return '不錯！繼續練習可以更好'
    if (acc >= 50) return '需要加強，建議多練習'
    return '繼續努力，GTO 需要反覆練習'
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SETUP PHASE
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 16px 24px',
          gap: 18,
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
          📝 考題測驗
        </h2>

        {/* Table type */}
        <div>
          <div style={sectionLabel}>遊戲類型</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => handleTableTypeChange('cash')}
              style={chipStyle(localTableType === 'cash', false)}
            >
              現金局 6-max
            </button>
            <button
              onClick={() => handleTableTypeChange('tournament')}
              style={chipStyle(localTableType === 'tournament', false)}
            >
              錦標賽 9-max
            </button>
          </div>
        </div>

        {/* Question count */}
        <div>
          <div style={sectionLabel}>題目數量</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {QUESTION_COUNTS.map(n => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                style={chipStyle(questionCount === n, false)}
              >
                {n} 題
              </button>
            ))}
          </div>
        </div>

        {/* Depth */}
        <div>
          <div style={sectionLabel}>籌碼深度</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DEPTH_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedDepth(opt.value)}
                style={chipStyle(selectedDepth === opt.value, opt.value === 0)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Position */}
        <div>
          <div style={sectionLabel}>位置</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedPositions([...ALL_POSITIONS])}
              style={chipStyle(selectAllPositions, true)}
            >
              全部
            </button>
            {ALL_POSITIONS.map(pos => (
              <button
                key={pos}
                onClick={() => togglePosition(pos)}
                style={chipStyle(
                  !selectAllPositions && selectedPositions.includes(pos),
                  false,
                )}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <div style={{ flex: 1 }} />
        <button
          className="btn-primary"
          onClick={startExam}
          style={{ width: '100%', padding: '14px 0', fontSize: 16, fontWeight: 700 }}
        >
          開始測驗 →
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXAM PHASE
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'exam') {
    const q = questions[currentIdx]
    const isCorrect = answered && q.userAction === q.correctAction
    const isWrong = answered && q.userAction !== q.correctAction
    const progress = ((currentIdx + (answered ? 1 : 0)) / totalCount) * 100

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          padding: '6px 16px 8px',
          overflow: 'hidden',
        }}
      >
        {/* Progress bar */}
        <div style={{ flexShrink: 0, marginBottom: 6 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
              第 {currentIdx + 1} 題 / 共 {totalCount} 題
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: '"IBM Plex Mono", monospace',
                color:
                  q.stackBB <= 15 ? '#ef4444' :
                  q.stackBB <= 40 ? '#f59e0b' :
                  '#10b981',
              }}
            >
              {q.stackBB}BB · {q.position}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'var(--border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#9775fa',
                borderRadius: 2,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Poker felt */}
        <div style={{ flexShrink: 0 }}>
          <PokerFelt
            showPositions
            heroPosition={q.position}
            seatStacks={q.seatStacks}
            seatInfo={q.preflopCtx.seatInfo}
            potTotal={q.preflopCtx.potTotal}
            scenarioText={q.preflopCtx.scenarioDesc}
            tableSize={isNineMax ? 9 : 6}
          >
            {!answered && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 8,
                  padding: '5px 14px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                你會怎麼做？
              </div>
            )}
            {answered && (
              <div
                className="animate-pop"
                style={{
                  background: isCorrect ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 8,
                  padding: '5px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {isCorrect
                  ? '✓ 正確'
                  : `✗ 應該是 ${ACTION_LABELS[q.correctAction]}`}
              </div>
            )}
          </PokerFelt>
        </div>

        {/* Hand display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            flexShrink: 0,
            marginTop: 6,
          }}
        >
          <HoleCards hand={q.hand} revealed size="md" />
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: '"IBM Plex Mono", monospace',
              color: 'var(--text-primary)',
              letterSpacing: '-1px',
            }}
          >
            {q.hand}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 6 }}>
          {ACTIONS.map(action => {
            const cfg = ACTION_COLORS[action]
            const isUserPick = answered && q.userAction === action
            const isCorrectAction = answered && q.correctAction === action

            let btnBg = cfg.bg
            let btnBorder = cfg.border
            let btnColor = cfg.color

            if (answered) {
              if (isUserPick && isCorrect) {
                btnBg = 'rgba(16,185,129,0.2)'
                btnBorder = 'rgba(16,185,129,0.6)'
                btnColor = '#10b981'
              } else if (isUserPick && isWrong) {
                btnBg = 'rgba(239,68,68,0.2)'
                btnBorder = 'rgba(239,68,68,0.6)'
                btnColor = '#ef4444'
              } else if (isCorrectAction && isWrong) {
                btnBg = 'rgba(16,185,129,0.12)'
                btnBorder = 'rgba(16,185,129,0.4)'
                btnColor = '#10b981'
              } else {
                btnBg = 'rgba(148,163,184,0.06)'
                btnBorder = 'rgba(148,163,184,0.15)'
                btnColor = 'rgba(148,163,184,0.3)'
              }
            }

            return (
              <button
                key={action}
                onClick={() => handleAnswer(action)}
                disabled={answered}
                style={{
                  flex: 1,
                  padding: '8px 6px',
                  borderRadius: 12,
                  border: `1.5px solid ${btnBorder}`,
                  background: btnBg,
                  color: btnColor,
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  fontFamily: 'Outfit, sans-serif',
                  opacity: answered && !isUserPick && !isCorrectAction ? 0.4 : 1,
                }}
              >
                <span style={{ fontSize: 18 }}>{ACTION_EMOJI[action]}</span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{ACTION_LABELS[action]}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESULT PHASE
  // ═══════════════════════════════════════════════════════════════════════════
  const scoreColor = getScoreColor(accuracy)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (accuracy / 100) * circumference

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 24px',
        gap: 16,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
        測驗結果
      </h2>

      {/* Score circle */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          padding: '24px 0',
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
        }}
      >
        <div style={{ position: 'relative', width: 124, height: 124 }}>
          <svg width="124" height="124" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="62" cy="62" r={radius} fill="none" stroke="var(--border)" strokeWidth="9" />
            <circle
              cx="62" cy="62" r={radius}
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
                fontSize: 24,
                fontWeight: 800,
                fontFamily: '"IBM Plex Mono", monospace',
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {correctCount} / {totalCount}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              正確率 {accuracy}%
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: scoreColor,
            textAlign: 'center',
          }}
        >
          {getComment(accuracy)}
        </div>
      </div>

      {/* Wrong questions review */}
      {wrongQuestions.length > 0 && (
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
            錯題回顧（{wrongQuestions.length} 題）
          </div>
          {wrongQuestions.map((q, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 0',
                borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ef4444',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  width: 40,
                  flexShrink: 0,
                }}
              >
                {q.hand}
              </span>
              <span style={{ width: 32, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
                {q.position}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                {q.stackBB}BB
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                {ACTION_LABELS[q.userAction!]}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>→</span>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                {ACTION_LABELS[q.correctAction]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn-primary"
          onClick={startExam}
          style={{ flex: 1, padding: '12px 0', fontSize: 14 }}
        >
          再考一次
        </button>
        <button
          onClick={onGoToTrain}
          style={{
            flex: 1,
            padding: '12px 0',
            borderRadius: 12,
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          返回練習
        </button>
      </div>
    </div>
  )
}

// ─── Shared styles ──────────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: 8,
}

function chipStyle(active: boolean, teal: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 10,
    border: `1.5px solid ${
      active
        ? teal ? 'rgba(56,217,169,0.4)' : 'rgba(151,117,250,0.5)'
        : 'var(--border)'
    }`,
    background: active
      ? teal ? 'rgba(56,217,169,0.12)' : 'rgba(151,117,250,0.12)'
      : 'var(--surface-card)',
    color: active
      ? teal ? '#38d9a9' : '#9775fa'
      : 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"IBM Plex Mono", monospace',
    transition: 'all 0.15s',
  }
}

export default QuizTab
