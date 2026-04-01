import React from 'react'

interface Props {
  onBack: () => void
}

export default function UpgradePage({ onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6"
         style={{ background: '#0a0a0a' }}>
      <div className="text-center">
        <div className="text-4xl mb-3">⭐</div>
        <div className="text-white font-bold text-xl mb-2">升級 Poker Goal Pro</div>
        <div className="text-gray-400 text-sm">無限練習 + 弱點分析 + 進階關卡</div>
      </div>

      <div className="w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4"
           style={{ background: '#111', border: '1px solid #222' }}>
        {[
          '每天無限關卡',
          '選擇 10 / 50 / 100 關模式',
          '長期分數累積',
          '弱點分析報告',
          '所有籌碼深度解鎖',
        ].map(item => (
          <div key={item} className="flex items-center gap-3">
            <span style={{ color: '#7c3aed' }}>✓</span>
            <span className="text-gray-300 text-sm">{item}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          className="w-full py-4 rounded-full font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          即將推出，敬請期待
        </button>
        <button onClick={onBack}
          className="w-full py-3 rounded-full text-sm font-medium"
          style={{ background: '#111', border: '1px solid #222', color: '#555' }}>
          返回
        </button>
      </div>
    </div>
  )
}
