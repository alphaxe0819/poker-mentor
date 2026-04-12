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
  /** Current bet on this street (0 if no one has bet yet) */
  currentBetBB: number
  /** Hero's current street commitment */
  heroStreetCommitBB: number
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
  currentBetBB, heroStreetCommitBB,
  showXS, showXL, onAction, disabled,
}: Props) {

  // ── Bet sizing (when no one has bet yet on this street) ──
  // Uses pot-percentage. All bets must be at least 1 BB.
  const betXS    = Math.max(1, Math.round(potBB * 0.15 * 10) / 10)
  const betSmall = Math.max(1, Math.round(potBB * 0.33 * 10) / 10)
  const betMid   = Math.max(1, Math.round(potBB * 0.5 * 10) / 10)
  const betLarge = Math.max(1, Math.round(potBB * 1.0 * 10) / 10)
  const betXL    = Math.max(1, Math.round(potBB * 2.0 * 10) / 10)

  // ── Raise sizing (when facing a bet/raise) ──
  // Min raise-to = currentBet + (currentBet - heroStreetCommit) = 2*currentBet - heroCommit
  // But standard formula: min raise-to = currentBet + lastRaiseIncrement
  // lastRaiseIncrement = currentBet - previousBet (we approximate as currentBet - heroStreetCommit for v1.0)
  const lastIncrement = Math.max(1, currentBetBB - heroStreetCommitBB)
  const minRaiseTo = currentBetBB + lastIncrement

  // Raise-to options: min-raise, 2.5x, 3x, pot-raise
  const potAfterCall = potBB + (currentBetBB - heroStreetCommitBB)  // pot if hero calls first
  const potRaiseTo = currentBetBB + potAfterCall  // standard pot-raise formula

  const raiseSmall = Math.max(minRaiseTo, Math.round(minRaiseTo * 10) / 10)
  const raiseMid   = Math.max(minRaiseTo, Math.round((currentBetBB * 2.5) * 10) / 10)
  const raiseLarge = Math.max(minRaiseTo, Math.round(potRaiseTo * 10) / 10)

  // Use bet sizes when betting, raise sizes when raising
  const isBetting = canBet
  const xsAmount    = isBetting ? betXS    : raiseSmall
  const smallAmount = isBetting ? betSmall : raiseSmall
  const midAmount   = isBetting ? betMid   : raiseMid
  const largeAmount = isBetting ? betLarge : raiseLarge
  const xlAmount    = isBetting ? betXL    : Math.round(potRaiseTo * 1.5 * 10) / 10

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
