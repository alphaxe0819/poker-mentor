import { useState, useCallback, useRef } from 'react'
import PokerFelt, { type SeatDisplayInfo } from '../components/PokerFelt'
import HoleCards from '../components/HoleCards'
import SessionStats from '../components/SessionStats'
import ActionFeedback, { SimpleStepFeedback } from '../components/ActionFeedback'
import { getGTOAction, getTopActions, getStep2GTOFromDB } from '../lib/gtoData'

// ── 常數 ──────────────────────────────────────────────────────────────────────

const GAME_TYPES = [
  { key: 'cash_6max',  label: '6-max 現金', tableSize: 6  as const },
  { key: 'tourn_9max', label: '9-max 錦標', tableSize: 9  as const },
  { key: 'cash_hu',    label: 'HU 對戰',    tableSize: 2  as const },
  { key: 'cash_4max',  label: '4-max 現金', tableSize: 4  as const },
] as const

type GameTypeKey = typeof GAME_TYPES[number]['key']

const STACK_DEPTHS = [100, 75, 40, 25, 15]

const POSITIONS: Record<GameTypeKey, string[]> = {
  cash_6max:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  tourn_9max: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  cash_hu:    ['BTN/SB', 'BB'],
  cash_4max:  ['CO', 'BTN', 'SB', 'BB'],
}

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

// ── 輔助函數 ──────────────────────────────────────────────────────────────────

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getVillainResponse(heroAction: string, stackBB: number): string {
  const rand = Math.random()
  if (heroAction === 'r') {
    if (stackBB <= 25) {
      if (rand < 0.50) return 'allin'
      if (rand < 0.80) return 'fold'
      return 'call'
    } else {
      if (rand < 0.30) return '3bet'
      if (rand < 0.80) return 'fold'
      return 'call'
    }
  }
  if (heroAction === '3b') {
    if (rand < 0.40) return '4bet'
    if (rand < 0.80) return 'fold'
    return 'call'
  }
  return 'fold'
}

function getStep2Actions(villainResp: string, stackBB: number): { label: string; action: string }[] {
  if (villainResp === '3bet') return [
    { label: '4-Bet', action: '4b' },
    { label: 'Call',  action: 'c'  },
    { label: 'Fold',  action: 'f'  },
  ]
  if (villainResp === '4bet') return [
    { label: 'All-in', action: 'allin' },
    { label: 'Call',   action: 'c'     },
    { label: 'Fold',   action: 'f'     },
  ]
  if (villainResp === 'allin') return [
    { label: `Call ${stackBB}BB`, action: 'c' },
    { label: 'Fold',              action: 'f' },
  ]
  return [{ label: 'Fold', action: 'f' }]
}

function buildSeatInfo(
  positions: string[],
  heroPos: string,
  stackBB: number,
  raiserPos?: string | null,
  villainRespPos?: string | null,
  villainResp?: string | null,
): Record<string, SeatDisplayInfo> {
  const info: Record<string, SeatDisplayInfo> = {}

  for (const pos of positions) {
    if (pos === heroPos) {
      info[pos] = { status: 'hero', bet: 0, stack: stackBB }
      continue
    }
    if (pos === 'SB') {
      info[pos] = { status: 'posted', bet: 0.5, stack: stackBB - 0.5 }
      continue
    }
    if (pos === 'BB') {
      info[pos] = { status: 'posted', bet: 1, stack: stackBB - 1 }
      continue
    }
    if (villainRespPos && pos === villainRespPos) {
      const betAmt = villainResp === '3bet' ? 7.5 : villainResp === '4bet' ? 17 : stackBB
      info[pos] = { status: 'raised', bet: betAmt, stack: stackBB - betAmt }
      continue
    }
    if (raiserPos && pos === raiserPos) {
      info[pos] = { status: 'raised', bet: 2.5, stack: stackBB - 2.5 }
      continue
    }
    info[pos] = { status: 'folded', bet: 0, stack: stackBB }
  }

  for (const pos of positions) {
    if (!info[pos]) info[pos] = { status: 'waiting', bet: 0, stack: stackBB }
  }
  return info
}

// ── 型別 ──────────────────────────────────────────────────────────────────────

interface HandSetup {
  gameTypeKey: GameTypeKey
  tableSize: 2 | 4 | 6 | 9
  stackDepth: number
  heroPos: string
  hand: string
  raiserPos: string | null
  initialScenario: 'RFI' | 'vs_raise'
}

interface StepResult {
  step: number
  heroAction: string
  gtoAction: string
  isCorrect: boolean
  gtoTopActions: { action: string; freq: number }[]
}

type Phase =
  | 'question_step1'
  | 'villain_response'
  | 'question_step2'
  | 'feedback_step1'
  | 'feedback_step2'
  | 'hand_over'

// ── 主元件 ────────────────────────────────────────────────────────────────────

export default function TrainTab() {
  const [gameTypeKey, setGameTypeKey] = useState<GameTypeKey>('cash_6max')
  const [stackDepth, setStackDepth]   = useState<number>(100)

  const [handSetup,       setHandSetup]       = useState<HandSetup | null>(null)
  const [phase,           setPhase]           = useState<Phase>('question_step1')
  const [villainResp,     setVillainResp]     = useState<string>('')
  const [villainPos,      setVillainPos]      = useState<string>('')
  const [step2Actions,    setStep2Actions]    = useState<{ label: string; action: string }[]>([])
  const [stepResults,     setStepResults]     = useState<StepResult[]>([])
  const [potWinMsg,       setPotWinMsg]       = useState<string>('')
  const [currentSeatInfo, setCurrentSeatInfo] = useState<Record<string, SeatDisplayInfo>>({})
  const [scenarioText,    setScenarioText]    = useState<string>('')

  const [total,   setTotal]   = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak,  setStreak]  = useState(0)

  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const gameType  = GAME_TYPES.find(g => g.key === gameTypeKey)!
  const positions = POSITIONS[gameTypeKey]
  const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0

  const startHand = useCallback(() => {
    if (autoNextTimer.current) clearTimeout(autoNextTimer.current)

    const heroPos = randomItem(positions)
    const hand    = randomItem(ALL_HANDS)
    const hasFacing = Math.random() < 0.4
    let raiserPos: string | null = null

    if (hasFacing) {
      const heroIdx    = positions.indexOf(heroPos)
      const beforeHero = positions.slice(0, heroIdx).filter(p => p !== 'SB' && p !== 'BB')
      if (beforeHero.length > 0) raiserPos = randomItem(beforeHero)
    }

    const initialScenario: 'RFI' | 'vs_raise' = raiserPos ? 'vs_raise' : 'RFI'
    const setup: HandSetup = {
      gameTypeKey, tableSize: gameType.tableSize, stackDepth,
      heroPos, hand, raiserPos, initialScenario,
    }

    const seatInfo = buildSeatInfo(positions, heroPos, stackDepth, raiserPos)
    const text = raiserPos
      ? `${raiserPos} 加注 2.5BB，輪到你（${heroPos}）`
      : `沒有人加注，輪到你（${heroPos}）`

    setHandSetup(setup)
    setCurrentSeatInfo(seatInfo)
    setScenarioText(text)
    setPhase('question_step1')
    setVillainResp('')
    setVillainPos('')
    setStep2Actions([])
    setStepResults([])
    setPotWinMsg('')
  }, [gameTypeKey, stackDepth, gameType.tableSize, positions])

  const getStep1Actions = (setup: HandSetup) => {
    if (setup.initialScenario === 'RFI') {
      const a = [
        { label: 'Fold',  action: 'f' },
        { label: 'Raise', action: 'r' },
      ]
      if (setup.stackDepth <= 25) a.push({ label: 'All-in', action: 'allin' })
      return a
    } else {
      const a = [
        { label: 'Fold',  action: 'f' },
        { label: 'Call',  action: 'c' },
        { label: '3-Bet', action: '3b' },
      ]
      if (setup.stackDepth <= 40) a.push({ label: 'All-in', action: 'allin' })
      return a
    }
  }

  const handleStep1 = (action: string) => {
    if (!handSetup) return

    const dbScenario = handSetup.initialScenario === 'vs_raise' ? 'vs_open' : 'open'
    const gtoAnswer  = getGTOAction(gameTypeKey, stackDepth, handSetup.heroPos, handSetup.hand, dbScenario)
    const topActions = getTopActions(gameTypeKey, stackDepth, handSetup.heroPos, handSetup.hand, dbScenario)
    const isOk = action === gtoAnswer

    const result: StepResult = {
      step: 1, heroAction: action, gtoAction: gtoAnswer, isCorrect: isOk, gtoTopActions: topActions,
    }
    setStepResults([result])

    if (!isOk) {
      setPhase('feedback_step1')
      setTotal(t => t + 1)
      setStreak(0)
      return
    }

    const hasMultiStep = gameTypeKey === 'tourn_9max' && stackDepth >= 88

    if ((action === 'r' || action === '3b') && hasMultiStep) {
      setPhase('villain_response')
      setTimeout(() => {
        const resp = getVillainResponse(action, stackDepth)
        const heroIdx    = positions.indexOf(handSetup.heroPos)
        const candidates = positions.slice(0, heroIdx).filter(p => p !== 'SB' && p !== 'BB')
        const vPos = handSetup.raiserPos ?? (candidates.length > 0 ? randomItem(candidates) : 'BB')
        setVillainResp(resp)
        setVillainPos(vPos)

        if (resp === 'fold' || resp === 'call') {
          const pot = action === 'r' ? 3.5 : 8.5
          setPotWinMsg(resp === 'fold' ? `${vPos} 棄牌，收取底池 +${pot}BB` : `${vPos} 跟注`)
          setPhase('hand_over')
          setTotal(t => t + 1)
          setCorrect(c => c + 1)
          setStreak(s => s + 1)
          autoNextTimer.current = setTimeout(() => startHand(), 1800)
        } else {
          const betAmt    = resp === '3bet' ? 7.5 : resp === '4bet' ? 17 : stackDepth
          const newSeatInfo = buildSeatInfo(positions, handSetup.heroPos, stackDepth, handSetup.raiserPos, vPos, resp)
          const newText   =
            resp === '3bet'  ? `${vPos} 3-Bet ${betAmt}BB，輪到你（${handSetup.heroPos}）` :
            resp === '4bet'  ? `${vPos} 4-Bet ${betAmt}BB，輪到你（${handSetup.heroPos}）` :
                               `${vPos} All-in ${betAmt}BB，輪到你（${handSetup.heroPos}）`
          setCurrentSeatInfo(newSeatInfo)
          setScenarioText(newText)
          setStep2Actions(getStep2Actions(resp, stackDepth))
          setPhase('question_step2')
        }
      }, 900)
      return
    }

    setPhase('feedback_step1')
    setTotal(t => t + 1)
    setCorrect(c => c + 1)
    setStreak(s => s + 1)
  }

  const handleStep2 = (action: string) => {
    if (!handSetup) return
    const gtoAnswer = getStep2GTOFromDB(
      gameTypeKey, stackDepth, handSetup.heroPos, villainPos, villainResp, handSetup.hand
    )
    const isOk = action === gtoAnswer
    const result: StepResult = {
      step: 2, heroAction: action, gtoAction: gtoAnswer, isCorrect: isOk,
      gtoTopActions: [{ action: gtoAnswer, freq: 100 }],
    }
    setStepResults(prev => [...prev, result])
    setPhase('feedback_step2')
    setTotal(t => t + 1)
    if (isOk) { setCorrect(c => c + 1); setStreak(s => s + 1) }
    else      { setStreak(0) }
  }

  const step1Result = stepResults.find(r => r.step === 1)
  const step2Result = stepResults.find(r => r.step === 2)

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', background: '#0a0a0a' }}>

      <SessionStats accuracy={accuracy} streak={streak} total={total} stackBB={stackDepth} />

      <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto w-full">

        <div className="flex gap-2 flex-wrap">
          {GAME_TYPES.map(g => (
            <button key={g.key} onClick={() => { setGameTypeKey(g.key); setHandSetup(null) }}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition"
              style={{
                background: gameTypeKey === g.key ? '#7c3aed' : '#111',
                border: gameTypeKey === g.key ? '1px solid #7c3aed' : '1px solid #222',
                color: gameTypeKey === g.key ? '#fff' : '#555',
              }}>
              {g.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {STACK_DEPTHS.map(d => (
            <button key={d} onClick={() => setStackDepth(d)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition"
              style={{
                background: stackDepth === d ? '#1d4ed8' : '#111',
                border: stackDepth === d ? '1px solid #1d4ed8' : '1px solid #222',
                color: stackDepth === d ? '#fff' : '#555',
              }}>
              {d}BB
            </button>
          ))}
        </div>

        {!handSetup ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="text-gray-600 text-sm">選好設定後開始練習</div>
            <button onClick={startHand}
              className="px-8 py-3 rounded-full font-bold text-base text-white"
              style={{ background: '#7c3aed' }}>
              開始練習
            </button>
          </div>
        ) : (
          <>
            <PokerFelt
              tableSize={handSetup.tableSize}
              heroPosition={handSetup.heroPos}
              seatInfo={currentSeatInfo}
              scenarioText={phase === 'villain_response' ? '等待對手反應...' : scenarioText}
              showPositions
            />

            <div className="flex justify-center">
              <HoleCards hand={handSetup.hand} />
            </div>

            {phase === 'question_step1' && (
              <div className="grid gap-2"
                   style={{ gridTemplateColumns: `repeat(${Math.min(getStep1Actions(handSetup).length, 3)}, 1fr)` }}>
                {getStep1Actions(handSetup).map(btn => (
                  <button key={btn.action} onClick={() => handleStep1(btn.action)}
                    className="py-3 rounded-xl text-sm font-bold text-white transition"
                    style={{ background: '#111', border: '1px solid #222' }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            )}

            {phase === 'villain_response' && (
              <div className="text-center text-gray-500 text-sm py-4 animate-pulse">
                對手思考中...
              </div>
            )}

            {phase === 'question_step2' && (
              <div className="grid gap-2"
                   style={{ gridTemplateColumns: `repeat(${Math.min(step2Actions.length, 3)}, 1fr)` }}>
                {step2Actions.map(btn => (
                  <button key={btn.action} onClick={() => handleStep2(btn.action)}
                    className="py-3 rounded-xl text-sm font-bold text-white transition"
                    style={{ background: '#111', border: '1px solid #222' }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            )}

            {phase === 'hand_over' && potWinMsg && (
              <div className="text-center text-green-400 text-sm py-3 font-medium">
                {potWinMsg}
              </div>
            )}

            {phase === 'feedback_step1' && step1Result && (
              <ActionFeedback
                isCorrect={step1Result.isCorrect}
                gtoAction={step1Result.gtoTopActions[0]?.action ?? step1Result.gtoAction}
                gtoFreq={step1Result.gtoTopActions[0]?.freq ?? 100}
                secondAction={step1Result.gtoTopActions[1]?.action ?? 'f'}
                secondFreq={step1Result.gtoTopActions[1]?.freq ?? 0}
                chosenAction={step1Result.heroAction}
                chosenFreq={step1Result.isCorrect ? 100 : 0}
                hand={handSetup.hand}
                onNext={startHand}
              />
            )}

            {phase === 'feedback_step2' && step2Result && (
              <SimpleStepFeedback
                isCorrect={step2Result.isCorrect}
                gtoAction={step2Result.gtoAction}
                onNext={startHand}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
