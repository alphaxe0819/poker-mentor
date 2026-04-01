import { useState } from 'react'
import PokerFelt from '../components/PokerFelt'
import HoleCards from '../components/HoleCards'
import ActionHistory from '../components/ActionHistory'
import ActionFeedback from '../components/ActionFeedback'
import { GUEST_QUESTIONS } from '../data/guestQuestions'
import { getActionByKey, getTopActionsByKey, getRangeByKey } from '../lib/gtoData'
import { buildScenario } from '../tabs/TrainTab'

const POSITIONS_9MAX = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

interface Props {
  onFinish: () => void
  onRegister: () => void
}

type Phase = 'question' | 'answered'

export default function GuestTrainTab({ onFinish, onRegister }: Props) {
  const [current,  setCurrent]  = useState(0)
  const [phase,    setPhase]    = useState<Phase>('question')
  const [chosen,   setChosen]   = useState('')
  const [score,    setScore]    = useState(0)
  const [finished, setFinished] = useState(false)

  const q = GUEST_QUESTIONS[current]

  const { seatInfo, actionHistory, scenarioText } = buildScenario(
    POSITIONS_9MAX, q.heroPos, q.stackBB, q.raiserPos, q.raiserAction
  )

  const gtoAnswer  = getActionByKey(q.stackBB, q.dbKey, q.hand)
  const topActions = getTopActionsByKey(q.stackBB, q.dbKey, q.hand)
  const gtoRange   = getRangeByKey(q.stackBB, q.dbKey)
  const isCorrect  = chosen === gtoAnswer

  const getActions = () => {
    if (!q.raiserPos) return [
      { label: 'Fold',  action: 'f' },
      { label: 'Raise', action: 'r' },
    ]
    return [
      { label: 'Fold',  action: 'f' },
      { label: 'Call',  action: 'c' },
      { label: '3-Bet', action: '3b' },
    ]
  }

  const handleAnswer = (action: string) => {
    setChosen(action)
    setPhase('answered')
    if (action === gtoAnswer) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= GUEST_QUESTIONS.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setPhase('question')
      setChosen('')
    }
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6"
           style={{ background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="text-4xl font-black text-white mb-2">{score} / 3</div>
          <div className="text-gray-400 text-sm">體驗結束！正確率 {Math.round(score/3*100)}%</div>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button onClick={onRegister}
            className="w-full py-3.5 rounded-full font-bold text-white"
            style={{ background: '#7c3aed' }}>
            註冊解鎖完整功能
          </button>
          <button onClick={onFinish}
            className="w-full py-3 rounded-full text-sm font-medium"
            style={{ background: '#111', border: '1px solid #222', color: '#666' }}>
            返回登入
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div className="flex items-center justify-between px-4 py-3"
           style={{ borderBottom: '1px solid #1a1a1a' }}>
        <span className="text-gray-500 text-sm">體驗模式</span>
        <span className="text-gray-500 text-sm">{current + 1} / {GUEST_QUESTIONS.length}</span>
      </div>

      <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto w-full">
        <ActionHistory actions={actionHistory} />

        <PokerFelt
          tableSize={9}
          heroPosition={q.heroPos}
          seatInfo={seatInfo}
          scenarioText={scenarioText}
          showPositions
        />

        <div className="flex justify-center">
          <HoleCards hand={q.hand} />
        </div>

        {phase === 'question' && (
          <div className="grid gap-2"
               style={{ gridTemplateColumns: `repeat(${getActions().length}, 1fr)` }}>
            {getActions().map(btn => (
              <button key={btn.action} onClick={() => handleAnswer(btn.action)}
                className="py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: '#111', border: '1px solid #222' }}>
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {phase === 'answered' && (
          <ActionFeedback
            isCorrect={isCorrect}
            gtoAction={topActions[0]?.action ?? gtoAnswer}
            gtoFreq={topActions[0]?.freq ?? 100}
            secondAction={topActions[1]?.action ?? 'f'}
            secondFreq={topActions[1]?.freq ?? 0}
            chosenAction={chosen}
            chosenFreq={isCorrect ? 100 : 0}
            hand={q.hand}
            gtoRange={gtoRange}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  )
}
