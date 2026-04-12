// src/components/HeadsUpScenarioSelect.tsx
import { useState } from 'react'
import type { StackRatio, MatchConfig } from '../lib/hu/types'

interface Props {
  userPoints: number
  entryCost: number  // 30 for v1.0
  onCancel: () => void
  onConfirm: (config: MatchConfig) => void
}

const RATIOS: { value: StackRatio; label: string; desc: string }[] = [
  { value: '1:1', label: '1:1',  desc: '40 vs 40 BB · 平均對戰' },
  { value: '1:2', label: '1:2',  desc: '27 vs 53 BB · 你短碼' },
  { value: '2:1', label: '2:1',  desc: '53 vs 27 BB · 你大碼' },
  { value: '1:5', label: '1:5',  desc: '13 vs 67 BB · 你極短' },
  { value: '5:1', label: '5:1',  desc: '67 vs 13 BB · 你壓制' },
]

export default function HeadsUpScenarioSelect({
  userPoints, entryCost, onCancel, onConfirm,
}: Props) {
  const [selected, setSelected] = useState<StackRatio>('1:1')

  function handleConfirm() {
    const playerSide: MatchConfig['playerSide'] =
      selected === '1:1' ? 'equal' :
      selected === '1:2' || selected === '1:5' ? 'short' : 'big'
    onConfirm({
      totalStackBB: 80,
      stackRatio: selected,
      playerSide,
      sbBB: 0.5,
      bbBB: 1,
    })
  }

  const canAfford = userPoints >= entryCost

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6"
         style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-sm">
        <button onClick={onCancel}
                className="text-gray-400 text-sm mb-4">← 返回</button>

        <h1 className="text-white text-2xl font-bold mb-1">HU 對決</h1>
        <p className="text-gray-400 text-sm mb-6">選擇你和對手的籌碼比例</p>

        <div className="flex flex-col gap-2 mb-6">
          {RATIOS.map(r => (
            <button key={r.value}
                    onClick={() => setSelected(r.value)}
                    className="text-left p-4 rounded-2xl transition-all"
                    style={{
                      background: selected === r.value ? '#7c3aed' : '#111',
                      border: `1px solid ${selected === r.value ? '#a78bfa' : '#1a1a1a'}`,
                    }}>
              <div className="text-white font-bold text-lg">{r.label}</div>
              <div className="text-gray-300 text-xs mt-1">{r.desc}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-4"
             style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">入場費</span>
            <span className="text-white font-bold">{entryCost} 點</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">你的點數</span>
            <span className={canAfford ? 'text-white' : 'text-red-400'} style={{ fontWeight: 700 }}>
              {userPoints} 點
            </span>
          </div>
        </div>

        <button onClick={handleConfirm}
                disabled={!canAfford}
                className="w-full py-4 rounded-full font-bold text-white text-base transition-opacity"
                style={{
                  background: canAfford ? '#7c3aed' : '#444',
                  opacity: canAfford ? 1 : 0.5,
                }}>
          {canAfford ? `開始 (-${entryCost} 點)` : '點數不足'}
        </button>
      </div>
    </div>
  )
}
