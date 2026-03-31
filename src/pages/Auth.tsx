import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isDemoMode, supabase } from '../lib/supabase'
import { demoAuth, BUILTIN_ACCOUNTS } from '../lib/demoAuth'
import type { AuthMode } from '../types'

const Auth: React.FC = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<AuthMode>(
    (params.get('mode') as AuthMode) ?? 'login'
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [coachCode, setCoachCode] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showCoachCode, setShowCoachCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => { emailRef.current?.focus() }, [mode])

  const fillDemo = useCallback((type: 'student' | 'coach') => {
    const accounts = {
      student: { email: 'student@demo.com', pw: 'demo1234' },
      coach:   { email: 'coach@demo.com',   pw: 'demo1234' },
    }
    setEmail(accounts[type].email)
    setPassword(accounts[type].pw)
  }, [])

  const triggerError = (msg: string) => {
    setError(msg)
    setShakeKey(k => k + 1)
  }

  const handleQuickDemo = async (type: 'student' | 'coach') => {
    const creds = type === 'student'
      ? { email: 'student@demo.com', pw: 'demo1234' }
      : { email: 'master@demo.com', pw: 'coach1234' }
    setEmail(creds.email)
    setPassword(creds.pw)
    setError('')
    setLoading(true)
    try {
      const { profile, error: err } = await demoAuth.login(creds.email, creds.pw)
      if (err) { triggerError(err); return }
      if (profile) navigate('/app')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const isBuiltinAccount = email.toLowerCase() in BUILTIN_ACCOUNTS

      if (isDemoMode || isBuiltinAccount) {
        // ── Demo mode / Built-in accounts ─────────────────────────────────
        if (mode === 'login') {
          const { profile, error: err } = await demoAuth.login(email, password)
          if (err) { triggerError(err); return }
          if (profile) navigate('/app')
        } else if (mode === 'register') {
          if (!name.trim()) { triggerError('請輸入名稱'); return }
          if (password.length < 6) { triggerError('密碼至少 6 個字元'); return }
          const { profile, error: err } = await demoAuth.register(
            email, password, name.trim(), coachCode.trim() || undefined
          )
          if (err) { triggerError(err); return }
          if (profile) navigate('/app')
        }
      } else {
        // ── Supabase mode ──────────────────────────────────────────────────
        if (mode === 'login') {
          const { data: loginData, error: err } = await supabase!.auth.signInWithPassword({ email, password })
          if (err) { triggerError(err.message); return }
          // Ensure profile exists (handles edge cases)
          if (loginData.user) {
            const { data: existing } = await supabase!
              .from('profiles')
              .select('id')
              .eq('id', loginData.user.id)
              .single()
            if (!existing) {
              await supabase!.from('profiles').insert({
                id: loginData.user.id,
                email,
                name: loginData.user.user_metadata?.name ?? email.split('@')[0],
                is_coach: false,
              })
            }
          }
          navigate('/app')
        } else if (mode === 'register') {
          if (!name.trim()) { triggerError('請輸入名稱'); return }
          const { error: signUpErr } = await supabase!.auth.signUp({
            email,
            password,
            options: { data: { name, coach_code: coachCode } },
          })
          if (signUpErr) { triggerError(signUpErr.message); return }

          // Email confirmation disabled — sign in directly
          const { data: loginData, error: loginErr } = await supabase!.auth.signInWithPassword({ email, password })
          if (loginErr) {
            // If auto-confirm is off, fall back to OTP flow
            setMode('otp')
            return
          }

          // Create profile
          if (loginData.user) {
            await supabase!.from('profiles').insert({
              id: loginData.user.id,
              email,
              name: name.trim() || email.split('@')[0],
              is_coach: false,
            })
          }
          navigate('/app')
        } else if (mode === 'otp') {
          const { data: otpData, error: err } = await supabase!.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'signup',
          })
          if (err) { triggerError(err.message); return }
          // Create profile after email verification
          if (otpData.user) {
            await supabase!.from('profiles').insert({
              id: otpData.user.id,
              email,
              name: name || email.split('@')[0],
              is_coach: false,
            })
          }
          navigate('/app')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const TITLES: Record<AuthMode, string> = {
    login: '歡迎回來',
    register: '建立帳號',
    otp: '驗證 Email',
  }
  const SUBTITLES: Record<AuthMode, string> = {
    login: '登入你的 GTO Trainer 帳號',
    register: '開始你的 GTO 學習之旅',
    otp: `驗證碼已寄送至 ${email}`,
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
        overflowY: 'auto',
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          marginTop: 52,
          marginBottom: 0,
          padding: '8px 0',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        ← 返回
      </button>

      {/* Header */}
      <div className="animate-fade-in" style={{ marginTop: 32, marginBottom: 36 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>
          {mode === 'login' ? '🔑' : mode === 'register' ? '✨' : '📧'}
        </div>
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
          }}
        >
          {TITLES[mode]}
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          {SUBTITLES[mode]}
        </p>
      </div>

      {/* Quick demo buttons (login mode only) */}
      {mode === 'login' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('student')}
            disabled={loading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              background: 'rgba(56,217,169,0.12)',
              border: '1px solid rgba(56,217,169,0.4)',
              color: '#38d9a9',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {loading ? '登入中...' : '⚡ 快速體驗（免註冊）'}
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('coach')}
            disabled={loading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              background: 'rgba(232,184,75,0.12)',
              border: '1px solid rgba(232,184,75,0.4)',
              color: '#e8b84b',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {loading ? '登入中...' : '🎓 教練體驗（免註冊）'}
          </button>
          <p style={{ margin: 0, fontSize: 11, color: '#7777a0', textAlign: 'center' }}>
            使用測試帳號體驗完整功能，資料不會被保存
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 11, color: '#44445a' }}>或用 Email 登入</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>
      )}

      {/* Google login (Supabase mode only, login/register) */}
      {!isDemoMode && mode !== 'otp' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 0 }}>
          <button
            type="button"
            onClick={() => alert('此功能暫未開放')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid #dadce0',
              color: '#3c4043',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
              transition: 'box-shadow 0.15s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            使用 Google 登入
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>或使用 Email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
        </div>
      )}

      {/* Form */}
      <form
        key={shakeKey}
        onSubmit={handleSubmit}
        className={error ? 'animate-shake' : 'animate-fade-in'}
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        {mode === 'otp' ? (
          <>
            <div>
              <label style={labelStyle}>驗證碼</label>
              <input
                className="input-field"
                placeholder="請輸入 6 位數驗證碼"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: 20 }}
              />
            </div>
          </>
        ) : (
          <>
            {mode === 'register' && (
              <div>
                <label style={labelStyle}>暱稱</label>
                <input
                  className="input-field"
                  placeholder="你的名字"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                ref={emailRef}
                className="input-field"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={labelStyle}>密碼</label>
              <input
                className="input-field"
                type="password"
                placeholder={mode === 'register' ? '至少 6 個字元' : '你的密碼'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'register' ? 6 : undefined}
              />
            </div>

            {mode === 'register' && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowCoachCode(v => !v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: 13,
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'Outfit, sans-serif',
                    marginBottom: showCoachCode ? 8 : 0,
                  }}
                >
                  {showCoachCode ? '▾' : '▸'} 我有教練代碼
                </button>
                {showCoachCode && (
                  <input
                    className="input-field"
                    placeholder="COACH-XXXXX"
                    value={coachCode}
                    onChange={e => setCoachCode(e.target.value.toUpperCase())}
                    style={{ fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.1em' }}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: 4 }}
        >
          {loading
            ? '處理中...'
            : mode === 'login'
            ? '登入'
            : mode === 'register'
            ? '建立帳號'
            : '驗證'}
        </button>

        {/* Demo test accounts hint — always show so demo accounts work */}
        {mode === 'login' && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: 'rgba(151,117,250,0.08)',
              border: '1px solid rgba(151,117,250,0.2)',
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: '#7777a0',
                marginBottom: 8,
                marginTop: 0,
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              DEMO 測試帳號
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(56,217,169,0.12)',
                  border: '1px solid rgba(56,217,169,0.3)',
                  color: '#38d9a9',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                👤 學員帳號 — student@demo.com / demo1234
              </button>
              <button
                type="button"
                onClick={() => fillDemo('coach')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(232,184,75,0.1)',
                  border: '1px solid rgba(232,184,75,0.25)',
                  color: '#e8b84b',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                🎓 教練帳號 — coach@demo.com / demo1234
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Switch mode */}
      {mode !== 'otp' && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: 14,
            color: 'var(--text-secondary)',
          }}
        >
          {mode === 'login' ? '還沒有帳號？' : '已有帳號？'}
          <button
            onClick={() => {
              setError('')
              setMode(mode === 'login' ? 'register' : 'login')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: 4,
              fontSize: 14,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {mode === 'login' ? '立即註冊' : '去登入'}
          </button>
        </p>
      )}

      {/* Demo badge */}
      {isDemoMode && (
        <div
          style={{
            margin: '24px auto 32px',
            padding: '8px 16px',
            borderRadius: 20,
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#f59e0b',
            fontSize: 12,
            textAlign: 'center',
            display: 'inline-block',
          }}
        >
          ⚡ Demo 模式 — 資料存於本機
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  letterSpacing: '0.02em',
}

export default Auth
