import { useEffect } from 'react'
import { saveShareResult } from '../lib/auth'

interface Props {
  total: number
  correct: number
  streak: number
  score: number
  userId?: string | null
  userName?: string
  stackBb?: number
  onNext: () => void
}

export default function RoundResultScreen({
  total, correct, streak, score, userId, userName, stackBb, onNext
}: Props) {
  // Guard: don't render if data hasn't been set yet
  if (total <= 0) return null

  const accuracy = Math.round((correct / total) * 100)

  // 自動儲存結果
  useEffect(() => {
    if (!userId) return
    saveShareResult({
      userId,
      userName: userName ?? '玩家',
      total, correct, score, streak,
      stackBb: stackBb ?? 100,
    }).catch(console.error)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6"
         style={{ background: '#0a0a0a' }}>

      <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
           style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-center mb-2">
          <div className="text-3xl mb-2">
            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '💪' : '📚'}
          </div>
          <div className="text-white font-bold text-lg">本關完成！</div>
          <div className="text-gray-500 text-xs mt-1">{total} 題挑戰</div>
        </div>

        <div className="w-full rounded-full h-2" style={{ background: '#1a1a1a' }}>
          <div className="h-2 rounded-full"
               style={{
                 width: `${accuracy}%`,
                 background: accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'
               }} />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2"
             style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-xs">正確率</span>
            <span className="text-white font-bold text-xl">{accuracy}%</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-xs">連勝</span>
            <span className="text-yellow-400 font-bold text-xl">{streak}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-xs">分數</span>
            <span className="font-bold text-xl"
                  style={{ color: score >= 0 ? '#10b981' : '#ef4444' }}>
              {score > 0 ? '+' : ''}{score}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button onClick={onNext}
          className="w-full py-4 rounded-full font-bold text-white text-base"
          style={{ background: '#7c3aed' }}>
          學習更多
        </button>
      </div>
    </div>
  )
}
