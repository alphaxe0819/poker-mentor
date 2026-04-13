// src/components/PostflopActionBar.tsx
// GTO Wizard style: Fold(blue) / Check(grey) / Call(green) / sizing buttons / All-in(dark red)
import { memo } from 'react'

interface Props {
  canFold: boolean
  canCheck: boolean
  canCall: boolean
  callAmount?: number
  canBet: boolean
  canRaise: boolean
  potBB: number
  effectiveStackBB: number
  currentBetBB: number
  heroStreetCommitBB: number
  showXS: boolean
  showXL: boolean
  onAction: (action: ActionChoice) => void
  disabled?: boolean
}

export type ActionChoice =
  | { kind: 'fold' }
  | { kind: 'check' }
  | { kind: 'call' }
  | { kind: 'bet'; bbAmount: number }
  | { kind: 'raise'; bbAmount: number }
  | { kind: 'allin' }

const BTN = 'flex items-center justify-center rounded-xl font-bold text-white transition-opacity'

export default memo(function PostflopActionBar({
  canFold, canCheck, canCall, callAmount,
  canBet, canRaise, potBB, effectiveStackBB,
  currentBetBB, heroStreetCommitBB,
  onAction, disabled,
}: Props) {

  // Bet sizing (pot-percentage)
  const betSmall = Math.max(1, Math.round(potBB * 0.33 * 10) / 10)
  const betMid   = Math.max(1, Math.round(potBB * 0.5 * 10) / 10)
  const betLarge = Math.max(1, Math.round(potBB * 1.0 * 10) / 10)

  // Raise sizing
  const lastIncrement = Math.max(1, currentBetBB - heroStreetCommitBB)
  const minRaiseTo = currentBetBB + lastIncrement
  const potAfterCall = potBB + (currentBetBB - heroStreetCommitBB)
  const potRaiseTo = currentBetBB + potAfterCall

  const raiseSmall = Math.max(minRaiseTo, Math.round(minRaiseTo * 10) / 10)
  const raiseMid   = Math.max(minRaiseTo, Math.round((currentBetBB * 2.5) * 10) / 10)
  const raiseLarge = Math.max(minRaiseTo, Math.round(potRaiseTo * 10) / 10)

  const isBetting = canBet
  const smallAmount = isBetting ? betSmall : raiseSmall
  const midAmount   = isBetting ? betMid   : raiseMid
  const largeAmount = isBetting ? betLarge : raiseLarge

  function handleSize(amt: number) {
    if (amt >= effectiveStackBB) {
      onAction({ kind: 'allin' })
      return
    }
    onAction(canBet
      ? { kind: 'bet', bbAmount: amt }
      : { kind: 'raise', bbAmount: amt })
  }

  const opacity = disabled ? 0.4 : 1

  return (
    <div className="flex flex-col gap-1.5 p-3" style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
      {/* Row 1: Fold/Check/Call — main action */}
      <div className="flex gap-2">
        {canFold && (
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#2563eb', opacity, minHeight: 48 }}
                  onClick={() => onAction({ kind: 'fold' })}>
            FOLD
          </button>
        )}

        {canCheck && (
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#374151', opacity, minHeight: 48 }}
                  onClick={() => onAction({ kind: 'check' })}>
            CHECK
          </button>
        )}

        {canCall && (
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#059669', opacity, minHeight: 48 }}
                  onClick={() => onAction({ kind: 'call' })}>
            <span className="text-sm font-bold">CALL {callAmount?.toFixed(1)}</span>
          </button>
        )}
      </div>

      {/* Row 2: Sizing buttons — bet/raise options */}
      {(canBet || canRaise) && (
        <div className="flex gap-1.5">
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#dc2626', opacity, minHeight: 44 }}
                  onClick={() => handleSize(smallAmount)}>
            <div className="text-center">
              <div className="text-xs font-bold">33%</div>
              <div className="text-[10px] opacity-70">{smallAmount}</div>
            </div>
          </button>
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#dc2626', opacity, minHeight: 44 }}
                  onClick={() => handleSize(midAmount)}>
            <div className="text-center">
              <div className="text-xs font-bold">50%</div>
              <div className="text-[10px] opacity-70">{midAmount}</div>
            </div>
          </button>
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#dc2626', opacity, minHeight: 44 }}
                  onClick={() => handleSize(largeAmount)}>
            <div className="text-center">
              <div className="text-xs font-bold">100%</div>
              <div className="text-[10px] opacity-70">{largeAmount}</div>
            </div>
          </button>
          <button disabled={disabled} className={`flex-1 ${BTN}`}
                  style={{ background: '#991b1b', opacity, minHeight: 44 }}
                  onClick={() => onAction({ kind: 'allin' })}>
            <div className="text-center">
              <div className="text-xs font-bold">ALLIN</div>
              <div className="text-[10px] opacity-70">{effectiveStackBB.toFixed(0)}</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
})
