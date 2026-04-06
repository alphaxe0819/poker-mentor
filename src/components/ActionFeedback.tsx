import { useState } from 'react'
import RangeGrid from './RangeGrid'
import { getExplanation } from '../lib/explanations'

const ACTION_NAMES: Record<string, string> = {
  f:    'Fold（棄牌）',
  c:    'Call（跟注）',
  r:    'Raise（加注）',
  '3b': '3-Bet',
  '4b': '4-Bet',
  allin:'All-in（全下）',
}

function getActionName(action: string, isLimp?: boolean): string {
  if (isLimp && action === 'c') return 'Check（過牌）'
  return ACTION_NAMES[action] ?? action
}

function ActionCol({
  label,
  action,
  freq,
  highlight,
  isLimp,
}: {
  label: string
  action: string
  freq: number
  highlight?: boolean
  isLimp?: boolean
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center py-3 rounded-xl"
      style={{
        background: highlight ? '#1a1a3a' : '#111',
        border: highlight ? '1px solid #4c1d95' : '1px solid #1a1a1a',
      }}
    >
      <span className="text-[10px] text-gray-500 mb-1">{label}</span>
      <span className="text-sm font-bold text-white">{getActionName(action, isLimp)}</span>
      <span className="text-xs mt-0.5" style={{ color: '#10b981' }}>{freq}%</span>
    </div>
  )
}

interface Props {
  hideResult?: boolean
  hideButtons?: boolean
  isCorrect: boolean
  gtoAction: string
  gtoFreq: number
  secondAction: string
  secondFreq: number
  chosenAction: string
  chosenFreq: number
  hand: string
  gtoRange?: Record<string, string>
  isLimp?: boolean
  heroPos?: string
  raiserPos?: string | null
  raiserAction?: string | null
  stackBB?: number
  showExplanation?: boolean
  alwaysShowExplanation?: boolean
  onNext: () => void
}

export default function ActionFeedback({
  hideResult,
  hideButtons,
  isCorrect,
  gtoAction,
  gtoFreq,
  secondAction,
  secondFreq,
  chosenAction,
  chosenFreq,
  hand,
  gtoRange,
  isLimp,
  heroPos,
  raiserPos,
  raiserAction,
  stackBB,
  showExplanation: showExplanationProp = true,
  alwaysShowExplanation = false,
  onNext,
}: Props) {
  const [showRange, setShowRange] = useState(false)
  const [showExplanationModal, setShowExplanationModal] = useState(false)

  const hasSecond = secondAction && secondAction !== gtoAction && secondFreq > 0

  // 答錯時自動彈出；alwaysShowExplanation 開啟時答對也彈出（課程模式）
  const shouldShowPopup = heroPos && showExplanationProp && (!isCorrect || alwaysShowExplanation)
  const [autoOpened, setAutoOpened] = useState(false)
  if (shouldShowPopup && !autoOpened) {
    setAutoOpened(true)
    setShowExplanationModal(true)
  }

  return (
    <div className="flex flex-col gap-3">

      {!hideResult && (
        <div className="text-center">
          <span
            className="text-base font-bold"
            style={{ color: isCorrect ? '#10b981' : '#ef4444' }}
          >
            {isCorrect ? '✓ 正確！' : '✗ 不對'}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <ActionCol label="最佳行動" action={gtoAction}    freq={gtoFreq}    highlight isLimp={isLimp} />
        <ActionCol label="你的選擇" action={chosenAction} freq={chosenFreq} isLimp={isLimp} />
        {hasSecond && (
          <ActionCol label="第二選項" action={secondAction} freq={secondFreq} isLimp={isLimp} />
        )}
      </div>

      {/* 答錯時的說明彈窗 */}
      {showExplanationModal && shouldShowPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowExplanationModal(false)}
        >
          <div
            className="rounded-2xl p-5 w-full max-w-sm flex flex-col gap-4"
            style={{ background: '#111', border: '1px solid #333' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-base" style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <span className="text-white font-bold text-base">
                {isCorrect ? '答對了！來看看為什麼' : '策略說明'}
              </span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: '#ccc' }}>
              {getExplanation({
                hand,
                heroPos,
                gtoAction,
                chosenAction,
                raiserPos: raiserPos ?? null,
                raiserAction: raiserAction ?? null,
                stackBB: stackBB ?? 100,
              })}
            </p>

            <div className="text-xs text-gray-500 text-center">
              點擊「查看範圍」可查看此場景的完整 GTO 推薦範圍
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setShowExplanationModal(false); setShowRange(true) }}
                className="flex-1 py-2.5 rounded-xl text-sm transition"
                style={{ background: '#1a1a2e', border: '1px solid #4c1d95', color: '#a78bfa' }}
              >
                查看範圍
              </button>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition"
                style={{ background: '#4c1d95', border: '1px solid #7c3aed' }}
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 隱藏按鈕供手牌區觸發 */}
      <button id="range-btn" style={{ display: 'none' }} onClick={() => setShowRange(true)} />
      <button id="next-hand-btn" style={{ display: 'none' }} onClick={onNext} />

      {!hideButtons && (
        <div className="flex gap-2">
          <button
            onClick={() => setShowRange(true)}
            className="flex-1 py-2.5 rounded-xl text-sm transition"
            style={{ background: '#111', border: '1px solid #2a2a2a', color: '#666' }}
          >
            查看範圍
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition"
            style={{ background: '#4c1d95', border: '1px solid #7c3aed' }}
          >
            下一手 →
          </button>
        </div>
      )}

      {showRange && (
        <RangeGrid highlightHand={hand} gtoRange={gtoRange} onClose={() => setShowRange(false)} />
      )}

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
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: isCorrect ? 'rgba(22,101,52,0.3)' : 'rgba(127,29,29,0.3)',
        border: isCorrect ? '1px solid #166534' : '1px solid #7f1d1d',
      }}
    >
      <div className="text-base font-bold text-white mb-1">
        {isCorrect ? '✓ 正確' : '✗ 不對'}
      </div>
      {!isCorrect && (
        <div className="text-sm text-gray-400 mb-2">
          GTO 建議：
          <span className="text-gray-200 font-semibold">
            {ACTION_NAMES[gtoAction] ?? gtoAction}
          </span>
        </div>
      )}
      <button
        onClick={onNext}
        className="px-6 py-2 rounded-full text-sm font-medium text-white transition"
        style={{ background: '#4c1d95' }}
      >
        下一手 →
      </button>
    </div>
  )
}
