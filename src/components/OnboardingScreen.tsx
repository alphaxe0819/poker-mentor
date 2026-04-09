import { useState } from 'react'

interface Props {
  userName: string
  quizStyle?: string | null
  quizLevel?: string | null
  onComplete: () => void
}

const STEPS = [
  {
    title: '歡迎加入！',
    content: (name: string) => (
      <>
        <div className="text-3xl font-black text-white mb-4">
          {name}，你好！
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          這是一個基於 <span className="text-purple-400 font-bold">GTO 策略</span> 的撲克翻前訓練器。
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mt-2">
          讓我們快速了解如何使用吧！
        </p>
      </>
    ),
  },
  {
    title: '什麼是 GTO？',
    content: () => (
      <>
        <div className="text-xl font-bold text-white mb-3">
          GTO = <span className="text-purple-400">最佳博弈策略</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Game Theory Optimal（賽局理論最優解）是一種
          <span className="text-white font-medium"> 對手無法利用 </span>
          的策略。
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mt-3">
          掌握 GTO 翻前範圍，是成為贏家的第一步。
        </p>
        <div className="mt-4 rounded-xl p-3 flex items-center gap-3"
          style={{ background: '#1a1a2e', border: '1px solid #2d2d4a' }}>
          <span className="text-2xl">🎯</span>
          <span className="text-xs text-gray-300">每天練習，建立正確的翻前直覺</span>
        </div>
      </>
    ),
  },
  {
    title: '練習方式',
    content: () => (
      <>
        <div className="text-xl font-bold text-white mb-4">
          練習流程很簡單
        </div>
        <div className="flex flex-col gap-3">
          {[
            { step: '1', icon: '🃏', text: '系統隨機發牌並指定你的位置' },
            { step: '2', icon: '🤔', text: '根據手牌和位置選擇行動' },
            { step: '3', icon: '✅', text: '系統告訴你 GTO 正確答案' },
            { step: '4', icon: '📊', text: '答錯時可查看策略說明和範圍表' },
          ].map(item => (
            <div key={item.step} className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: '#111', border: '1px solid #1a1a1a' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: '#4c1d95', color: '#fff' }}>
                {item.step}
              </div>
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-gray-300 flex-1">{item.text}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: '支援多種桌型',
    content: () => (
      <>
        <div className="text-xl font-bold text-white mb-4">
          完整的 GTO 資料庫
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '9-max 錦標', desc: '15-100BB', icon: '🏆' },
            { label: '6-max 現金', desc: '100BB',    icon: '💰' },
            { label: '4-max 現金', desc: '100BB',    icon: '🎲' },
            { label: 'HU 對戰',   desc: '100BB',    icon: '⚔️' },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-4 flex flex-col items-center gap-2"
              style={{ background: '#111', border: '1px solid #1a1a1a' }}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm text-white font-medium">{item.label}</span>
              <span className="text-xs text-gray-500">{item.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs text-center mt-3">
          涵蓋 RFI、vs Raise、vs 3-Bet 等場景
        </p>
      </>
    ),
  },
  {
    title: '準備好了嗎？',
    content: (_name: string, quizStyle?: string | null, quizLevel?: string | null) => {
      const RECO: Record<string, string> = {
        'rock-beginner': '推薦從「RFI 基礎」課程開始，學習在各位置主動出擊',
        'rock-novice': '推薦「位置的力量」課程，學會利用位置優勢',
        'octopus-beginner': '推薦從「RFI 基礎」課程開始，建立正確的翻前範圍',
        'octopus-novice': '推薦「面對加注」課程，學習何時該棄牌',
        'octopus-intermediate': '推薦「面對加注」課程，提升防守效率',
        'fox-beginner': '推薦從「RFI 基礎」課程開始，打好基礎再發揮創意',
        'fox-novice': '推薦「面對加注」課程，讓攻擊更有紀律',
        'fox-intermediate': '推薦直接開始訓練，用實戰磨練你的攻擊技巧',
        'shark-beginner': '推薦從「RFI 基礎」課程開始，鞏固基本功',
        'shark-novice': '推薦「位置的力量」課程，讓你的優勢更全面',
      }
      const recoKey = quizStyle && quizLevel ? `${quizStyle}-${quizLevel}` : null
      const reco = recoKey ? RECO[recoKey] : null
      const fallbackReco = quizStyle ? '推薦直接開始訓練，從實戰中持續進步' : null
      const displayReco = reco || fallbackReco

      return (
        <>
          <div className="text-xl font-bold text-white mb-3">
            開始你的 GTO 之旅！
          </div>
          {displayReco && (
            <div className="rounded-xl p-4 mb-3 text-center"
              style={{ background: '#0f1a0f', border: '1px solid #1a4a1a' }}>
              <div className="text-green-400 font-bold text-sm mb-1">🧠 根據你的撲克 MBTI</div>
              <div className="text-gray-300 text-xs">{displayReco}</div>
            </div>
          )}
          <div className="flex flex-col gap-3 mt-1">
            <div className="rounded-xl p-4 text-center"
              style={{ background: '#1a1a2e', border: '1px solid #4c1d95' }}>
              <div className="text-purple-400 font-bold text-sm mb-1">免費帳戶</div>
              <div className="text-gray-400 text-xs">每天 1 關（10 題）全隨機練習</div>
            </div>
            <div className="rounded-xl p-4 text-center"
              style={{ background: '#1a0a2e', border: '1px solid #7c3aed' }}>
              <div className="text-purple-300 font-bold text-sm mb-1">付費帳戶</div>
              <div className="text-gray-400 text-xs">無限練習 + 自選桌型/籌碼深度/題數</div>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">
            從實戰中學習，每一手都在進步
          </p>
        </>
      )
    },
  },
]

export default function OnboardingScreen({ userName, quizStyle, quizLevel, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>

      {/* 進度點 */}
      <div className="flex justify-center gap-2 pt-6 pb-2">
        {STEPS.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              background: i === step ? '#7c3aed' : i < step ? '#4c1d95' : '#222',
            }}
          />
        ))}
      </div>

      {/* 跳過 */}
      <div className="flex justify-end px-4 pt-2">
        <button onClick={onComplete}
          className="text-xs px-3 py-1 rounded-full transition"
          style={{ color: '#888', background: '#1a1a1a', border: '1px solid #333' }}>
          略過教學 &raquo;
        </button>
      </div>

      {/* 內容 */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8 max-w-lg mx-auto w-full">

        {/* 標題標籤 */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-1.5 rounded-full text-xs font-bold"
            style={{ background: '#7c3aed', color: '#fff' }}>
            {current.title}
          </div>
        </div>

        {/* 主內容 */}
        <div className="flex-1 flex flex-col justify-center">
          {current.content(userName, quizStyle, quizLevel)}
        </div>
      </div>

      {/* 底部按鈕 */}
      <div className="px-6 pb-8 max-w-lg mx-auto w-full">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3.5 rounded-full text-sm font-medium transition"
              style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888' }}>
              上一步
            </button>
          )}
          <button
            onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
            className="flex-1 py-3.5 rounded-full text-sm font-bold text-white transition"
            style={{ background: '#7c3aed' }}>
            {isLast ? '開始練習' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}
