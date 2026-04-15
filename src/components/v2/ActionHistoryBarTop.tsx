import { memo } from 'react'

export interface HistoryItem {
  label: string       // "UTG", "BTN", "Flop", etc.
  detail: string      // "R 2.5", "Call", "F", "K♣7♠2♠", "?"
  kind?: 'villain' | 'hero' | 'folded' | 'neutral'
}

interface Props {
  items: HistoryItem[]
  onBack?: () => void
  rightSlot?: React.ReactNode  // e.g. GG button in HU review
  stats?: {
    accuracy?: number       // 0-100
    streak?: number
    progress?: string       // "4/10"
  }
}

const KIND_STYLE: Record<string, { bg: string; border: string; color: string; labelColor: string }> = {
  villain:  { bg: '#1f0f0f', border: '#3a1818', color: '#fca5a5', labelColor: '#fca5a5' },
  hero:     { bg: '#14102a', border: '#3a2a6a', color: '#c8b6ff', labelColor: '#fff' },
  folded:   { bg: '#0f1218', border: '#1f232b', color: '#8a92a0', labelColor: '#8a92a0' },
  neutral:  { bg: '#151820', border: '#1f232b', color: '#8a92a0', labelColor: '#e6e8ec' },
}

export default memo(function ActionHistoryBarTop({ items, onBack, rightSlot, stats }: Props) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto flex-shrink-0"
      style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', scrollbarWidth: 'none' as const }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm"
          style={{ background: '#1a1a1a', color: '#888' }}
          aria-label="返回"
        >
          ←
        </button>
      )}
      {items.map((it, i) => {
        const s = KIND_STYLE[it.kind ?? 'neutral']
        const faded = it.kind === 'folded'
        return (
          <div
            key={i}
            className="flex items-center gap-[3px] px-2 py-1 rounded-md text-[10px] whitespace-nowrap flex-shrink-0"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              color: s.color,
              opacity: faded ? 0.5 : 1,
            }}>
            <b className="font-bold mr-0.5" style={{ color: s.labelColor }}>{it.label}</b>
            {it.detail}
          </div>
        )
      })}
      {stats && (
        <div className="ml-auto flex-shrink-0 flex items-center gap-2 text-[10px] pl-2"
          style={{ color: '#8a92a0' }}>
          {stats.accuracy !== undefined && (
            <span>正確率 <b style={{ color: '#8be58b', fontWeight: 700 }}>{stats.accuracy}%</b></span>
          )}
          {stats.streak !== undefined && (
            <span>連擊 <b style={{ color: '#e6e8ec', fontWeight: 700 }}>{stats.streak}</b></span>
          )}
          {stats.progress && (
            <span style={{ color: '#e6e8ec', fontWeight: 700 }}>{stats.progress}</span>
          )}
        </div>
      )}
      {rightSlot && (
        <div className="ml-auto flex-shrink-0">{rightSlot}</div>
      )}
    </div>
  )
})
