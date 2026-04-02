import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AnswerRecord {
  hero_pos: string
  hand: string
  is_correct: boolean
  scenario_type: string
  created_at: string
}

interface Props {
  userId?: string | null
  isPaid?: boolean
  onNavigateAnalysis?: () => void
}

export default function StatsTab({ userId, onNavigateAnalysis }: Props) {
  const [records,      setRecords]      = useState<AnswerRecord[]>([])
  const [todayRecords, setTodayRecords] = useState<AnswerRecord[]>([])
  const [loading,      setLoading]      = useState(true)
  const [period,       setPeriod]       = useState<'7' | '30' | 'all'>('7')

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    setLoading(true)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayQuery = supabase
      .from('answer_records')
      .select('hero_pos, hand, is_correct, scenario_type, created_at')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: true })

    let query = supabase
      .from('answer_records')
      .select('hero_pos, hand, is_correct, scenario_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (period !== 'all') {
      const since = new Date()
      since.setDate(since.getDate() - Number(period))
      query = query.gte('created_at', since.toISOString())
    }

    Promise.all([todayQuery, query]).then(([todayRes, res]) => {
      setTodayRecords((todayRes.data ?? []) as AnswerRecord[])
      setRecords((res.data ?? []) as AnswerRecord[])
      setLoading(false)
    })
  }, [userId, period])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen"
           style={{ background: '#0a0a0a' }}>
        <div className="text-gray-600 text-sm">載入中...</div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-6"
           style={{ background: '#0a0a0a' }}>
        <div className="text-4xl">📊</div>
        <div className="text-white font-bold">尚無答題記錄</div>
        <div className="text-gray-500 text-sm">完成練習後這裡會顯示弱點分析</div>
      </div>
    )
  }

  // 位置分析
  const posStats: Record<string, { total: number; correct: number }> = {}
  records.forEach(r => {
    if (!posStats[r.hero_pos]) posStats[r.hero_pos] = { total: 0, correct: 0 }
    posStats[r.hero_pos].total++
    if (r.is_correct) posStats[r.hero_pos].correct++
  })
  const posList = Object.entries(posStats)
    .map(([pos, s]) => ({ pos, accuracy: Math.round(s.correct / s.total * 100), total: s.total }))
    .sort((a, b) => a.accuracy - b.accuracy)

  // 手牌類型分析
  const typeStats: Record<string, { total: number; correct: number }> = { '同花': { total: 0, correct: 0 }, '雜色': { total: 0, correct: 0 }, '對子': { total: 0, correct: 0 } }
  records.forEach(r => {
    const type = r.hand.endsWith('s') ? '同花' : r.hand[0] === r.hand[1] ? '對子' : '雜色'
    typeStats[type].total++
    if (r.is_correct) typeStats[type].correct++
  })

  // 場景分析
  const sceneStats: Record<string, { total: number; correct: number }> = {}
  records.forEach(r => {
    const key = r.scenario_type === 'RFI' ? 'RFI（主動加注）' : 'vs Raise（面對加注）'
    if (!sceneStats[key]) sceneStats[key] = { total: 0, correct: 0 }
    sceneStats[key].total++
    if (r.is_correct) sceneStats[key].correct++
  })

  // 趨勢
  const dayStats: Record<string, { total: number; correct: number }> = {}
  records.forEach(r => {
    const day = r.created_at.slice(0, 10)
    if (!dayStats[day]) dayStats[day] = { total: 0, correct: 0 }
    dayStats[day].total++
    if (r.is_correct) dayStats[day].correct++
  })
  const dayList = Object.entries(dayStats)
    .map(([day, s]) => ({ day: day.slice(5), accuracy: Math.round(s.correct / s.total * 100) }))
    .slice(-7)

  const total   = records.length
  const correct = records.filter(r => r.is_correct).length
  const overall = Math.round(correct / total * 100)

  return (
    <div className="flex flex-col gap-5 p-4 pb-24" style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* 今日挑戰 */}
      {(() => {
        const todayTotal   = todayRecords.length
        const todayCorrect = todayRecords.filter(r => r.is_correct).length
        const todayAcc     = todayTotal > 0 ? Math.round(todayCorrect / todayTotal * 100) : 0
        return (
          <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="text-gray-400 text-xs mb-3">今日挑戰</div>
            {todayTotal === 0 ? (
              <div className="text-gray-600 text-sm text-center py-2">今天還沒有練習記錄</div>
            ) : (
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-xs">總題數</span>
                  <span className="text-white font-bold text-xl">{todayTotal}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-xs">正確率</span>
                  <span className="font-bold text-xl" style={{ color: todayAcc >= 70 ? '#10b981' : '#f59e0b' }}>{todayAcc}%</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-xs">答對</span>
                  <span className="text-white font-bold text-xl">{todayCorrect}</span>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* 時間區間切換 */}
      <div className="flex rounded-full p-1" style={{ background: '#111' }}>
        {([['7', '近 7 天'], ['30', '近 30 天'], ['all', '生涯']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setPeriod(val)}
            className="flex-1 py-2 rounded-full text-xs font-medium transition"
            style={{
              background: period === val ? '#7c3aed' : 'transparent',
              color: period === val ? '#fff' : '#555',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* 整體 */}
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-400 text-xs mb-3">
          {period === '7' ? '近 7 天' : period === '30' ? '近 30 天' : '生涯'}整體
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">總題數</span>
            <span className="text-white font-bold text-xl">{total}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">正確率</span>
            <span className="font-bold text-xl" style={{ color: overall >= 70 ? '#10b981' : '#f59e0b' }}>{overall}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">答對</span>
            <span className="text-white font-bold text-xl">{correct}</span>
          </div>
        </div>
      </div>

      {/* 弱點強化分析按鈕 */}
      <button
        onClick={() => onNavigateAnalysis?.()}
        className="w-full py-3 rounded-2xl text-sm font-bold transition"
        style={{ background: '#1a1a3a', border: '1px solid #4c1d95', color: '#a78bfa' }}
      >
        🎯 弱點強化分析 →
      </button>

      {/* 位置弱點 */}
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-400 text-xs mb-3">位置正確率（低→高）</div>
        <div className="flex flex-col gap-2">
          {posList.map(({ pos, accuracy, total }) => (
            <div key={pos} className="flex items-center gap-3">
              <span className="text-gray-400 text-xs w-10">{pos}</span>
              <div className="flex-1 rounded-full h-2" style={{ background: '#1a1a1a' }}>
                <div className="h-2 rounded-full"
                     style={{ width: `${accuracy}%`, background: accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <span className="text-gray-400 text-xs w-10 text-right">{accuracy}%</span>
              <span className="text-gray-600 text-xs w-8 text-right">{total}題</span>
            </div>
          ))}
        </div>
      </div>

      {/* 手牌類型 */}
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-400 text-xs mb-3">手牌類型正確率</div>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(typeStats).map(([type, s]) => {
            const acc = s.total > 0 ? Math.round(s.correct / s.total * 100) : 0
            return (
              <div key={type} className="flex flex-col items-center gap-1 rounded-xl p-3"
                   style={{ background: '#0a0a0a' }}>
                <span className="text-gray-500 text-xs">{type}</span>
                <span className="font-bold text-lg"
                      style={{ color: acc >= 70 ? '#10b981' : acc >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {s.total > 0 ? `${acc}%` : '-'}
                </span>
                <span className="text-gray-600 text-xs">{s.total} 題</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 場景 */}
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-400 text-xs mb-3">場景正確率</div>
        <div className="flex flex-col gap-2">
          {Object.entries(sceneStats).map(([scene, s]) => {
            const acc = Math.round(s.correct / s.total * 100)
            return (
              <div key={scene} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs flex-1">{scene}</span>
                <div className="w-24 rounded-full h-2" style={{ background: '#1a1a1a' }}>
                  <div className="h-2 rounded-full"
                       style={{ width: `${acc}%`, background: acc >= 70 ? '#10b981' : acc >= 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="text-gray-400 text-xs w-10 text-right">{acc}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 趨勢 */}
      {dayList.length > 1 && (
        <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <div className="text-gray-400 text-xs mb-3">
            {period === '7' ? '近 7 天' : period === '30' ? '近 30 天' : '生涯'}正確率趨勢
          </div>
          <div className="flex items-end gap-2 h-20">
            {dayList.map(({ day, accuracy }) => (
              <div key={day} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full rounded-t"
                     style={{
                       height: `${accuracy * 0.7}px`,
                       background: accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444',
                       minHeight: 4,
                     }} />
                <span className="text-gray-600 text-xs">{day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
