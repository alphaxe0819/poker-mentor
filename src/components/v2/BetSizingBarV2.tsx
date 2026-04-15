import { memo } from 'react'

export type BetAction =
  | { kind: 'fold' }
  | { kind: 'check' }
  | { kind: 'call'; amount: number }
  | { kind: 'bet'; amount: number; label: string }   // preflop raise sizing or postflop bet
  | { kind: 'raise'; amount: number; label: string }
  | { kind: 'allin'; amount: number }

export interface SizingOption {
  label: string      // "3B 2.5x" / "Bet 33%" / "Raise 2x"
  amount: number     // in BB
  kind: 'bet' | 'raise'
}

interface Props {
  canFold: boolean
  canCheck: boolean
  canCall: boolean
  callAmount?: number
  sizingOptions: SizingOption[]
  canAllIn: boolean
  allInAmount?: number
  onAction: (a: BetAction) => void
  disabled?: boolean
}

const BTN = 'flex-1 flex flex-col items-center justify-center rounded-[10px] font-extrabold text-white transition-[transform] active:scale-[.98]'

export default memo(function BetSizingBarV2({
  canFold, canCheck, canCall, callAmount,
  sizingOptions, canAllIn, allInAmount,
  onAction, disabled,
}: Props) {
  const opacity = disabled ? 0.5 : 1

  // Single row: all buttons crammed into one flex line for max felt space
  return (
    <div className="flex gap-[4px] px-2 pb-3 pt-2 flex-shrink-0"
      style={{ background: 'linear-gradient(180deg, transparent, #08090b 20%)' }}>
      {canFold && (
        <button disabled={disabled} onClick={() => onAction({ kind: 'fold' })}
          className={BTN}
          style={{ minHeight: 48, background: '#2563eb', opacity, fontSize: 12, letterSpacing: .2 }}>
          <span>FOLD</span>
        </button>
      )}
      {canCheck && (
        <button disabled={disabled} onClick={() => onAction({ kind: 'check' })}
          className={BTN}
          style={{ minHeight: 48, background: '#374151', opacity, fontSize: 12, letterSpacing: .2 }}>
          <span>CHECK</span>
        </button>
      )}
      {canCall && callAmount !== undefined && (
        <button disabled={disabled} onClick={() => onAction({ kind: 'call', amount: callAmount })}
          className={BTN}
          style={{ minHeight: 48, background: '#059669', opacity, fontSize: 12, letterSpacing: .2 }}>
          <span>CALL</span>
          <small className="text-[9px] opacity-75 font-semibold leading-none">{callAmount}</small>
        </button>
      )}
      {sizingOptions.map((opt, i) => (
        <button key={i} disabled={disabled}
          onClick={() => onAction({ kind: opt.kind, amount: opt.amount, label: opt.label })}
          className={BTN}
          style={{ minHeight: 48, background: '#dc2626', opacity, fontSize: 11, letterSpacing: .1 }}>
          <span>{opt.label}</span>
          <small className="text-[9px] opacity-75 font-semibold leading-none">{opt.amount}</small>
        </button>
      ))}
      {canAllIn && allInAmount !== undefined && (
        <button disabled={disabled} onClick={() => onAction({ kind: 'allin', amount: allInAmount })}
          className={BTN}
          style={{ minHeight: 48, background: '#7f1d1d', opacity, fontSize: 11, letterSpacing: .1 }}>
          <span>ALL-IN</span>
          <small className="text-[9px] opacity-75 font-semibold leading-none">{allInAmount}</small>
        </button>
      )}
    </div>
  )
})
