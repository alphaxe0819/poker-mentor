import { useState } from 'react'
import PointsBadge from '../components/PointsBadge'

const GAME_TYPES = [
  { key: 'random',     label: '全隨機' },
  { key: 'tourn_9max', label: '9-max 錦標' },
  { key: 'cash_6max',  label: '6-max 現金' },
  { key: 'cash_4max',  label: '4-max 現金' },
  { key: 'cash_hu',    label: 'HU 對戰' },
] as const

type GameTypeKey = typeof GAME_TYPES[number]['key']

const STACK_DEPTHS_OPTIONS = ['random', 100, 75, 40, 25, 15] as const
type StackDepthOption = typeof STACK_DEPTHS_OPTIONS[number]

const ROUND_SIZES = [10, 30, 100]

interface Props {
  points?: number
  isPaid?: boolean
  onNavigateToMissions?: () => void
  onNavigateToHU?: () => void
  onStart: (config: {
    gameTypeKey: GameTypeKey
    stackDepth: number | 'random'
    trainMode: 'single' | 'multi'
    roundSize: number
    showExplanation: boolean
  }) => void
}

export default function TrainSetupScreen({ points = 0, isPaid = false, onNavigateToMissions, onNavigateToHU, onStart }: Props) {
  const [gameTypeKey, setGameTypeKey] = useState<GameTypeKey>(isPaid ? 'random' : 'random')
  const [stackDepth,  setStackDepth]  = useState<StackDepthOption>('random')
  const trainMode = 'multi'
  const [roundSize, setRoundSize] = useState(10)
  const [showExplanation, setShowExplanation] = useState(true)

  // 免費用戶鎖定全隨機
  const lockedGameType = !isPaid
  const lockedStackDepth = !isPaid
  const lockedRoundSize = !isPaid

  // 現金局固定 100BB
  const isCash = gameTypeKey.startsWith('cash_')

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-white font-bold text-lg">練習設定</h2>
        <PointsBadge points={points} onNavigateToMissions={onNavigateToMissions} />
      </div>

      {/* 遊戲類型 */}
      <div>
        <div className="text-gray-400 text-xs mb-2">遊戲類型</div>
        <div className="flex gap-2 flex-wrap">
          {GAME_TYPES.map(g => {
            const selected = gameTypeKey === g.key
            const disabled = lockedGameType && g.key !== 'random'
            return (
              <button key={g.key}
                onClick={() => !disabled && setGameTypeKey(g.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{
                  background: selected ? '#7c3aed' : '#111',
                  border: selected ? '1px solid #7c3aed' : '1px solid #222',
                  color: disabled ? '#333' : selected ? '#fff' : '#555',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}>
                {g.label}
                {disabled && ' 🔒'}
              </button>
            )
          })}
        </div>
      </div>

      {/* 籌碼深度 */}
      <div>
        <div className="text-gray-400 text-xs mb-2">籌碼深度</div>
        {isCash ? (
          <div className="rounded-xl p-3 text-center"
               style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <span className="text-gray-500 text-xs">現金局固定 100BB</span>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {STACK_DEPTHS_OPTIONS.map(d => {
              const selected = stackDepth === d
              const disabled = lockedStackDepth && d !== 'random'
              return (
                <button key={d}
                  onClick={() => !disabled && setStackDepth(d)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition"
                  style={{
                    background: selected ? '#1d4ed8' : '#111',
                    border: selected ? '1px solid #1d4ed8' : '1px solid #222',
                    color: disabled ? '#333' : selected ? '#fff' : '#555',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                  }}>
                  {d === 'random' ? '全隨機' : `${d}BB`}
                  {disabled && ' 🔒'}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 題數 */}
      <div>
        <div className="text-gray-400 text-xs mb-2">題數</div>
        <div className="flex gap-2">
          {ROUND_SIZES.map(s => {
            const selected = lockedRoundSize ? s === 10 : roundSize === s
            const disabled = lockedRoundSize && s !== 10
            return (
              <button key={s}
                onClick={() => !disabled && setRoundSize(s)}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{
                  background: selected ? '#059669' : '#111',
                  border: selected ? '1px solid #059669' : '1px solid #222',
                  color: disabled ? '#333' : selected ? '#fff' : '#555',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}>
                {s} 題
                {disabled && ' 🔒'}
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex items-center justify-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showExplanation}
          onChange={e => setShowExplanation(e.target.checked)}
          className="w-4 h-4 rounded accent-purple-600"
        />
        <span className="text-gray-400 text-xs">答錯時顯示策略說明</span>
      </label>

      {/* MTT 情境模擬器入口 */}
      {onNavigateToHU && (
        <button
          onClick={onNavigateToHU}
          className="w-full p-4 rounded-2xl text-left"
          style={{ background: '#1a1a2e', border: '1px solid #7c3aed' }}>
          <div className="text-white font-bold text-sm mb-1">🥊 HU 對決（新）</div>
          <div className="text-gray-400 text-xs">和 AI 打 1v1 完整 80BB 對局 · 30 點 / 場</div>
        </button>
      )}

      <button
        onClick={() => onStart({
          gameTypeKey: lockedGameType ? 'random' : gameTypeKey,
          stackDepth: isCash ? 100 : (lockedStackDepth ? 'random' : stackDepth),
          trainMode,
          roundSize: lockedRoundSize ? 10 : roundSize,
          showExplanation,
        })}
        className="w-full py-3.5 rounded-full font-bold text-base text-white mt-2"
        style={{ background: '#7c3aed' }}>
        開始練習
      </button>
    </div>
  )
}
