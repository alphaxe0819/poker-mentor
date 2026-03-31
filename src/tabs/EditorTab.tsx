import React, { useState, useCallback } from 'react'
import type { RangeMap, Action, MixedFreq, Scenario } from '../types'
import { DEMO_SCENARIOS, allHands } from '../lib/gtoData'
import RangeGrid from '../components/RangeGrid'
import FreqPopup from '../components/FreqPopup'

interface Props {
  isCoach: boolean
}

type BrushMode = Action | 'mixed' | 'erase'

const BRUSH_CONFIG: Array<{ mode: BrushMode; label: string; emoji: string; color: string }> = [
  { mode: 'raise', label: 'Raise', emoji: '🔺', color: '#6366f1' },
  { mode: 'call',  label: 'Call',  emoji: '📞', color: '#10b981' },
  { mode: 'fold',  label: 'Fold',  emoji: '🗑️', color: '#64748b' },
  { mode: 'mixed', label: 'Mixed', emoji: '⚡', color: '#f59e0b' },
]

const EditorTab: React.FC<Props> = ({ isCoach }) => {
  const [baseScenario, setBaseScenario] = useState<Scenario | null>(DEMO_SCENARIOS[0] ?? null)
  const [range, setRange] = useState<RangeMap>(baseScenario?.range ?? {})
  const [brush, setBrush] = useState<BrushMode>('raise')
  const [selectedHand, setSelectedHand] = useState<string | null>(null)
  const [showFreqPopup, setShowFreqPopup] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCellClick = useCallback(
    (hand: string) => {
      if (brush === 'mixed') {
        setSelectedHand(hand)
        setShowFreqPopup(true)
        return
      }

      setRange(prev => ({
        ...prev,
        [hand]: {
          action: brush === 'erase' ? 'fold' : (brush as Action),
          mixed: undefined,
        },
      }))
    },
    [brush]
  )

  const handleFreqSave = useCallback(
    (freq: MixedFreq | null) => {
      if (!selectedHand) return
      if (freq === null) {
        setRange(prev => ({
          ...prev,
          [selectedHand]: { action: 'raise', mixed: undefined },
        }))
      } else {
        const dominant: Action =
          freq.raise >= freq.call && freq.raise >= freq.fold
            ? 'raise'
            : freq.call >= freq.fold
            ? 'call'
            : 'fold'
        setRange(prev => ({
          ...prev,
          [selectedHand]: { action: dominant, mixed: freq },
        }))
      }
      setShowFreqPopup(false)
      setSelectedHand(null)
    },
    [selectedHand]
  )

  const handleSave = () => {
    // TODO: save to Supabase / localStorage
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const countByAction = (() => {
    const counts = { raise: 0, call: 0, fold: 0, mixed: 0 }
    for (const hand of allHands()) {
      const d = range[hand]
      if (!d || d.action === 'fold') counts.fold++
      else if (d.mixed) counts.mixed++
      else counts[d.action]++
    }
    return counts
  })()

  if (!isCoach) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '32px',
          textAlign: 'center',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 64 }}>🔒</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          教練專屬功能
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
          Range 編輯器只開放給持有
          <br />
          教練代碼的使用者
        </p>
        <div
          style={{
            padding: '12px 20px',
            borderRadius: 12,
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#f59e0b',
            fontSize: 13,
          }}
        >
          Demo 代碼：COACH-DEMO1 · COACH-ALPHA · COACH-BETA
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px 16px 24px',
        gap: 14,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}
        >
          Range 編輯器
        </h2>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(99,102,241,0.15)',
            color: 'var(--primary)',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          教練模式
        </span>
      </div>

      {/* Scenario selector */}
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, display: 'block' }}>
          基於情境
        </label>
        <select
          value={baseScenario?.id ?? ''}
          onChange={e => {
            const s = DEMO_SCENARIOS.find(s => s.id === e.target.value)
            if (s) {
              setBaseScenario(s)
              setRange({ ...s.range })
            }
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 12,
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: 14,
            fontFamily: 'Outfit, sans-serif',
            outline: 'none',
          }}
        >
          {DEMO_SCENARIOS.map(s => (
            <option key={s.id} value={s.id} style={{ background: '#1a2235' }}>
              {s.name} ({s.position})
            </option>
          ))}
        </select>
      </div>

      {/* Brush toolbar */}
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, display: 'block' }}>
          筆刷
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {BRUSH_CONFIG.map(({ mode, label, emoji, color }) => (
            <button
              key={mode}
              onClick={() => setBrush(mode)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 10,
                background: brush === mode ? `rgba(${hexToRgb(color)},0.2)` : 'var(--surface-card)',
                border: `1.5px solid ${brush === mode ? color : 'rgba(255,255,255,0.08)'}`,
                color: brush === mode ? color : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.15s',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              <span style={{ fontSize: 16 }}>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Range grid */}
      <div style={{ padding: '0 2px' }}>
        <RangeGrid
          range={range}
          onCellClick={handleCellClick}
          showLegend
        />
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        {[
          { label: 'Raise', value: countByAction.raise, color: '#6366f1' },
          { label: 'Call',  value: countByAction.call,  color: '#10b981' },
          { label: 'Mixed', value: countByAction.mixed, color: '#f59e0b' },
          { label: 'Fold',  value: countByAction.fold,  color: '#64748b' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              textAlign: 'center',
              padding: '10px 8px',
              borderRadius: 12,
              background: 'var(--surface-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color,
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        className="btn-primary"
        onClick={handleSave}
        style={{
          background: saved
            ? 'linear-gradient(135deg, #10b981, #34d399)'
            : undefined,
        }}
      >
        {saved ? '✓ 已儲存！' : '儲存範圍'}
      </button>

      {/* Freq popup */}
      {showFreqPopup && selectedHand && (
        <FreqPopup
          hand={selectedHand}
          initial={range[selectedHand]?.mixed}
          onSave={handleFreqSave}
          onClose={() => { setShowFreqPopup(false); setSelectedHand(null) }}
        />
      )}
    </div>
  )
}

// Utility: convert hex color to r,g,b string for rgba()
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255,255,255'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}

export default EditorTab
