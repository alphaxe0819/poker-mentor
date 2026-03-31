import { getActionLabel } from '../lib/gtoData'

interface Props {
  isCorrect: boolean
  gtoAction: string
  gtoFreq: number
  secondAction: string
  secondFreq: number
  chosenAction: string
  chosenFreq: number
  hand: string
  onNext: () => void
}

function ActionCol({ label, action, freq, highlight }: { label: string; action: string; freq: number; highlight?: boolean }) {
  return (
    <div className="flex-1 rounded-lg p-2 text-center" style={{
      background: highlight ? '#0a2a0a' : '#1a1a1a',
      border: highlight ? '1px solid #166534' : '1px solid #333',
    }}>
      <div className="text-[10px] mb-1" style={{ color: highlight ? '#4ade80' : '#666' }}>{label}</div>
      <div className="text-sm font-bold text-white">{getActionLabel(action)}</div>
      <div className="text-xs" style={{ color: highlight ? '#4ade80' : '#666' }}>{freq}%</div>
    </div>
  )
}

export default function ActionFeedback({
  isCorrect, gtoAction, gtoFreq, secondAction, secondFreq,
  chosenAction, chosenFreq, hand: _hand, onNext,
}: Props) {
  return (
    <div className="rounded-xl p-4" style={{
      background: isCorrect ? 'rgba(22,101,52,0.3)' : 'rgba(127,29,29,0.3)',
      border: isCorrect ? '1px solid #166534' : '1px solid #7f1d1d',
    }}>
      <div className="text-base font-bold text-white text-center mb-2">
        {isCorrect ? '✓ 正確' : '✗ 不對'}
      </div>
      <div className="flex gap-2">
        <ActionCol label="最佳行動" action={gtoAction}    freq={gtoFreq}    highlight />
        <ActionCol label="你的選擇" action={chosenAction} freq={chosenFreq} />
        {secondFreq > 0 && (
          <ActionCol label="第二選項" action={secondAction} freq={secondFreq} />
        )}
      </div>
      <button onClick={onNext}
        className="mt-3 w-full py-2.5 rounded-full text-sm font-medium text-white transition"
        style={{ background: '#7c3aed' }}>
        下一題
      </button>
    </div>
  )
}

export function SimpleStepFeedback({
  isCorrect,
  gtoAction,
  onNext,
}: {
  isCorrect: boolean
  gtoAction: string
  onNext: () => void
}) {
  return (
    <div className="rounded-xl p-4 text-center" style={{
      background: isCorrect ? 'rgba(22,101,52,0.3)' : 'rgba(127,29,29,0.3)',
      border: isCorrect ? '1px solid #166534' : '1px solid #7f1d1d',
    }}>
      <div className="text-base font-bold text-white mb-1">
        {isCorrect ? '✓ 正確' : '✗ 不對'}
      </div>
      {!isCorrect && (
        <div className="text-sm text-gray-400 mb-2">
          GTO 建議：<span className="text-gray-200 font-semibold">{getActionLabel(gtoAction)}</span>
        </div>
      )}
      <button onClick={onNext}
        className="px-6 py-2 rounded-full text-sm font-medium text-white transition"
        style={{ background: '#4c1d95' }}>
        下一手 →
      </button>
    </div>
  )
}
