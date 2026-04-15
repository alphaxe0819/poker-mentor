import { memo, useCallback, useRef } from 'react'

export type StreetState = 'best' | 'ok' | 'doubt' | 'err' | 'pending'
export type Street = 'preflop' | 'flop' | 'turn' | 'river'

export interface ActionFreq {
  label: string       // "3-Bet to 7.5" / "Call" etc
  freq: number        // 0..100
  color: string       // palette color e.g. '#ef4444'
  evText?: string     // "EV +3.2"
  isYours?: boolean   // highlight your choice
}

export interface StreetScore {
  street: Street
  state: StreetState
}

interface Props {
  isCorrect: boolean
  tip: string                          // "AKo · BTN vs UTG 高頻 3-bet"
  actions: ActionFreq[]                // for frequency bar + rows
  streets: StreetScore[]               // 4 chips
  explanation?: string                 // long-form, shown when expanded
  explanationTitle?: string            // h4 in expanded block
  expanded: boolean
  onToggleExpand: () => void
  onViewRange: () => void
  onNext: () => void
  onAskAI?: () => void
}

const STREET_LABELS: Record<Street, string> = {
  preflop: '翻前', flop: '翻牌', turn: '轉牌', river: '河牌',
}

const STREET_STATE_STYLE: Record<StreetState, { border: string; bg: string; color: string; text: string }> = {
  best:    { border: '#1e5a3d', bg: '#0a1d14', color: '#34d399', text: '✓✓ 最佳' },
  ok:      { border: '#1a4770', bg: '#0a1523', color: '#60a5fa', text: '✓ 正確' },
  doubt:   { border: '#6b4a1a', bg: '#1a1208', color: '#fbbf24', text: '! 存疑' },
  err:     { border: '#5a1a1a', bg: '#1a0a0a', color: '#f87171', text: '⊘ 錯誤' },
  pending: { border: '#1f232b', bg: '#0c0e12', color: '#565d6a', text: '—' },
}

export default memo(function FeedbackSheetV2({
  isCorrect, tip, actions, streets,
  explanation, explanationTitle = '為什麼？',
  expanded, onToggleExpand, onViewRange, onNext, onAskAI,
}: Props) {
  // Drag state for handle
  const dragStart = useRef<number | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientY
  }, [])
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragStart.current == null) return
    const dy = e.clientY - dragStart.current
    dragStart.current = null
    if (dy < -30 && !expanded) onToggleExpand()
    else if (dy > 30 && expanded) onToggleExpand()
  }, [expanded, onToggleExpand])

  const totalFreq = actions.reduce((s, a) => s + a.freq, 0) || 100

  return (
    <>
      <div className="absolute inset-0 bg-black/45 z-[9]" onClick={onToggleExpand} />
      <div
        className="absolute left-0 right-0 bottom-0 z-[10] flex flex-col gap-2.5 px-3 pb-3.5 pt-2
                   rounded-t-2xl"
        style={{
          background: '#0f1116',
          borderTop: '1px solid #1f232b',
          boxShadow: '0 -10px 30px rgba(0,0,0,.5)',
          maxHeight: '92%',
          overflowY: 'auto',
        }}>
        {/* Handle */}
        <div
          className="self-center w-9 h-[3px] rounded mb-0.5 cursor-grab"
          style={{ background: '#3a3f4a' }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClick={onToggleExpand}
        />

        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-extrabold flex items-center gap-1.5"
            style={{ color: isCorrect ? '#10b981' : '#f87171' }}>
            {isCorrect ? '✓ 正確' : '✗ 不對'}
          </div>
          <div className="ml-auto text-[11px]" style={{ color: '#8a92a0' }}>
            {tip}
          </div>
        </div>

        {/* Frequency bar */}
        <div>
          <div className="flex h-1.5 rounded overflow-hidden" style={{ background: '#1b1f27' }}>
            {actions.map((a, i) => (
              <div key={i} style={{ background: a.color, width: `${(a.freq / totalFreq) * 100}%` }} />
            ))}
          </div>
          <div className="flex gap-2 text-[10px] mt-0.5" style={{ color: '#8a92a0' }}>
            {actions.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: a.color }} />
                {a.label} {a.freq}%
              </span>
            ))}
            <span className="ml-auto" style={{ color: '#c8b6ff' }}>
              你：{actions.find(a => a.isYours)?.label ?? '—'}
            </span>
          </div>
        </div>

        {/* Action freq rows */}
        <div className="flex flex-col gap-[3px]">
          {actions.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[11px]"
              style={
                a.isYours
                  ? { background: '#0d111a', border: '1px solid #2a3550', borderRadius: 6, padding: '4px 8px' }
                  : { padding: '4px 2px' }
              }>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }} />
              <span className="flex-1 font-semibold text-white">
                {a.label}{a.isYours ? '（你的選擇）' : ''}
              </span>
              <span className="font-bold text-white min-w-[34px] text-right">{a.freq}%</span>
              {a.evText && <span className="text-[10px]" style={{ color: '#8a92a0' }}>{a.evText}</span>}
            </div>
          ))}
        </div>

        {/* Street chips */}
        <div className="flex gap-1.5 mt-1.5">
          {streets.map((s, i) => {
            const style = STREET_STATE_STYLE[s.state]
            return (
              <div key={i}
                className="flex-1 rounded-[7px] flex flex-col items-center gap-[1px] py-1.5 px-1"
                style={{
                  border: `1px solid ${style.border}`,
                  background: style.bg,
                  opacity: s.state === 'pending' ? 0.4 : 1,
                }}>
                <div className="text-[10px] font-bold text-white">{STREET_LABELS[s.street]}</div>
                <div className="text-[9px] font-bold" style={{ color: style.color }}>{style.text}</div>
              </div>
            )
          })}
        </div>

        {/* Expanded only */}
        {expanded && explanation && (
          <div
            className="rounded-lg px-3 py-2.5 text-[11px] leading-[1.7]"
            style={{ background: '#0c0e12', border: '1px solid #1f232b', color: '#c8ccd4' }}>
            <h4 className="text-[11px] font-bold text-white m-0 mb-1.5">{explanationTitle}</h4>
            {explanation.split('\n').map((p, i) => (
              <p key={i} className="m-0 mb-1.5 last:mb-0">{p}</p>
            ))}
          </div>
        )}

        {expanded && onAskAI && (
          <button
            onClick={onAskAI}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #1a1040, #0c0e12)',
              border: '1px solid #342056',
            }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
              style={{ background: 'radial-gradient(circle at 30% 30%, #c8b6ff, #5b2fd6)' }}>🤖</div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">和 AI 教練深入討論</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#8a92a0' }}>
                詢問這手背景、替代路線等 · 5 點/則
              </div>
            </div>
            <div className="text-sm" style={{ color: '#a78bfa' }}>›</div>
          </button>
        )}

        {/* Actions row */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onViewRange}
            className="flex-1 min-h-[40px] rounded-[9px] text-[13px] font-bold flex items-center justify-center gap-1.5"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#aaa' }}>
            ⊞ 查看範圍
          </button>
          <button
            onClick={onNext}
            className="flex-1 min-h-[40px] rounded-[9px] text-[13px] font-bold text-white flex items-center justify-center gap-1.5"
            style={{ background: '#7c3aed' }}>
            ▶▶ 下一手
          </button>
        </div>
      </div>
    </>
  )
})

// Helper: decide street score state from hero's chosen action frequency
export function scoreByFreq(chosenFreq: number): StreetState {
  if (chosenFreq >= 60) return 'best'
  if (chosenFreq >= 20) return 'ok'
  if (chosenFreq >= 5) return 'doubt'
  return 'err'
}
