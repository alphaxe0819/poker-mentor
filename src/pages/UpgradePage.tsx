import { useState } from 'react'
import { openCheckout } from '../lib/lemonsqueezy'
import PromoCodeInput from '../components/PromoCodeInput'

interface Props {
  onBack: () => void
  userId: string
  userEmail: string
  onRedeemed?: () => void
}

const PRO_FEATURES = [
  { icon: '♾️', text: '每天無限關卡' },
  { icon: '🎯', text: '選擇 10 / 50 / 100 關模式' },
  { icon: '📊', text: '每日 AI 弱點分析報告' },
  { icon: '🏆', text: '長期分數累積與排行' },
  { icon: '🃏', text: '所有籌碼深度解鎖' },
]

export default function UpgradePage({ onBack, userId, userEmail, onRedeemed }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

  const handleCheckout = () => {
    openCheckout(selectedPlan, userId, userEmail)
  }

  return (
    <div className="flex flex-col items-center min-h-screen gap-5 p-6 pb-10"
         style={{ background: '#0a0a0a' }}>

      {/* Header */}
      <div className="text-center pt-4">
        <div className="text-4xl mb-3">⭐</div>
        <div className="text-white font-bold text-xl mb-1">升級 Poker Goal Pro</div>
        <div className="text-gray-400 text-sm">解鎖所有功能，加速你的 GTO 學習</div>
      </div>

      {/* 方案選擇 */}
      <div className="w-full max-w-sm flex flex-col gap-3">

        {/* 年繳方案 */}
        <button
          onClick={() => setSelectedPlan('yearly')}
          className="w-full rounded-2xl p-4 text-left transition-all relative"
          style={{
            background: selectedPlan === 'yearly' ? '#1a1035' : '#111',
            border: selectedPlan === 'yearly' ? '2px solid #7c3aed' : '1px solid #222',
          }}>
          {/* 推薦標籤 */}
          <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full text-xs font-bold"
               style={{ background: '#7c3aed', color: 'white' }}>
            省 33%
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white font-bold text-lg">年繳方案</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-2xl">$8</span>
            <span className="text-gray-400 text-sm">/ 月</span>
            <span className="text-gray-600 text-xs ml-1">（$96/年）</span>
          </div>
        </button>

        {/* 月繳方案 */}
        <button
          onClick={() => setSelectedPlan('monthly')}
          className="w-full rounded-2xl p-4 text-left transition-all"
          style={{
            background: selectedPlan === 'monthly' ? '#1a1035' : '#111',
            border: selectedPlan === 'monthly' ? '2px solid #7c3aed' : '1px solid #222',
          }}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white font-bold text-lg">月繳方案</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-2xl">$12</span>
            <span className="text-gray-400 text-sm">/ 月</span>
          </div>
        </button>
      </div>

      {/* Pro 功能列表 */}
      <div className="w-full max-w-sm rounded-2xl p-5 flex flex-col gap-3.5"
           style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        {PRO_FEATURES.map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span className="text-base w-6 text-center">{icon}</span>
            <span className="text-gray-300 text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* 序號兌換 */}
      <div className="w-full max-w-sm">
        <PromoCodeInput onRedeemed={onRedeemed} />
      </div>

      {/* CTA */}
      <div className="w-full max-w-sm flex flex-col gap-3 mt-auto">
        <button
          onClick={handleCheckout}
          className="w-full py-4 rounded-full font-bold text-white text-base active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          {selectedPlan === 'yearly' ? '以 $96/年 訂閱' : '以 $12/月 訂閱'}
        </button>

        <div className="text-center text-gray-600 text-xs leading-relaxed">
          安全付款由 Lemon Squeezy 處理<br />
          隨時可取消，無綁約
        </div>

        <button onClick={onBack}
          className="w-full py-3 rounded-full text-sm font-medium"
          style={{ background: '#111', border: '1px solid #222', color: '#555' }}>
          返回
        </button>
      </div>
    </div>
  )
}
