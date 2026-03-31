import { useState, useCallback } from 'react'
import PokerFelt, { type SeatDisplayInfo } from '../components/PokerFelt'
import HoleCards from '../components/HoleCards'
import { getGTOAction, getActionLabel } from '../lib/gtoData'

// ── 常數 ──────────────────────────────────────────
const GAME_TYPES = [
  { key: 'cash_6max',  label: '6-max 現金', tableSize: 6  as const },
  { key: 'tourn_9max', label: '9-max 錦標', tableSize: 9  as const },
  { key: 'cash_hu',    label: 'HU 對戰',    tableSize: 2  as const },
  { key: 'cash_4max',  label: '4-max 現金', tableSize: 4  as const },
] as const

type GameTypeKey = typeof GAME_TYPES[number]['key']

const QUIZ_SIZES = [10, 20, 30]
const STACK_DEPTHS = [100, 75, 40, 25, 15]

const POSITIONS: Record<GameTypeKey, string[]> = {
  cash_6max:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  tourn_9max: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  cash_hu:    ['BTN/SB', 'BB'],
  cash_4max:  ['CO', 'BTN', 'SB', 'BB'],
}

const ACTION_BUTTONS = [
  { label: 'Fold',  action: 'f',    color: 'bg-gray-600 hover:bg-gray-500' },
  { label: 'Call',  action: 'c',    color: 'bg-blue-600 hover:bg-blue-500' },
  { label: 'Raise', action: 'r',    color: 'bg-green-600 hover:bg-green-500' },
  { label: '3-Bet', action: '3b',   color: 'bg-yellow-600 hover:bg-yellow-500' },
  { label: 'All-in',action: 'allin',color: 'bg-red-700 hover:bg-red-600' },
]

// ── 輔助函數 ──────────────────────────────────────
const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
const ALL_HANDS: string[] = (() => {
  const h: string[] = []
  for (let i = 0; i < RANKS.length; i++)
    for (let j = 0; j < RANKS.length; j++) {
      if (i === j) h.push(RANKS[i] + RANKS[j])
      else if (i < j) h.push(RANKS[i] + RANKS[j] + 's')
      else h.push(RANKS[j] + RANKS[i] + 'o')
    }
  return h
})()

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildSeatInfo(positions: string[], heroPos: string): Record<string, SeatDisplayInfo> {
  const info: Record<string, SeatDisplayInfo> = {}
  let hasRaiser = false
  for (const pos of positions) {
    if (pos === heroPos) { info[pos] = { status: 'hero', bet: 0 }; break }
    if (pos === 'SB')    { info[pos] = { status: 'posted', bet: 0.5 }; continue }
    if (pos === 'BB')    { info[pos] = { status: 'posted', bet: 1 };   continue }
    if (!hasRaiser && Math.random() < 0.28) {
      info[pos] = { status: 'raised', bet: 2.5 }
      hasRaiser = true
    } else {
      info[pos] = { status: 'folded', bet: 0 }
    }
  }
  for (const pos of positions) {
    if (!info[pos]) info[pos] = { status: 'waiting', bet: 0 }
  }
  return info
}

function buildScenario(positions: string[], heroPos: string, seatInfo: Record<string, SeatDisplayInfo>): string {
  const raiser = positions.find(p => seatInfo[p]?.status === 'raised')
  return raiser
    ? `${raiser} 加注到 2.5BB，輪到你（${heroPos}）`
    : `沒有人加注，輪到你（${heroPos}）`
}

// Placeholder GTO lookup
function getGTOAnswer(gameTypeKey: string, stackDepth: number, heroPos: string, hand: string): string {
  return getGTOAction(gameTypeKey, stackDepth, heroPos, hand)
}

// ── 型別 ──────────────────────────────────────────
interface QuizQuestion {
  gameTypeKey: GameTypeKey
  tableSize: 2 | 4 | 6 | 9
  stackDepth: number
  heroPos: string
  hand: string
  seatInfo: Record<string, SeatDisplayInfo>
  scenario: string
  gtoAnswer: string
}

interface WrongItem {
  hand: string
  heroPos: string
  chosen: string
  gtoAnswer: string
}

type QuizPhase = 'setup' | 'playing' | 'result'

// ── 主元件 ────────────────────────────────────────
export default function QuizTab() {
  const [gameTypeKey, setGameTypeKey] = useState<GameTypeKey>('cash_6max')
  const [stackDepth, setStackDepth]   = useState<number>(100)
  const [quizSize, setQuizSize]       = useState<number>(10)

  const [phase, setPhase]         = useState<QuizPhase>('setup')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent]     = useState<number>(0)
  const [answered, setAnswered]   = useState<boolean>(false)
  const [chosen, setChosen]       = useState<string>('')
  const [score, setScore]         = useState<number>(0)
  const [wrongs, setWrongs]       = useState<WrongItem[]>([])

  const gameType  = GAME_TYPES.find(g => g.key === gameTypeKey)!
  const positions = POSITIONS[gameTypeKey]

  const generateQuestions = useCallback((): QuizQuestion[] => {
    return Array.from({ length: quizSize }, () => {
      const heroPos   = randomItem(positions)
      const hand      = randomItem(ALL_HANDS)
      const seatInfo  = buildSeatInfo(positions, heroPos)
      const scenario  = buildScenario(positions, heroPos, seatInfo)
      const gtoAnswer = getGTOAnswer(gameTypeKey, stackDepth, heroPos, hand)
      return { gameTypeKey, tableSize: gameType.tableSize, stackDepth, heroPos, hand, seatInfo, scenario, gtoAnswer }
    })
  }, [gameTypeKey, stackDepth, quizSize, gameType.tableSize, positions])

  const startQuiz = () => {
    setQuestions(generateQuestions())
    setCurrent(0)
    setScore(0)
    setWrongs([])
    setAnswered(false)
    setChosen('')
    setPhase('playing')
  }

  const handleAnswer = (action: string) => {
    if (answered) return
    setChosen(action)
    setAnswered(true)
    const q = questions[current]
    if (action === q.gtoAnswer) {
      setScore(s => s + 1)
    } else {
      setWrongs(w => [...w, { hand: q.hand, heroPos: q.heroPos, chosen: action, gtoAnswer: q.gtoAnswer }])
    }
  }

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setAnswered(false)
      setChosen('')
    }
  }

  const q = questions[current]
  const isCorrect = q ? chosen === q.gtoAnswer : false
  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // ── 設定畫面 ──
  if (phase === 'setup') {
    return (
      <div className="flex flex-col gap-5 p-4 max-w-lg mx-auto">
        <h2 className="text-white font-bold text-lg">測驗模式</h2>

        <div>
          <div className="text-gray-400 text-xs mb-2">遊戲類型</div>
          <div className="flex gap-2 flex-wrap">
            {GAME_TYPES.map(g => (
              <button key={g.key} onClick={() => setGameTypeKey(g.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                  ${gameTypeKey === g.key ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-xs mb-2">籌碼深度</div>
          <div className="flex gap-2 flex-wrap">
            {STACK_DEPTHS.map(d => (
              <button key={d} onClick={() => setStackDepth(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                  ${stackDepth === d ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                {d}BB
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-xs mb-2">題數</div>
          <div className="flex gap-2">
            {QUIZ_SIZES.map(s => (
              <button key={s} onClick={() => setQuizSize(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition
                  ${quizSize === s ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                {s} 題
              </button>
            ))}
          </div>
        </div>

        <button onClick={startQuiz}
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold text-base transition mt-2">
          開始測驗
        </button>
      </div>
    )
  }

  // ── 結果畫面 ──
  if (phase === 'result') {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
        <h2 className="text-white font-bold text-lg text-center">測驗結果</h2>

        <div className="bg-gray-800 rounded-2xl p-5 text-center">
          <div className="text-5xl font-black text-purple-400">{accuracy}%</div>
          <div className="text-gray-400 text-sm mt-1">正確率</div>
          <div className="text-white text-sm mt-2">{score} / {questions.length} 題正確</div>
        </div>

        {wrongs.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-gray-400 text-xs">錯誤題目</div>
            {wrongs.map((w, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-white text-sm font-bold">{w.hand}</span>
                <span className="text-gray-400 text-xs">{w.heroPos}</span>
                <span className="text-red-400 text-xs">你：{getActionLabel(w.chosen)}</span>
                <span className="text-green-400 text-xs">GTO：{getActionLabel(w.gtoAnswer)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button onClick={startQuiz}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-full font-bold text-sm transition">
            再測一次
          </button>
          <button onClick={() => setPhase('setup')}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-full font-bold text-sm transition">
            重新設定
          </button>
        </div>
      </div>
    )
  }

  // ── 答題畫面 ──
  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">

      {/* 進度 */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-xs">第 {current + 1} / {questions.length} 題</span>
        <span className="text-green-400 text-xs">✓ {score}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div className="bg-purple-500 h-1 rounded-full transition-all"
             style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      {q && (
        <>
          <PokerFelt
            tableSize={q.tableSize}
            heroPosition={q.heroPos}
            seatInfo={q.seatInfo}
            scenarioText={q.scenario}
            showPositions
          />

          <div className="flex justify-center">
            <HoleCards hand={q.hand} />
          </div>

          {!answered && (
            <div className="grid grid-cols-3 gap-2">
              {ACTION_BUTTONS.map(btn => (
                <button key={btn.action} onClick={() => handleAnswer(btn.action)}
                  className={`${btn.color} text-white font-bold py-3 rounded-xl text-sm transition`}>
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {answered && (
            <div className={`rounded-xl p-4 text-center border ${
              isCorrect ? 'bg-green-900/40 border-green-600' : 'bg-red-900/40 border-red-600'
            }`}>
              <div className="text-lg font-bold mb-1">
                {isCorrect ? '✅ 正確！' : '❌ 不對'}
              </div>
              <div className="text-sm text-gray-300">
                GTO 建議：<span className="text-yellow-300 font-bold">{getActionLabel(q.gtoAnswer)}</span>
              </div>
              <button onClick={nextQuestion}
                className="mt-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium transition">
                {current + 1 >= questions.length ? '查看結果' : '下一題'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
