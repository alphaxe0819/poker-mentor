import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Position } from '../types'

const ALL_POSITIONS: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']

interface SavedStats {
  total: number
  correct: number
  accuracy: number
  streak: number
  lastCoach?: string
}

function readStats(): SavedStats | null {
  try {
    const raw = localStorage.getItem('gto_stats')
    if (!raw) return null
    const s = JSON.parse(raw) as SavedStats
    return s.total > 0 ? s : null
  } catch {
    return null
  }
}

function readPrefPositions(): Position[] {
  try {
    const raw = localStorage.getItem('gto_pref_positions')
    if (!raw) return []
    return JSON.parse(raw) as Position[]
  } catch {
    return []
  }
}

const Splash: React.FC = () => {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [savedStats] = useState<SavedStats | null>(readStats)
  const [selectedPositions, setSelectedPositions] = useState<Position[]>(readPrefPositions)

  // Animated card rain background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const SUITS = ['♠', '♥', '♦', '♣']
    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      suit: SUITS[Math.floor(Math.random() * 4)],
      size: 12 + Math.random() * 16,
      speed: 0.4 + Math.random() * 0.8,
      opacity: 0.05 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.3,
    }))

    let raf: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.font = `${p.size}px serif`
        ctx.fillStyle =
          p.suit === '♥' || p.suit === '♦'
            ? `rgba(239,68,68,${p.opacity})`
            : `rgba(248,250,252,${p.opacity})`
        ctx.fillText(p.suit, p.x, p.y)
        p.y += p.speed
        p.x += p.drift
        if (p.y > canvas.height + 30) {
          p.y = -30
          p.x = Math.random() * canvas.width
        }
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  const togglePosition = (pos: Position) => {
    setSelectedPositions(prev => {
      const next = prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
      try { localStorage.setItem('gto_pref_positions', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }

  const handleStart = () => {
    navigate('/auth?mode=register')
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1525 50%, #0a0e1a 100%)',
        padding: '0 24px',
      }}
    >
      {/* BG canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 32,
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          }}
        >
          ♠
        </div>

        <h1
          style={{
            margin: '0 0 6px',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: '#ffffff' }}>Poker</span>{' '}
          <span style={{ color: '#9775fa' }}>Mentor</span>
        </h1>
        <p
          style={{
            margin: '0 0 20px',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          德州撲克 GTO 翻前訓練平台
        </p>

        {/* ── Historical stats bar (if any training data) ─────────────────── */}
        {savedStats && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 12,
              padding: '10px 8px',
              marginBottom: 16,
            }}
          >
            {[
              {
                value: `${savedStats.accuracy}%`,
                label: '準確率',
                color:
                  savedStats.accuracy >= 70
                    ? '#10b981'
                    : savedStats.accuracy >= 50
                    ? '#f59e0b'
                    : '#ef4444',
              },
              {
                value: savedStats.streak >= 1 ? `${savedStats.streak}🔥` : '0',
                label: '連勝',
                color: savedStats.streak >= 3 ? '#f59e0b' : 'var(--text-primary)',
              },
              {
                value: savedStats.total.toString(),
                label: '累計手數',
                color: 'var(--primary)',
              },
            ].map(({ value, label, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    fontFamily: '"IBM Plex Mono", monospace',
                    color,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    marginTop: 3,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Coach source bar ────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '8px 12px',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>📚</span>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>當前教練</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {savedStats?.lastCoach ?? 'GTO Demo Coach'}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/app')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
              padding: '4px 8px',
            }}
          >
            更換
          </button>
        </div>

        {/* ── Position chips (multi-select) ────────────────────────────────── */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            快速選擇位置
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {ALL_POSITIONS.map(pos => {
              const isSelected = selectedPositions.includes(pos)
              return (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: `1.5px solid ${isSelected ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.12)'}`,
                    background: isSelected ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {pos}
                </button>
              )
            })}
          </div>
          {selectedPositions.length > 0 && (
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              已選 {selectedPositions.length} 個位置
            </div>
          )}
        </div>

        {/* ── Static stats row (always shown) ─────────────────────────────── */}
        {!savedStats && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 28,
              marginBottom: 28,
            }}
          >
            {[
              { value: '169', label: '手牌組合' },
              { value: '6+', label: '練習情境' },
              { value: 'GTO', label: '解算精度' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'var(--primary)',
                    fontFamily: '"IBM Plex Mono", monospace',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA Buttons ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            className="btn-primary animate-pulse-glow"
            onClick={handleStart}
          >
            {savedStats ? '繼續練習 →' : '免費開始練習'}
          </button>
          <button
            className="btn-ghost"
            onClick={() => navigate('/auth?mode=login')}
          >
            已有帳號，登入
          </button>
        </div>

        {/* Demo mode hint */}
        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          Demo 模式免費使用，無需信用卡
        </p>
      </div>
    </div>
  )
}

export default Splash
