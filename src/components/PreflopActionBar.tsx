// src/components/PreflopActionBar.tsx
// GTO Wizard style: large colored buttons — Fold(blue) / Raise(red) / All-in(dark red)
import { memo } from 'react'

interface Props {
  canFold: boolean
  canCheck: boolean
  canCall: boolean
  callAmount?: number
  canRaise: boolean
  raiseAmount: number
  raiseLabel: string
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

const BTN = 'flex-1 flex items-center justify-center rounded-xl font-bold text-white transition-opacity'

export default memo(function PreflopActionBar({
  canFold, canCheck, canCall, callAmount,
  canRaise, raiseAmount, raiseLabel, effectiveStackBB,
  onAction, disabled,
}: Props) {
  const opacity = disabled ? 0.4 : 1
  const raiseIsAllin = raiseAmount >= effectiveStackBB

  return (
    <div className="flex gap-2 p-3" style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
      {canFold && (
        <button disabled={disabled} className={BTN}
                style={{ background: '#2563eb', opacity, minHeight: 52 }}
                onClick={() => onAction({ kind: 'fold' })}>
          FOLD
        </button>
      )}

      {canCheck && (
        <button disabled={disabled} className={BTN}
                style={{ background: '#374151', opacity, minHeight: 52 }}
                onClick={() => onAction({ kind: 'check' })}>
          CHECK
        </button>
      )}

      {canCall && (
        <button disabled={disabled} className={BTN}
                style={{ background: '#059669', opacity, minHeight: 52 }}
                onClick={() => onAction({ kind: 'call' })}>
          <div className="text-center">
            <div className="text-sm font-bold">CALL</div>
            <div className="text-xs opacity-80">{callAmount?.toFixed(1)}</div>
          </div>
        </button>
      )}

      {canRaise && !raiseIsAllin && (
        <button disabled={disabled} className={BTN}
                style={{ background: '#dc2626', opacity, minHeight: 52 }}
                onClick={() => onAction({ kind: 'raise', bbAmount: raiseAmount })}>
          <div className="text-center">
            <div className="text-sm font-bold">{raiseLabel.split(' ')[0].toUpperCase()}</div>
            <div className="text-xs opacity-80">{raiseLabel.split(' ').slice(1).join(' ')}</div>
          </div>
        </button>
      )}

      {(canRaise || canCheck) && (
        <button disabled={disabled} className={BTN}
                style={{ background: '#991b1b', opacity, minHeight: 52 }}
                onClick={() => onAction({ kind: 'allin' })}>
          <div className="text-center">
            <div className="text-sm font-bold">ALLIN</div>
            <div className="text-xs opacity-80">{effectiveStackBB.toFixed(0)}</div>
          </div>
        </button>
      )}
    </div>
  )
})
