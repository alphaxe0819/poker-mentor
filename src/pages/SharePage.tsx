import React, { useEffect, useState } from 'react'
import { getShareResult } from '../lib/auth'

interface ShareData {
  id: string
  user_name: string
  total: number
  correct: number
  score: number
  accuracy: number
  streak: number
  stack_bb: number
  created_at: string
}

export default function SharePage() {
  const [data,    setData]    = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id) { setLoading(false); return }
    getShareResult(id).then(result => {
      setData(result as ShareData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0a0a0a' }}>
        <div className="text-gray-600 text-sm">載入中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#0a0a0a' }}>
        <div className="text-gray-500 text-sm">找不到此分享記錄</div>
      </div>
    )
  }

  const accuracy = data.accuracy
  const date = new Date(data.created_at).toLocaleDateString('zh-TW')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
         style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-sm flex flex-col gap-5">

        {/* Logo */}
        <div className="text-center">
          <div className="text-2xl font-black text-white">
            Poker <span style={{ color: '#7c3aed' }}>Goal</span>
          </div>
          <div className="text-gray-600 text-xs mt-1">GTO 翻前訓練</div>
        </div>

        {/* 成績卡 */}
        <div className="rounded-2xl p-6 flex flex-col gap-4"
             style={{ background: '#111', border: '1px solid #1a1a1a' }}>

          <div className="text-center">
            <div className="text-4xl mb-3">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '💪' : '📚'}
            </div>
            <div className="text-white font-bold text-xl">{data.user_name}</div>
            <div className="text-gray-500 text-sm mt-1">
              完成了 {data.total} 題 GTO 挑戰
            </div>
            <div className="text-gray-600 text-xs mt-1">{date}</div>
          </div>

          <div className="w-full rounded-full h-2" style={{ background: '#1a1a1a' }}>
            <div className="h-2 rounded-full"
                 style={{
                   width: `${accuracy}%`,
                   background: accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'
                 }} />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3"
               style={{ borderTop: '1px solid #1a1a1a' }}>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-500 text-xs">正確率</span>
              <span className="text-white font-bold text-2xl">{accuracy}%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-500 text-xs">連勝</span>
              <span className="text-yellow-400 font-bold text-2xl">{data.streak}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-500 text-xs">分數</span>
              <span className="font-bold text-2xl"
                    style={{ color: data.score >= 0 ? '#10b981' : '#ef4444' }}>
                {data.score > 0 ? '+' : ''}{data.score}
              </span>
            </div>
          </div>
        </div>

        {/* 來挑戰 */}
        <button onClick={() => window.location.href = '/'}
          className="w-full py-4 rounded-full font-bold text-white"
          style={{ background: '#7c3aed' }}>
          我也要來挑戰 →
        </button>

        <div className="text-center text-gray-700 text-xs">
          截圖此頁面分享給朋友
        </div>
      </div>
    </div>
  )
}
