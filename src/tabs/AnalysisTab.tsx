import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getPoints, spendPoints } from '../lib/points'

const ANALYSIS_COST = 50

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''

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
}

// 付費用戶每日免費分析
function getLocalDateString(): string {
  const now = new Date()
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  return utc8.toISOString().slice(0, 10)
}

function getPaidFreeUsed(): boolean {
  const today = getLocalDateString()
  const data = localStorage.getItem('analysis_paid_free')
  if (!data) return false
  try {
    const parsed = JSON.parse(data)
    return parsed.date === today && parsed.used === true
  } catch {
    return false
  }
}

function markPaidFreeUsed() {
  localStorage.setItem('analysis_paid_free', JSON.stringify({ date: getLocalDateString(), used: true }))
}

async function analyzeWeakness(data: {
  overall: number
  total: number
  posList: { pos: string; accuracy: number; total: number }[]
  rfiAcc: number
  rfiTotal: number
  vsRaiseAcc: number
  vsRaiseTotal: number
  suitedAcc: number
  offsuitAcc: number
  pairAcc: number
}): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('未登入')

  const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-weakness`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  })

  const json = await response.json()
  if (!response.ok) throw new Error(json.error ?? '分析失敗')
  return json.text ?? '分析失敗，請稍後再試。'
}

export default function AnalysisTab({ userId, isPaid = false }: Props) {
  const [records,   setRecords]   = useState<AnswerRecord[]>([])
  const [loading,   setLoading]   = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis,  setAnalysis]  = useState<string | null>(null)
  const [points,    setPoints]    = useState(getPoints)
  const [showConfirm, setShowConfirm] = useState(false)

  // 付費用戶今日是否已用免費次數
  const paidFreeUsed = isPaid ? getPaidFreeUsed() : true
  const hasPaidFree = isPaid && !paidFreeUsed

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    supabase
      .from('answer_records')
      .select('hero_pos, hand, is_correct, scenario_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .then(res => {
        setRecords((res.data ?? []) as AnswerRecord[])
        setLoading(false)
      })
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0a0a0a' }}>
        <div className="text-gray-600 text-sm">載入中...</div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-6" style={{ background: '#0a0a0a' }}>
        <div className="text-4xl">🔒</div>
        <div className="text-white font-bold">請先登入</div>
      </div>
    )
  }

  const MIN_RECORDS = 70

  if (records.length < MIN_RECORDS) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-6" style={{ background: '#0a0a0a' }}>
        <div className="text-4xl">📊</div>
        <div className="text-white font-bold">
          {records.length === 0 ? '尚無答題記錄' : '答題數量不足'}
        </div>
        <div className="text-gray-500 text-sm text-center">
          {records.length === 0
            ? '完成練習後才能使用弱點分析'
            : `需要至少 ${MIN_RECORDS} 題才能進行分析（目前 ${records.length} 題）`}
        </div>
        <div className="w-full max-w-xs mt-2">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#222' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.min(100, Math.round(records.length / MIN_RECORDS * 100))}%`,
              background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
            }} />
          </div>
          <div className="text-gray-600 text-xs text-center mt-1">
            {records.length} / {MIN_RECORDS}
          </div>
        </div>
      </div>
    )
  }

  // 計算統計數據
  const total   = records.length
  const correct = records.filter(r => r.is_correct).length
  const overall = Math.round(correct / total * 100)

  const posStats: Record<string, { total: number; correct: number }> = {}
  records.forEach(r => {
    if (!posStats[r.hero_pos]) posStats[r.hero_pos] = { total: 0, correct: 0 }
    posStats[r.hero_pos].total++
    if (r.is_correct) posStats[r.hero_pos].correct++
  })
  const posList = Object.entries(posStats)
    .map(([pos, s]) => ({ pos, accuracy: Math.round(s.correct / s.total * 100), total: s.total }))
    .sort((a, b) => a.accuracy - b.accuracy)

  const rfiRecords     = records.filter(r => r.scenario_type === 'RFI')
  const vsRaiseRecords = records.filter(r => r.scenario_type !== 'RFI')
  const rfiAcc         = rfiRecords.length > 0 ? Math.round(rfiRecords.filter(r => r.is_correct).length / rfiRecords.length * 100) : 0
  const vsRaiseAcc     = vsRaiseRecords.length > 0 ? Math.round(vsRaiseRecords.filter(r => r.is_correct).length / vsRaiseRecords.length * 100) : 0
  const suitedRecords  = records.filter(r => r.hand.endsWith('s'))
  const offsuitRecords = records.filter(r => r.hand.endsWith('o'))
  const pairRecords    = records.filter(r => r.hand[0] === r.hand[1])
  const suitedAcc      = suitedRecords.length > 0 ? Math.round(suitedRecords.filter(r => r.is_correct).length / suitedRecords.length * 100) : 0
  const offsuitAcc     = offsuitRecords.length > 0 ? Math.round(offsuitRecords.filter(r => r.is_correct).length / offsuitRecords.length * 100) : 0
  const pairAcc        = pairRecords.length > 0 ? Math.round(pairRecords.filter(r => r.is_correct).length / pairRecords.length * 100) : 0

  const doAnalyze = async () => {
    setShowConfirm(false)
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const result = await analyzeWeakness({
        overall, total, posList,
        rfiAcc, rfiTotal: rfiRecords.length,
        vsRaiseAcc, vsRaiseTotal: vsRaiseRecords.length,
        suitedAcc, offsuitAcc, pairAcc,
      })
      // 扣點或標記免費次數
      if (hasPaidFree) {
        markPaidFreeUsed()
      } else {
        spendPoints(ANALYSIS_COST)
        setPoints(getPoints())
      }
      setAnalysis(result)
    } catch {
      setAnalysis('分析失敗，請稍後再試。')
    }
    setAnalyzing(false)
  }

  const handleAnalyzeClick = () => {
    if (analyzing) return
    if (hasPaidFree) {
      // 付費用戶免費次數，直接分析
      doAnalyze()
      return
    }
    if (points < ANALYSIS_COST) return
    setShowConfirm(true)
  }

  const canAnalyze = hasPaidFree || points >= ANALYSIS_COST
  const buttonLabel = analyzing
    ? '教練分析中...'
    : hasPaidFree
      ? '開始分析（今日免費）'
      : canAnalyze
        ? `開始分析（⭐ ${ANALYSIS_COST} 點）`
        : `點數不足（需要 ${ANALYSIS_COST} 點）`

  return (
    <div className="flex flex-col gap-5 p-4 pb-24" style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-white font-bold text-base">🎯 弱點強化分析</div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: '#1a1a2e', border: '1px solid #2d2d4a' }}>
          <span className="text-sm">⭐</span>
          <span className="text-sm font-bold text-yellow-400">{points}</span>
        </div>
      </div>

      {/* 費用說明 */}
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        {isPaid ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs">付費用戶</div>
              <div className="text-white text-sm font-medium mt-1">
                {paidFreeUsed ? '今日免費次數已使用' : '今日有 1 次免費分析'}
              </div>
            </div>
            {paidFreeUsed && (
              <div className="text-gray-500 text-xs text-right">
                額外分析<br/>⭐ {ANALYSIS_COST} 點/次
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs">AI 弱點分析</div>
              <div className="text-white text-sm font-medium mt-1">每次 ⭐ {ANALYSIS_COST} 點</div>
            </div>
            <div className="text-gray-500 text-xs text-right">
              練習答對<br/>可獲得點數
            </div>
          </div>
        )}
      </div>

      {/* 確認彈窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: '#111', border: '1px solid #222' }}>
            <div className="text-white font-bold text-base mb-2">使用 AI 分析</div>
            <div className="text-gray-400 text-sm mb-1">花費 ⭐ {ANALYSIS_COST} 點進行弱點分析</div>
            <div className="text-gray-500 text-xs mb-5">目前擁有：⭐ {points} 點</div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-sm"
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
                取消
              </button>
              <button onClick={doAnalyze}
                className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: '#7c3aed' }}>
                確認分析
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分析按鈕 */}
      <button
        onClick={handleAnalyzeClick}
        disabled={!canAnalyze || analyzing}
        className="w-full py-3 rounded-xl text-sm font-bold transition"
        style={{
          background: canAnalyze && !analyzing ? '#4c1d95' : '#1a1a1a',
          border: '1px solid ' + (canAnalyze && !analyzing ? '#7c3aed' : '#2a2a2a'),
          color: canAnalyze && !analyzing ? '#fff' : '#444',
        }}
      >
        {buttonLabel}
      </button>

      {/* 分析結果 */}
      {analysis && (
        <div className="rounded-2xl p-4" style={{ background: '#1a1a3a', border: '1px solid #4c1d95' }}>
          <div className="text-gray-400 text-xs mb-3">教練分析結果</div>
          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{analysis}</div>
        </div>
      )}

    </div>
  )
}
