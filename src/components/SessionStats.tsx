interface Props {
  accuracy: number
  streak: number
  total: number
  stackBB: number
}

export default function SessionStats({ accuracy, streak, total, stackBB }: Props) {
  return (
    <div className="flex gap-2 px-4 py-2" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
      <div className="flex-1 text-center">
        <div className="text-[10px] text-gray-600">準確率</div>
        <div className="text-sm font-bold" style={{ color: total === 0 ? '#444' : accuracy >= 70 ? '#4ade80' : accuracy >= 50 ? '#fbbf24' : '#f87171' }}>
          {total > 0 ? `${accuracy}%` : '—'}
        </div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-[10px] text-gray-600">連勝</div>
        <div className="text-sm font-bold" style={{ color: streak >= 3 ? '#fbbf24' : '#888' }}>
          {streak > 0 ? streak : '—'}
        </div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-[10px] text-gray-600">手數</div>
        <div className="text-sm font-bold text-gray-300">{total}</div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-[10px] text-gray-600">深度</div>
        <div className="text-sm font-bold" style={{ color: stackBB <= 15 ? '#f87171' : stackBB <= 40 ? '#fbbf24' : '#4ade80' }}>
          {stackBB}BB
        </div>
      </div>
    </div>
  )
}
