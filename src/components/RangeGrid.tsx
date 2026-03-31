import React, { useCallback } from 'react'
import type { RangeMap, Action, HandData } from '../types'
import { cellToHand } from '../lib/gtoData'

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'] as const

interface Props {
  range: RangeMap
  /** If provided, highlights this single hand */
  highlight?: string
  /** Called when a cell is clicked (editor mode) */
  onCellClick?: (hand: string) => void
  /** Read-only display mode */
  readOnly?: boolean
  /** Show action legend */
  showLegend?: boolean
}

function getCellStyle(data: HandData | undefined, isHighlight: boolean): React.CSSProperties {
  if (!data || data.action === 'fold') {
    return {
      background: isHighlight ? '#374151' : 'rgba(255,255,255,0.03)',
      border: isHighlight ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
    }
  }

  if (data.mixed) {
    const { raise } = data.mixed
    const raiseColor = '#6366f1'
    const callColor = '#10b981'
    return {
      background: `linear-gradient(135deg, ${raiseColor} ${raise}%, ${callColor} ${raise}%)`,
      border: isHighlight ? '2px solid #f59e0b' : '1px solid rgba(0,0,0,0.2)',
    }
  }

  const colors: Record<Action, string> = {
    raise: '#6366f1',
    call: '#10b981',
    fold: 'rgba(255,255,255,0.03)',
  }
  return {
    background: colors[data.action],
    border: isHighlight ? '2px solid #f59e0b' : '1px solid rgba(0,0,0,0.2)',
    boxShadow: isHighlight ? '0 0 12px rgba(245,158,11,0.5)' : undefined,
  }
}

function getCellText(row: number, col: number): string {
  const r = RANKS[row]
  const c = RANKS[col]
  if (row === col) return r + r
  if (row < col) return r + c  // suited: top-right triangle
  return c + r                 // offsuit: bottom-left triangle
}

const RangeGrid: React.FC<Props> = ({
  range,
  highlight,
  onCellClick,
  readOnly = false,
  showLegend = true,
}) => {
  const handleClick = useCallback(
    (row: number, col: number) => {
      if (readOnly) return
      onCellClick?.(cellToHand(row, col))
    },
    [readOnly, onCellClick]
  )

  return (
    <div className="select-none">
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(13, 1fr)',
          gap: '1.5px',
          padding: '2px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 13 }, (_, row) =>
          Array.from({ length: 13 }, (_, col) => {
            const hand = cellToHand(row, col)
            const data = range[hand]
            const isHL = hand === highlight
            const label = getCellText(row, col)
            const isSuited = row < col
            const isOffsuit = row > col
            const cellStyle = getCellStyle(data, isHL)

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                title={hand}
                style={{
                  ...cellStyle,
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: readOnly ? 'default' : 'pointer',
                  borderRadius: '2px',
                  transition: 'transform 0.1s, opacity 0.1s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (!readOnly) (e.currentTarget as HTMLDivElement).style.opacity = '0.8'
                }}
                onMouseLeave={e => {
                  if (!readOnly) (e.currentTarget as HTMLDivElement).style.opacity = '1'
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(5px, 1.1vw, 9px)',
                    fontWeight: isHL ? 700 : 500,
                    color: data?.action === 'fold' ? 'rgba(148,163,184,0.6)' : 'rgba(255,255,255,0.9)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    fontFamily: '"IBM Plex Mono", monospace',
                    userSelect: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {label}
                  {isSuited && (
                    <span style={{ fontSize: '0.7em', opacity: 0.7 }}>s</span>
                  )}
                  {isOffsuit && (
                    <span style={{ fontSize: '0.7em', opacity: 0.7 }}>o</span>
                  )}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          {(
            [
              { color: '#6366f1', label: 'Raise', border: undefined as string | undefined },
              { color: '#10b981', label: 'Call',  border: undefined as string | undefined },
              { color: 'rgba(255,255,255,0.08)', label: 'Fold', border: '1px solid rgba(255,255,255,0.1)' as string | undefined },
            ]
          ).map(({ color, label, border }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: color,
                  border: border,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RangeGrid
