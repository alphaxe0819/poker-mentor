import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Profile } from '../types'
import { isDemoMode, supabase } from '../lib/supabase'
import { demoAuth } from '../lib/demoAuth'

interface Props {
  profile: Profile
  onProfileUpdate: (p: Profile) => void
}

const ProfileTab: React.FC<Props> = ({ profile, onProfileUpdate }) => {
  const navigate = useNavigate()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(profile.name)
  const [coachCodeInput, setCoachCodeInput] = useState('')
  const [showCoachInput, setShowCoachInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const flash = (msg: string, isError = false) => {
    if (isError) setError(msg)
    else setSuccessMsg(msg)
    setTimeout(() => { setError(''); setSuccessMsg('') }, 3000)
  }

  const handleSaveName = async () => {
    if (!nameInput.trim()) return
    setLoading(true)
    try {
      if (isDemoMode) {
        await demoAuth.updateName(profile.id, nameInput.trim())
        onProfileUpdate({ ...profile, name: nameInput.trim() })
        flash('名稱已更新')
      } else if (supabase) {
        const { error: err } = await supabase
          .from('profiles')
          .update({ name: nameInput.trim() })
          .eq('id', profile.id)
        if (err) { flash(err.message, true); return }
        onProfileUpdate({ ...profile, name: nameInput.trim() })
        flash('名稱已更新')
      }
      setEditingName(false)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyCoachCode = async () => {
    if (!coachCodeInput.trim()) return
    setLoading(true)
    try {
      if (isDemoMode) {
        const { error: err } = await demoAuth.applyCoachCode(profile.id, coachCodeInput.trim())
        if (err) { flash(err, true); return }
        onProfileUpdate({ ...profile, is_coach: true })
        flash('教練權限已啟用！')
        setShowCoachInput(false)
        setCoachCodeInput('')
      } else if (supabase) {
        // Check coach code in Supabase
        const code = coachCodeInput.trim().toUpperCase()
        const { data: codeRow } = await supabase
          .from('coach_codes')
          .select('*')
          .eq('code', code)
          .single()
        if (!codeRow) { flash('無效的教練代碼', true); return }
        if (codeRow.used_by) { flash('此代碼已被使用', true); return }

        // Mark code as used
        await supabase
          .from('coach_codes')
          .update({ used_by: profile.id, used_at: new Date().toISOString() })
          .eq('code', code)

        // Update profile
        const { error: err } = await supabase
          .from('profiles')
          .update({ is_coach: true })
          .eq('id', profile.id)
        if (err) { flash(err.message, true); return }

        onProfileUpdate({ ...profile, is_coach: true })
        flash('教練權限已啟用！')
        setShowCoachInput(false)
        setCoachCodeInput('')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (isDemoMode) {
      await demoAuth.logout()
    } else if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '16px 16px 32px',
        gap: 16,
      }}
    >
      {/* Avatar + name */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 0 20px',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 700,
            color: 'white',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          }}
        >
          {profile.name?.[0]?.toUpperCase() ?? '?'}
        </div>

        {editingName ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              className="input-field"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              style={{ width: 180, textAlign: 'center' }}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSaveName() }}
            />
            <button
              onClick={handleSaveName}
              disabled={loading}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--primary)',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                fontSize: 13,
              }}
            >
              儲存
            </button>
            <button
              onClick={() => { setEditingName(false); setNameInput(profile.name) }}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                fontSize: 13,
              }}
            >
              取消
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                margin: '0 0 4px',
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              {profile.name}
            </h2>
            <button
              onClick={() => setEditingName(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              ✏️ 編輯名稱
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              fontFamily: '"IBM Plex Mono", monospace',
            }}
          >
            {profile.email}
          </span>
          {profile.is_coach && (
            <span
              style={{
                padding: '2px 10px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              教練
            </span>
          )}
        </div>
      </div>

      {/* Flash messages */}
      {successMsg && (
        <div
          className="animate-fade-in"
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: 'var(--success)',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          ✓ {successMsg}
        </div>
      )}
      {error && (
        <div
          className="animate-fade-in"
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--danger)',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {/* Info cards */}
      <div
        style={{
          borderRadius: 16,
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <InfoRow label="帳號類型" value={profile.is_coach ? '教練帳號' : '學員帳號'} />
        <InfoRow label="加入時間" value={new Date(profile.created_at).toLocaleDateString('zh-TW')} divider />
        <InfoRow label="模式" value={isDemoMode ? 'Demo（本機）' : 'Supabase 雲端'} divider />
      </div>

      {/* Coach code section (non-coach only) */}
      {!profile.is_coach && (
        <div
          style={{
            borderRadius: 16,
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            padding: '16px',
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              升級教練帳號
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              輸入教練代碼即可解鎖 Range 編輯器
            </div>
          </div>

          {!showCoachInput ? (
            <button
              onClick={() => setShowCoachInput(true)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 10,
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              輸入教練代碼
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input-field"
                placeholder="COACH-XXXXX"
                value={coachCodeInput}
                onChange={e => setCoachCodeInput(e.target.value.toUpperCase())}
                style={{ fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.05em' }}
                autoFocus
              />
              <button
                onClick={handleApplyCoachCode}
                disabled={loading || !coachCodeInput.trim()}
                style={{
                  padding: '0 16px',
                  borderRadius: 10,
                  background: 'var(--primary)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'Outfit, sans-serif',
                  flexShrink: 0,
                }}
              >
                啟用
              </button>
            </div>
          )}

          {isDemoMode && showCoachInput && (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              Demo 代碼：COACH-DEMO1 / COACH-ALPHA / COACH-BETA
            </p>
          )}
        </div>
      )}

      {/* Cloud sync status */}
      <div
        style={{
          padding: '16px',
          borderRadius: 16,
          border: `1px ${isDemoMode ? 'dashed' : 'solid'} ${isDemoMode ? 'rgba(255,255,255,0.08)' : 'rgba(16,185,129,0.25)'}`,
          background: isDemoMode ? 'transparent' : 'rgba(16,185,129,0.06)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 20, marginBottom: 6 }}>{isDemoMode ? '☁️' : '✅'}</div>
        <div style={{ fontSize: 13, color: isDemoMode ? 'var(--text-muted)' : '#10b981' }}>
          {isDemoMode ? '登入 Supabase 帳號以啟用雲端同步' : '訓練記錄已自動同步至雲端'}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: 8,
          padding: '12px',
          borderRadius: 12,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: 'var(--danger)',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 15,
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        登出
      </button>
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: string
  divider?: boolean
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value, divider }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 16px',
      borderTop: divider ? '1px solid var(--border)' : undefined,
    }}
  >
    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
  </div>
)

export default ProfileTab
