import React, { useState, useCallback, useEffect, useRef } from 'react'
import type { Scenario, Action, TrainSession, Position, Profile, RangeMap, HandData } from '../types'
import {
  allHands, pickRandomHand, resolveAction, DEMO_SCENARIOS,
  generateSeatStacks, getRangeForStack, STACK_SIZES,
  generatePreflopContext, cellToHand, type SeatDisplayInfo,
} from '../lib/gtoData'
import { buildRangeMap } from '../lib/gto/getGTOAction'
import { isDemoMode, supabase } from '../lib/supabase'
import PokerFelt from '../components/PokerFelt'
import HoleCards from '../components/HoleCards'
import SessionSummary from '../components/SessionSummary'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  scenario: Scenario | null
  onSelectScenario: () => void
  onSetScenario?: (scenario: Scenario) => void
  profile?: Profile | null
  activeCoachId?: string | null
  selectedStack?: number
  onBack?: () => void
}

type Phase =
  | 'question'        // Step 1 question
  | 'step1_result'    // Step 1 result (wrong or correct-fold)
  | 'villain_acting'  // Villain animation
  | 'hand_complete'   // Hand ended (villain fold/call)
  | 'step2_question'  // Step 2 question
  | 'step2_result'    // Step 2 result

const ACTION_CONFIG: Record<Action, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  raise: { label: 'Raise / 3-Bet', emoji: '🔺', color: '#9775fa', bg: 'rgba(151,117,250,0.18)', border: 'rgba(151,117,250,0.5)' },
  call:  { label: 'Call / Limp',   emoji: '📞', color: '#38d9a9', bg: 'rgba(56,217,169,0.12)',  border: 'rgba(56,217,169,0.5)' },
  fold:  { label: 'Fold',          emoji: '🗑️', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)',  border: 'rgba(255,107,107,0.5)' },
}

const RANKS_13 = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
const POS_ORDER: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']

// ─── Utility Functions ───────────────────────────────────────────────────────

function getFrequencies(range: RangeMap, hand: string): Record<Action, number> {
  const data = range[hand]
  if (!data) return { raise: 0, call: 0, fold: 100 }
  if (data.mixed) return { raise: data.mixed.raise, call: data.mixed.call, fold: data.mixed.fold }
  return {
    raise: data.action === 'raise' ? 100 : 0,
    call:  data.action === 'call'  ? 100 : 0,
    fold:  data.action === 'fold'  ? 100 : 0,
  }
}

function openSize(stack: number) { return stack <= 40 ? 2 : 2.5 }
const THREE_BET = 7
const FOUR_BET = 18

// ─── BUG 1 fix: frequency-based grading ─────────────────────────────────────

type Grade = 'best' | 'acceptable' | 'suboptimal' | 'wrong'

function evaluateAnswer(userAction: Action, range: RangeMap, hand: string): { grade: Grade; label: string; isPass: boolean; color: string } {
  const freqs = getFrequencies(range, hand)
  const freq = freqs[userAction]
  if (freq >= 60) return { grade: 'best', label: '✓ 最佳行動', isPass: true, color: '#10b981' }
  if (freq >= 20) return { grade: 'acceptable', label: '△ 可以接受', isPass: true, color: '#ffa94d' }
  if (freq > 0)   return { grade: 'suboptimal', label: '△ 非最佳決策', isPass: false, color: '#ffa94d' }
  return { grade: 'wrong', label: '✗ 答錯了', isPass: false, color: '#ef4444' }
}

// ─── BUG 2 fix: contextual action labels ────────────────────────────────────

function getContextualLabel(action: Action, scenKey: string, stack: number, heroPos: Position, vBet?: number): string {
  if (action === 'fold') return 'Fold'
  if (action === 'raise') {
    if (scenKey === 'vs_open') { const s = Math.round(2.5 * 3.5); return s > stack * 0.4 ? `All-In ${stack}bb` : `3-Bet ${s}bb` }
    if (scenKey === 'vs_3bet') return `4-Bet ${FOUR_BET}bb`
    if (scenKey === 'vs_4bet' || scenKey === 'vs_allin') return `All-In ${stack}bb`
    if (scenKey === 'limp_vs_raise') return `3-Bet ${(vBet ?? 3) * 3}bb`
    if (stack <= 20) return `All-In ${stack}bb`
    return `Raise ${openSize(stack)}bb`
  }
  // call
  if (heroPos === 'SB' && scenKey === 'open') return 'Limp'
  if (scenKey === 'vs_open') return 'Call 2.5bb'
  if (scenKey === 'vs_3bet') return `Call ${THREE_BET}bb`
  if (scenKey === 'vs_4bet') return `Call ${FOUR_BET}bb`
  if (scenKey === 'vs_allin') return `Call ${stack}bb`
  if (scenKey === 'limp_vs_raise') return `Call ${vBet ?? 3}bb`
  return 'Call'
}

// Bet sizing for felt display (used in handleStep1)
function computeRaiseBB(gtoScenario: string | undefined, stack: number): number {
  if (stack <= 20) return stack // all-in
  if (gtoScenario === 'vs_open') {
    const s = Math.round(2.5 * 3.5)
    return s > stack * 0.4 ? stack : s
  }
  return openSize(stack)
}

// ─── BUG 3 fix: scenario-based available actions ─────────────────────────────

function getScenarioActions(scenKey: string, heroPos: Position): Action[] {
  if (heroPos === 'SB' && scenKey === 'open') return ['raise', 'call', 'fold'] // raise + limp + fold
  if (scenKey === 'open') return ['raise', 'fold'] // RFI: no call
  if (scenKey === 'vs_allin') return ['call', 'fold'] // facing all-in: no raise
  return ['raise', 'call', 'fold']
}

interface BtnConfig {
  key: string; action: Action; label: string; emoji: string
  color: string; bg: string; border: string; fontWeight?: number
}

const S = { // style shortcuts
  raise: { color: ACTION_CONFIG.raise.color, bg: ACTION_CONFIG.raise.bg, border: ACTION_CONFIG.raise.border },
  call:  { color: ACTION_CONFIG.call.color,  bg: ACTION_CONFIG.call.bg,  border: ACTION_CONFIG.call.border },
  fold:  { color: ACTION_CONFIG.fold.color,  bg: ACTION_CONFIG.fold.bg,  border: ACTION_CONFIG.fold.border },
  allin: { color: '#ff4444', bg: 'rgba(180,30,30,0.15)', border: 'rgba(220,50,50,0.8)' },
}

function buildStep1Buttons(scenKey: string, stack: number, heroPos: Position): BtnConfig[] {
  const btns: BtnConfig[] = []
  const isSBOpen = heroPos === 'SB' && scenKey === 'open'

  if (stack <= 20 && !isSBOpen) {
    btns.push({ key: 'allin', action: 'raise', label: `All-In ${stack}bb`, emoji: '💥', ...S.allin, fontWeight: 800 })
  }

  if (scenKey === 'vs_open') {
    const s = Math.round(2.5 * 3.5)
    btns.push({ key: 'raise', action: 'raise', label: s > stack * 0.4 ? `All-In ${stack}bb` : `3-Bet ${s}bb`, emoji: '🔺', ...S.raise })
  } else {
    btns.push({ key: 'raise', action: 'raise', label: `Raise ${openSize(stack)}bb`, emoji: '🔺', ...S.raise })
  }

  if (isSBOpen) btns.push({ key: 'call', action: 'call', label: 'Limp', emoji: '📞', ...S.call })
  else if (scenKey === 'vs_open') btns.push({ key: 'call', action: 'call', label: 'Call 2.5bb', emoji: '📞', ...S.call })
  else btns.push({ key: 'call', action: 'call', label: 'Call', emoji: '📞', ...S.call })

  btns.push({ key: 'fold', action: 'fold', label: 'Fold', emoji: '🗑️', ...S.fold })
  return btns
}

function getVillainResponse(heroAction: string, stackBB: number): string {
  const r = Math.random()
  if (heroAction === 'raise') {
    if (stackBB <= 25) { return r < 0.50 ? 'allin' : r < 0.80 ? 'fold' : 'call' }
    return r < 0.30 ? '3bet' : r < 0.80 ? 'fold' : 'call'
  }
  if (heroAction === '3bet') { return r < 0.40 ? '4bet' : r < 0.80 ? 'fold' : 'call' }
  if (heroAction === 'limp') { return r < 0.50 ? 'bb_raise' : 'check' }
  return 'fold'
}

function pickVillain(heroPos: Position, gtoScenario: string, raiserPos?: string): Position {
  if (gtoScenario === 'vs_open' && raiserPos) return raiserPos as Position
  const idx = POS_ORDER.indexOf(heroPos)
  const after = POS_ORDER.filter((_, i) => i > idx)
  return after.length > 0 ? after[Math.floor(Math.random() * after.length)] : 'BB'
}

function buildStep2Range(scenario: string, stackBB: number): RangeMap {
  const range: RangeMap = {}
  let raiseSet: Set<string>, callSet: Set<string>

  if (scenario === 'vs_3bet') {
    raiseSet = stackBB <= 25
      ? new Set(['AA','KK','QQ','AKs','AKo'])
      : new Set(['AA','KK','AKs'])
    callSet = stackBB <= 25
      ? new Set(['JJ','TT','AQs'])
      : new Set(['QQ','JJ','TT','99','AQs','AQo','AJs','KQs','AKo'])
  } else if (scenario === 'vs_4bet') {
    raiseSet = new Set(['AA','KK'])
    callSet = new Set(['QQ','AKs','AKo'])
  } else if (scenario === 'vs_allin') {
    raiseSet = new Set()
    callSet = stackBB <= 20
      ? new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs'])
      : new Set(['AA','KK','QQ','AKs','AKo'])
  } else if (scenario === 'limp_vs_raise') {
    raiseSet = new Set(['AA','KK','QQ','JJ','TT','AKs','AQs','AJs','KQs'])
    callSet = new Set(['99','88','77','66','55','44','33','22','ATs','A9s','A8s','A7s','A6s','A5s',
      'KJs','KTs','QJs','QTs','JTs','J9s','T9s','T8s','98s','97s','87s','76s','65s','54s',
      'AKo','AQo','AJo','KQo'])
  } else { raiseSet = new Set(); callSet = new Set() }

  for (const h of allHands()) {
    if (raiseSet.has(h)) range[h] = { action: 'raise' }
    else if (callSet.has(h)) range[h] = { action: 'call' }
    else range[h] = { action: 'fold' }
  }
  return range
}

function rangeCellColor(data: HandData | undefined): string {
  if (!data || data.action === 'fold') return 'rgba(40,40,50,0.6)'
  if (data.mixed) return 'rgba(220,140,30,0.8)'
  if (data.action === 'raise') return 'rgba(220,50,50,0.8)'
  if (data.action === 'call') return 'rgba(50,180,100,0.8)'
  return 'rgba(40,40,50,0.6)'
}

function gridCellText(row: number, col: number): string {
  const r = RANKS_13[row], c = RANKS_13[col]
  if (row === col) return r + r
  if (row < col) return r + c + 's'
  return c + r + 'o'
}

// ─── Main Component ──────────────────────────────────────────────────────────

const TrainTab: React.FC<Props> = ({ scenario, onSelectScenario, onSetScenario, profile, activeCoachId, selectedStack: stackProp = 0, onBack }) => {
  // ── Core state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('question')
  const [currentHand, setCurrentHand] = useState('AKs')
  const [effectiveStack, setEffectiveStack] = useState(100)
  const [seatStacks, setSeatStacks] = useState<number[]>(() => generateSeatStacks(100))

  // Ranges
  const [step1Range, setStep1Range] = useState<RangeMap | null>(null)
  const [step2Range, setStep2Range] = useState<RangeMap | null>(null)

  // Step 1
  const [step1CorrectAction, setStep1CorrectAction] = useState<Action>('raise')
  const [step1UserAction, setStep1UserAction] = useState<Action | null>(null)
  const [step1Correct, setStep1Correct] = useState(false)
  const [step1Eval, setStep1Eval] = useState<{ grade: Grade; label: string; isPass: boolean; color: string } | null>(null)

  // Villain
  const [villainAction, setVillainAction] = useState<string | null>(null)
  const [villainPos, setVillainPos] = useState<Position>('BB')
  const [villainBet, setVillainBet] = useState(0)

  // Step 2
  const [step2CorrectAction, setStep2CorrectAction] = useState<Action>('fold')
  const [step2UserAction, setStep2UserAction] = useState<Action | null>(null)
  const [step2Eval, setStep2Eval] = useState<{ grade: Grade; label: string; isPass: boolean; color: string } | null>(null)

  // Felt display (mutable per-hand)
  const [feltSeatInfo, setFeltSeatInfo] = useState<Record<string, SeatDisplayInfo>>({})
  const [feltPot, setFeltPot] = useState(1.5)
  const [feltText, setFeltText] = useState('')
  const [flashSeat, setFlashSeat] = useState<string | null>(null)

  // Session
  const [sessions, setSessions] = useState<TrainSession[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [showRangeModal, setShowRangeModal] = useState(false)
  const [handScore, setHandScore] = useState(0)

  const [streak, setStreak] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem('gto_stats') || '{}').streak ?? 0 } catch { return 0 }
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const TOURN_STACKS = [15, 25, 40, 75, 100]

  // ── Deal new hand ─────────────────────────────────────────────────────────
  const nextHand = useCallback(() => {
    if (!scenario) return
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }

    let stack: number
    if (scenario.gameType === 'cash') stack = 100
    else if (scenario.gameType === 'tournament') {
      stack = stackProp === 0 ? TOURN_STACKS[Math.floor(Math.random() * TOURN_STACKS.length)] : stackProp
    } else {
      stack = stackProp === 0 ? STACK_SIZES[Math.floor(Math.random() * STACK_SIZES.length)] : stackProp
    }

    setEffectiveStack(stack)
    setSeatStacks(generateSeatStacks(stack))

    let range: RangeMap
    if (scenario.gameType && scenario.tableType && scenario.gtoScenario) {
      range = buildRangeMap(scenario.gameType, scenario.tableType, stack, scenario.position, scenario.gtoScenario)
    } else { range = getRangeForStack(scenario.position, stack) }

    setStep1Range(range)
    setStep2Range(null)

    const gtoScen = scenario.gtoScenario ?? (scenario.position === 'BB' ? 'vs_open' : 'open')
    const ctx = generatePreflopContext(scenario.position, gtoScen)
    setFeltSeatInfo({ ...ctx.seatInfo })
    setFeltPot(ctx.potTotal)
    setFeltText(ctx.scenarioDesc)

    const hand = pickRandomHand(range)
    const correct = resolveAction(range, hand)
    setCurrentHand(hand)
    setStep1CorrectAction(correct)
    setStep1UserAction(null)
    setStep1Correct(false)
    setStep1Eval(null)
    setStep2UserAction(null)
    setStep2Eval(null)
    setVillainAction(null)
    setFlashSeat(null)
    setHandScore(0)
    setPhase('question')
    setShowRangeModal(false)
  }, [scenario, stackProp])

  useEffect(() => { if (scenario) nextHand() }, [scenario, nextHand])

  // ── Step 1 action handler ─────────────────────────────────────────────────
  const handleStep1 = useCallback((action: Action) => {
    if (phase !== 'question' || !scenario || !step1Range) return
    setStep1UserAction(action)

    // BUG 1 fix: frequency-based evaluation
    const evalResult = evaluateAnswer(action, step1Range, currentHand)
    setStep1Eval(evalResult)
    setStep1Correct(evalResult.isPass)

    if (!evalResult.isPass) {
      // Wrong or suboptimal → show result, 0 points
      setHandScore(0)
      setPhase('step1_result')
      recordSession(action, step1CorrectAction, false, 0)
      return
    }

    if (action === 'fold') {
      // Correct fold → 1 point, hand over
      setHandScore(1)
      setPhase('step1_result')
      recordSession(action, step1CorrectAction, true, 1)
      return
    }

    // Correct raise or call → animate villain response
    const gtoScen = scenario.gtoScenario ?? (scenario.position === 'BB' ? 'vs_open' : 'open')

    // Update felt: hero bet
    const raiseBB = computeRaiseBB(gtoScen, effectiveStack)
    const newSeatInfo = { ...feltSeatInfo }
    newSeatInfo[scenario.position] = { status: 'raised' as const, bet: action === 'raise' ? raiseBB : (gtoScen === 'vs_open' ? 2.5 : 1) }
    setFeltSeatInfo(newSeatInfo)
    setFeltPot(prev => prev + (action === 'raise' ? raiseBB : (gtoScen === 'vs_open' ? 2.5 : 0.5)))

    // Determine villain action
    const heroActionKey = action === 'raise'
      ? (gtoScen === 'vs_open' ? '3bet' : 'raise')
      : (scenario.position === 'SB' ? 'limp' : 'call')
    const vPos = pickVillain(scenario.position, gtoScen, (feltSeatInfo as any).__raiserPos)
    const vResp = getVillainResponse(heroActionKey, effectiveStack)
    setVillainPos(vPos)

    if (vResp === 'fold' || vResp === 'call' || vResp === 'check') {
      startVillainAnim(vPos, vResp, 0, () => {
        setHandScore(1)
        setPhase('step1_result')
        recordSession(action, step1CorrectAction, true, 1)
      })
      return
    }

    // Villain 3bet / 4bet / allin → step 2
    let vBet: number
    let step2ScenKey: string
    if (vResp === '3bet') { vBet = THREE_BET; step2ScenKey = 'vs_3bet' }
    else if (vResp === '4bet') { vBet = FOUR_BET; step2ScenKey = 'vs_4bet' }
    else if (vResp === 'allin') { vBet = effectiveStack; step2ScenKey = 'vs_allin' }
    else if (vResp === 'bb_raise') { vBet = 3; step2ScenKey = 'limp_vs_raise' }
    else { vBet = 0; step2ScenKey = 'vs_3bet' }

    startVillainAnim(vPos, vResp, vBet, () => {
      // Set up step 2
      const s2Range = buildStep2Range(step2ScenKey, effectiveStack)
      setStep2Range(s2Range)
      const s2Correct = resolveAction(s2Range, currentHand)
      setStep2CorrectAction(s2Correct)
      setPhase('step2_question')
    })
  }, [phase, scenario, step1Range, step1CorrectAction, effectiveStack, feltSeatInfo, currentHand, nextHand])

  // ── Step 2 action handler ─────────────────────────────────────────────────
  const handleStep2 = useCallback((action: Action) => {
    if (phase !== 'step2_question' || !step2Range) return
    setStep2UserAction(action)
    const evalResult = evaluateAnswer(action, step2Range, currentHand)
    setStep2Eval(evalResult)
    const score = evalResult.isPass ? 1 : 0.5
    setHandScore(score)
    setPhase('step2_result')
    recordSession(action, step2CorrectAction, evalResult.isPass, score)
  }, [phase, step2Range, step2CorrectAction])

  // ── Villain animation sequence ────────────────────────────────────────────
  function startVillainAnim(vPos: string, vResp: string, vBet: number, onComplete: () => void) {
    setPhase('villain_acting')
    setFlashSeat(null)

    timerRef.current = setTimeout(() => {
      // Flash villain seat
      setFlashSeat(vPos)

      timerRef.current = setTimeout(() => {
        setFlashSeat(null)
        setVillainAction(vResp)
        setVillainBet(vBet)

        // Update felt
        const newInfo = { ...feltSeatInfo }
        if (vResp === 'fold' || vResp === 'check') {
          if (vResp === 'fold') newInfo[vPos] = { status: 'folded', bet: 0 }
        } else {
          newInfo[vPos] = { status: 'raised', bet: vBet }
          setFeltPot(prev => prev + vBet)
        }
        setFeltSeatInfo(newInfo)

        // Update scenario text
        const labels: Record<string, string> = {
          '3bet': `${vPos} 3-Bet ${vBet}bb`,
          '4bet': `${vPos} 4-Bet ${vBet}bb`,
          'allin': `${vPos} All-In ${vBet}bb`,
          'bb_raise': `BB 加注 ${vBet}bb`,
          'fold': `${vPos} Fold`,
          'call': `${vPos} Call`,
          'check': `BB Check`,
        }
        setFeltText(labels[vResp] ?? '')

        onComplete()
      }, 500)
    }, 800)
  }

  // ── Record session ────────────────────────────────────────────────────────
  const recordSession = useCallback((userAction: Action, correctAction: Action, isCorrect: boolean, score: number) => {
    if (!scenario) return
    const session: TrainSession = {
      scenarioId: scenario.id, hand: currentHand,
      userAction, correctAction, isCorrect,
      timestamp: Date.now(), score,
    }
    setSessions(prev => {
      const next = [...prev, session]
      if (next.length % 25 === 0) setShowSummary(true)
      return next
    })

    const newStreak = score >= 1 ? streak + 1 : 0
    setStreak(newStreak)

    try {
      const saved = JSON.parse(localStorage.getItem('gto_stats') || '{"total":0,"correct":0}')
      const cumTotal = (saved.total ?? 0) + 1
      const cumCorrect = (saved.correct ?? 0) + score
      localStorage.setItem('gto_stats', JSON.stringify({
        total: cumTotal, correct: cumCorrect,
        accuracy: Math.round((cumCorrect / cumTotal) * 100),
        streak: newStreak, lastCoach: scenario.coachSource,
      }))
    } catch {}

    if (!isDemoMode && supabase && profile?.id && !profile.id.startsWith('demo_')) {
      supabase.from('training_records').insert({
        user_id: profile.id, position: scenario.position,
        hand: currentHand, action_taken: userAction,
        correct_action: correctAction, is_correct: isCorrect,
        stack_bb: effectiveStack, coach_id: activeCoachId ?? null,
      }).then(() => {})
    }
  }, [scenario, currentHand, streak, effectiveStack, profile, activeCoachId])

  // ── Session helpers ───────────────────────────────────────────────────────
  const handlePracticePosition = useCallback((pos: Position) => {
    const target = DEMO_SCENARIOS.find(s => s.position === pos)
    if (!target) return
    setShowSummary(false)
    if (onSetScenario) onSetScenario(target)
    else onSelectScenario()
  }, [onSetScenario, onSelectScenario])

  const handleRepeat = useCallback(() => { setSessions([]); setShowSummary(false); nextHand() }, [nextHand])

  // ── Computed values ───────────────────────────────────────────────────────
  const total = sessions.length
  const totalScore = sessions.reduce((s, ss) => s + (ss.score ?? (ss.isCorrect ? 1 : 0)), 0)
  const accuracy = total > 0 ? Math.round((totalScore / total) * 100) : 0

  if (!scenario) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 32px', textAlign: 'center', gap: 20 }}>
        <div style={{ fontSize: 64 }}>🎯</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>選擇練習情境</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>前往「教練」頁面選擇 GTO 範圍，<br />開始你的翻前訓練</p>
        <button className="btn-primary" onClick={onSelectScenario} style={{ maxWidth: 240 }}>選擇情境 →</button>
      </div>
    )
  }

  const gtoScen = scenario.gtoScenario ?? (scenario.position === 'BB' ? 'vs_open' : 'open')
  const step1Buttons = buildStep1Buttons(gtoScen, effectiveStack, scenario.position)

  // Current scenario key (for contextual labels and action filtering)
  const currentScenKey = phase === 'step2_result'
    ? (villainAction === '3bet' ? 'vs_3bet' : villainAction === '4bet' ? 'vs_4bet' : villainAction === 'allin' ? 'vs_allin' : villainAction === 'bb_raise' ? 'limp_vs_raise' : 'open')
    : gtoScen

  // Active range for current step
  const activeRange = phase === 'step2_question' || phase === 'step2_result'
    ? (step2Range ?? step1Range!)
    : (step1Range ?? getRangeForStack(scenario.position, effectiveStack))

  // Current result state
  const isShowingResult = phase === 'step1_result' || phase === 'step2_result'
  const resultAction = phase === 'step2_result' ? step2UserAction : step1UserAction
  const resultCorrectAction = phase === 'step2_result' ? step2CorrectAction : step1CorrectAction

  const freqs = isShowingResult ? getFrequencies(activeRange, currentHand) : null

  // BUG 4 fix: EV columns only show scenario-valid actions, sorted by freq
  const evColumns: Array<{ action: Action; role: 'best' | 'yours' | 'third' }> = isShowingResult && resultAction && freqs
    ? (() => {
        const scenActions = getScenarioActions(currentScenKey, scenario.position)
        const sorted = scenActions
          .map(a => ({ action: a, freq: freqs[a] }))
          .sort((x, y) => y.freq - x.freq)
        const best = sorted[0]
        const third = sorted.find(s => s.action !== best.action && s.action !== resultAction)
        const cols: Array<{ action: Action; role: 'best' | 'yours' | 'third' }> = [
          { action: best.action, role: 'best' },
          { action: resultAction, role: 'yours' },
        ]
        if (third && third.freq > 0) {
          cols.push({ action: third.action, role: 'third' })
        }
        return cols
      })()
    : []

  const EV_STYLE: Record<string, { label: string; border: string; bg: string; color: string }> = {
    best:  { label: '最佳行動', border: 'rgba(16,185,129,.45)', bg: 'rgba(16,185,129,.1)', color: '#10b981' },
    yours: { label: '你的選擇', border: 'rgba(151,117,250,.45)', bg: 'rgba(151,117,250,.12)', color: '#9775fa' },
    third: { label: '第三選項', border: 'rgba(148,163,184,.3)', bg: 'rgba(148,163,184,.08)', color: '#94a3b8' },
  }

  // Step 2 bet info
  const step2BetInfo = villainAction ? (() => {
    if (villainAction === 'allin') return { raiseLabel: '', callLabel: `Call ${villainBet}bb`, onlyCallFold: true }
    if (villainAction === '4bet') return { raiseLabel: `All-In ${effectiveStack}bb`, callLabel: `Call ${villainBet}bb`, onlyCallFold: false }
    if (villainAction === '3bet') return { raiseLabel: `4-Bet ${FOUR_BET}bb`, callLabel: `Call ${villainBet}bb`, onlyCallFold: false }
    if (villainAction === 'bb_raise') return { raiseLabel: `3-Bet ${villainBet * 3}bb`, callLabel: `Call ${villainBet}bb`, onlyCallFold: false }
    return { raiseLabel: 'Raise', callLabel: 'Call', onlyCallFold: false }
  })() : null

  // Range modal title
  const rangeModalTitle = phase === 'step2_question' || phase === 'step2_result'
    ? `${scenario.position} vs ${villainPos} ${villainAction?.toUpperCase()} · ${effectiveStack}BB`
    : gtoScen === 'vs_open'
    ? `BB vs Open · ${effectiveStack}BB`
    : `${scenario.position} Open · ${effectiveStack}BB`

  // ── Render action buttons ─────────────────────────────────────────────────
  function renderActionButtons(handleAction: (a: Action) => void, isStep2 = false) {
    let btns: BtnConfig[]

    if (isStep2 && step2BetInfo) {
      btns = []
      if (!step2BetInfo.onlyCallFold && step2BetInfo.raiseLabel) {
        btns.push({ key: 'raise', action: 'raise', label: step2BetInfo.raiseLabel, emoji: '🔺', ...S.raise })
      }
      btns.push({ key: 'call', action: 'call', label: step2BetInfo.callLabel, emoji: step2BetInfo.onlyCallFold ? '💥' : '📞',
        color: step2BetInfo.onlyCallFold ? '#ff4444' : ACTION_CONFIG.call.color,
        bg: step2BetInfo.onlyCallFold ? 'rgba(180,30,30,0.15)' : ACTION_CONFIG.call.bg,
        border: step2BetInfo.onlyCallFold ? 'rgba(220,50,50,0.8)' : ACTION_CONFIG.call.border,
        fontWeight: step2BetInfo.onlyCallFold ? 800 : undefined })
      btns.push({ key: 'fold', action: 'fold', label: 'Fold', emoji: '🗑️', ...S.fold })
    } else {
      btns = step1Buttons
    }

    const is4 = btns.length >= 4
    return (
      <div style={{ display: 'flex', gap: is4 ? '1%' : 8, flexShrink: 0, marginTop: 6 }}>
        {btns.map(btn => (
          <button key={btn.key} onClick={() => handleAction(btn.action)} style={{
            ...(is4 ? { width: '23%', flexShrink: 0 } : { flex: 1 }),
            padding: is4 ? '8px 2px' : '8px 6px', borderRadius: 12,
            border: `1.5px solid ${btn.border}`, background: btn.bg, color: btn.color,
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2, fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.15s', fontWeight: btn.fontWeight,
          }}>
            <span style={{ fontSize: is4 ? 14 : 18 }}>{btn.emoji}</span>
            <span style={{ fontSize: is4 ? 9 : 11, fontWeight: btn.fontWeight ?? 700 }}>{btn.label}</span>
          </button>
        ))}
      </div>
    )
  }

  // ── Render result section ─────────────────────────────────────────────────
  function renderResult() {
    if (!resultAction || !freqs) return null
    const correctAction = resultCorrectAction
    const ev = phase === 'step2_result' ? step2Eval : step1Eval
    // BUG 2 fix: use contextual labels
    const bestLabel = getContextualLabel(correctAction, currentScenKey, effectiveStack, scenario!.position, villainBet)
    return (
      <div className="animate-slide-up" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
        {/* Two-column result */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <HoleCards hand={currentHand} revealed size="md" />
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{currentHand}</span>
            {/* Score badge */}
            {phase !== 'step1_result' || step1Correct ? (
              <div style={{ fontSize: 10, color: handScore >= 1 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                {handScore >= 1 ? '★ 1.0' : `★ ${handScore}`}
              </div>
            ) : null}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div className="animate-pop" style={{ fontSize: 18, fontWeight: 800, color: ev?.color ?? '#ef4444' }}>
              {ev?.label ?? '✗ 答錯了'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
              GTO：{bestLabel} {freqs[correctAction]}%
            </div>
            <button className="btn-primary" onClick={nextHand} style={{ width: '100%', padding: '8px 0', fontSize: 13 }}>
              下一手 →
            </button>
          </div>
        </div>

        {/* EV columns */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${evColumns.length}, 1fr)`, gap: 6, flexShrink: 0 }}>
          {evColumns.map(({ action, role }) => {
            const s = EV_STYLE[role]; const cfg = ACTION_CONFIG[action]; const freq = freqs[action]
            const ctxLabel = getContextualLabel(action, currentScenKey, effectiveStack, scenario!.position, villainBet)
            return (
              <div key={role} style={{ borderRadius: 10, border: `1.5px solid ${s.border}`, background: s.bg, padding: '4px', height: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                <div style={{ fontSize: 11 }}>{cfg.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.2 }}>{ctxLabel}</div>
                <div style={{ fontSize: 11, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: s.color }}>{freq}%</div>
              </div>
            )
          })}
        </div>

        {/* View range button */}
        <button onClick={() => setShowRangeModal(true)} style={{ padding: '8px 12px', borderRadius: 12, flexShrink: 0, background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          查看完整範圍 13×13
        </button>

        <div style={{ flex: 1 }} />
        <button onClick={() => setShowSummary(true)} style={{ padding: '8px 12px', borderRadius: 12, background: 'var(--surface-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>
          結束
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', padding: '6px 16px 8px', overflow: 'hidden' }}>
        {/* ── Stats bar ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'stretch' }}>
          <button onClick={() => { if (sessions.length > 0) setShowLeaveConfirm(true); else onBack?.() }} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: '#141420', color: 'var(--text-secondary)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center', fontFamily: 'Outfit, sans-serif' }}>←</button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, flex: 1 }}>
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: total === 0 ? 'var(--text-muted)' : accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>{total > 0 ? `${accuracy}%` : '--'}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>準確率</div>
            </div>
            <div style={{ background: 'var(--surface-card)', border: `1px solid ${streak >= 3 ? 'rgba(245,158,11,0.35)' : 'var(--border)'}`, borderRadius: 8, padding: '5px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: streak >= 3 ? '#f59e0b' : 'var(--text-primary)', lineHeight: 1 }}>{streak >= 1 ? `${streak}${streak >= 3 ? '🔥' : ''}` : '--'}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>連勝</div>
            </div>
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: 'var(--text-primary)', lineHeight: 1 }}>{total}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>手數</div>
            </div>
            <div style={{ background: 'var(--surface-card)', border: `1px solid ${effectiveStack <= 15 ? 'rgba(239,68,68,0.35)' : effectiveStack <= 40 ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)'}`, borderRadius: 8, padding: '5px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: effectiveStack <= 15 ? '#ef4444' : effectiveStack <= 40 ? '#f59e0b' : '#10b981', lineHeight: 1 }}>{effectiveStack}bb</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>有效深度</div>
            </div>
          </div>
        </div>

        {/* ── Poker felt ─────────────────────────────────────────────────── */}
        <div style={{ flexShrink: 0, marginTop: 6 }}>
          <PokerFelt showPositions heroPosition={scenario.position} seatStacks={seatStacks} seatInfo={feltSeatInfo} potTotal={feltPot} scenarioText={feltText} flashSeat={flashSeat ?? undefined}>
            {/* Center content depends on phase */}
            {(phase === 'question' || phase === 'step2_question') && (
              <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 14px', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: '"IBM Plex Mono", monospace' }}>
                {phase === 'step2_question' ? '對手反擊，你怎麼辦？' : '你會怎麼做？'}
              </div>
            )}
            {phase === 'villain_acting' && (
              <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 14px', fontSize: 13, color: 'rgba(255,200,50,0.8)', fontFamily: '"IBM Plex Mono", monospace' }}>
                等待對手...
              </div>
            )}
            {phase === 'hand_complete' && (
              <div className="animate-pop" style={{ background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 14px', fontSize: 13, fontWeight: 700, color: 'white' }}>
                收取底池 +{feltPot.toFixed(1)}bb
              </div>
            )}
            {isShowingResult && (() => {
              const ev = phase === 'step2_result' ? step2Eval : step1Eval
              const bgColor = ev?.grade === 'best' ? 'rgba(16,185,129,0.9)' : ev?.grade === 'wrong' ? 'rgba(239,68,68,0.9)' : 'rgba(255,169,77,0.9)'
              return (
                <div className="animate-pop" style={{ background: bgColor, backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 14px', fontSize: 13, fontWeight: 700, color: 'white' }}>
                  {ev?.label ?? ''}
                </div>
              )
            })()}
          </PokerFelt>
        </div>

        {/* ── Question phase (Step 1 or Step 2) ──────────────────────────── */}
        {(phase === 'question' || phase === 'step2_question') && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexShrink: 0, marginTop: 6 }}>
              <HoleCards hand={currentHand} revealed size="md" />
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{currentHand}</span>
            </div>
            {phase === 'question'
              ? renderActionButtons(handleStep1, false)
              : renderActionButtons(handleStep2, true)}
          </>
        )}

        {/* ── Villain acting (animation) ─────────────────────────────────── */}
        {phase === 'villain_acting' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexShrink: 0, marginTop: 12 }}>
            <HoleCards hand={currentHand} revealed size="md" />
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: '"IBM Plex Mono", monospace', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{currentHand}</span>
          </div>
        )}

        {/* ── Hand complete (pot won, auto-advancing) ────────────────────── */}
        {phase === 'hand_complete' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexShrink: 0, marginTop: 12 }}>
            <HoleCards hand={currentHand} revealed size="md" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>✓ 正確</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>自動進入下一手...</div>
            </div>
          </div>
        )}

        {/* ── Result (step1 or step2) ────────────────────────────────────── */}
        {isShowingResult && renderResult()}
      </div>

      {/* ── Range Modal ──────────────────────────────────────────────────── */}
      {showRangeModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }} onClick={() => setShowRangeModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 12px', maxWidth: 400, width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>完整範圍</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: '"IBM Plex Mono", monospace', marginTop: 2 }}>{rangeModalTitle}</div>
              </div>
              <button onClick={() => setShowRangeModal(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 1.5, background: 'rgba(0,0,0,0.3)', borderRadius: 8, overflow: 'hidden', padding: 2 }}>
              {Array.from({ length: 13 }, (_, row) =>
                Array.from({ length: 13 }, (_, col) => {
                  const hand = cellToHand(row, col)
                  const data = activeRange[hand]
                  const isHL = hand === currentHand
                  return (
                    <div key={`${row}-${col}`} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: rangeCellColor(data), borderRadius: 2, border: isHL ? '2px solid #f59e0b' : '1px solid rgba(0,0,0,0.15)', boxShadow: isHL ? '0 0 8px rgba(245,158,11,0.5)' : undefined }}>
                      <span style={{ fontSize: 'clamp(6px,1.2vw,10px)', fontWeight: isHL ? 700 : 500, color: 'rgba(255,255,255,0.9)', lineHeight: 1, fontFamily: '"IBM Plex Mono", monospace', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{gridCellText(row, col)}</span>
                    </div>
                  )
                })
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[{ color: 'rgba(220,50,50,0.8)', label: 'Raise' }, { color: 'rgba(50,180,100,0.8)', label: 'Call' }, { color: 'rgba(220,140,30,0.8)', label: 'Mixed' }, { color: 'rgba(40,40,50,0.6)', label: 'Fold' }].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Session Summary ──────────────────────────────────────────────── */}
      {showSummary && (
        <SessionSummary sessions={sessions} scenario={scenario} onRepeat={handleRepeat} onPracticePosition={handlePracticePosition} onClose={() => setShowSummary(false)} />
      )}

      {/* ── Leave confirm ────────────────────────────────────────────────── */}
      {showLeaveConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowLeaveConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', maxWidth: 320, width: '100%', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>練習尚未結束，確定要離開嗎？</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLeaveConfirm(false)} className="btn-primary" style={{ flex: 1, padding: '10px 0', fontSize: 14 }}>繼續練習</button>
              <button onClick={() => { setShowLeaveConfirm(false); onBack?.() }} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>離開</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TrainTab
