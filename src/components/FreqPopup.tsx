import React, { useState, useCallback } from 'react'
import type { MixedFreq } from '../types'

interface Props {
  hand: string
  initial?: MixedFreq
  onSave: (freq: MixedFreq | null) => void
  onClose: () => void
}

const DEFAULT_FREQ: MixedFreq = { raise: 50, call: 25, fold: 25 }

const FreqPopup: React.FC<Props> = ({ hand, initial, onSave, onClose }) => {
  const [freq, setFreq] = useState<MixedFreq>(initial ?? DEFAULT_FREQ)

  const total = freq.raise + freq.call + freq.fold

  const update = useCallback((key: keyof MixedFreq, value: number) => {
    setFreq(prev => {
      const next = { ...prev, [key]: Math.max(0, Math.min(100, value)) }
      return next
    })
  }, [])

  const normalize = useCallback(() => {
    if (total === 0) return
    const scale = 100 / total
    setFreq(prev => ({
      raise: Math.round(prev.raise * scale),
      call: Math.round(prev.call * scale),
      fold: Math.round(prev.fold * scale),
    }))
  }, [total])

  const handleSave = () => {
    if (Math.abs(total - 100) > 1) {
      normalize()
      return
    }
    onSave(freq)
  }

  const ACTIONS: Array<{ key: keyof MixedFreq; label: string; color: string }> = [
    { key: 'raise', label: 'Raise', color: '#6366f1' },
    { key: 'call',  label: 'Call',  color: '#10b981' },
    { key: 'fold',  label: 'Fold',  color: '#64748b' },
  ]

  const isValid = Math.abs(total - 100) <= 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '0 0 20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="animate-slide-up"
        style={{
          background: 'var(--surface-elevated)',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 32px',
          width: '100%',
          maxWidth: 430,
          border: '1px solid var(--border-strong)',
          borderBottom: 'none',
        }}
      >
        {/* Handle bar */}
        <div
          style={{
            width: 40,
            height: 4,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
            margin: '0 auto 20px',
          }}
        />

        <h3
          style={{
            margin: '0 0 4px',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          混合策略頻率
        </h3>
        <p
          style={{
            margin: '0 0 20px',
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontFamily: '"IBM Plex Mono", monospace',
          }}
        >
          {hand}
        </p>

        {/* Frequency bars */}
        <div
          style={{
            display: 'flex',
            height: 12,
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 20,
            gap: 2,
          }}
        >
          {ACTIONS.map(({ key, color }) => (
            <div
              key={key}
              style={{
                flex: freq[key],
                background: color,
                transition: 'flex 0.2s',
                minWidth: freq[key] > 0 ? 4 : 0,
              }}
            />
          ))}
        </div>

        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ACTIONS.map(({ key, label, color }) => (
            <div key={key}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color,
                    fontFamily: '"IBM Plex Mono", monospace',
                  }}
                >
                  {freq[key]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={freq[key]}
                onChange={e => update(key, Number(e.target.value))}
                style={{ width: '100%', accentColor: color }}
              />
            </div>
          ))}
        </div>

        {/* Total indicator */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            fontSize: 12,
            color: isValid ? 'var(--success)' : 'var(--danger)',
            fontFamily: '"IBM Plex Mono", monospace',
          }}
        >
          合計：{total}% {!isValid && '（需等於 100%）'}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={() => onSave(null)}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--danger)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            清除混合
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            style={{
              flex: 2,
              padding: '11px 0',
              borderRadius: 12,
              background: isValid
                ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              cursor: isValid ? 'pointer' : 'not-allowed',
              opacity: isValid ? 1 : 0.5,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {isValid ? '確認儲存' : '需正規化'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FreqPopup
