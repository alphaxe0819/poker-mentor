import { useRef, useState } from 'react'
import type { QuizResult } from '../data/quizQuestions'
import { STYLE_META, LEVEL_META, QUIZ_QUESTIONS } from '../data/quizQuestions'
import RadarChart from './RadarChart'

interface Props {
  result: QuizResult
  onRegister: () => void
  onBack: () => void
}

export default function QuizResultScreen({ result, onRegister, onBack }: Props) {
  const shareRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)
  const meta = STYLE_META[result.style]
  const levelMeta = LEVEL_META[result.level]
  const scenarioCount = QUIZ_QUESTIONS.filter(q => q.type === 'scenario').length

  const handleShare = async () => {
    if (!shareRef.current || sharing) return
    setSharing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      })
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png')
      )
      if (!blob) { setSharing(false); return }

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'poker-mbti.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `我的撲克 MBTI 是「${meta.name}」`,
          files: [new File([blob], 'poker-mbti.png', { type: 'image/png' })],
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
      // User cancelled share or error
    }
    setSharing(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Share card area (captured by html2canvas) */}
        <div ref={shareRef} className="px-6 pt-8 pb-6" style={{ background: '#0a0a0a' }}>
          {/* Style hero */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{meta.emoji}</div>
            <div className="text-2xl font-black text-white mb-1">{meta.name}</div>
            <div className="text-gray-500 text-sm">{meta.tag}</div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed text-center mb-6 max-w-sm mx-auto">
            {meta.description}
          </p>

          {/* Radar chart */}
          <div className="flex justify-center mb-4">
            <RadarChart dimensions={result.dimensions} size={240} />
          </div>

          {/* App branding (for share card) */}
          <div className="text-center">
            <span className="text-xs text-gray-700">
              Poker <span style={{ color: '#7c3aed' }}>Goal</span> — 撲克 MBTI
            </span>
          </div>
        </div>

        {/* Below share area (not captured) */}
        <div className="px-6">
          {/* Tips */}
          <div className="mb-6">
            <div className="text-white text-sm font-bold mb-3">💡 個性化訓練建議</div>
            <div className="flex flex-col gap-2">
              {meta.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl p-3"
                  style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                  <span className="text-purple-400 text-xs mt-0.5">●</span>
                  <span className="text-gray-300 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level (subtle) */}
          <div className="rounded-xl p-4 mb-4"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="text-gray-500 text-xs mb-2">📊 詳細分析</div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">GTO 理解度</span>
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
          </div>
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-3"
        style={{ background: 'linear-gradient(transparent, #0a0a0a 30%)' }}>
        <div className="max-w-lg mx-auto flex flex-col gap-2.5">
          <button onClick={handleShare} disabled={sharing}
            className="w-full py-3 rounded-full text-sm font-medium transition"
            style={{ background: '#111', border: '1px solid #333', color: '#ccc', opacity: sharing ? 0.6 : 1 }}>
            {sharing ? '產生圖片中...' : '📤 分享我的撲克 MBTI'}
          </button>
          <button onClick={onRegister}
            className="w-full py-3.5 rounded-full text-sm font-bold text-white transition"
            style={{ background: '#7c3aed' }}>
            註冊開始訓練 →
          </button>
          <button onClick={onBack}
            className="w-full py-2 text-xs transition"
            style={{ color: '#555' }}>
            返回登入
          </button>
        </div>
      </div>
    </div>
  )
}
