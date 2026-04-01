import React, { useState, useEffect } from 'react'

interface Props {
  onUpgrade: () => void
}

function getTimeUntilMidnight(): string {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function DailyLimitScreen({ onUpgrade }: Props) {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6"
         style={{ background: '#0a0a0a' }}>
      <div className="text-center">
        <div className="text-5xl mb-4">🎯</div>
        <div className="text-white font-bold text-xl mb-2">今日挑戰完成！</div>
        <div className="text-gray-400 text-sm">免費用戶每天 1 關，明天再來挑戰</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-gray-600 text-xs">距離重置還有</div>
        <div className="text-3xl font-black" style={{ color: '#7c3aed', fontVariantNumeric: 'tabular-nums' }}>
          {countdown}
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button onClick={onUpgrade}
          className="w-full py-4 rounded-full font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          ⭐ 升級付費，無限練習
        </button>
        <div className="text-center text-gray-600 text-xs">
          付費用戶可選擇 10 / 50 / 100 關模式，並享有弱點分析
        </div>
      </div>
    </div>
  )
}
