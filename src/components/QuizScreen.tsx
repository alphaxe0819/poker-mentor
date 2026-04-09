import { useState, useCallback } from 'react'
import { QUIZ_QUESTIONS, computeQuizResult, saveQuizResultLocal } from '../data/quizQuestions'
import type { QuizResult } from '../data/quizQuestions'
import HoleCards from './HoleCards'
import QuizResultScreen from './QuizResultScreen'

interface Props {
  onFinish: () => void
  onRegister: () => void
}

export default function QuizScreen({ onFinish, onRegister }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [animating, setAnimating] = useState(false)

  const handleSelect = useCallback((optionIdx: number) => {
    if (animating) return
    const newAnswers = [...answers, optionIdx]
    setAnswers(newAnswers)

    if (newAnswers.length === QUIZ_QUESTIONS.length) {
      const r = computeQuizResult(newAnswers)
      saveQuizResultLocal(r)
      setAnimating(true)
      setTimeout(() => {
        setResult(r)
        setAnimating(false)
      }, 400)
    } else {
      setAnimating(true)
      setTimeout(() => {
        setCurrent(c => c + 1)
        setAnimating(false)
      }, 300)
    }
  }, [answers, animating])

  if (result) {
    return (
      <QuizResultScreen
        result={result}
        onRegister={onRegister}
        onBack={onFinish}
      />
    )
  }

  const q = QUIZ_QUESTIONS[current]
  const progress = ((current) / QUIZ_QUESTIONS.length) * 100

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 text-xs">撲克 MBTI 測驗</span>
          <span className="text-gray-500 text-xs">{current + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 rounded-full" style={{ background: '#222' }}>
          <div className="h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: '#7c3aed' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-6 max-w-lg mx-auto w-full"
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}>

        {/* Question type badge */}
        <div className="flex justify-center mb-4">
          <span className="text-xs px-3 py-1 rounded-full"
            style={{
              background: q.type === 'scenario' ? '#1a1a2e' : '#1a2e1a',
              color: q.type === 'scenario' ? '#a78bfa' : '#86efac',
              border: `1px solid ${q.type === 'scenario' ? '#2d2d4a' : '#2d4a2d'}`,
            }}>
            {q.type === 'scenario' ? '🃏 情境題' : '💭 偏好題'}
          </span>
        </div>

        {/* Scenario prompt */}
        <div className="text-white text-base font-medium text-center mb-4 leading-relaxed">
          {q.prompt}
        </div>

        {/* Hand display for scenario questions */}
        {q.hand && (
          <div className="flex justify-center mb-4">
            <HoleCards hand={q.hand} />
          </div>
        )}

        {q.heroPos && (
          <div className="text-center text-gray-500 text-xs mb-4">
            你的位置：<span className="text-purple-400 font-bold">{q.heroPos}</span>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-2.5 mt-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-all active:scale-[0.98]"
              style={{ background: '#111', border: '1px solid #222', color: '#ddd' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
