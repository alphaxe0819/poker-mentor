import React from 'react'
import type { SeatDisplayInfo } from '../lib/gtoData'

interface Props {
  children?: React.ReactNode
  showPositions?: boolean
  heroPosition?: string
  seatStacks?: number[]
  seatInfo?: Record<string, SeatDisplayInfo>
  potTotal?: number
  scenarioText?: string
  flashSeat?: string
  tableSize?: 6 | 9
}

const SLOTS_6MAX = [
  { top: '86%', left: '50%' },
  { top: '70%', left: '15%' },
  { top: '22%', left: '15%' },
  { top: '10%', left: '50%' },
  { top: '22%', left: '85%' },
  { top: '70%', left: '85%' },
]

const SLOTS_9MAX = [
  { top: '88%', left: '50%' },
  { top: '72%', left: '18%' },
  { top: '45%', left: '6%'  },
  { top: '16%', left: '18%' },
  { top: '6%',  left: '50%' },
  { top: '16%', left: '82%' },
  { top: '45%', left: '94%' },
  { top: '72%', left: '82%' },
  { top: '88%', left: '68%' },
]

// Bet chip position (top/left relative to 52×52 circle container) + anchor transform
// Each points from the seat towards the table center
const BET_POSITIONS = [
  { top: -6,  left: 26, tr: 'translate(-50%,-100%)' },   // slot 0: above
  { top: 10,  left: 58, tr: 'translate(0,-50%)' },        // slot 1: right
  { top: 42,  left: 58, tr: 'translate(0,-50%)' },        // slot 2: right-lower
  { top: 60,  left: 26, tr: 'translate(-50%,0)' },        // slot 3: below
  { top: 42,  left: -6, tr: 'translate(-100%,-50%)' },    // slot 4: left-lower
  { top: 10,  left: -6, tr: 'translate(-100%,-50%)' },    // slot 5: left
]

const ORDER_6MAX = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const ORDER_9MAX = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

function getLabels(heroPos: string, tableSize: number): string[] {
  if (tableSize === 9) {
    const order = ORDER_9MAX
    const heroIdx = order.indexOf(heroPos)
    if (heroIdx === -1) return order
    return SLOTS_9MAX.map((_, i) => order[(heroIdx + i) % 9])
  }
  const order = ORDER_6MAX
  const heroIdx = order.indexOf(heroPos)
  if (heroIdx === -1) return order
  return SLOTS_6MAX.map((_, i) => order[(heroIdx + i) % 6])
}

const PokerFelt: React.FC<Props> = ({
  children,
  showPositions = false,
  heroPosition,
  seatStacks,
  seatInfo,
  potTotal,
  scenarioText,
  flashSeat,
  tableSize = 6,
}) => {
  const SLOTS = tableSize === 9 ? SLOTS_9MAX : SLOTS_6MAX
  const labels = getLabels(heroPosition ?? 'BTN', tableSize)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 230,
        background: 'radial-gradient(ellipse at center, #1f5c3a 0%, #153d27 60%, #0e2c1c 100%)',
        borderRadius: 20,
        overflow: 'visible',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.4)',
        border: '2px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Felt texture */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Table edge */}
      <div
        style={{
          position: 'absolute', inset: 8, borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none',
        }}
      />

      {/* Pot display */}
      {potTotal != null && potTotal > 0 && (
        <div
          style={{
            position: 'absolute', top: '38%', left: '50%',
            transform: 'translate(-50%,-100%)',
            fontSize: 10, fontWeight: 700,
            fontFamily: '"IBM Plex Mono", monospace',
            color: '#f59e0b',
            background: 'rgba(0,0,0,0.45)',
            padding: '2px 8px', borderRadius: 6,
            zIndex: 3, whiteSpace: 'nowrap',
          }}
        >
          POT {potTotal}bb
        </div>
      )}

      {/* Scenario text */}
      {scenarioText && (
        <div
          style={{
            position: 'absolute', top: 14, left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 9, fontWeight: 600,
            fontFamily: '"IBM Plex Mono", monospace',
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(0,0,0,0.35)',
            padding: '2px 8px', borderRadius: 4,
            zIndex: 3, whiteSpace: 'nowrap',
          }}
        >
          {scenarioText}
        </div>
      )}

      {/* Seats */}
      {showPositions &&
        SLOTS.map((slot, i) => {
          const isHero = i === 0
          const label = labels[i]
          const stack = seatStacks?.[i]
          const info = seatInfo?.[label]
          const isFolded = info?.status === 'folded'
          const isRaised = info?.status === 'raised'
          const isPosted = info?.status === 'posted'
          const isFlashing = flashSeat === label

          // Bet chip data
          let betAmount: number | null = null
          let chipColor = '#4a9eff'
          let isAllInBet = false

          if (seatInfo) {
            if (!isHero && info && !isFolded && info.bet > 0) {
              betAmount = info.bet
              if (isRaised) chipColor = '#4a9eff'
              if (isPosted) chipColor = 'rgba(74,158,255,0.5)'
              // All-in detection: bet equals stack
              if (stack != null && info.bet >= stack) {
                chipColor = '#ff4444'
                isAllInBet = true
              }
            }
          } else {
            // Legacy fallback
            if (label === 'SB') { betAmount = 0.5; chipColor = 'rgba(74,158,255,0.5)' }
            if (label === 'BB') { betAmount = 1; chipColor = '#4a9eff' }
          }

          const betPos = BET_POSITIONS[i]

          return (
            <div
              key={`slot-${i}`}
              style={{
                position: 'absolute',
                top: slot.top,
                left: slot.left,
                transform: 'translate(-50%,-50%)',
                zIndex: 2,
                opacity: isFolded ? 0.3 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Seat wrapper (52×52 relative container) */}
              <div style={{ position: 'relative', width: 52, height: 52 }}>
                {/* Circle */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    background: isHero
                      ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                      : isFolded
                      ? 'rgba(0,0,0,0.25)'
                      : 'rgba(0,0,0,0.45)',
                    border: isHero
                      ? '2px solid rgba(255,255,255,0.3)'
                      : isFlashing
                      ? '2px solid rgba(255,255,255,0.8)'
                      : isFolded
                      ? '1px solid rgba(255,255,255,0.04)'
                      : isRaised
                      ? '1.5px solid rgba(239,68,68,0.5)'
                      : '1px solid rgba(255,255,255,0.12)',
                    boxShadow: isHero
                      ? '0 0 14px rgba(99,102,241,0.5)'
                      : isFlashing
                      ? '0 0 18px rgba(255,255,255,0.6)'
                      : undefined,
                    transition: 'all 0.3s',
                  }}
                >
                  {/* Position name */}
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'Outfit, sans-serif',
                      color: isHero
                        ? '#9775fa'
                        : isFolded
                        ? 'rgba(255,255,255,0.3)'
                        : 'white',
                      lineHeight: 1,
                      textDecoration: isFolded ? 'line-through' : 'none',
                    }}
                  >
                    {label}
                  </div>
                  {/* Stack (behind = remaining chips) */}
                  {stack != null && !isFolded && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        fontFamily: '"IBM Plex Mono", monospace',
                        color: '#aaaaaa',
                        lineHeight: 1,
                      }}
                    >
                      {stack}
                    </div>
                  )}
                </div>

                {/* Bet chip — positioned towards table center */}
                {betAmount != null && (
                  <div
                    style={{
                      position: 'absolute',
                      top: betPos.top,
                      left: betPos.left,
                      transform: betPos.tr,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Dot */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: chipColor,
                        flexShrink: 0,
                        boxShadow: `0 0 4px ${chipColor}`,
                      }}
                    />
                    {/* Amount text */}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: '"IBM Plex Mono", monospace',
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      }}
                    >
                      {betAmount}
                      {isAllInBet && (
                        <span style={{ fontSize: 8, color: '#ff4444', marginLeft: 2 }}>AI</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

      {/* Center content */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PokerFelt
