import { useState, useEffect } from 'react'
import { redeemPromoCode, getPromoRedemption } from '../lib/promo'

interface Props {
  /** 兌換成功後回呼（用於刷新 profile） */
  onRedeemed?: () => void
}

export default function PromoCodeInput({ onRedeemed }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [alreadyRedeemed, setAlreadyRedeemed] = useState<string | null>(null) // expires_at

  // 檢查是否已兌換過 POKERGOAL2026
  useEffect(() => {
    getPromoRedemption('POKERGOAL2026').then(({ redeemed, expires_at }) => {
      if (redeemed && expires_at) {
        setAlreadyRedeemed(expires_at)
      }
    })
  }, [])

  const handleRedeem = async () => {
    const trimmed = code.trim()
    if (!trimmed) return

    setLoading(true)
    setResult(null)

    const res = await redeemPromoCode(trimmed)

    if (res.success && res.expires_at) {
      const dateStr = new Date(res.expires_at).toLocaleDateString('zh-TW')
      setResult({ type: 'success', message: `兌換成功！Pro 體驗有效至 ${dateStr}` })
      setAlreadyRedeemed(res.expires_at)
      onRedeemed?.()
    } else {
      setResult({ type: 'error', message: res.error ?? '兌換失敗' })
    }

    setLoading(false)
  }

  // 已兌換過：顯示狀態
  if (alreadyRedeemed) {
    const dateStr = new Date(alreadyRedeemed).toLocaleDateString('zh-TW')
    const isActive = new Date(alreadyRedeemed) > new Date()
    return (
      <div className="rounded-2xl p-4 flex flex-col gap-1"
           style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-400 text-xs">序號體驗</div>
        <div className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
          {isActive ? `Pro 體驗有效至 ${dateStr}` : `Pro 體驗已於 ${dateStr} 到期`}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
         style={{ background: '#111', border: '1px solid #1a1a1a' }}>
      <div className="text-gray-400 text-xs">輸入序號</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
          placeholder="請輸入序號"
          disabled={loading}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
          style={{ background: '#0a0a0a', border: '1px solid #222' }}
        />
        <button
          onClick={handleRedeem}
          disabled={loading || !code.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition active:scale-[0.97] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          {loading ? '兌換中...' : '兌換'}
        </button>
      </div>
      {result && (
        <div className={`text-xs ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}
