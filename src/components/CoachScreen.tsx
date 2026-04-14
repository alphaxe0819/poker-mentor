import { useState, useRef, useEffect, useCallback } from 'react'
import { ONBOARDING_STEPS, ONBOARDING_RESPONSES, ONBOARDING_OUTRO } from '../data/coachOnboarding'
import { supabase } from '../lib/supabase'
import PointsBadge from './PointsBadge'

interface Props {
  userId: string
  points: number
  coachOnboardingDone: boolean
  onPointsChanged: () => void
  onOnboardingDone: () => void
  onNavigateToMissions?: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// 種子用戶體驗期：暫時 0 點（原值 5）
const COST_PER_MESSAGE = 0
const STORAGE_KEY = 'coach_messages'

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveMessages(msgs: ChatMessage[]) {
  // Keep last 20 messages
  const trimmed = msgs.slice(-20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export default function CoachScreen({ userId, points, coachOnboardingDone, onPointsChanged, onOnboardingDone, onNavigateToMissions }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    coachOnboardingDone ? loadMessages() : []
  )
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [onboardingDone, setOnboardingDone] = useState(coachOnboardingDone)
  const [answeredKeys, setAnsweredKeys] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, onboardingStep])

  // Show first onboarding message on mount
  useEffect(() => {
    if (!onboardingDone && messages.length === 0) {
      const step = ONBOARDING_STEPS[0]
      if (step?.text) {
        setMessages([{ role: 'assistant', content: step.text }])
        setOnboardingStep(1)
      }
    }
  }, [])

  // Handle onboarding choice — allow all 3 questions
  const handleOnboardingChoice = useCallback((choiceLabel: string, responseKey: string) => {
    const response = ONBOARDING_RESPONSES[responseKey]
    if (!response) return

    const newAnswered = new Set(answeredKeys)
    newAnswered.add(responseKey)
    setAnsweredKeys(newAnswered)

    const newMsgs: ChatMessage[] = [
      ...messages,
      { role: 'user', content: choiceLabel },
      { role: 'assistant', content: response.text },
    ]

    // All 3 answered → auto finish
    const allChoices = ONBOARDING_STEPS[1]?.choices ?? []
    if (newAnswered.size >= allChoices.length) {
      newMsgs.push({ role: 'assistant', content: ONBOARDING_OUTRO })
      setMessages(newMsgs)
      finishOnboarding()
    } else {
      newMsgs.push({ role: 'assistant', content: '還想問其他問題嗎？選一個繼續，或直接開始正式對話：' })
      setMessages(newMsgs)
    }
  }, [messages, answeredKeys])

  const finishOnboarding = useCallback(() => {
    setOnboardingDone(true)
    supabase.from('profiles').update({ coach_onboarding_done: true }).eq('id', userId)
    onOnboardingDone()
    saveMessages([])
  }, [userId, onOnboardingDone])

  // Handle real message send
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return

    // Check points
    if (points < COST_PER_MESSAGE) return

    setSending(true)
    setInput('')

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)

    // Spend points
    const { spendPoints } = await import('../lib/points')
    const result = await spendPoints(userId, COST_PER_MESSAGE, 'ai_coach', 'AI 教練對話')
    if (!result.success) {
      setMessages([...newMsgs, { role: 'assistant', content: '點數不足，無法發送訊息。完成任務獲取更多點數！' }])
      setSending(false)
      onPointsChanged()
      return
    }
    onPointsChanged()

    // Call Edge Function
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token ?? ''}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
          },
          body: JSON.stringify({
            messages: newMsgs.slice(-10).map(m => ({ role: m.role, content: m.content })),
          }),
        }
      )
      const json = await res.json()
      const reply = json.text ?? '抱歉，我暫時無法回答。'
      const finalMsgs = [...newMsgs, { role: 'assistant' as const, content: reply }]
      setMessages(finalMsgs)
      saveMessages(finalMsgs)
    } catch {
      const errorMsgs = [...newMsgs, { role: 'assistant' as const, content: '網路錯誤，請稍後再試。' }]
      setMessages(errorMsgs)
      saveMessages(errorMsgs)
    }

    setSending(false)
  }, [input, sending, messages, userId, points, onPointsChanged])

  const handleClear = () => {
    setMessages([])
    saveMessages([])
  }

  const insufficientPoints = points < COST_PER_MESSAGE

  return (
    <div className="flex flex-col" style={{ background: '#0a0a0a', height: 'calc(100vh - 48px)' }}>
      {/* Header — fixed top */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-white text-sm font-bold">AI 教練</span>
        </div>
        <div className="flex items-center gap-3">
          <PointsBadge points={points} onNavigateToMissions={onNavigateToMissions} />
          {onboardingDone && messages.length > 0 && (
            <button onClick={handleClear} className="text-gray-600 text-xs">清除對話</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: msg.role === 'user' ? '#7c3aed' : '#111',
                color: msg.role === 'user' ? '#fff' : '#ddd',
                border: msg.role === 'assistant' ? '1px solid #1a1a1a' : 'none',
              }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Onboarding choices */}
        {!onboardingDone && onboardingStep === 1 && (() => {
          const remaining = (ONBOARDING_STEPS[1]?.choices ?? []).filter(c => !answeredKeys.has(c.responseKey))
          return (
            <div className="flex flex-col gap-2 mt-2">
              {remaining.map((choice) => (
                <button key={choice.responseKey}
                  onClick={() => handleOnboardingChoice(choice.label, choice.responseKey)}
                  className="text-left px-4 py-3 rounded-xl text-sm transition active:scale-[0.98]"
                  style={{ background: '#111', border: '1px solid #7c3aed', color: '#a78bfa' }}>
                  {choice.label}
                </button>
              ))}
              {answeredKeys.size > 0 && remaining.length > 0 && (
                <button onClick={finishOnboarding}
                  className="py-2.5 rounded-xl text-xs font-medium transition"
                  style={{ background: '#111', border: '1px solid #333', color: '#888' }}>
                  跳過，開始正式對話
                </button>
              )}
            </div>
          )
        })()}

        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm"
              style={{ background: '#111', border: '1px solid #1a1a1a', color: '#666' }}>
              教練正在思考...
            </div>
          </div>
        )}
      </div>

      {/* Input area — fixed bottom */}
      {onboardingDone && (
        <div className="flex-shrink-0 px-4 pb-4 pt-2" style={{ borderTop: '1px solid #1a1a1a' }}>
          {insufficientPoints && (
            <div className="text-center text-xs text-gray-500 mb-2">
              點數不足（需要 {COST_PER_MESSAGE} 點），完成任務獲取更多點數
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={insufficientPoints ? '點數不足...' : '問教練任何撲克問題...'}
              disabled={sending || insufficientPoints}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: '#111', border: '1px solid #222' }}
            />
            <button onClick={handleSend}
              disabled={sending || !input.trim() || insufficientPoints}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-30"
              style={{ background: '#7c3aed' }}>
              {sending ? '...' : (COST_PER_MESSAGE === 0 ? '送出' : `${COST_PER_MESSAGE}⭐`)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
