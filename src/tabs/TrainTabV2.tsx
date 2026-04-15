import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PokerFeltV2 from '../components/v2/PokerFeltV2'
import ActionHistoryBarTop, { type HistoryItem } from '../components/v2/ActionHistoryBarTop'
import BetSizingBarV2, { type BetAction, type SizingOption } from '../components/v2/BetSizingBarV2'
import FeedbackSheetV2, { type StreetScore, scoreByFreq } from '../components/v2/FeedbackSheetV2'

export interface SeatDisplayInfo {
  status: 'hero' | 'raised' | 'posted' | 'folded' | 'waiting' | 'active'
  bet: number
  stack?: number
}
import HoleCards from '../components/HoleCards'
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
  onNavigateToHU?: () => void
}

export default function TrainTabV2({ guestMode: _guestMode = false, userId = null, userName, isPaid = false, points = 0, isTabActive = true, onStartRound, onRoundComplete, onPointsChanged: _onPointsChanged, onNavigateToMissions, onNavigateToHU }: TrainTabProps) {
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
  const [, setScenarioText]    = useState<string>('')
  const [sheetExpanded,   setSheetExpanded]   = useState(false)

  const [total,   setTotal]   = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak,  setStreak]  = useState(0)
  const [score,   setScore]   = useState(0)

  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // ── v2 derived state (must be before any early returns to satisfy Rules of Hooks) ──
  const historyItems: HistoryItem[] = useMemo(() => {
    if (!handSetup) return []
    return currentActionHistory
      .filter(a => (a.action as string) !== 'posted')
      .map(a => {
        const isHero = a.position === handSetup.heroPos
        let detail = ''
        let kind: HistoryItem['kind'] = 'neutral'
        const act = a.action as string
        if (act === 'hero') { detail = '?'; kind = 'hero' }
        else if (act === 'fold' || act === 'f') { detail = 'F'; kind = 'folded' }
        else if (act === 'call' || act === 'c') { detail = 'Call'; kind = isHero ? 'hero' : 'villain' }
        else if (act === 'raise' || act === 'r') { detail = `R ${a.amount ?? ''}`; kind = isHero ? 'hero' : 'villain' }
        else if (act === '3b') { detail = `3B ${a.amount ?? ''}`; kind = 'hero' }
        else if (act === '4b') { detail = '4B'; kind = 'hero' }
        else if (act === 'allin') { detail = 'All-in'; kind = isHero ? 'hero' : 'villain' }
        else if (act === 'limp') { detail = 'Limp'; kind = 'villain' }
        else { detail = act; kind = isHero ? 'hero' : 'neutral' }
        return { label: a.position, detail, kind }
      })
  }, [currentActionHistory, handSetup])

  const activeResult = phase === 'feedback_step1' ? step1Result : phase === 'feedback_step2' ? step2Result : null
  useEffect(() => {
    if (activeResult) setSheetExpanded(!activeResult.isCorrect)
  }, [activeResult?.step, activeResult?.isCorrect])

  const streetScores: StreetScore[] = useMemo(() => {
    const preflopState = (() => {
      if (!activeResult) return 'pending' as const
      const chosen = activeResult.gtoTopActions.find(a => a.action === activeResult.heroAction)
      const freq = chosen?.freq ?? (activeResult.isCorrect ? 100 : 0)
      return scoreByFreq(freq)
    })()
    return [
      { street: 'preflop', state: preflopState },
      { street: 'flop', state: 'pending' },
      { street: 'turn', state: 'pending' },
      { street: 'river', state: 'pending' },
    ]
  }, [activeResult])

  // ── 設定畫面 ──
  if (screen === 'setup') {
    return <TrainSetupScreen points={points} isPaid={isPaid} onNavigateToMissions={onNavigateToMissions} onNavigateToHU={onNavigateToHU} onStart={handleStart} />
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

  // ── 練習畫面（fullscreen overlay：蓋住 App 的 sub-tab + BottomNav）──
  return (
    <div className="flex flex-col"
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#0a0a0a', overflow: 'hidden',
      }}>

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
          {/* 頂部 action history bar，back 按鈕在左 + 右側顯示 stats */}
          <ActionHistoryBarTop
            items={historyItems}
            onBack={handleBack}
            stats={{
              accuracy: total > 0 ? Math.round((correct / total) * 100) : undefined,
              streak,
              progress: `${Math.min(total + 1, ROUND_SIZE)}/${ROUND_SIZE}`,
            }}
          />

          {/* Felt 佔剩餘空間 */}
          <div className="flex-1 relative min-h-0">
            <PokerFeltV2
              tableSize={handSetup.tableSize}
              heroPosition={handSetup.heroPos}
              seatInfo={currentSeatInfo as any}
              potTotal={Object.values(currentSeatInfo).reduce((sum, s: any) => sum + (s?.bet ?? 0), 0)}
            />
          </div>

          {/* Hero 手牌：略低於 BTN 座位（無下方文字），不影響 action bar 位置 */}
          <div className="flex justify-center relative z-[5]" style={{ marginTop: -8, marginBottom: 4 }}>
            <HoleCards hand={handSetup.hand} />
          </div>

          {/* villain_response / hand_over 的狀態文字 */}
          {phase === 'villain_response' && (
            <div className="text-center text-gray-500 text-sm py-3 animate-pulse">對手思考中...</div>
          )}
          {phase === 'hand_over' && potWinMsg && (
            <div className="text-center text-green-400 text-sm py-2 font-medium">{potWinMsg}</div>
          )}

          {/* Action bar（決策期） */}
          {phase === 'question_step1' && (
            <ActionBarFromList
              actions={getStep1Actions(handSetup)}
              raiserAction={handSetup.raiserAction}
              stackBB={handSetup.stackDepth}
              raiserBet={
                handSetup.raiserAction === 'limp' ? 1 :
                handSetup.raiserPos ? getRaiseAmount(handSetup.stackDepth, handSetup.raiserAction) :
                1
              }
              isPreflopRFI={!handSetup.raiserPos}
              onChoose={handleStep1}
            />
          )}
          {phase === 'question_step2' && (
            <ActionBarFromList
              actions={step2Actions}
              raiserAction={null}
              stackBB={handSetup.stackDepth}
              raiserBet={villainResp === '3bet' ? 7.5 : villainResp === '4bet' ? 17 : handSetup.stackDepth}
              isPreflopRFI={false}
              onChoose={handleStep2}
            />
          )}

          {/* 回饋 sheet（feedback phase） */}
          {activeResult && handSetup && (
            <FeedbackSheetV2
              isCorrect={activeResult.isCorrect}
              tip={`${handSetup.hand} · ${handSetup.heroPos}${handSetup.raiserPos ? ` vs ${handSetup.raiserPos}` : ''}`}
              actions={activeResult.gtoTopActions.slice(0, 3).map(a => ({
                label: actionToLabel(a.action),
                freq: a.freq,
                color: actionToColor(a.action),
                isYours: a.action === activeResult.heroAction,
                evText: '',
              })).concat(
                activeResult.gtoTopActions.some(a => a.action === activeResult.heroAction)
                  ? []
                  : [{ label: actionToLabel(activeResult.heroAction), freq: 0, color: actionToColor(activeResult.heroAction), isYours: true, evText: '' }]
              )}
              streets={streetScores}
              explanation={showExplanation ? buildExplanation(activeResult, handSetup) : undefined}
              explanationTitle="說明"
              expanded={sheetExpanded}
              onToggleExpand={() => setSheetExpanded(v => !v)}
              onViewRange={() => {/* TODO: open range overlay */}}
              onNext={startHand}
              onAskAI={undefined}
            />
          )}
        </>
      )}
    </div>
  )
}

// ── v2 附屬元件 / 輔助 ──
function ActionBarFromList({ actions, raiserAction, stackBB, raiserBet, isPreflopRFI, onChoose }: {
  actions: { label: string; action: string }[]
  raiserAction: 'raise' | 'limp' | 'allin' | null
  stackBB: number
  raiserBet: number
  isPreflopRFI: boolean
  onChoose: (action: string) => void
}) {
  const fold = actions.find(a => a.action === 'f')
  const call = actions.find(a => a.action === 'c')
  const isCheck = !!call && raiserAction === 'limp'
  const raise = actions.find(a => a.action === 'r')
  const threeB = actions.find(a => a.action === '3b')
  const fourB = actions.find(a => a.action === '4b')
  const allin = actions.find(a => a.action === 'allin')

  // Callers pre-compute raiserBet = current bet to call; 0 if hero = RFI first-to-act
  const heroRaiseOpen = getRaiseAmount(stackBB, 'raise')   // ~2 / 2.1 / 2.5 BB
  const threeBAmount = Math.round(raiserBet * 3 * 10) / 10
  const fourBAmount = Math.round(raiserBet * 2.25 * 10) / 10

  const sizingOptions: SizingOption[] = []
  if (raise) {
    const amt = isPreflopRFI ? heroRaiseOpen : raiserBet * 3
    sizingOptions.push({ label: raise.label, amount: Math.round(amt * 10) / 10, kind: 'raise' })
  }
  if (threeB) sizingOptions.push({ label: threeB.label, amount: threeBAmount, kind: 'raise' })
  if (fourB)  sizingOptions.push({ label: fourB.label, amount: fourBAmount, kind: 'raise' })

  return (
    <BetSizingBarV2
      canFold={!!fold}
      canCheck={isCheck}
      canCall={!!call && !isCheck}
      callAmount={raiserBet}
      sizingOptions={sizingOptions}
      canAllIn={!!allin}
      allInAmount={stackBB}
      onAction={(a: BetAction) => {
        if (a.kind === 'fold') onChoose('f')
        else if (a.kind === 'check' || a.kind === 'call') onChoose('c')
        else if (a.kind === 'allin') onChoose('allin')
        else if (a.kind === 'raise' || a.kind === 'bet') {
          const label = (a as any).label as string
          const match = [raise, threeB, fourB].find(o => o?.label === label)
          if (match) onChoose(match.action)
        }
      }}
    />
  )
}

function actionToLabel(act: string): string {
  if (act === 'f') return 'Fold'
  if (act === 'c') return 'Call'
  if (act === 'r') return 'Raise'
  if (act === '3b') return '3-Bet'
  if (act === '4b') return '4-Bet'
  if (act === 'allin') return 'All-in'
  return act
}
function actionToColor(act: string): string {
  if (act === 'f') return '#2563eb'
  if (act === 'c') return '#10b981'
  if (act === 'r' || act === '3b' || act === '4b') return '#ef4444'
  if (act === 'allin') return '#7f1d1d'
  return '#8a92a0'
}
function buildExplanation(result: StepResult, handSetup: HandSetup): string {
  const best = result.gtoTopActions[0]
  const chose = actionToLabel(result.heroAction)
  const shouldBe = actionToLabel(best?.action ?? 'f')
  if (result.isCorrect) {
    return `${handSetup.hand} 在 ${handSetup.heroPos}${handSetup.raiserPos ? ` 面對 ${handSetup.raiserPos} 加注` : ''} 的 GTO 主線就是 ${shouldBe}。你選了 ${chose}，方向正確。`
  }
  return `${handSetup.hand} 在 ${handSetup.heroPos}${handSetup.raiserPos ? ` 面對 ${handSetup.raiserPos} 加注` : ''} 的 GTO 建議是 ${shouldBe}（${best?.freq ?? 0}%）。你選了 ${chose}，EV 較差。建議回頭看 GTO 範圍矩陣釐清此區間。`
}
