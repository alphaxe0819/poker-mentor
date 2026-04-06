import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getPoints } from '../lib/points'
import type { User } from '@supabase/supabase-js'

const DEMO_EMAIL    = 'student@demo.com'
const DEMO_PASSWORD = 'demo1234'

export default function ProfileTab() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: session } = await supabase.auth.getSession()
      if (session.session?.user) {
        setUser(session.session.user)
        setLoading(false)
        return
      }
      const { data } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      })
      setUser(data.user ?? null)
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

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <h2 className="text-white font-bold text-lg">帳號</h2>

      {user ? (
        <div className="bg-gray-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white text-sm font-medium">{user.email}</div>
              <div className="text-gray-400 text-xs">快速體驗帳號</div>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: '#1a1a2e', border: '1px solid #2d2d4a' }}>
            <div>
              <div className="text-gray-400 text-xs">累積點數</div>
              <div className="text-yellow-400 font-bold text-lg">⭐ {getPoints()}</div>
            </div>
            <div className="text-gray-500 text-xs text-right">
              練習答對 +1 點
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-full text-sm font-medium transition"
          >
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
