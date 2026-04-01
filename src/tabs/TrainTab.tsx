import { useState, useCallback, useRef, useEffect } from 'react'
import PokerFelt from '../components/PokerFelt'

export interface SeatDisplayInfo {
  status: 'hero' | 'raised' | 'posted' | 'folded' | 'waiting' | 'active'
  bet: number
  stack?: number
}
import HoleCards from '../components/HoleCards'
import SessionStats from '../components/SessionStats'
import ActionFeedback from '../components/ActionFeedback'
import ActionHistory from '../components/ActionHistory'
import TrainSetupScreen from './TrainSetupScreen'
import RoundResultScreen from '../components/RoundResultScreen'
import { saveAnswerRecord } from '../lib/auth'
import { getStep2GTOFromDB, getValidScenarios, getRangeByKey, getActionByKey, getTopActionsByKey } from '../lib/gtoData'

// ── 常數 ──────────────────────────────────────────────────────────────────────

type GameTypeKey = 'tourn_9max'

const POSITIONS: Record<GameTypeKey, string[]> = {
  tourn_9max: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
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

// 只有 BTN 和 SB 會 All-in 開池，其他位置不會
function canOpenAllin(position: string, stackBB: number): boolean {
  if (stackBB > 25) return false
  return ['BTN', 'SB', 'CO'].includes(position)
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

function getRaiseAmount(stackBB: number, action: 'raise' | 'limp' | 'allin' | null): number {
  if (action === 'allin') return round1(stackBB)
  if (action === 'limp')  return 1
  if (stackBB >= 58) return 2.5
  if (stackBB >= 33) return 2.1
  return 2
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function buildScenario(
  positions: string[],
  heroPos: string,
  stackBB: number,
  raiserPos: string | null,
  raiserAction: 'raise' | 'limp' | 'allin' | null,
): {
  seatInfo: Record<string, SeatDisplayInfo>
  actionHistory: HandSetup['actionHistory']
  scenarioText: string
} {
  const raiseAmt = raiserPos ? getRaiseAmount(stackBB, raiserAction) : 0
  const seatInfo: Record<string, SeatDisplayInfo> = {}
  const actionHistory: HandSetup['actionHistory'] = []

  for (const pos of positions) {
    // ── 計算每個座位的狀態 ──
    if (pos === heroPos) {
      const heroBet = pos === 'BB' ? 1 : pos === 'SB' ? 0.5 : 0
      seatInfo[pos] = { status: 'hero', bet: heroBet, stack: stackBB - heroBet }
      actionHistory.push({ position: pos, stack: stackBB - heroBet, action: 'hero' })
      continue
    }

    if (pos === raiserPos) {
      const status = raiserAction === 'limp' ? 'posted' : 'raised'
      seatInfo[pos] = { status, bet: raiseAmt, stack: stackBB - raiseAmt }
      actionHistory.push({
        position: pos,
        stack: stackBB - raiseAmt,
        action: raiserAction === 'limp' ? 'limp' : raiserAction === 'allin' ? 'allin' : 'raise',
        amount: raiseAmt,
      })
      continue
    }

    if (pos === 'SB') {
      // SB 永遠預先投入 0.5BB
      seatInfo[pos] = { status: 'posted', bet: 0.5, stack: stackBB - 0.5 }
      actionHistory.push({ position: pos, stack: stackBB - 0.5, action: 'posted' as any, amount: 0.5 })
      continue
    }

    if (pos === 'BB') {
      // BB 永遠預先投入 1BB
      seatInfo[pos] = { status: 'posted', bet: 1, stack: stackBB - 1 }
      actionHistory.push({ position: pos, stack: stackBB - 1, action: 'posted' as any, amount: 1 })
      continue
    }

    // 其他位置：Hero 之前的折牌，Hero 之後的等待
    const heroIdx   = positions.indexOf(heroPos)
    const posIdx    = positions.indexOf(pos)
    const raiserIdx = raiserPos ? positions.indexOf(raiserPos) : -1

    if (posIdx < heroIdx && posIdx !== raiserIdx) {
      seatInfo[pos] = { status: 'folded', bet: 0, stack: stackBB }
      actionHistory.push({ position: pos, stack: stackBB, action: 'fold' })
    } else {
      seatInfo[pos] = { status: 'waiting', bet: 0, stack: stackBB }
    }
  }

  // ── 情境文字 ──
  const scenarioText = raiserPos
    ? raiserAction === 'limp'  ? `${raiserPos} Limp，輪到你（${heroPos}）`
    : raiserAction === 'allin' ? `${raiserPos} All-in ${raiseAmt}BB，輪到你（${heroPos}）`
    : `${raiserPos} 加注 ${raiseAmt}BB，輪到你（${heroPos}）`
    : `沒有人加注，輪到你（${heroPos}）`

  return { seatInfo, actionHistory, scenarioText }
}

function buildSeatInfo(
  positions: string[],
  heroPos: string,
  stackBB: number,
  raiserPos?: string | null,
  raiserAction?: 'raise' | 'limp' | 'allin' | null,
  villainRespPos?: string | null,
  villainResp?: string | null,
): Record<string, SeatDisplayInfo> {
  const { seatInfo } = buildScenario(positions, heroPos, stackBB, raiserPos ?? null, raiserAction ?? null)
  if (villainRespPos) {
    const betAmt = villainResp === '3bet' ? 7.5 : villainResp === '4bet' ? 17 : stackBB
    seatInfo[villainRespPos] = { status: 'raised', bet: betAmt, stack: stackBB - betAmt }
  }
  return seatInfo
}

// ── 型別 ──────────────────────────────────────────────────────────────────────

interface TrainConfig {
  gameTypeKey: GameTypeKey
  stackDepth: number
  trainMode: 'single' | 'multi'
  roundSize: number
}

interface HandSetup {
  gameTypeKey: GameTypeKey
  tableSize: 9
  stackDepth: number
  heroPos: string
  hand: string
  raiserPos: string | null
  raiserAction: 'raise' | 'limp' | 'allin' | null
  initialScenario: 'RFI' | 'vs_raise'
  gtoRange: Record<string, string>
  dbKey: string
  actionHistory: { position: string; stack: number; action: 'fold' | 'raise' | 'call' | 'allin' | 'limp' | 'hero'; amount?: number }[]
}

interface StepResult {
  step: number
  heroAction: string
  gtoAction: string
  isCorrect: boolean
  gtoTopActions: { action: string; freq: number }[]
}

type Phase = 'question_step1' | 'villain_response' | 'question_step2' | 'feedback_step1' | 'feedback_step2' | 'hand_over' | 'round_complete'
type Screen = 'setup' | 'training'

// ── 主元件 ────────────────────────────────────────────────────────────────────

interface TrainTabProps {
  guestMode?: boolean
  userId?: string | null
  userName?: string
  isPaid?: boolean
  onStartRound?: () => Promise<boolean>
  onRoundComplete?: () => void
}

export default function TrainTab({ guestMode: _guestMode = false, userId = null, userName, isPaid = false, onStartRound, onRoundComplete }: TrainTabProps) {
  const [screen,    setScreen]    = useState<Screen>('setup')
  const [config,    setConfig]    = useState<TrainConfig | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const [handSetup,       setHandSetup]       = useState<HandSetup | null>(null)
  const [phase,           setPhase]           = useState<Phase>('question_step1')
  const [villainResp,     setVillainResp]     = useState<string>('')
  const [villainPos,      setVillainPos]      = useState<string>('')
  const [step2Actions,    setStep2Actions]    = useState<{ label: string; action: string }[]>([])
  const [stepResults,     setStepResults]     = useState<StepResult[]>([])
  const [currentActionHistory, setCurrentActionHistory] = useState<HandSetup['actionHistory']>([])
  const [potWinMsg,       setPotWinMsg]       = useState<string>('')
  const [currentSeatInfo, setCurrentSeatInfo] = useState<Record<string, SeatDisplayInfo>>({})
  const [scenarioText,    setScenarioText]    = useState<string>('')

  const [total,   setTotal]   = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak,  setStreak]  = useState(0)
  const [score,   setScore]   = useState(0)

  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  const [needAutoStart, setNeedAutoStart] = useState(false)

  const handleStart = (cfg: TrainConfig) => {
    setConfig(cfg)
    setScreen('training')
    setTotal(0); setCorrect(0); setStreak(0); setScore(0)
    // 直接開始第一手，不等用戶點按鈕
    setTimeout(() => {
      setNeedAutoStart(true)
    }, 50)
  }

  const handleBack = () => {
    if (handSetup && phase === 'question_step1') {
      setShowExitConfirm(true)
    } else if (!handSetup) {
      setScreen('setup')
    } else {
      setShowExitConfirm(true)
    }
  }

  const confirmExit = () => {
    if (autoNextTimer.current) clearTimeout(autoNextTimer.current)
    setShowExitConfirm(false)
    setScreen('setup')
    setHandSetup(null)
    setStepResults([])
  }

  const positions = config ? POSITIONS[config.gameTypeKey] : POSITIONS['tourn_9max']

  const ROUND_SIZE = config?.roundSize ?? 10

  const startHand = useCallback(async () => {
    if (!config) return
    if (autoNextTimer.current) clearTimeout(autoNextTimer.current)


    // 第一題才檢查每日限制
    if (onStartRound && total === 0) {
      const allowed = await onStartRound()
      if (!allowed) return
    }

    // 免費用戶隨機籌碼深度
    const effectiveStackDepth = isPaid
      ? config.stackDepth
      : [100, 75, 40, 25, 15][Math.floor(Math.random() * 5)]
    const scenarios = getValidScenarios(effectiveStackDepth)
    const scenario  = randomItem(scenarios)

    const heroPos      = scenario.heroPos
    const raiserPos    = scenario.raiserPos
    const raiserAction = scenario.raiserAction
    const initialScenario: 'RFI' | 'vs_raise' = raiserPos ? 'vs_raise' : 'RFI'
    const hand         = randomItem(ALL_HANDS)
    const gtoRange     = getRangeByKey(effectiveStackDepth, scenario.dbKey)
    console.log('[scenario]', scenario.dbKey, Object.keys(gtoRange).length)

    const { seatInfo, actionHistory, scenarioText } = buildScenario(
      positions, heroPos, effectiveStackDepth, raiserPos, raiserAction
    )

    setHandSetup({
      gameTypeKey: config.gameTypeKey,
      tableSize: 9,
      stackDepth: effectiveStackDepth,
      heroPos, hand, raiserPos, raiserAction,
      initialScenario, gtoRange,
      actionHistory, dbKey: scenario.dbKey,
    })
    setCurrentSeatInfo(seatInfo)
    setCurrentActionHistory(actionHistory)
    setScenarioText(scenarioText)
    setPhase('question_step1')
    setVillainResp(''); setVillainPos('')
    setStep2Actions([]); setStepResults([])
    setPotWinMsg('')
  }, [config, positions])

  useEffect(() => {
    if (needAutoStart && config) {
      setNeedAutoStart(false)
      startHand()
    }
  }, [needAutoStart, config, startHand])

  const getStep1Actions = (setup: HandSetup) => {
    if (setup.initialScenario === 'RFI') {
      if (setup.heroPos === 'SB') {
        // SB 有三個選項：Fold / Limp / Raise
        return [
          { label: 'Fold',  action: 'f' },
          { label: 'Call',  action: 'c' },
          { label: 'Raise', action: 'r' },
        ]
      }
      const a = [{ label: 'Fold', action: 'f' }, { label: 'Raise', action: 'r' }]
      if (canOpenAllin(setup.heroPos, setup.stackDepth)) a.push({ label: 'All-in', action: 'allin' })
      return a
    } else {
      // BB 面對 SB limp：Check 或 Raise
      if (setup.heroPos === 'BB' && setup.raiserAction === 'limp') {
        return [
          { label: 'Check', action: 'c' },
          { label: 'Raise', action: 'r' },
        ]
      }
      const a = [{ label: 'Fold', action: 'f' }, { label: 'Call', action: 'c' }, { label: '3-Bet', action: '3b' }]
      if (setup.stackDepth <= 40) a.push({ label: 'All-in', action: 'allin' })
      return a
    }
  }

  const handleStep1 = (action: string) => {
    if (!handSetup || !config) return
    const gtoAnswer  = getActionByKey(handSetup.stackDepth, handSetup.dbKey, handSetup.hand)
    const topActions = getTopActionsByKey(handSetup.stackDepth, handSetup.dbKey, handSetup.hand)
    const isOk = action === gtoAnswer
    const result: StepResult = { step: 1, heroAction: action, gtoAction: gtoAnswer, isCorrect: isOk, gtoTopActions: topActions }
    setStepResults([result])

    // 存答題記錄（付費用戶）
    if (userId && isPaid && handSetup) {
      saveAnswerRecord({
        userId,
        dbKey:        handSetup.dbKey,
        hand:         handSetup.hand,
        chosenAction: action,
        gtoAction:    gtoAnswer,
        isCorrect:    isOk,
        stackBb:      handSetup.stackDepth,
        heroPos:      handSetup.heroPos,
        scenarioType: handSetup.raiserPos ? 'vs_raise' : 'RFI',
      }).catch(console.error)
    }

    const raiseAmtHero = getRaiseAmount(handSetup.stackDepth, 'raise')
    const heroAmount =
      action === 'r'     ? round1(raiseAmtHero) :
      action === '3b'    ? round1(raiseAmtHero * 3) :
      action === 'allin' ? round1(handSetup.stackDepth) :
      action === 'c'     ? (
        handSetup.raiserAction === 'limp' ? 0 :  // BB vs SB limp：Check = 0BB
        handSetup.raiserPos ? raiseAmtHero : 1   // 面對加注跟注 / SB limp
      ) :
      undefined

    // 更新行動歷史：Hero 行動
    setCurrentActionHistory(prev => prev.map(item =>
      item.action === 'hero'
        ? { ...item, action: action as any, amount: heroAmount }
        : item
    ))

    // 更新座位資訊：Hero 投入籌碼
    if (heroAmount) {
      setCurrentSeatInfo(prev => ({
        ...prev,
        [handSetup.heroPos]: {
          ...prev[handSetup.heroPos],
          bet: heroAmount,
          stack: handSetup.stackDepth - heroAmount,
        }
      }))
    }

    if (!isOk) {
      const newTotal = total + 1
      setTotal(newTotal)
      setStreak(0)
      setScore(s => Math.round((s - 1) * 10) / 10)
      if (newTotal >= ROUND_SIZE) {
        setPhase('round_complete')
        return
      }
      setPhase('feedback_step1')
      return
    }

    const hasMultiStep = config.trainMode === 'multi'
    if ((action === 'r' || action === '3b') && hasMultiStep) {
      setPhase('villain_response')
      const raiseAmt = getRaiseAmount(handSetup.stackDepth, 'raise')
      // 先顯示 Hero 行動
      const heroActionText = action === 'r'
        ? `你加注 ${raiseAmt}BB，等待對手反應...`
        : `你 3-Bet ${raiseAmt * 3}BB，等待對手反應...`
      setScenarioText(heroActionText)
      setTimeout(() => {
        const resp = getVillainResponse(action, handSetup.stackDepth)
        const heroIdx    = positions.indexOf(handSetup.heroPos)
        const afterHero  = positions.slice(heroIdx + 1).filter(p => p !== 'SB' && p !== 'BB')
        const vPos = handSetup.heroPos === 'SB' ? 'BB'
          : handSetup.raiserPos ?? (afterHero.length > 0 ? randomItem(afterHero) : 'BB')
        setVillainResp(resp); setVillainPos(vPos)

        const raiseAmt = getRaiseAmount(handSetup.stackDepth, 'raise')
        const threeBetAmt = raiseAmt * 3
        if (resp === 'fold' || resp === 'call') {
          const pot = action === 'r' ? raiseAmt + 1.5 : threeBetAmt + raiseAmt
          setPotWinMsg(resp === 'fold' ? `所有人棄牌，收取底池 +${pot.toFixed(1)}BB` : `${vPos} 跟注`)
          if (resp === 'fold') setScenarioText(`所有人棄牌，收取底池 +${pot.toFixed(1)}BB`)
          // 更新行動歷史：顯示對手最終行動
          const villainAmount = resp === 'call'
            ? (action === 'r' ? raiseAmt : threeBetAmt)
            : undefined
          setCurrentActionHistory(prev => prev.map(item =>
            item.position === vPos
              ? { ...item, action: resp === 'fold' ? 'fold' : 'call', amount: villainAmount }
              : item
          ))
          setCorrect(c => c + 1); setStreak(s => s + 1)
          setScore(s => Math.round((s + 1) * 10) / 10)
          setPhase('feedback_step1')
        } else {
          const betAmt = resp === '3bet' ? 7.5 : resp === '4bet' ? 17 : handSetup.stackDepth
          const newSeatInfo = buildSeatInfo(positions, handSetup.heroPos, handSetup.stackDepth, handSetup.raiserPos, handSetup.raiserAction, vPos, resp)
          const newText = resp === '3bet' ? `${vPos} 3-Bet ${betAmt}BB，輪到你（${handSetup.heroPos}）`
            : resp === '4bet' ? `${vPos} 4-Bet ${betAmt}BB，輪到你（${handSetup.heroPos}）`
            : `${vPos} All-in ${betAmt}BB，輪到你（${handSetup.heroPos}）`
          setCurrentSeatInfo(newSeatInfo); setScenarioText(newText)
          setStep2Actions(getStep2Actions(resp, handSetup.stackDepth))

          // 更新行動歷史：villain 的新行動
          const villainBetAmt =
            resp === '3bet'  ? round1(raiseAmt * 3) :
            resp === '4bet'  ? 17 :
            resp === 'allin' ? handSetup.stackDepth : 0

          setCurrentActionHistory(prev => prev.map(item =>
            item.position === vPos
              ? { ...item, action: resp === '3bet' ? 'raise' : resp === '4bet' ? 'raise' : 'allin' as any, amount: villainBetAmt }
              : item
          ))

          setPhase('question_step2')
        }
      }, 900)
      return
    }

    const newTotal = total + 1
    setTotal(newTotal)
    setCorrect(c => c + 1)
    setStreak(s => s + 1)
    setScore(s => Math.round((s + 1) * 10) / 10)
    if (newTotal >= ROUND_SIZE) {
      setPhase('round_complete')
      return
    }
    setPhase('feedback_step1')
  }

  const handleStep2 = (action: string) => {
    if (!handSetup || !config) return
    const gtoAnswer = getStep2GTOFromDB(config.gameTypeKey, handSetup.stackDepth, handSetup.heroPos, villainPos, villainResp, handSetup.hand)
    const isOk = action === gtoAnswer
    setStepResults(prev => [...prev, { step: 2, heroAction: action, gtoAction: gtoAnswer, isCorrect: isOk, gtoTopActions: [{ action: gtoAnswer, freq: 100 }] }])
    // 更新行動歷史：Hero Step 2 行動
    const step2Amount =
      action === 'allin' ? handSetup.stackDepth :
      action === 'c'     ? round1(getRaiseAmount(handSetup.stackDepth, 'raise') * 3) :
      undefined
    setCurrentActionHistory(prev => prev.map(item =>
      item.position === handSetup.heroPos
        ? { ...item, action: action as any, amount: step2Amount }
        : item
    ))
    // Step 2 不另外計題數，和 Step 1 同一手
    if (isOk) {
      setCorrect(c => c + 1)
      setStreak(s => s + 1)
      setScore(s => Math.round((s + 1) * 10) / 10)
    } else {
      setStreak(0)
      setScore(s => Math.round((s - 1) * 10) / 10)
    }
    setPhase('feedback_step2')
  }

  const step1Result = stepResults.find(r => r.step === 1)
  const step2Result = stepResults.find(r => r.step === 2)

  // ── 設定畫面 ──
  if (screen === 'setup') {
    return <TrainSetupScreen isPaid={isPaid} onStart={handleStart} />
  }

  // ── 完成一關 ──
  if (phase === 'round_complete') {
    return (
      <RoundResultScreen
        total={total}
        correct={correct}
        streak={streak}
        score={score}
        userId={userId}
        userName={userName}
        stackBb={config?.stackDepth}
        onNext={() => {
          // 回到設定頁面
          setScreen('setup')
          setPhase('question_step1')
          setTotal(0)
          setCorrect(0)
          setStreak(0)
          setScore(0)
          setHandSetup(null)
          if (onRoundComplete) onRoundComplete()
        }}
      />
    )
  }

  // ── 練習畫面 ──
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', background: '#0a0a0a' }}>

      {/* 退出確認彈窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: '#111', border: '1px solid #222' }}>
            <div className="text-white font-bold text-base mb-2">中斷練習？</div>
            <div className="text-gray-400 text-sm mb-5">目前測驗進行中，是否要中斷？</div>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-sm font-medium"
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
                繼續練習
              </button>
              <button onClick={confirmExit}
                className="flex-1 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: '#7c3aed' }}>
                中斷
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 頂部列 */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={handleBack}
          className="text-gray-500 hover:text-gray-300 text-sm px-2 py-1 rounded"
          style={{ background: '#1a1a1a' }}>
          ←
        </button>
        <SessionStats accuracy={accuracy} streak={streak} total={total} stackBB={config?.stackDepth ?? 100} />
      </div>

      <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto w-full">
        {/* 題數進度 */}
        {handSetup && config && (
          <div className="flex items-center justify-between px-1">
            <span className="text-gray-500 text-xs whitespace-nowrap">
              第 {Math.min(total + 1, ROUND_SIZE)} 題 / 共 {ROUND_SIZE} 題
            </span>
            <div className="flex-1 mx-3 rounded-full h-1" style={{ background: '#1a1a1a' }}>
              <div className="h-1 rounded-full transition-all"
                   style={{
                     width: `${Math.min((total / ROUND_SIZE) * 100, 100)}%`,
                     background: '#7c3aed',
                   }} />
            </div>
            <span className="text-gray-600 text-xs whitespace-nowrap">{Math.min(total, ROUND_SIZE)}/{ROUND_SIZE}</span>
          </div>
        )}

        {!handSetup ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="text-gray-600 text-sm">點擊開始第一手</div>
            <button onClick={startHand}
              className="px-8 py-3 rounded-full font-bold text-base text-white"
              style={{ background: '#7c3aed' }}>
              開始練習
            </button>
          </div>
        ) : (
          <>
            {/* 行動歷史列 */}
            <ActionHistory actions={currentActionHistory} />

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
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(getStep1Actions(handSetup).length, 3)}, 1fr)` }}>
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
              <div className="text-center text-gray-500 text-sm py-4 animate-pulse">對手思考中...</div>
            )}

            {phase === 'question_step2' && (
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(step2Actions.length, 3)}, 1fr)` }}>
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
              <div className="text-center text-green-400 text-sm py-3 font-medium">{potWinMsg}</div>
            )}

            {potWinMsg && phase === 'feedback_step1' && (
              <div className="text-center text-green-400 text-sm py-1 font-medium">{potWinMsg}</div>
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
                gtoRange={handSetup.gtoRange}
                onNext={startHand}
              />
            )}

            {phase === 'feedback_step2' && step2Result && (
              <ActionFeedback
                isCorrect={step2Result.isCorrect}
                gtoAction={step2Result.gtoTopActions[0]?.action ?? step2Result.gtoAction}
                gtoFreq={step2Result.gtoTopActions[0]?.freq ?? 100}
                secondAction={step2Result.gtoTopActions[1]?.action ?? 'f'}
                secondFreq={step2Result.gtoTopActions[1]?.freq ?? 0}
                chosenAction={step2Result.heroAction}
                chosenFreq={step2Result.isCorrect ? 100 : 0}
                hand={handSetup.hand}
                gtoRange={handSetup.gtoRange}
                onNext={startHand}
              />
            )}

          </>
        )}
      </div>
    </div>
  )
}
