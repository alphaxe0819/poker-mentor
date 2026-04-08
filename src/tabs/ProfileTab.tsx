import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getPoints } from '../lib/points'
import { getSubscription, getSubscriptionDisplayInfo } from '../lib/lemonsqueezy'
import type { Subscription } from '../lib/lemonsqueezy'
import type { User } from '@supabase/supabase-js'
import PromoCodeInput from '../components/PromoCodeInput'

const DEMO_EMAIL    = 'student@demo.com'
const DEMO_PASSWORD = 'demo1234'

export default function ProfileTab() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sub, setSub]         = useState<Subscription | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: session } = await supabase.auth.getSession()
      if (session.session?.user) {
        setUser(session.session.user)
        const s = await getSubscription(session.session.user.id)
        setSub(s)
        setLoading(false)
        return
      }
      const { data } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      })
      setUser(data.user ?? null)
      if (data.user) {
        const s = await getSubscription(data.user.id)
        setSub(s)
      }
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="p-4 text-gray-400 text-center">載入中...</div>
  }

  const displayInfo = getSubscriptionDisplayInfo(sub)

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <h2 className="text-white font-bold text-lg">帳號</h2>

      {user ? (
        <div className="flex flex-col gap-4">
          {/* 用戶資訊 */}
          <div className="rounded-2xl p-5 flex flex-col gap-4"
               style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user.email?.[0].toUpperCase()}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{user.email}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full"
                        style={{ background: displayInfo.statusColor }} />
                  <span className="text-gray-400 text-xs">{displayInfo.statusText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 訂閱方案 — TODO: 測試階段暫時隱藏，上線前恢復 */}
          {/* <div className="rounded-2xl p-5 flex flex-col gap-3"
               style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-xs">目前方案</div>
              <div className="text-white font-bold text-sm">{displayInfo.label}</div>
            </div>

            {displayInfo.renewDate && sub?.status === 'active' && (
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-xs">下次續費</div>
                <div className="text-gray-300 text-sm">{displayInfo.renewDate}</div>
              </div>
            )}

            {sub?.card_brand && sub?.card_last_four && (
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-xs">付款方式</div>
                <div className="text-gray-300 text-sm">
                  {sub.card_brand.toUpperCase()} **** {sub.card_last_four}
                </div>
              </div>
            )}

            {displayInfo.canManage && sub ? (
              <button
                onClick={() => openCustomerPortal(sub)}
                className="w-full py-2.5 rounded-full text-sm font-medium mt-1 transition"
                style={{ background: '#1a1a2e', border: '1px solid #2d2d4a', color: '#a78bfa' }}>
                管理訂閱
              </button>
            ) : (
              <button
                onClick={onUpgrade}
                className="w-full py-2.5 rounded-full text-sm font-bold text-white mt-1 transition active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                升級 Pro
              </button>
            )}
          </div> */}

          {/* 序號兌換 */}
          <PromoCodeInput onRedeemed={() => window.location.reload()} />

          {/* 積分 */}
          <div className="rounded-2xl p-4 flex items-center justify-between"
               style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div>
              <div className="text-gray-400 text-xs">累積點數</div>
              <div className="text-yellow-400 font-bold text-lg">⭐ {getPoints()}</div>
            </div>
            <div className="text-gray-500 text-xs text-right">
              練習答對 +1 點
            </div>
          </div>

          {/* 登出 */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-full text-sm font-medium transition"
            style={{ background: '#111', border: '1px solid #222', color: '#666' }}>
            登出
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl p-5 text-center text-gray-400 text-sm">
          登入失敗，請確認 Supabase 設定
        </div>
      )}
    </div>
  )
}
