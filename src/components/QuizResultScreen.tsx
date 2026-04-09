import type { QuizResult } from '../data/quizQuestions'
import { STYLE_META } from '../data/quizQuestions'

interface Props {
  result: QuizResult
  onRegister: () => void
  onBack: () => void
}

export default function QuizResultScreen({ result, onRegister, onBack }: Props) {
  const meta = STYLE_META[result.style]
  // Show first sentence + trailing "..." to create curiosity
  const firstSentence = meta.description.split('。')[0] + '。'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}>

      {/* Style reveal */}
      <div className="text-center mb-8">
        <div className="text-gray-500 text-xs mb-4">你的撲克 MBTI 是...</div>
        <div className="text-7xl mb-4">{meta.emoji}</div>
        <div className="text-3xl font-black text-white mb-1">{meta.name}</div>
        <div className="text-gray-500 text-sm mb-6">{meta.tag}</div>
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
          {firstSentence}<span className="text-gray-600">......</span>
        </p>
      </div>

      {/* Teaser for detailed analysis */}
      <div className="w-full max-w-sm rounded-xl p-4 mb-8 text-center"
        style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-500 text-xs mb-1">📊 雷達圖 · 訓練建議 · GTO 分析</div>
        <div className="text-purple-400 text-sm font-medium">註冊後解鎖完整詳細分析</div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        <button onClick={onRegister}
          className="w-full py-3.5 rounded-full text-sm font-bold text-white transition"
          style={{ background: '#7c3aed' }}>
          註冊查看詳細分析 →
        </button>
        <button onClick={onBack}
          className="w-full py-2 text-xs transition"
          style={{ color: '#555' }}>
          返回登入
        </button>
      </div>
    </div>
  )
}
