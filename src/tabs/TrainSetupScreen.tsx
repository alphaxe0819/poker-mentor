import { useState } from 'react'

const GAME_TYPES = [
  { key: 'tourn_9max', label: '9-max 錦標' },
] as const

const STACK_DEPTHS = [100, 75, 40, 25, 15]
const ROUND_SIZES = [10, 30, 100]

interface Props {
  isPaid?: boolean
  onStart: (config: {
    gameTypeKey: 'tourn_9max'
    stackDepth: number
    trainMode: 'single' | 'multi'
    roundSize: number
  }) => void
}

export default function TrainSetupScreen({ isPaid = false, onStart }: Props) {
  const [gameTypeKey, setGameTypeKey] = useState('tourn_9max')
  const [stackDepth,  setStackDepth]  = useState(100)
  const trainMode = 'multi'
  const [roundSize, setRoundSize] = useState(10)

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto">
      <h2 className="text-white font-bold text-lg mt-2">練習設定</h2>

      <div>
        <div className="text-gray-400 text-xs mb-2">遊戲類型</div>
        <div className="flex gap-2 flex-wrap">
          {GAME_TYPES.map(g => (
            <button key={g.key} onClick={() => setGameTypeKey(g.key)}
              className="px-4 py-2 rounded-full text-sm font-medium transition"
              style={{
                background: gameTypeKey === g.key ? '#7c3aed' : '#111',
                border: gameTypeKey === g.key ? '1px solid #7c3aed' : '1px solid #222',
                color: gameTypeKey === g.key ? '#fff' : '#555',
              }}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {isPaid ? (
        <div>
          <div className="text-gray-400 text-xs mb-2">籌碼深度</div>
          <div className="flex gap-2 flex-wrap">
            {STACK_DEPTHS.map(d => (
              <button key={d} onClick={() => setStackDepth(d)}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{
                  background: stackDepth === d ? '#1d4ed8' : '#111',
                  border: stackDepth === d ? '1px solid #1d4ed8' : '1px solid #222',
                  color: stackDepth === d ? '#fff' : '#555',
                }}>
                {d}BB
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-3 text-center"
             style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <span className="text-gray-500 text-xs">籌碼深度全隨機</span>
          <span className="text-gray-600 text-xs ml-2">（付費用戶可自選）</span>
        </div>
      )}

      {isPaid && (
        <div>
          <div className="text-gray-400 text-xs mb-2">題數</div>
          <div className="flex gap-2">
            {ROUND_SIZES.map(s => (
              <button key={s} onClick={() => setRoundSize(s)}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{
                  background: roundSize === s ? '#059669' : '#111',
                  border: roundSize === s ? '1px solid #059669' : '1px solid #222',
                  color: roundSize === s ? '#fff' : '#555',
                }}>
                {s} 題
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onStart({ gameTypeKey: gameTypeKey as 'tourn_9max', stackDepth, trainMode, roundSize: isPaid ? roundSize : 10 })}
        className="w-full py-3.5 rounded-full font-bold text-base text-white mt-2"
        style={{ background: '#7c3aed' }}>
        開始練習
      </button>
    </div>
  )
}
