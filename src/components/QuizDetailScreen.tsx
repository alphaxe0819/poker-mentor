import type { QuizResult } from '../data/quizQuestions'
import { STYLE_META, LEVEL_META, QUIZ_QUESTIONS } from '../data/quizQuestions'
import RadarChart from './RadarChart'

interface Props {
  result: QuizResult
  onContinue: () => void
}

const COURSE_RECO: Record<string, { course: string; reason: string }> = {
  'rock-beginner':       { course: 'RFI 基礎', reason: '學習在各位置主動出擊' },
  'rock-novice':         { course: '位置的力量', reason: '學會利用位置優勢' },
  'rock-intermediate':   { course: '面對加注', reason: '學習更積極的防守策略' },
  'rock-advanced':       { course: '直接開始訓練', reason: '嘗試增加攻擊頻率' },
  'octopus-beginner':    { course: 'RFI 基礎', reason: '建立正確的翻前範圍' },
  'octopus-novice':      { course: '面對加注', reason: '學習何時該棄牌' },
  'octopus-intermediate': { course: '面對加注', reason: '提升防守效率' },
  'octopus-advanced':    { course: '直接開始訓練', reason: '專注收緊翻前範圍' },
  'fox-beginner':        { course: 'RFI 基礎', reason: '打好基礎再發揮創意' },
  'fox-novice':          { course: '面對加注', reason: '讓攻擊更有紀律' },
  'fox-intermediate':    { course: '直接開始訓練', reason: '用實戰磨練攻擊技巧' },
  'fox-advanced':        { course: '直接開始訓練', reason: '將創意與紀律完美結合' },
  'shark-beginner':      { course: 'RFI 基礎', reason: '鞏固基本功' },
  'shark-novice':        { course: '位置的力量', reason: '讓你的優勢更全面' },
  'shark-intermediate':  { course: '直接開始訓練', reason: '挑戰更高難度的情境' },
  'shark-advanced':      { course: '直接開始訓練', reason: '你已具備 GTO 思維！' },
}

export default function QuizDetailScreen({ result, onContinue }: Props) {
  const meta = STYLE_META[result.style]
  const levelMeta = LEVEL_META[result.level]
  const scenarioCount = QUIZ_QUESTIONS.filter(q => q.type === 'scenario').length
  const recoKey = `${result.style}-${result.level}`
  const reco = COURSE_RECO[recoKey]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Style hero */}
        <div className="text-center px-6 pt-8 pb-4">
          <div className="text-5xl mb-3">{meta.emoji}</div>
          <div className="text-2xl font-black text-white mb-1">{meta.name}</div>
          <div className="text-gray-500 text-sm mb-4">{meta.tag}</div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            {meta.description}
          </p>
        </div>

        {/* Radar chart */}
        <div className="flex justify-center mb-2">
          <RadarChart dimensions={result.dimensions} size={240} />
        </div>

        <div className="px-6">
          {/* Tips */}
          <div className="mb-5">
            <div className="text-white text-sm font-bold mb-3">💡 個性化訓練建議</div>
            <div className="flex flex-col gap-2">
              {meta.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl p-3"
                  style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                  <span className="text-purple-400 text-xs mt-0.5">●</span>
                  <span className="text-gray-300 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GTO level */}
          <div className="rounded-xl p-4 mb-5"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="text-gray-500 text-xs mb-2">📊 GTO 理解度</div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">等級</span>
              <span className="text-white text-sm font-medium">{levelMeta.label}</span>
            </div>
            <div className="w-full h-1.5 rounded-full mt-1" style={{ background: '#222' }}>
              <div className="h-1.5 rounded-full"
                style={{
                  width: `${(result.gtoCorrect / scenarioCount) * 100}%`,
                  background: '#7c3aed',
                }}
              />
            </div>
            <div className="text-gray-600 text-xs mt-1 text-right">
              {result.gtoCorrect} / {scenarioCount} 情境題正確
            </div>
          </div>

          {/* Course recommendation */}
          {reco && (
            <div className="rounded-xl p-4 mb-4"
              style={{ background: '#0f1a0f', border: '1px solid #1a4a1a' }}>
              <div className="text-green-400 font-bold text-sm mb-1">🎯 推薦學習路徑</div>
              <div className="text-gray-300 text-sm">
                {reco.course === '直接開始訓練'
                  ? `${reco.reason}，推薦直接開始實戰訓練！`
                  : `推薦先上「${reco.course}」課程 — ${reco.reason}`
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-3"
        style={{ background: 'linear-gradient(transparent, #0a0a0a 30%)' }}>
        <div className="max-w-lg mx-auto">
          <button onClick={onContinue}
            className="w-full py-3.5 rounded-full text-sm font-bold text-white transition"
            style={{ background: '#7c3aed' }}>
            開始訓練 →
          </button>
        </div>
      </div>
    </div>
  )
}
