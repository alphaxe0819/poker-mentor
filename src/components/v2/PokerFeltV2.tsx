import { memo } from 'react'

interface SeatDisplayInfo {
  status: 'hero' | 'raised' | 'posted' | 'folded' | 'waiting' | 'active'
  bet: number
  stack?: number
  hasCards?: boolean
}

interface Props {
  tableSize?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  heroPosition?: string
  showPositions?: boolean
  seatInfo?: Record<string, SeatDisplayInfo>
  potTotal?: number
  boardCards?: Array<{ rank: string; suit: 's' | 'h' | 'd' | 'c' }>
}

const POSITION_MAP: Record<number, string[]> = {
  2:  ['BTN', 'BB'],
  3:  ['BTN', 'SB', 'BB'],
  4:  ['UTG', 'BTN', 'SB', 'BB'],
  5:  ['HJ', 'CO', 'BTN', 'SB', 'BB'],
  6:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  7:  ['UTG', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  8:  ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  9:  ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  10: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB', 'BB2'],
}

// Pill aspect ratio (W:H) used for seat layout math. Adjust if felt container changes.
const PILL_W = 84, PILL_H = 120   // relative units
const PILL_R = PILL_W / 2         // semi-circle radius
const PILL_L = PILL_H - PILL_W    // straight-side length

// Compute seat positions on pill perimeter, slot 0 = bottom center, going CCW on screen (CW on table)
function pillSeatSlots(count: number): Array<{ left: string; top: string }> {
  const perimeter = 2 * Math.PI * PILL_R + 2 * PILL_L
  const spacing = perimeter / count
  const halfBottomSemi = Math.PI * PILL_R / 2
  const leftStraightEnd = halfBottomSemi + PILL_L
  const topSemiEnd = leftStraightEnd + Math.PI * PILL_R
  const rightStraightEnd = topSemiEnd + PILL_L

  function pointAt(s: number): { x: number; y: number } {
    if (s <= halfBottomSemi) {
      const phi = s / PILL_R
      return { x: PILL_W / 2 - PILL_R * Math.sin(phi), y: PILL_H - PILL_R + PILL_R * Math.cos(phi) }
    }
    if (s <= leftStraightEnd) {
      const d = s - halfBottomSemi
      return { x: 0, y: (PILL_H - PILL_R) - d }
    }
    if (s <= topSemiEnd) {
      const alpha = (s - leftStraightEnd) / PILL_R
      return { x: PILL_W / 2 - PILL_R * Math.cos(alpha), y: PILL_R - PILL_R * Math.sin(alpha) }
    }
    if (s <= rightStraightEnd) {
      const d = s - topSemiEnd
      return { x: PILL_W, y: PILL_R + d }
    }
    const e = s - rightStraightEnd
    return { x: PILL_W / 2 + PILL_R * Math.cos(e / PILL_R), y: PILL_H - PILL_R + PILL_R * Math.sin(e / PILL_R) }
  }

  // Translate pill coord → felt container %: outline inset 8%, outline spans 8..92 each axis
  return Array.from({ length: count }, (_, i) => {
    const { x, y } = pointAt(i * spacing)
    return {
      left: `${(8 + (x / PILL_W) * 84).toFixed(1)}%`,
      top: `${(8 + (y / PILL_H) * 84).toFixed(1)}%`,
    }
  })
}

const SLOT_MAP = Object.fromEntries(
  [2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => [n, pillSeatSlots(n)])
) as Record<number, Array<{ left: string; top: string }>>

// Seat circles are OPAQUE (not transparent) so the pill outline line doesn't bleed through.
const STATUS_STYLE: Record<string, { border: string; bg: string; shadow: string; posColor: string; stackColor: string }> = {
  hero:    { border: '2px solid #a78bfa', bg: '#16181d', shadow: '0 0 10px rgba(167,139,250,.4)', posColor: '#d6c8ff', stackColor: '#c8b6ff' },
  raised:  { border: '2px solid #dc2626', bg: '#16181d', shadow: '0 0 8px rgba(220,38,38,.35)', posColor: '#fecaca', stackColor: '#8a92a0' },
  active:  { border: '2px solid #10b981', bg: '#16181d', shadow: '0 0 8px rgba(16,185,129,.35)', posColor: '#a7f3d0', stackColor: '#8a92a0' },
  posted:  { border: '1.5px solid #4a5060', bg: '#14161b', shadow: 'none', posColor: '#aab0bb', stackColor: '#8a92a0' },
  waiting: { border: '1.5px solid #4a5060', bg: '#14161b', shadow: 'none', posColor: '#aab0bb', stackColor: '#8a92a0' },
  folded:  { border: '1.5px dashed #4a5060', bg: '#0d0f13', shadow: 'none', posColor: '#8a92a0', stackColor: '#6a7080' },
}

const SUIT_BG: Record<string, string> = {
  s: '#3a3d44', h: '#8b2232', d: '#1e5faa', c: '#1a7a3a',
}
const SUIT_BORDER: Record<string, string> = {
  s: '#555860', h: '#b02e42', d: '#2a78d4', c: '#22994a',
}
const SUIT_SYMBOL: Record<string, string> = {
  s: '♠', h: '♥', d: '♦', c: '♣',
}

export default memo(function PokerFeltV2({
  tableSize = 6,
  heroPosition,
  showPositions = true,
  seatInfo = {},
  potTotal,
  boardCards,
}: Props) {
  const size = Math.min(Math.max(tableSize, 2), 10) as keyof typeof SLOT_MAP
  const positions = POSITION_MAP[size]
  const slots = SLOT_MAP[size]
  const count = positions.length

  const heroIdx = heroPosition ? positions.indexOf(heroPosition) : positions.indexOf('BTN')
  const safeHeroIdx = heroIdx >= 0 ? heroIdx : 0
  const orderedPositions = [
    ...positions.slice(safeHeroIdx),
    ...positions.slice(0, safeHeroIdx),
  ]

  return (
    <div className="relative w-full h-full">
      {/* Capsule outline */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '8%', border: '1.5px solid #2a2f3a', borderRadius: 9999 }}
      />

      {/* Center info: pot + board */}
      {(potTotal !== undefined || boardCards?.length) && (
        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-[2]">
          {potTotal !== undefined && potTotal > 0 && (
            <div className="text-xs text-gray-400">
              底池<b className="text-white text-sm font-bold mx-0.5">{potTotal}</b>BB
            </div>
          )}
          {boardCards && boardCards.length > 0 && (
            <div className="flex gap-[3px]">
              {boardCards.map((c, i) => (
                <div key={i}
                  className="relative flex items-center justify-center rounded"
                  style={{
                    width: 30, height: 42, color: '#fff',
                    background: SUIT_BG[c.suit],
                    border: `1.5px solid ${SUIT_BORDER[c.suit]}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,.5)',
                  }}>
                  <span className="absolute top-0.5 left-1 text-[13px] font-bold" style={{ color: 'rgba(255,255,255,.95)' }}>
                    {SUIT_SYMBOL[c.suit]}
                  </span>
                  <span className="text-[17px] font-black leading-none">{c.rank}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seats */}
      {orderedPositions.map((pos, i) => {
        const slot = slots[i % count]
        const info = seatInfo[pos]
        const status = info?.status ?? (i === 0 ? 'hero' : 'waiting')
        const stack = info?.stack ?? 0
        const bet = info?.bet ?? 0
        const hasCards = info?.hasCards ?? (status !== 'folded' && status !== 'hero')
        const style = STATUS_STYLE[status] ?? STATUS_STYLE.waiting
        const isHero = status === 'hero'
        const isDealer = pos === 'BTN' || pos === 'BTN/SB'

        return (
          <div key={pos}>
            {/* Hole cards (face-down G G) for non-hero active seats — TOP layer */}
            {hasCards && !isHero && (
              <div
                className="absolute flex gap-[2px]"
                style={{
                  zIndex: 4,
                  left: slot.left,
                  top: `calc(${slot.top} - 5%)`,
                  transform: 'translate(-50%, -50%)',
                }}>
                <div style={holeBackStyle}><span>G</span></div>
                <div style={holeBackStyle}><span>G</span></div>
              </div>
            )}

            {/* Seat circle — MIDDLE layer (opaque so outline doesn't bleed through) */}
            <div
              className="absolute flex flex-col items-center rounded-full"
              style={{
                zIndex: 2,
                left: slot.left, top: slot.top,
                width: 46, height: 46,
                background: style.bg,
                border: style.border,
                boxShadow: style.shadow,
                transform: 'translate(-50%, -50%)',
                paddingTop: 14,   // shift inner text down so cards don't cover position name
              }}>
              {showPositions && (
                <span className="text-[10px] font-bold leading-none" style={{ color: style.posColor }}>
                  {pos === 'BB2' ? 'BB' : pos}
                </span>
              )}
              <span className="text-[9px] leading-none mt-0.5" style={{ color: style.stackColor }}>
                {stack > 0 ? stack : '—'}
              </span>
              {isDealer && (
                <div
                  className="absolute rounded-full bg-white text-black font-black flex items-center justify-center"
                  style={{
                    bottom: -4, right: -4, width: 14, height: 14,
                    fontSize: 8, border: '1px solid #000', zIndex: 5,
                  }}>
                  D
                </div>
              )}
            </div>

            {/* Bet chip toward table center — past the cards */}
            {bet > 0 && (
              <div
                className="absolute flex items-center gap-[3px] rounded-full"
                style={{
                  zIndex: 3,
                  left: `calc(${slot.left} + ${(50 - parseFloat(slot.left)) * 0.22}%)`,
                  top: `calc(${slot.top} + ${(50 - parseFloat(slot.top)) * 0.22}%)`,
                  transform: 'translate(-50%, -50%)',
                  padding: '2px 6px',
                  background: 'rgba(0,0,0,.7)',
                  border: '1px solid #2a2a2a',
                  fontSize: 9,
                  color: '#e5e7eb',
                  whiteSpace: 'nowrap',
                }}>
                <span
                  className="inline-block w-[6px] h-[6px] rounded-full"
                  style={{
                    background: status === 'raised'
                      ? 'radial-gradient(circle at 30% 30%, #ff9a9a, #9c1919)'
                      : isHero
                      ? 'radial-gradient(circle at 30% 30%, #c8b6ff, #5b2fd6)'
                      : 'radial-gradient(circle at 30% 30%, #6ea8ff, #1f4bb8)',
                  }}
                />
                {bet}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
})

const holeBackStyle: React.CSSProperties = {
  width: 22, height: 30, borderRadius: 4,
  background: '#4a5162', border: '1px solid #6a7184',
  boxShadow: '0 1px 3px rgba(0,0,0,.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,.6)',
  fontFamily: 'serif', letterSpacing: -1,
}
