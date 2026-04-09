import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { VERSION } from '../version'

type Mode = 'login' | 'register'

interface Props {
  onSuccess: () => void
  onGuest: () => void
  initialMode?: Mode
}

export default function AuthPage({ onSuccess, onGuest, initialMode = 'login' }: Props) {
  const [mode,      setMode]      = useState<Mode>(initialMode)
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [name,      setName]      = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const [refCode] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('ref')
  })

  const handleGoogleLogin = async () => {
    // Save referral code before OAuth redirect
    if (refCode) localStorage.setItem('pending_referral', refCode)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) setError(error.message)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onSuccess()
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }

      // 建立 profile（必須在 onAuthStateChange 觸發前完成）
      if (data.user) {
        await supabase.from('profiles').upsert({
          id:       data.user.id,
          email:    data.user.email,
          name:     name || email.split('@')[0],
          is_paid:  false,
          player_type: 'tournament',
          daily_plays_count: 0,
          onboarding_done: false,
        })
        // Record referral if came from referral link
        if (refCode && data.user) {
          import('../lib/missions').then(m => m.recordReferral(data.user!.id, refCode))
        }
      }
      // 不呼叫 onSuccess()，讓 onAuthStateChange 處理
      // 它會檢查 onboarding_done 並正確導向 onboarding 畫面
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
         style={{ background: '#0a0a0a' }}>

      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-3xl font-black text-white mb-1">
          Poker <span style={{ color: '#7c3aed' }}>Goal</span>
        </div>
        <div className="text-gray-500 text-sm">每天練習，讓你的撲克越來越強</div>
        <div className="text-gray-700 text-xs mt-1">{VERSION}</div>
      </div>

      {/* 模式切換 */}
      <div className="w-full max-w-sm">
        <div className="flex mb-5 rounded-full p-1" style={{ background: '#111' }}>
          {(['login', 'register'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className="flex-1 py-2 rounded-full text-sm font-medium transition"
              style={{
                background: mode === m ? '#7c3aed' : 'transparent',
                color: mode === m ? '#fff' : '#555',
              }}>
              {m === 'login' ? '登入' : '註冊'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="暱稱"
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded-xl px-4 py-3 text-sm text-white outline-none transition"
              style={{ background: '#111', border: '1px solid #222' }}
            />
          )}
          <input
            type="email"
            placeholder="電子郵件"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-xl px-4 py-3 text-sm text-white outline-none transition"
            style={{ background: '#111', border: '1px solid #222' }}
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="rounded-xl px-4 py-3 text-sm text-white outline-none transition"
            style={{ background: '#111', border: '1px solid #222' }}
          />

          {error && (
            <div className="text-red-400 text-xs px-1">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="py-3 rounded-full text-sm font-bold text-white transition mt-1"
            style={{ background: '#7c3aed', opacity: loading ? 0.6 : 1 }}>
            {loading ? '處理中...' : mode === 'login' ? '登入' : '註冊'}
          </button>

          {/* 分隔線 */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-px" style={{ background: '#222' }} />
            <span className="text-gray-600 text-xs">或</span>
            <div className="flex-1 h-px" style={{ background: '#222' }} />
          </div>

          {/* Google 登入 */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition"
            style={{ background: '#111', border: '1px solid #222', color: '#ccc' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 帳號登入
          </button>
        </div>

        {/* 撲克 MBTI */}
        <div className="mt-6 text-center">
          <button onClick={onGuest}
            className="text-sm font-medium transition"
            style={{ color: '#7c3aed' }}>
            🧠 測測你的撲克 MBTI →
          </button>
        </div>
      </div>
    </div>
  )
}
