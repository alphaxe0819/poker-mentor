// src/components/PreflopActionBar.tsx
// Preflop-specific action bar with fixed GTO-correct raise sizes.
// HU 40BB preflop sizings:
//   - Open (0 prior raises): 2.5 BB
//   - 3-bet (1 prior raise):  ~3x the open = 7-9 BB → use 9 BB
//   - 4-bet (2 prior raises): ~2.2x the 3bet = ~20 BB → use 22 BB
//   - Beyond: all-in
import { memo } from 'react'

interface Props {
  canFold: boolean
  canCheck: boolean
  canCall: boolean
  callAmount?: number
  canRaise: boolean
  raiseAmount: number      // pre-computed raise-to size
  raiseLabel: string       // e.g. 'Raise 2.5' or '3-Bet 9'
  effectiveStackBB: number
  onAction: (action: PreflopAction) => void
  disabled?: boolean
}

export type PreflopAction =
  | { kind: 'fold' }
  | { kind: 'check' }
  | { kind: 'call' }
  | { kind: 'raise'; bbAmount: number }
  | { kind: 'allin' }

export default memo(function PreflopActionBar({
  canFold, canCheck, canCall, callAmount,
  canRaise, raiseAmount, raiseLabel, effectiveStackBB,
  onAction, disabled,
}: Props) {
  const btnBase = 'px-4 py-3 rounded-lg font-bold text-sm text-white transition-opacity'
  const opacity = disabled ? 0.4 : 1

  // If raise amount >= effective stack, just show all-in
  const raiseIsAllin = raiseAmount >= effectiveStackBB

  return (
    <div className="flex flex-wrap gap-2 justify-center p-3"
         style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>

      {canFold && (
        <button disabled={disabled}
                className={btnBase}
                style={{ background: '#374151', opacity }}
                onClick={() => onAction({ kind: 'fold' })}>
          Fold
        </button>
      )}

      {canCheck && (
        <button disabled={disabled}
                className={btnBase}
                style={{ background: '#374151', opacity }}
                onClick={() => onAction({ kind: 'check' })}>
          Check
        </button>
      )}

      {canCall && (
        <button disabled={disabled}
                className={btnBase}
                style={{ background: '#1e40af', opacity }}
                onClick={() => onAction({ kind: 'call' })}>
          Call {callAmount?.toFixed(1)}
        </button>
      )}

      {canRaise && !raiseIsAllin && (
        <button disabled={disabled}
                className={btnBase}
                style={{ background: '#7c3aed', opacity }}
                onClick={() => onAction({ kind: 'raise', bbAmount: raiseAmount })}>
          {raiseLabel}
        </button>
      )}

      {(canRaise || canCheck) && (
        <button disabled={disabled}
                className={btnBase}
                style={{ background: '#dc2626', opacity }}
                onClick={() => onAction({ kind: 'allin' })}>
          All-in {effectiveStackBB.toFixed(0)}
        </button>
      )}
    </div>
  )
})
