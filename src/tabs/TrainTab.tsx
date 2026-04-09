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

import { getStep2GTOFromDB, getValidScenarios, getRangeByKey, getActionByKey, getTopActionsByKey, isActionValid, preloadDB } from '../lib/gtoData'

// ── 常數 ──────────────────────────────────────────────────────────────────────

type GameTypeKey = 'tourn_9max' | 'cash_6max' | 'cash_4max' | 'cash_hu'
type ConfigGameTypeKey = GameTypeKey | 'random'
const GAME_TYPE_KEYS: GameTypeKey[] = ['tourn_9max', 'cash_6max', 'cash_4max', 'cash_hu']

const POSITIONS: Record<GameTypeKey, string[]> = {
  tourn_9max: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  cash_6max:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  cash_4max:  ['UTG', 'BTN', 'SB', 'BB'],
  cash_hu:    ['SB', 'BB'],
}

type TableSize = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
const TABLE_SIZE: Record<GameTypeKey, TableSize> = {
  tourn_9max: 9,
  cash_6max:  6,
  cash_4max:  4,
  cash_hu:    2,
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

    // 更新 hero 的 bet — 在 step2 時 hero 已經 raise/3bet 過了
    if (!raiserPos) {
      // Hero 是 RFI（開池加注），hero bet = 2.5BB
      const heroBet = 2.5
      seatInfo[heroPos] = { status: 'hero', bet: heroBet, stack: stackBB - heroBet }
    } else {
      // Hero 是 vs raise，hero 之前 3-bet 過
      const heroBet = getRaiseAmount(stackBB, raiserAction ?? null) * 3
      seatInfo[heroPos] = { status: 'hero', bet: heroBet, stack: stackBB - heroBet }
    }
  }
  return seatInfo
}

// ── 型別 ──────────────────────────────────────────────────────────────────────

interface TrainConfig {
  gameTypeKey: ConfigGameTypeKey
  stackDepth: number | 'random'
  trainMode: 'single' | 'multi'
  roundSize: number
  showExplanation: boolean
}

interface HandSetup {
  gameTypeKey: GameTypeKey
  tableSize: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
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
  points?: number
  isTabActive?: boolean
  onStartRound?: () => Promise<boolean>
  onRoundComplete?: () => void
  onPointsChanged?: () => void
  onNavigateToMissions?: () => void
}

export default function TrainTab({ guestMode: _guestMode = false, userId = null, userName, isPaid = false, points = 0, isTabActive = true, onStartRound, onRoundComplete, onPointsChanged: _onPointsChanged, onNavigateToMissions }: TrainTabProps) {
  const [screen,    setScreen]    = useState<Screen>('setup')
  const [config,    setConfig]    = useState<TrainConfig | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showExplanation, setShowExplanation] = useState(true)

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

  useEffect(() => {
    setScreen('setup')
    setConfig(null)
    setHandSetup(null)
    setPhase('question_step1')
    setTotal(0); setCorrect(0); setStreak(0); setScore(0)
    setInterruptedTotal(0)
    setStepResults([])
    setNeedAutoStart(false)
  }, [userId])

  // 免費玩家中斷後保留已答題數，避免重複計算
  const [interruptedTotal, setInterruptedTotal] = useState(0)

  const handleStart = async (cfg: TrainConfig) => {
    if (onStartRound) {
      const allowed = await onStartRound()
      if (allowed === false) return
    }
    // Preload GTO database(s) for selected game type (dynamic import)
    if (cfg.gameTypeKey === 'random' || cfg.stackDepth === 'random') {
      // Random mode: preload all possible DBs in parallel
      const gameTypes = cfg.gameTypeKey === 'random' ? GAME_TYPE_KEYS : [cfg.gameTypeKey]
      const stacks = cfg.stackDepth === 'random' ? [100, 75, 40, 25, 15] : [typeof cfg.stackDepth === 'number' ? cfg.stackDepth : 100]
      await Promise.all(
        gameTypes.flatMap(gt => stacks.map(s => preloadDB(gt, s)))
      )
    } else {
      await preloadDB(cfg.gameTypeKey, cfg.stackDepth)
    }
    setConfig(cfg)
    setShowExplanation(cfg.showExplanation)
    setScreen('training')
    // 免費玩家從中斷的題數接續；付費玩家每次重新開始
    const resumeTotal = !isPaid ? interruptedTotal : 0
    setTotal(resumeTotal); setCorrect(0); setStreak(0); setScore(0)
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
    // 免費玩家中斷時保留已答題數
    if (!isPaid) setInterruptedTotal(total)
    setShowExitConfirm(false)
    setScreen('setup')
    setHandSetup(null)
    setStepResults([])
  }

  const ROUND_SIZE = config?.roundSize ?? 10

  const startHand = useCallback(async () => {
    if (!config) return
    if (autoNextTimer.current) clearTimeout(autoNextTimer.current)

    // 解析實際遊戲類型（全隨機時每手隨機選）
    const resolvedGameType: GameTypeKey = config.gameTypeKey === 'random'
      ? randomItem(GAME_TYPE_KEYS)
      : config.gameTypeKey

    const positions = POSITIONS[resolvedGameType]

    // 現金局固定 100BB；全隨機或指定隨機時隨機深度
    const isCash = resolvedGameType.startsWith('cash_')
    const effectiveStackDepth = isCash
      ? 100
      : config.stackDepth === 'random'
        ? [100, 75, 40, 25, 15][Math.floor(Math.random() * 5)]
        : config.stackDepth
    const scenarios = getValidScenarios(effectiveStackDepth, resolvedGameType)
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
      gameTypeKey: resolvedGameType,
      tableSize: TABLE_SIZE[resolvedGameType],
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
  }, [config, total, onStartRound])

  useEffect(() => {
    if (needAutoStart && config) {
      setNeedAutoStart(false)
      startHand()
    }
  }, [needAutoStart, config, startHand])

  // 離開 tab 時不做任何事，保留當前狀態，回來繼續
  const prevTabActive = useRef(true)
  useEffect(() => {
    prevTabActive.current = isTabActive
  }, [isTabActive])

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
    const isOk = isActionValid(handSetup.stackDepth, handSetup.dbKey, handSetup.hand, action)
    const result: StepResult = { step: 1, heroAction: action, gtoAction: gtoAnswer, isCorrect: isOk, gtoTopActions: topActions }
    setStepResults([result])

    // 存答題記錄（所有登入用戶，Step2 的手牌在 Step2 結束後存）
    const willGoStep2 = isOk && config.trainMode === 'multi' && (action === 'r' || action === '3b')
    if (userId && handSetup && !willGoStep2) {
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
        const handPositions = POSITIONS[handSetup.gameTypeKey]
        const heroIdx    = handPositions.indexOf(handSetup.heroPos)
        const afterHero  = handPositions.slice(heroIdx + 1).filter((p: string) => p !== 'SB' && p !== 'BB')
        const vPos = handSetup.heroPos === 'SB' ? 'BB'
          : handSetup.raiserPos ?? (afterHero.length > 0 ? randomItem(afterHero) : 'BB')
        setVillainResp(resp); setVillainPos(vPos)

        const raiseAmt = getRaiseAmount(handSetup.stackDepth, 'raise')
        const threeBetAmt = raiseAmt * 3
        if (resp === 'fold' || resp === 'call') {
          const pot = action === 'r' ? raiseAmt + 1.5 : threeBetAmt + raiseAmt
          setPotWinMsg(resp === 'fold' ? `所有人棄牌，收取底池 +${pot.toFixed(1)}BB` : `${vPos} 跟注`)
          if (resp === 'fold') setScenarioText(`所有人棄牌，收取底池 +${pot.toFixed(1)}BB`)
          const villainAmount = resp === 'call'
            ? (action === 'r' ? raiseAmt : threeBetAmt)
            : undefined
          setCurrentActionHistory(prev => prev.map(item =>
            item.position === vPos
              ? { ...item, action: resp === 'fold' ? 'fold' : 'call', amount: villainAmount }
              : item
          ))
          // villain fold/call：存答題記錄（這手牌不會進 Step2）
          if (userId && handSetup) {
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
          const newTotalFold = total + 1
          setTotal(newTotalFold)
          setCorrect(c => c + 1); setStreak(s => s + 1);           setScore(s => Math.round((s + 1) * 10) / 10)
          if (newTotalFold >= ROUND_SIZE) {
            setPhase('round_complete')
            return
          }
          setPhase('feedback_step1')
        } else {
          const betAmt = resp === '3bet' ? 7.5 : resp === '4bet' ? 17 : handSetup.stackDepth
          const newSeatInfo = buildSeatInfo(handPositions, handSetup.heroPos, handSetup.stackDepth, handSetup.raiserPos, handSetup.raiserAction, vPos, resp)
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
    setCorrect(c => c + 1);     setStreak(s => s + 1)
    setScore(s => Math.round((s + 1) * 10) / 10)
    if (newTotal >= ROUND_SIZE) {
      setPhase('round_complete')
      return
    }
    setPhase('feedback_step1')
  }

  const handleStep2 = (action: string) => {
    if (!handSetup || !config) return
    const gtoAnswer = getStep2GTOFromDB(handSetup.gameTypeKey, handSetup.stackDepth, handSetup.heroPos, villainPos, villainResp, handSetup.hand)
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
    // Step 2 計題數，存答題記錄
    if (userId && handSetup) {
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
    const newTotalStep2 = total + 1
    setTotal(newTotalStep2)
    if (isOk) {
      setCorrect(c => c + 1);       setStreak(s => s + 1)
      setScore(s => Math.round((s + 1) * 10) / 10)
    } else {
      setStreak(0)
      setScore(s => Math.round((s - 1) * 10) / 10)
    }
    if (newTotalStep2 >= ROUND_SIZE) {
      setPhase('round_complete')
      return
    }
    setPhase('feedback_step2')
  }

  const step1Result = stepResults.find(r => r.step === 1)
  const step2Result = stepResults.find(r => r.step === 2)

  // ── 設定畫面 ──
  if (screen === 'setup') {
    return <TrainSetupScreen points={points} isPaid={isPaid} onNavigateToMissions={onNavigateToMissions} onStart={handleStart} />
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
        stackBb={typeof config?.stackDepth === 'number' ? config.stackDepth : undefined}
        onNext={async () => {
          setTotal(0)
          setCorrect(0)
          setStreak(0)
          setScore(0)
          setInterruptedTotal(0)
          setHandSetup(null)
          if (onRoundComplete) await onRoundComplete()
          // onRoundComplete 可能設 showLimit，等它執行完再回設定頁
          setScreen('setup')
          setPhase('question_step1')
        }}
      />
    )
  }

  // ── 練習畫面 ──
  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#0a0a0a', overflow: 'hidden' }}>

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
        <SessionStats accuracy={accuracy} streak={streak} total={total} stackBB={typeof config?.stackDepth === 'number' ? config.stackDepth : 100} />
        {handSetup && config && (
          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showExplanation}
                onChange={e => setShowExplanation(e.target.checked)}
                className="w-3 h-3 rounded accent-purple-600"
              />
              <span className="text-[10px] text-gray-600 whitespace-nowrap">說明</span>
            </label>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {Math.min(total + 1, ROUND_SIZE)}/{ROUND_SIZE}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto w-full overflow-y-auto flex-1 pb-6">


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

            <div className="flex items-start gap-2">
              <div className="flex-1 flex justify-center">
                {(phase === 'feedback_step1' || phase === 'feedback_step2') ? (
                  <button
                    onClick={() => document.getElementById('range-btn')?.click()}
                    className="w-full rounded-xl text-xs transition"
                    style={{ background: '#111', border: '1px solid #2a2a2a', color: '#666', height: 76 }}
                  >
                    查看範圍
                  </button>
                ) : <div className="flex-1" />}
              </div>
              <div className="flex flex-col items-center gap-1">
                <HoleCards hand={handSetup.hand} />
                {(phase === 'feedback_step1' || phase === 'feedback_step2') ? (() => {
                  const result = phase === 'feedback_step1' ? stepResults.find(r => r.step === 1) : stepResults.find(r => r.step === 2)
                  return result ? (
                    <span className="text-sm font-bold" style={{ color: result.isCorrect ? '#10b981' : '#ef4444' }}>
                      {result.isCorrect ? '✓ 正確！' : '✗ 不對'}
                    </span>
                  ) : null
                })() : (
                  <span className="text-xs text-gray-400">
                    {handSetup.hand} {handSetup.hand.endsWith('s') ? '同花' : handSetup.hand.endsWith('o') ? '雜色' : '對子'}
                  </span>
                )}
              </div>
              <div className="flex-1 flex justify-center">
                {(phase === 'feedback_step1' || phase === 'feedback_step2') ? (
                  <button
                    onClick={() => document.getElementById('next-hand-btn')?.click()}
                    className="w-full rounded-xl text-xs font-bold text-white transition"
                    style={{ background: '#4c1d95', border: '1px solid #7c3aed', height: 76 }}
                  >
                    下一手 →
                  </button>
                ) : <div className="flex-1" />}
              </div>
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
                hideResult
                hideButtons
                isCorrect={step1Result.isCorrect}
                gtoAction={step1Result.gtoTopActions[0]?.action ?? step1Result.gtoAction}
                gtoFreq={step1Result.gtoTopActions[0]?.freq ?? 100}
                secondAction={step1Result.gtoTopActions[1]?.action ?? 'f'}
                secondFreq={step1Result.gtoTopActions[1]?.freq ?? 0}
                chosenAction={step1Result.heroAction}
                chosenFreq={step1Result.isCorrect ? 100 : 0}
                hand={handSetup.hand}
                gtoRange={handSetup.gtoRange}
                isLimp={handSetup.raiserAction === 'limp'}
                heroPos={handSetup.heroPos}
                raiserPos={handSetup.raiserPos}
                raiserAction={handSetup.raiserAction}
                stackBB={handSetup.stackDepth}
                showExplanation={showExplanation}
                onNext={startHand}
              />
            )}

            {phase === 'feedback_step2' && step2Result && (
              <ActionFeedback
                hideResult
                hideButtons
                isCorrect={step2Result.isCorrect}
                gtoAction={step2Result.gtoTopActions[0]?.action ?? step2Result.gtoAction}
                gtoFreq={step2Result.gtoTopActions[0]?.freq ?? 100}
                secondAction={step2Result.gtoTopActions[1]?.action ?? 'f'}
                secondFreq={step2Result.gtoTopActions[1]?.freq ?? 0}
                chosenAction={step2Result.heroAction}
                chosenFreq={step2Result.isCorrect ? 100 : 0}
                hand={handSetup.hand}
                gtoRange={handSetup.gtoRange}
                isLimp={handSetup.raiserAction === 'limp'}
                heroPos={handSetup.heroPos}
                raiserPos={villainPos || handSetup.raiserPos}
                raiserAction={villainResp || handSetup.raiserAction}
                stackBB={handSetup.stackDepth}
                showExplanation={showExplanation}
                onNext={startHand}
              />
            )}

          </>
        )}
      </div>
    </div>
  )
}
