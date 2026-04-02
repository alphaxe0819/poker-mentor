import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getAnalysisUsage, incrementAnalysisUsage } from '../lib/auth'

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

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY ?? ''

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
  const posText = data.posList
    .map(p => `- ${p.pos}：${p.accuracy}%（${p.total} 題）`)
    .join('\n')

  const userPrompt = `【分析模組：翻前基礎策略】

以下是這位學生的近期答題數據：

整體正確率：${data.overall}%，共 ${data.total} 題

位置正確率（由低到高）：
${posText}

場景正確率：
- RFI：${data.rfiAcc}%（${data.rfiTotal} 題）
- vs Raise：${data.vsRaiseAcc}%（${data.vsRaiseTotal} 題）

手牌類型正確率：
- 同花：${data.suitedAcc}%
- 雜色：${data.offsuitAcc}%
- 對子：${data.pairAcc}%

請直接點出這位學生最需要改善的 3-5 個弱點。`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: `你是一位專業的德州撲克 GTO 教練。
用繁體中文，直接點出學生的弱點，口吻像教練在賽後檢討。
格式固定：列出 3-5 個弱點，每條一句話，直接說問題在哪。
開頭不要廢話，直接進入弱點清單。
不要給鼓勵或正面評價，只講需要改進的地方。

【分析模組】
目前啟用：翻前基礎策略
未來模組（停用中）：ICM 壓力場景、決賽桌單挑、短籌碼推疊策略`,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  const json = await response.json()
  return json.content?.[0]?.text ?? '分析失敗，請稍後再試。'
}

export default function AnalysisTab({ userId, isPaid = false }: Props) {
  const [records,   setRecords]   = useState<AnswerRecord[]>([])
  const [loading,   setLoading]   = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis,  setAnalysis]  = useState<string | null>(null)
  const [usage, setUsage] = useState<{
    canUse: boolean
    remaining: number
    totalAnswered: number
    nextUnlockAt: number
  } | null>(null)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    setLoading(true)

    Promise.all([
      supabase
        .from('answer_records')
        .select('hero_pos, hand, is_correct, scenario_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }),
      getAnalysisUsage(userId, isPaid),
    ]).then(([res, usageData]) => {
      setRecords((res.data ?? []) as AnswerRecord[])
      setUsage(usageData)
      setLoading(false)
    })
  }, [userId, isPaid])

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

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-6" style={{ background: '#0a0a0a' }}>
        <div className="text-4xl">📊</div>
        <div className="text-white font-bold">尚無答題記錄</div>
        <div className="text-gray-500 text-sm">完成練習後才能使用弱點分析</div>
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

  const handleAnalyze = async () => {
    if (!userId || !usage?.canUse) return
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const result = await analyzeWeakness({
        overall, total, posList,
        rfiAcc, rfiTotal: rfiRecords.length,
        vsRaiseAcc, vsRaiseTotal: vsRaiseRecords.length,
        suitedAcc, offsuitAcc, pairAcc,
      })
      await incrementAnalysisUsage(userId, isPaid, total)
      const newUsage = await getAnalysisUsage(userId, isPaid)
      setUsage(newUsage)
      setAnalysis(result)
    } catch {
      setAnalysis('分析失敗，請稍後再試。')
    }
    setAnalyzing(false)
  }

  return (
    <div className="flex flex-col gap-5 p-4 pb-24" style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      <div className="text-white font-bold text-base pt-2">🎯 弱點強化分析</div>

      {/* 使用次數說明 */}
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        {isPaid ? (
          <>
            <div className="text-gray-400 text-xs mb-2">付費用戶・今日剩餘次數</div>
            <div className="flex items-end gap-1">
              <span className="text-white font-bold text-3xl">{usage?.remaining ?? 0}</span>
              <span className="text-gray-500 text-sm mb-1">/ 3 次</span>
            </div>
          </>
        ) : (
          <>
            <div className="text-gray-400 text-xs mb-2">免費用戶・累計答題進度</div>
            <div className="flex items-end gap-1">
              <span className="text-white font-bold text-3xl">{usage?.totalAnswered ?? 0}</span>
              <span className="text-gray-500 text-sm mb-1">/ {usage?.nextUnlockAt ?? 70} 題</span>
            </div>
            <div className="mt-2 rounded-full h-1.5" style={{ background: '#1a1a1a' }}>
              <div className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${Math.min(((usage?.totalAnswered ?? 0) / (usage?.nextUnlockAt ?? 70)) * 100, 100)}%`,
                  background: usage?.canUse ? '#10b981' : '#7c3aed',
                }} />
            </div>
            {!usage?.canUse && (
              <div className="text-gray-600 text-xs mt-2">
                還需 {(usage?.nextUnlockAt ?? 70) - (usage?.totalAnswered ?? 0)} 題即可解鎖
              </div>
            )}
          </>
        )}
      </div>

      {/* 分析按鈕 */}
      <button
        onClick={handleAnalyze}
        disabled={!usage?.canUse || analyzing}
        className="w-full py-3 rounded-xl text-sm font-bold transition"
        style={{
          background: usage?.canUse && !analyzing ? '#4c1d95' : '#1a1a1a',
          border: '1px solid ' + (usage?.canUse && !analyzing ? '#7c3aed' : '#2a2a2a'),
          color: usage?.canUse && !analyzing ? '#fff' : '#444',
        }}
      >
        {analyzing ? '教練分析中...' : usage?.canUse ? '開始分析我的弱點' : '題數不足，繼續練習解鎖'}
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
