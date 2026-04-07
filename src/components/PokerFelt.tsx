interface SeatDisplayInfo {
  status: 'hero' | 'raised' | 'posted' | 'folded' | 'waiting' | 'active'
  bet: number
  stack?: number
}

interface Props {
  tableSize?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  heroPosition?: string
  showPositions?: boolean
  seatStacks?: number[]
  seatInfo?: Record<string, SeatDisplayInfo>
  potTotal?: number
  scenarioText?: string
  flashSeat?: string
}

function ellipseSlots(count: number): { top: string; left: string }[] {
  const cx = 50, cy = 50, rx = 43, ry = 39
  return Array.from({ length: count }, (_, i) => {
    const angleDeg = 90 + (360 / count) * i
    const angleRad = (angleDeg * Math.PI) / 180
    return {
      left: `${(cx + rx * Math.cos(angleRad)).toFixed(1)}%`,
      top:  `${(cy + ry * Math.sin(angleRad)).toFixed(1)}%`,
    }
  })
}

const SLOT_MAP = Object.fromEntries(
  [2,3,4,5,6,7,8,9,10].map(n => [n, ellipseSlots(n)])
) as Record<number, { top: string; left: string }[]>

const POSITION_MAP: Record<number, string[]> = {
  2:  ['BTN/SB', 'BB'],
  3:  ['BTN', 'SB', 'BB'],
  4:  ['UTG', 'BTN', 'SB', 'BB'],
  5:  ['HJ', 'CO', 'BTN', 'SB', 'BB'],
  6:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  7:  ['UTG', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  8:  ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  9:  ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  10: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB', 'BB2'],
}

const STATUS_STYLE: Record<string, { bg: string; border: string }> = {
  hero:    { bg: 'bg-[#1a1a2e]', border: '2px solid #7c3aed' },
  raised:  { bg: 'bg-[#2a1a1a]', border: '1.5px solid #dc2626' },
  posted:  { bg: 'bg-[#1a1a2e]', border: '1.5px solid #3b82f6' },
  folded:  { bg: 'bg-[#111]',    border: '1.5px solid #333' },
  waiting: { bg: 'bg-[#1c1c1c]', border: '1.5px solid #3a3a3a' },
  active:  { bg: 'bg-[#1a2a1a]', border: '1.5px solid #16a34a' },
}

export default function PokerFelt({
  tableSize = 6,
  heroPosition,
  showPositions = true,
  seatStacks = [],
  seatInfo = {},
  potTotal,
  scenarioText,
}: Props) {
  const size      = Math.min(Math.max(tableSize, 2), 10) as keyof typeof SLOT_MAP
  const positions = POSITION_MAP[size]
  const slots     = SLOT_MAP[size]
  const count     = positions.length

  const heroIdx = heroPosition ? positions.indexOf(heroPosition) : 0
  const orderedPositions = heroIdx >= 0
    ? [positions[heroIdx], ...positions.slice(heroIdx + 1), ...positions.slice(0, heroIdx)]
    : positions

  return (
    <div className="relative w-full" style={{ paddingBottom: '62%' }}>
      <div
        className="absolute inset-0 rounded-[50%]"
        style={{
          background: 'radial-gradient(ellipse at center, #0d1f14 0%, #091510 70%, #060e0a 100%)',
          border: '3px solid #2a1f0e',
        }}
      />
      <div
        className="absolute rounded-[50%]"
        style={{ inset: '6%', border: '1px solid #1a3a22', opacity: 0.5 }}
      />

      {potTotal !== undefined && potTotal > 0 && (
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-gray-300 text-xs px-3 py-1 rounded-full"
             style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid #2a2a2a' }}>
          底池 {potTotal} BB
        </div>
      )}

      {scenarioText && (
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2
                        text-gray-300 text-xs text-center max-w-[62%] leading-snug">
          {scenarioText}
        </div>
      )}

      {orderedPositions.map((pos, i) => {
        const slot    = slots[i % count]
        // BTN/SB 顯示用，但 seatInfo key 是 SB
        const infoKey = pos === 'BTN/SB' ? 'SB' : pos
        const info    = seatInfo[infoKey] ?? seatInfo[pos]
        const status  = info?.status ?? 'waiting'
        const stack   = info?.stack ?? seatStacks[i] ?? 0
        const bet     = info?.bet ?? 0
        const isHero  = status === 'hero'
        const isFolded = status === 'folded'
        const topPct  = parseFloat(slot.top)
        const leftPct = parseFloat(slot.left)
        const style   = STATUS_STYLE[status] ?? STATUS_STYLE.waiting

        const betDir =
          topPct > 70 ? { bottom: '105%', left: '50%', transform: 'translateX(-50%)' } :
          topPct < 30 ? { top: '105%',    left: '50%', transform: 'translateX(-50%)' } :
          leftPct < 45 ? { left: '105%',  top: '50%',  transform: 'translateY(-50%)' } :
                         { right: '105%', top: '50%',  transform: 'translateY(-50%)' }

        return (
          <div
            key={pos}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: slot.top, left: slot.left, opacity: isFolded ? 0.35 : 1 }}
          >
            <div
              className={`relative flex flex-col items-center justify-center rounded-full ${style.bg}`}
              style={{ width: 48, height: 48, border: style.border,
                       boxShadow: isHero ? '0 0 10px 2px rgba(124,58,237,0.5)' : 'none' }}
            >
              {showPositions && (
                <span className={`text-[9px] font-bold leading-none ${isHero ? 'text-purple-300' : 'text-gray-300'}`}>
                  {pos}
                </span>
              )}
              <span className="text-[9px] leading-none mt-0.5 text-gray-500">
                {stack > 0 ? `${stack}` : '—'}
              </span>
            </div>

            {bet > 0 && (
              <div className="absolute flex items-center gap-0.5 whitespace-nowrap" style={betDir}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-gray-300 text-[9px]">{bet}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
