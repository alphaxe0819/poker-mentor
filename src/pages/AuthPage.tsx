import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'register'

interface Props {
  onSuccess: () => void
  onGuest: () => void
}

export default function AuthPage({ onSuccess, onGuest }: Props) {
  const [mode,      setMode]      = useState<Mode>('login')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [name,      setName]      = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

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

      // 建立 profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id:    data.user.id,
          email: data.user.email,
          name:  name || email.split('@')[0],
        })
      }
      onSuccess()
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
        <div className="text-gray-700 text-xs mt-1">v0.4.0</div>
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
        </div>

        {/* 體驗模式 */}
        <div className="mt-6 text-center">
          <div className="text-gray-600 text-xs mb-2">不想註冊？</div>
          <button onClick={onGuest}
            className="text-sm font-medium transition"
            style={{ color: '#7c3aed' }}>
            先體驗 3 題 →
          </button>
        </div>
      </div>
    </div>
  )
}
