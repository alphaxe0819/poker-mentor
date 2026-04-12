// src/components/PostflopActionBar.tsx
import { memo } from 'react'

interface Props {
  /** Available actions */
  canFold: boolean
  canCheck: boolean
  canCall: boolean
  callAmount?: number  // BB to call
  canBet: boolean
  canRaise: boolean
  potBB: number
  effectiveStackBB: number
  /** Whether to show XS / XL hidden buttons */
  showXS: boolean
  showXL: boolean
  /** Callbacks */
  onAction: (action: ActionChoice) => void
  /** Disabled while bot is thinking */
  disabled?: boolean
}

export type ActionChoice =
  | { kind: 'fold' }
  | { kind: 'check' }
  | { kind: 'call' }
  | { kind: 'bet'; bbAmount: number }
  | { kind: 'raise'; bbAmount: number }
  | { kind: 'allin' }

export default memo(function PostflopActionBar({
  canFold, canCheck, canCall, callAmount,
  canBet, canRaise, potBB, effectiveStackBB,
  showXS, showXL, onAction, disabled,
}: Props) {

  const xsAmount = Math.max(1, Math.round(potBB * 0.15 * 10) / 10)
  const smallAmount = Math.round(potBB * 0.33 * 10) / 10
  const midAmount = Math.round(potBB * 0.5 * 10) / 10
  const largeAmount = Math.round(potBB * 1.0 * 10) / 10
  const xlAmount = Math.round(potBB * 2.0 * 10) / 10

  function handleSize(amt: number) {
    // Cap at effective stack → all-in
    if (amt >= effectiveStackBB) {
      onAction({ kind: 'allin' })
      return
    }
    onAction(canBet
      ? { kind: 'bet', bbAmount: amt }
      : { kind: 'raise', bbAmount: amt })
  }

  const btnBase = 'px-3 py-2 rounded-lg font-bold text-xs text-white transition-opacity'
  const opacity = disabled ? 0.4 : 1

  return (
    <div className="flex flex-wrap gap-1.5 justify-center p-3"
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
                style={{ background: '#374151', opacity }}
                onClick={() => onAction({ kind: 'call' })}>
          Call {callAmount?.toFixed(1)}
        </button>
      )}

      {(canBet || canRaise) && (
        <>
          {showXS && (
            <button disabled={disabled}
                    className={btnBase}
                    style={{ background: '#7c3aed', opacity }}
                    onClick={() => handleSize(xsAmount)}>
              極小
              <div className="text-[8px] opacity-80 font-normal">{xsAmount}</div>
            </button>
          )}
          <button disabled={disabled}
                  className={btnBase}
                  style={{ background: '#1e40af', opacity }}
                  onClick={() => handleSize(smallAmount)}>
            小
            <div className="text-[8px] opacity-80 font-normal">{smallAmount}</div>
          </button>
          <button disabled={disabled}
                  className={btnBase}
                  style={{ background: '#1e40af', opacity }}
                  onClick={() => handleSize(midAmount)}>
            中
            <div className="text-[8px] opacity-80 font-normal">{midAmount}</div>
          </button>
          <button disabled={disabled}
                  className={btnBase}
                  style={{ background: '#1e40af', opacity }}
                  onClick={() => handleSize(largeAmount)}>
            大
            <div className="text-[8px] opacity-80 font-normal">{largeAmount}</div>
          </button>
          {showXL && (
            <button disabled={disabled}
                    className={btnBase}
                    style={{ background: '#7c3aed', opacity }}
                    onClick={() => handleSize(xlAmount)}>
              極大
              <div className="text-[8px] opacity-80 font-normal">{xlAmount}</div>
            </button>
          )}
          <button disabled={disabled}
                  className={btnBase}
                  style={{ background: '#dc2626', opacity }}
                  onClick={() => onAction({ kind: 'allin' })}>
            All-in
            <div className="text-[8px] opacity-80 font-normal">{effectiveStackBB.toFixed(0)}</div>
          </button>
        </>
      )}
    </div>
  )
})
