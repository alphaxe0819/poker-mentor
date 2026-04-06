import { useState, useCallback } from 'react'
import type { Course, CourseQuestion } from '../lib/courseData'
import { saveCourseProgress } from '../lib/courseSync'
import { getActionByKey, getTopActionsByKey, isActionValid, getRangeByKey } from '../lib/gtoData'
import { buildScenario, type SeatDisplayInfo } from '../tabs/TrainTab'
import PokerFelt from './PokerFelt'
import HoleCards from './HoleCards'
import ActionFeedback from './ActionFeedback'
import ActionHistory from './ActionHistory'

type GameTypeKey = 'tourn_9max' | 'cash_6max' | 'cash_4max' | 'cash_hu'

const POSITIONS: Record<GameTypeKey, string[]> = {
  tourn_9max: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  cash_6max:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  cash_4max:  ['UTG', 'BTN', 'SB', 'BB'],
  cash_hu:    ['SB', 'BB'],
}

type TableSize = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
const TABLE_SIZE: Record<GameTypeKey, TableSize> = {
  tourn_9max: 9,
  cash_6max:  6,
  cash_4max:  4,
  cash_hu:    2,
}

function canOpenAllin(position: string, stackBB: number): boolean {
  if (stackBB > 25) return false
  return ['BTN', 'SB', 'CO'].includes(position)
}

interface StepResult {
  heroAction: string
  gtoAction: string
  isCorrect: boolean
  gtoTopActions: { action: string; freq: number }[]
}

type Phase = 'question' | 'feedback' | 'complete'

interface Props {
  course: Course
  onBack: () => void
}

function getStep1Actions(q: CourseQuestion): { label: string; action: string }[] {
  const isRFI = !q.raiserPos

  if (isRFI) {
    if (q.heroPos === 'SB') {
      return [
        { label: 'Fold',  action: 'f' },
        { label: 'Call',  action: 'c' },
        { label: 'Raise', action: 'r' },
      ]
    }
    const a = [{ label: 'Fold', action: 'f' }, { label: 'Raise', action: 'r' }]
    if (canOpenAllin(q.heroPos, q.stackBB)) a.push({ label: 'All-in', action: 'allin' })
    return a
  } else {
    // facing raise
    if (q.heroPos === 'BB' && q.raiserAction === 'limp') {
      return [
        { label: 'Check', action: 'c' },
        { label: 'Raise', action: 'r' },
      ]
    }
    if (q.raiserAction === 'allin') {
      return [
        { label: `Call ${q.stackBB}BB`, action: 'c' },
        { label: 'Fold', action: 'f' },
      ]
    }
    const a = [
      { label: 'Fold', action: 'f' },
      { label: 'Call',  action: 'c' },
      { label: '3-Bet', action: '3b' },
    ]
    if (q.stackBB <= 40) a.push({ label: 'All-in', action: 'allin' })
    return a
  }
}

export default function CoursePlayScreen({ course, onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [stepResult, setStepResult] = useState<StepResult | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const handleBack = () => {
    if (phase === 'complete') {
      onBack()
    } else {
      setShowExitConfirm(true)
    }
  }

  const question = course.questions[currentIdx]
  const positions = POSITIONS[question.gameTypeKey]
  const tableSize = TABLE_SIZE[question.gameTypeKey]

  const { seatInfo, actionHistory, scenarioText } = buildScenario(
    positions,
    question.heroPos,
    question.stackBB,
    question.raiserPos,
    question.raiserAction,
  )

  const gtoRange = getRangeByKey(question.stackBB, question.dbKey, question.gameTypeKey)

  const handleAnswer = useCallback((action: string) => {
    const gtoAction  = getActionByKey(question.stackBB, question.dbKey, question.hand)
    const topActions = getTopActionsByKey(question.stackBB, question.dbKey, question.hand)
    const isOk       = isActionValid(question.stackBB, question.dbKey, question.hand, action)

    const result: StepResult = { heroAction: action, gtoAction: gtoAction, isCorrect: isOk, gtoTopActions: topActions }
    setStepResult(result)
    setPhase('feedback')

    if (isOk) setCorrectCount(prev => prev + 1)
    setAnswers(prev => [...prev, isOk])
  }, [question])

  const handleNext = useCallback(() => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= course.questions.length) {
      // Save progress (localStorage + Supabase)
      saveCourseProgress(course.id, course.questions.length, correctCount, course.questions.length)
      setPhase('complete')
    } else {
      setCurrentIdx(nextIdx)
      setStepResult(null)
      setPhase('question')
    }
  }, [currentIdx, course, correctCount, stepResult])

  // Completion screen
  if (phase === 'complete') {
    const finalCorrect = correctCount
    const finalTotal = course.questions.length
    const pct = Math.round((finalCorrect / finalTotal) * 100)

    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-lg mx-auto w-full">
        <button onClick={onBack} className="self-start text-gray-500 text-sm px-2 py-1 rounded" style={{ background: '#1a1a1a' }}>
          ← 返回課程
        </button>

        <div className="text-4xl mt-4">
          {pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}
        </div>

        <h2 className="text-lg font-bold text-white">課程完成！</h2>
        <p className="text-sm text-gray-400">{course.title}</p>

        <div className="w-full rounded-xl p-6 text-center" style={{ background: '#111', border: '1px solid #222' }}>
          <div className="text-3xl font-bold text-white mb-1">{pct}%</div>
          <div className="text-sm text-gray-400">正確率</div>
          <div className="text-xs text-gray-500 mt-2">{finalCorrect}/{finalTotal} 題正確</div>
        </div>

        <div className="flex gap-2 w-full">
          {answers.map((ok, i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-full"
              style={{ background: ok ? '#10b981' : '#ef4444' }}
            />
          ))}
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={() => {
              setCurrentIdx(0)
              setPhase('question')
              setStepResult(null)
              setCorrectCount(0)
              setAnswers([])
            }}
            className="flex-1 py-3 rounded-xl text-sm transition"
            style={{ background: '#111', border: '1px solid #222', color: '#999' }}
          >
            重新挑戰
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition"
            style={{ background: '#4c1d95', border: '1px solid #7c3aed' }}
          >
            返回課程
          </button>
        </div>
      </div>
    )
  }

  // Build feedback props
  const topActions = stepResult?.gtoTopActions ?? []
  const gtoTop     = topActions[0] ?? { action: 'f', freq: 0 }
  const secondTop  = topActions[1] ?? { action: '', freq: 0 }
  const chosenFreq = topActions.find(a => a.action === stepResult?.heroAction)?.freq ?? 0
  const isLimp     = question.heroPos === 'BB' && question.raiserAction === 'limp'

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* 離開確認彈窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: '#111', border: '1px solid #222' }}>
            <div className="text-white font-bold text-base mb-2">離開課程？</div>
            <div className="text-gray-400 text-sm mb-5">目前的作答進度將不會保存，下次需要重新開始。</div>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-sm font-medium"
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
                繼續作答
              </button>
              <button onClick={onBack}
                className="flex-1 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: '#ef4444' }}>
                離開
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={handleBack} className="text-gray-500 hover:text-gray-300 text-sm px-2 py-1 rounded" style={{ background: '#1a1a1a' }}>
          ←
        </button>
        <span className="text-sm font-bold text-white flex-1 truncate">{course.icon} {course.title}</span>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          第 {currentIdx + 1}/{course.questions.length} 題
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: '#1a1a1a' }}>
        <div
          className="h-full transition-all"
          style={{
            width: `${((currentIdx + (phase === 'feedback' ? 1 : 0)) / course.questions.length) * 100}%`,
            background: '#7c3aed',
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto w-full overflow-y-auto flex-1 pb-6">
        {/* Action history */}
        <ActionHistory actions={actionHistory} />

        {/* Poker felt */}
        <PokerFelt
          tableSize={tableSize}
          heroPosition={question.heroPos}
          seatInfo={seatInfo as Record<string, SeatDisplayInfo>}
          scenarioText={scenarioText}
          showPositions
        />

        {/* Hand display area */}
        <div className="flex items-start gap-2">
          <div className="flex-1 flex justify-center">
            {phase === 'feedback' ? (
              <button
                onClick={() => document.getElementById('course-range-btn')?.click()}
                className="w-full rounded-xl text-xs transition"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#666', height: 76 }}
              >
                查看範圍
              </button>
            ) : <div className="flex-1" />}
          </div>
          <div className="flex flex-col items-center gap-1">
            <HoleCards hand={question.hand} />
            {phase === 'feedback' && stepResult ? (
              <span className="text-sm font-bold" style={{ color: stepResult.isCorrect ? '#10b981' : '#ef4444' }}>
                {stepResult.isCorrect ? '✓ 正確！' : '✗ 不對'}
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                {question.hand} {question.hand.endsWith('s') ? '同花' : question.hand.endsWith('o') ? '雜色' : '對子'}
              </span>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            {phase === 'feedback' ? (
              <button
                onClick={() => document.getElementById('course-next-btn')?.click()}
                className="w-full rounded-xl text-xs font-bold text-white transition"
                style={{ background: '#4c1d95', border: '1px solid #7c3aed', height: 76 }}
              >
                {currentIdx + 1 >= course.questions.length ? '查看結果' : '下一題 →'}
              </button>
            ) : <div className="flex-1" />}
          </div>
        </div>

        {/* Action buttons */}
        {phase === 'question' && (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(getStep1Actions(question).length, 3)}, 1fr)` }}>
            {getStep1Actions(question).map(btn => (
              <button
                key={btn.action}
                onClick={() => handleAnswer(btn.action)}
                className="py-3 rounded-xl text-sm font-bold text-white transition"
                style={{ background: '#111', border: '1px solid #222' }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        {phase === 'feedback' && stepResult && (
          <ActionFeedback
            hideResult
            hideButtons
            isCorrect={stepResult.isCorrect}
            gtoAction={gtoTop.action}
            gtoFreq={gtoTop.freq}
            secondAction={secondTop.action}
            secondFreq={secondTop.freq}
            chosenAction={stepResult.heroAction}
            chosenFreq={chosenFreq}
            hand={question.hand}
            gtoRange={gtoRange}
            isLimp={isLimp}
            heroPos={question.heroPos}
            raiserPos={question.raiserPos}
            raiserAction={question.raiserAction}
            stackBB={question.stackBB}
            showExplanation={true}
            alwaysShowExplanation={true}
            onNext={handleNext}
          />
        )}

        {/* Hidden buttons for card-area triggers */}
        <button id="course-range-btn" style={{ display: 'none' }} onClick={() => document.getElementById('range-btn')?.click()} />
        <button id="course-next-btn" style={{ display: 'none' }} onClick={handleNext} />
      </div>
    </div>
  )
}
