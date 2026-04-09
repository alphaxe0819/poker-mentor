import { useState, useRef, useCallback, type ReactNode } from 'react'
import type { QuizResult } from '../data/quizQuestions'
import { STYLE_META, LEVEL_META, QUIZ_QUESTIONS } from '../data/quizQuestions'
import { supabase } from '../lib/supabase'
import RadarChart from './RadarChart'

interface Props {
  result: QuizResult
  /** If true, show register CTA. If false (post-login), show "開始訓練" */
  showRegisterCTA?: boolean
  onRegister?: () => void
  onBack?: () => void
  onContinue?: () => void
}

const COURSE_RECO: Record<string, { course: string; reason: string }> = {
  'rock-beginner':       { course: 'RFI 基礎', reason: '學習在各位置主動出擊' },
  'rock-novice':         { course: '位置的力量', reason: '學會利用位置優勢' },
  'rock-intermediate':   { course: '面對加注', reason: '學習更積極的防守策略' },
  'rock-advanced':       { course: '直接開始訓練', reason: '嘗試增加攻擊頻率' },
  'octopus-beginner':    { course: 'RFI 基礎', reason: '建立正確的翻前範圍' },
  'octopus-novice':      { course: '面對加注', reason: '學習何時該棄牌' },
  'octopus-intermediate': { course: '面對加注', reason: '提升防守效率' },
  'octopus-advanced':    { course: '直接開始訓練', reason: '專注收緊翻前範圍' },
  'fox-beginner':        { course: 'RFI 基礎', reason: '打好基礎再發揮創意' },
  'fox-novice':          { course: '面對加注', reason: '讓攻擊更有紀律' },
  'fox-intermediate':    { course: '直接開始訓練', reason: '用實戰磨練攻擊技巧' },
  'fox-advanced':        { course: '直接開始訓練', reason: '將創意與紀律完美結合' },
  'shark-beginner':      { course: 'RFI 基礎', reason: '鞏固基本功' },
  'shark-novice':        { course: '位置的力量', reason: '讓你的優勢更全面' },
  'shark-intermediate':  { course: '直接開始訓練', reason: '挑戰更高難度的情境' },
  'shark-advanced':      { course: '直接開始訓練', reason: '你已具備 GTO 思維！' },
}

const ACCURACY_OPTIONS = ['非常準', '還算準', '不太準', '完全不準']
const IMPROVE_OPTIONS = ['翻前範圍', '翻後打法', '心態控制', '讀人/馬腳']

// ── Pure Canvas share card ─────────────────────────────

function drawShareCard(
  meta: { emoji: string; name: string; tag: string },
  dimensions: QuizResult['dimensions'],
): Promise<Blob | null> {
  const W = 600, H = 700
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.resolve(null)

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, W, H)

  // Emoji
  ctx.font = '64px serif'
  ctx.textAlign = 'center'
  ctx.fillText(meta.emoji, W / 2, 80)

  // Style name
  ctx.font = 'bold 32px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(meta.name, W / 2, 130)

  // Tag
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#888888'
  ctx.fillText(meta.tag, W / 2, 158)

  // Radar chart
  const cx = W / 2, cy = 340, maxR = 120
  const labels: { key: keyof typeof dimensions; label: string }[] = [
    { key: 'aggression', label: '攻擊性' },
    { key: 'position', label: '位置意識' },
    { key: 'discipline', label: '手牌紀律' },
    { key: 'potControl', label: '底池控制' },
    { key: 'tiltResistance', label: '抗壓性' },
  ]
  const angleStep = 360 / labels.length

  function polar(angle: number, r: number): [number, number] {
    const rad = ((angle - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }

  // Grid rings
  for (const ring of [0.2, 0.4, 0.6, 0.8, 1.0]) {
    ctx.beginPath()
    labels.forEach((_, i) => {
      const [x, y] = polar(i * angleStep, maxR * ring)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Axis lines
  labels.forEach((_, i) => {
    const [x, y] = polar(i * angleStep, maxR)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#333'
    ctx.stroke()
  })

  // Data polygon
  ctx.beginPath()
  labels.forEach((item, i) => {
    const val = dimensions[item.key] / 100
    const [x, y] = polar(i * angleStep, maxR * val)
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(124, 58, 237, 0.25)'
  ctx.fill()
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 2
  ctx.stroke()

  // Data points
  labels.forEach((item, i) => {
    const val = dimensions[item.key] / 100
    const [x, y] = polar(i * angleStep, maxR * val)
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#7c3aed'
    ctx.fill()
  })

  // Labels
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#999'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  labels.forEach((item, i) => {
    const [x, y] = polar(i * angleStep, maxR + 24)
    ctx.fillText(item.label, x, y)
  })

  // Branding
  ctx.font = '13px sans-serif'
  ctx.fillStyle = '#555'
  ctx.textAlign = 'center'
  ctx.fillText('Poker Goal — 撲克 MBTI', W / 2, H - 30)

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

// ── Component ──────────────────────────────────────────

export default function QuizDetailScreen({
  result, showRegisterCTA = false, onRegister, onBack, onContinue,
}: Props) {
  const meta = STYLE_META[result.style]
  const levelMeta = LEVEL_META[result.level]
  const scenarioCount = QUIZ_QUESTIONS.filter(q => q.type === 'scenario').length
  const recoKey = `${result.style}-${result.level}`
  const reco = COURSE_RECO[recoKey]

  // Feedback state
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [improve, setImprove] = useState<number | null>(null)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const feedbackRef = useRef(false)

  // Share state
  const [sharing, setSharing] = useState(false)

  const handleFeedback = useCallback(async (acc: number | null, imp: number | null) => {
    if (feedbackRef.current) return
    if (acc === null || imp === null) return
    feedbackRef.current = true
    setFeedbackSent(true)
    // Fire and forget — anonymous insert, no auth needed
    await supabase.from('quiz_feedback').insert({
      quiz_style: result.style,
      quiz_level: result.level,
      accuracy_rating: ACCURACY_OPTIONS[acc],
      improve_area: IMPROVE_OPTIONS[imp],
      gto_correct: result.gtoCorrect,
    }).then(() => {}, () => {}) // ignore errors silently
  }, [result])

  const handleAccuracy = (idx: number) => {
    setAccuracy(idx)
    handleFeedback(idx, improve)
  }
  const handleImprove = (idx: number) => {
    setImprove(idx)
    handleFeedback(accuracy, idx)
  }

  const handleShare = async () => {
    if (sharing) return
    setSharing(true)
    try {
      const blob = await drawShareCard(meta, result.dimensions)
      if (!blob) { setSharing(false); return }

      const file = new File([blob], 'poker-mbti.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `我的撲克 MBTI 是「${meta.name}」`,
          files: [file],
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'poker-mbti.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // User cancelled or error
    }
    setSharing(false)
  }

  // Collapsible section helper
  const Collapsible = ({ title, children }: { title: string; children: ReactNode }) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="rounded-xl mb-3 overflow-hidden"
        style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <button onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 text-left">
          <span className="text-white text-sm font-medium">{title}</span>
          <span className="text-gray-500 text-xs transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>
        {open && <div className="px-4 pb-4">{children}</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Style hero */}
        <div className="text-center px-6 pt-8 pb-4">
          <div className="text-5xl mb-3">{meta.emoji}</div>
          <div className="text-2xl font-black text-white mb-1">{meta.name}</div>
          <div className="text-gray-500 text-sm mb-4">{meta.tag}</div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            {meta.description}
          </p>
        </div>

        {/* Radar chart */}
        <div className="flex justify-center mb-4">
          <RadarChart dimensions={result.dimensions} size={240} />
        </div>

        <div className="px-6">
          {/* Feedback survey — right after chart */}
          {!feedbackSent ? (
            <div className="rounded-xl p-4 mb-5"
              style={{ background: '#111', border: '1px solid #1a1a1a' }}>
              <div className="text-gray-400 text-xs mb-3">花 10 秒幫我們改進</div>

              <div className="mb-3">
                <div className="text-gray-300 text-sm mb-2">這個測驗結果準嗎？</div>
                <div className="flex gap-2 flex-wrap">
                  {ACCURACY_OPTIONS.map((opt, i) => (
                    <button key={i} onClick={() => handleAccuracy(i)}
                      className="px-3 py-1.5 rounded-full text-xs transition"
                      style={{
                        background: accuracy === i ? '#7c3aed' : '#1a1a1a',
                        color: accuracy === i ? '#fff' : '#888',
                        border: `1px solid ${accuracy === i ? '#7c3aed' : '#333'}`,
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-gray-300 text-sm mb-2">你最想加強哪方面？</div>
                <div className="flex gap-2 flex-wrap">
                  {IMPROVE_OPTIONS.map((opt, i) => (
                    <button key={i} onClick={() => handleImprove(i)}
                      className="px-3 py-1.5 rounded-full text-xs transition"
                      style={{
                        background: improve === i ? '#7c3aed' : '#1a1a1a',
                        color: improve === i ? '#fff' : '#888',
                        border: `1px solid ${improve === i ? '#7c3aed' : '#333'}`,
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4 mb-5 text-center"
              style={{ background: '#111', border: '1px solid #1a4a1a' }}>
              <div className="text-green-400 text-sm">感謝你的回饋！</div>
            </div>
          )}

          {/* Share button */}
          <button onClick={handleShare} disabled={sharing}
            className="w-full py-3 rounded-xl text-sm font-medium transition mb-5"
            style={{ background: '#111', border: '1px solid #222', color: '#ccc', opacity: sharing ? 0.6 : 1 }}>
            {sharing ? '產生圖片中...' : '📤 分享我的撲克 MBTI'}
          </button>

          {/* Collapsible details */}
          <Collapsible title="💡 個性化訓練建議">
            <div className="flex flex-col gap-2">
              {meta.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 text-xs mt-0.5">●</span>
                  <span className="text-gray-300 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="📊 GTO 理解度">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">等級</span>
              <span className="text-white text-sm font-medium">{levelMeta.label}</span>
            </div>
            <div className="w-full h-1.5 rounded-full mt-1" style={{ background: '#222' }}>
              <div className="h-1.5 rounded-full"
                style={{
                  width: `${(result.gtoCorrect / scenarioCount) * 100}%`,
                  background: '#7c3aed',
                }}
              />
            </div>
            <div className="text-gray-600 text-xs mt-1 text-right">
              {result.gtoCorrect} / {scenarioCount} 情境題正確
            </div>
          </Collapsible>

          {reco && (
            <Collapsible title="🎯 推薦學習路徑">
              <div className="text-gray-300 text-sm">
                {reco.course === '直接開始訓練'
                  ? `${reco.reason}，推薦直接開始實戰訓練！`
                  : `推薦先上「${reco.course}」課程 — ${reco.reason}`
                }
              </div>
            </Collapsible>
          )}
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-3"
        style={{ background: 'linear-gradient(transparent, #0a0a0a 30%)' }}>
        <div className="max-w-lg mx-auto flex flex-col gap-2">
          {showRegisterCTA ? (
            <>
              <button onClick={onRegister}
                className="w-full py-3.5 rounded-full text-sm font-bold text-white transition"
                style={{ background: '#7c3aed' }}>
                免費註冊，開始個性化訓練 →
              </button>
              <button onClick={onBack}
                className="w-full py-2 text-xs transition"
                style={{ color: '#555' }}>
                返回登入
              </button>
            </>
          ) : (
            <button onClick={onContinue}
              className="w-full py-3.5 rounded-full text-sm font-bold text-white transition"
              style={{ background: '#7c3aed' }}>
              開始訓練 →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
