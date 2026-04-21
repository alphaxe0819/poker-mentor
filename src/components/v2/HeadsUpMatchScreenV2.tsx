// src/components/v2/HeadsUpMatchScreenV2.tsx — v2 UI (capsule felt)
import { useState, useEffect, useCallback, useRef } from 'react'
import PokerFeltV2 from './PokerFeltV2'
import ActionHistoryBarTop, { type HistoryItem } from './ActionHistoryBarTop'
import FeedbackSheetV2 from './FeedbackSheetV2'
import BetSizingBarV2, { type BetAction, type SizingOption } from './BetSizingBarV2'
import HoleCards from '../HoleCards'
import RangeGrid from '../RangeGrid'
import type { MatchConfig, MatchState, Action, HandState } from '../../lib/hu/types'
import type { ActionFreq, StreetScore } from './FeedbackSheetV2'
import { createMatch, dealNewHand, applyAction, resolveHand } from '../../lib/hu/engine'

/** Safe wrapper: if resolveHand throws, return a minimal resolved state so game doesn't freeze */
function resolveHandSafe(match: MatchState): MatchState {
  try { return resolveHand(match) } catch {
    return { ...match, handHistory: [...match.handHistory, match.currentHand!], currentHand: null, result: 'in_progress' }
  }
}

import { decideBotAction, preloadBotData } from '../../lib/hu/botAI'
import { handToCanonical } from '../../lib/hu/handToCanonical'
import type { Personality } from '../../lib/gto/huHeuristics'
import { isPreflopViolation } from '../../lib/hu/gtoCheck'

export interface GtoFlag {
  street: string
  actor: string
  pass: boolean
}
export type FlagsByHand = Record<number, GtoFlag[]>

// ── HU action → ActionHistoryBarTop item ─────────────────────────
function huActionToHistoryItem(a: Action, heroPos: string): HistoryItem {
  let detail = ''
  switch (a.kind) {
    case 'fold':  detail = 'Fold'; break
    case 'check': detail = 'Check'; break
    case 'call':  detail = 'Call'; break
    case 'bet':   detail = `Bet ${a.amount}`; break
    case 'raise': detail = `Raise ${a.amount}`; break
    case 'allin': detail = 'All-in'; break
    default:      detail = a.kind
  }
  return { label: a.actor.toUpperCase(), detail, kind: a.actor === heroPos ? 'hero' : 'villain' }
}

// ── Hand feedback data ────────────────────────────────────────────
export interface HUHandFeedback {
  tip: string
  actions: ActionFreq[]
  streets: StreetScore[]
  isCorrect: boolean
  explanation: string
}

/** 把已結束的 HandState 轉成 FeedbackSheetV2 所需資料（v1：全街 pending）*/
export function computeHandFeedback(hand: HandState, flags?: GtoFlag[]): HUHandFeedback {
  const canonical = handToCanonical(hand.hero.holeCards)
  const pos = hand.hero.position.toUpperCase()
  // isCorrect = no preflop violations recorded
  const isCorrect = flags && flags.length > 0 ? !flags.some(f => !f.pass) : true

  const preflopAction = hand.actions.find(
    a => a.street === 'preflop' && a.actor === hand.hero.position
  )
  let actionLabel = '未行動'
  if (preflopAction) {
    switch (preflopAction.kind) {
      case 'fold':  actionLabel = 'Fold'; break
      case 'check': actionLabel = 'Check'; break
      case 'call':  actionLabel = `Call ${preflopAction.amount ?? ''}`; break
      case 'bet':   actionLabel = `Bet ${preflopAction.amount ?? ''}`; break
      case 'raise': actionLabel = `Raise ${preflopAction.amount ?? ''}`; break
      case 'allin': actionLabel = 'All-in'; break
    }
  }

  return {
    tip: `${canonical} · ${pos}`,
    actions: [{ label: actionLabel, freq: 100, color: '#7c3aed', isYours: true }],
    streets: [
      { street: 'preflop', state: 'pending' },
      { street: 'flop',    state: 'pending' },
      { street: 'turn',    state: 'pending' },
      { street: 'river',   state: 'pending' },
    ],
    isCorrect,
    explanation: '街別 GTO 評分建構中，未來版本將顯示詳細頻率資料。',
  }
}

interface Props {
  config: MatchConfig
  personality: Personality
  onMatchComplete: (
    finalState: MatchState,
    flagsByHand: FlagsByHand,
    aiBookmarks: number[]
  ) => void
  onAbandon: () => void
}

export default function HeadsUpMatchScreenV2({
  config, personality, onMatchComplete, onAbandon,
}: Props) {
  const [match, setMatch] = useState<MatchState | null>(null)
  const [waitingForBot, setWaitingForBot] = useState(false)
  const waitingRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [handResult, setHandResult] = useState<{ delta: number; won: boolean; tie?: boolean } | null>(null)
  const violationsRef = useRef(0)
  const flagsRef = useRef<FlagsByHand>({})
  const resolvedRef = useRef<MatchState | null>(null)
  const [feedbackReady, setFeedbackReady] = useState<HUHandFeedback | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackExpanded, setFeedbackExpanded] = useState(false)
  const [feedbackCountdown, setFeedbackCountdown] = useState(0)
  const [aiBookmarkedHands, setAIBookmarkedHands] = useState<number[]>([])
  const [bookmarkToast, setBookmarkToast] = useState<false | 'new' | 'existing'>(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showRange, setShowRange] = useState(false)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const aiBookmarkedHandsRef = useRef<number[]>([])
  aiBookmarkedHandsRef.current = aiBookmarkedHands

  function clearCountdown() {
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }

  function dealNextHand() {
    clearCountdown()
    setFeedbackReady(null)
    setFeedbackOpen(false)
    setFeedbackExpanded(false)
    setFeedbackCountdown(0)
    setShowRange(false)
    const res = resolvedRef.current
    if (!res) return
    resolvedRef.current = null
    if (res.result !== 'in_progress') {
      const withViolations: MatchState = { ...res, violationPoints: 0 }
      onMatchComplete(withViolations, flagsRef.current, aiBookmarkedHandsRef.current)
    } else {
      setHandResult(null)
      setMatch(dealNewHand(res))
    }
  }

  // ── Init match on mount ──
  useEffect(() => {
    let cancelled = false
    async function init() {
      await preloadBotData()
      if (cancelled) return
      const initial = dealNewHand(createMatch(config))
      setMatch(initial)
    }
    init().catch(e => setError(`Init failed: ${e}`))
    return () => { cancelled = true }
  }, [config])

  const matchRef = useRef(match)
  matchRef.current = match

  // ── Bot turn handler ──
  useEffect(() => {
    if (!match?.currentHand) return
    if (match.currentHand.isComplete) return
    const isBotTurn = match.currentHand.toAct !== match.currentHand.hero.position
    if (!isBotTurn) return
    if (waitingRef.current) return

    waitingRef.current = true
    setWaitingForBot(true)

    setTimeout(async () => {
      const currentMatch = matchRef.current
      if (!currentMatch?.currentHand || currentMatch.currentHand.isComplete) {
        waitingRef.current = false
        setWaitingForBot(false)
        return
      }
      try {
        const botAction = await decideBotAction(currentMatch.currentHand, config, personality)
        const updated = applyAction(currentMatch, botAction)
        setMatch(updated)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(`Bot error: ${msg}`)
      } finally {
        waitingRef.current = false
        setWaitingForBot(false)
      }
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.currentHand?.toAct, match?.currentHand?.handNumber, match?.currentHand?.street])

  // ── Hand complete → resolve and start feedback countdown ──
  useEffect(() => {
    if (!match?.currentHand?.isComplete) return
    const hand = match.currentHand

    try {
      const resolved = resolveHand(match)
      resolvedRef.current = resolved
      const delta = resolved.playerStackBB - match.playerStackBB
      const won = delta > 0
      const tie = delta === 0 && !hand.hero.hasFolded && !hand.villain.hasFolded
      setHandResult({ delta, won, tie })
    } catch (e) {
      console.error('[HeadsUpMatch] resolveHand failed:', e)
      setHandResult({ delta: 0, won: false, tie: true })
      resolvedRef.current = resolveHandSafe(match)
    }

    const handFlags = flagsRef.current[hand.handNumber] ?? []
    setFeedbackReady(computeHandFeedback(hand, handFlags))
    setFeedbackOpen(false)
    setFeedbackExpanded(false)

    clearCountdown()
    let remaining = 10
    setFeedbackCountdown(remaining)
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1
      setFeedbackCountdown(remaining)
      if (remaining <= 0) dealNextHand()
    }, 1000)

    return () => { clearCountdown() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.currentHand?.isComplete, match?.currentHand?.handNumber])

  // ── Unified action handler (preflop + postflop) ──
  const handleBetAction = useCallback((betAction: BetAction) => {
    if (!match?.currentHand) return
    const hand = match.currentHand
    const heroPos = hand.hero.position
    let action!: Action

    switch (betAction.kind) {
      case 'fold':  action = { kind: 'fold',  actor: heroPos, street: hand.street }; break
      case 'check': action = { kind: 'check', actor: heroPos, street: hand.street }; break
      case 'call':  action = { kind: 'call',  actor: heroPos, street: hand.street }; break
      case 'bet':   action = { kind: 'bet',   amount: betAction.amount, actor: heroPos, street: hand.street }; break
      case 'raise': action = { kind: 'raise', amount: betAction.amount, actor: heroPos, street: hand.street }; break
      case 'allin': action = { kind: 'allin', actor: heroPos, street: hand.street }; break
      default: return
    }

    // Detect preflop violation
    if (hand.street === 'preflop') {
      const isViolation = isPreflopViolation(hand, heroPos, betAction.kind)
      const flag: GtoFlag = { street: 'preflop', actor: heroPos, pass: !isViolation }
      const handNum = hand.handNumber
      flagsRef.current = { ...flagsRef.current, [handNum]: [...(flagsRef.current[handNum] ?? []), flag] }
      if (isViolation) violationsRef.current++
    }

    setMatch(applyAction(match, action))
  }, [match])

  // ── Render guards ──
  if (!match || !match.currentHand) {
    return (
      <div className="flex items-center justify-center text-gray-400"
           style={{ position: 'fixed', inset: 0, background: '#0a0a0a' }}>
        載入中...
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center text-red-400 p-6"
           style={{ position: 'fixed', inset: 0, background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="mb-4">{error}</div>
          <button onClick={onAbandon}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm">
            回主選單
          </button>
        </div>
      </div>
    )
  }

  const hand = match.currentHand
  const isPlayerTurn = hand.toAct === hand.hero.position && !hand.isComplete && !hand.hero.isAllIn

  const heroTotalBB    = hand.hero.stackBB    + hand.hero.committedBB
  const villainTotalBB = hand.villain.stackBB + hand.villain.committedBB
  void villainTotalBB  // used implicitly for totalEffStack

  const toCallBB = hand.currentBetBB - hand.hero.streetCommitBB
  const canFold  = !hand.isComplete && toCallBB > 0
  const canCheck = !hand.isComplete && toCallBB === 0
  const canCall  = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB >= toCallBB
  const canBet   = !hand.isComplete && toCallBB === 0 && hand.hero.stackBB > 0
  const canRaise = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB > toCallBB

  const isPreflop = hand.street === 'preflop'

  // ── Preflop raise sizing ──
  const preflopRaises = hand.actions.filter(a => a.street === 'preflop' && (a.kind === 'raise' || a.kind === 'bet')).length
  const totalEffStack  = Math.min(heroTotalBB, hand.villain.stackBB + hand.villain.committedBB)
  const isMidStack     = totalEffStack <= 25
  const preflopRaiseAmount = preflopRaises === 0
    ? (isMidStack ? 2 : 2.5)
    : preflopRaises === 1 ? (isMidStack ? 6 : 9)
    : (isMidStack ? heroTotalBB : 22)
  const preflopRaiseLabel  = preflopRaises === 0 ? 'Raise'
    : preflopRaises === 1 ? '3-Bet'
    : (isMidStack ? 'All-in' : '4-Bet')
  const raiseIsAllin = preflopRaiseAmount >= hand.hero.stackBB

  // ── Postflop bet/raise sizing ──
  const betSmall = Math.max(1, Math.round(hand.potBB * 0.33 * 10) / 10)
  const betMid   = Math.max(1, Math.round(hand.potBB * 0.5  * 10) / 10)
  const betLarge = Math.max(1, Math.round(hand.potBB * 1.0  * 10) / 10)
  const lastIncrement = Math.max(1, hand.currentBetBB - hand.hero.streetCommitBB)
  const minRaiseTo    = hand.currentBetBB + lastIncrement
  const potAfterCall  = hand.potBB + (hand.currentBetBB - hand.hero.streetCommitBB)
  const potRaiseTo    = hand.currentBetBB + potAfterCall
  const raiseMid   = Math.max(minRaiseTo, Math.round(hand.currentBetBB * 2.5 * 10) / 10)
  const raiseLarge = Math.max(minRaiseTo, Math.round(potRaiseTo * 10) / 10)

  // ── Unified sizing options for single-row BetSizingBarV2 ──
  const sizingOptions: SizingOption[] = isPreflop
    ? (canRaise && !raiseIsAllin
        ? [{ label: `${preflopRaiseLabel} ${preflopRaiseAmount}`, amount: preflopRaiseAmount, kind: 'raise' as const }]
        : [])
    : (canBet || canRaise)
      ? [
          { label: '33%',  amount: canBet ? betSmall : Math.max(minRaiseTo, Math.round(minRaiseTo * 10) / 10), kind: canBet ? 'bet' as const : 'raise' as const },
          { label: '50%',  amount: canBet ? betMid   : raiseMid,   kind: canBet ? 'bet' as const : 'raise' as const },
          { label: '100%', amount: canBet ? betLarge : raiseLarge, kind: canBet ? 'bet' as const : 'raise' as const },
        ]
      : []

  const canAllIn    = hand.hero.stackBB > 0 && !hand.hero.isAllIn && !hand.isComplete
  const allInAmount = hand.hero.stackBB

  // ── ActionHistoryBarTop items ──
  const historyItems: HistoryItem[] = hand.actions.map(a => huActionToHistoryItem(a, hand.hero.position))

  // ── PokerFeltV2 seat keys (HU 2-player) ──
  const heroSeatKey    = hand.hero.position    === 'btn' ? 'BTN/SB' : 'BB'
  const villainSeatKey = hand.villain.position === 'btn' ? 'BTN/SB' : 'BB'

  const showVillainCards = hand.isComplete && !hand.hero.hasFolded && !hand.villain.hasFolded

  // For RangeGrid highlight
  const heroCanonical = handToCanonical(hand.hero.holeCards)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Exit confirm modal ── */}
      {showExitConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: '#111', border: '1px solid #222' }}>
            <div className="text-white font-bold text-base mb-2">放棄比賽？</div>
            <div className="text-gray-400 text-sm mb-5">比賽進行中，確定要放棄？</div>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-sm font-medium"
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
                繼續比賽
              </button>
              <button onClick={onAbandon}
                className="flex-1 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: '#7c3aed' }}>
                放棄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top: ActionHistoryBarTop ── */}
      <ActionHistoryBarTop
        items={historyItems}
        onBack={() => setShowExitConfirm(true)}
        rightSlot={
          <div className="flex items-center gap-2 text-[10px]" style={{ color: '#8a92a0' }}>
            {waitingForBot && <span className="animate-pulse" style={{ color: '#6b7280' }}>思考中...</span>}
            <span>手 #{hand.handNumber}</span>
            <span className="font-bold" style={{ color: '#e6e8ec' }}>{heroTotalBB} BB</span>
          </div>
        }
      />

      {/* ── Felt — fills all remaining space ── */}
      <div className="flex-1 relative min-h-0">
        <PokerFeltV2
          tableSize={2}
          heroPosition={hand.hero.position === 'btn' ? 'BTN/SB' : 'BB'}
          potTotal={hand.potBB}
          boardCards={hand.board}
          seatInfo={{
            [heroSeatKey]: {
              status: 'hero',
              bet: hand.hero.streetCommitBB,
              stack: hand.hero.stackBB,
            },
            [villainSeatKey]: {
              status: hand.villain.hasFolded ? 'folded' : 'active',
              bet: hand.villain.streetCommitBB,
              stack: hand.villain.stackBB,
              hasCards: !hand.villain.hasFolded,
            },
          }}
        />

        {/* Villain showdown cards — absolute overlay inside felt */}
        {showVillainCards && (
          <div className="absolute" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <HoleCards
              hand={handToCanonical(hand.villain.holeCards)}
              actualCards={hand.villain.holeCards}
              size="small"
            />
          </div>
        )}

        {/* ── Hand result chip — inside felt, below community cards, no layout shift ── */}
        {handResult && (() => {
          const col = handResult.tie ? '#fbbf24' : handResult.won ? '#10b981' : '#ef4444'
          const bg  = handResult.tie ? 'rgba(251,191,36,0.12)' : handResult.won ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
          const label = hand.hero.hasFolded ? '你棄牌'
            : hand.villain.hasFolded ? '對手棄牌'
            : handResult.tie ? 'Chop' : 'Showdown'
          return (
            <div className="absolute flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                 style={{ top: '62%', left: '50%', transform: 'translateX(-50%)', zIndex: 6,
                          background: bg, border: `1px solid ${col}`, color: col, whiteSpace: 'nowrap' }}>
              <span>{handResult.tie ? '🤝' : handResult.won ? '🏆' : '💔'}</span>
              <span>{handResult.tie ? 'CHOP' : `${handResult.delta >= 0 ? '+' : ''}${handResult.delta.toFixed(1)} BB`}</span>
              <span className="font-normal opacity-70">{label}</span>
            </div>
          )
        })()}
      </div>

      {/* ── Hero hole cards ── */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ paddingTop: 6, paddingBottom: 4 }}>
        <HoleCards hand={heroCanonical} actualCards={hand.hero.holeCards} />
        <div className="flex items-center gap-2 text-xs mt-1">
          <span style={{ color: '#6b7280' }}>{heroCanonical}</span>
          <span style={{ color: '#374151' }}>·</span>
          <span style={{ color: '#9ca3af' }}>{hand.hero.position.toUpperCase()}</span>
          <span style={{ color: '#374151' }}>·</span>
          <span className="font-bold text-white">{heroTotalBB} BB</span>
          {!waitingForBot && isPlayerTurn && (
            <span className="font-bold" style={{ color: '#10b981' }}>輪到你</span>
          )}
        </div>
      </div>

      {/* ── Action bar — fixed-height, shows next-hand buttons when complete ── */}
      <div className="flex-shrink-0">
        {isPlayerTurn ? (
          <BetSizingBarV2
            canFold={canFold}
            canCheck={canCheck}
            canCall={canCall}
            callAmount={toCallBB}
            sizingOptions={sizingOptions}
            canAllIn={canAllIn}
            allInAmount={allInAmount}
            onAction={handleBetAction}
          />
        ) : hand.isComplete ? (
          /* Hand complete — show feedback + next-hand buttons */
          <div className="flex gap-[4px] px-2 pb-3 pt-2"
               style={{ background: 'linear-gradient(180deg, transparent, #08090b 20%)' }}>
            <button
              onClick={() => { clearCountdown(); setFeedbackOpen(true); setFeedbackCountdown(0) }}
              className="flex-1 flex flex-col items-center justify-center rounded-[10px] font-extrabold text-white"
              style={{ minHeight: 48, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#aaa', fontSize: 12 }}>
              <span>👁 回饋</span>
              {feedbackCountdown > 0 && (
                <small className="text-[9px] opacity-60 font-semibold leading-none">{feedbackCountdown}s</small>
              )}
            </button>
            <button
              onClick={() => dealNextHand()}
              className="flex-1 flex items-center justify-center rounded-[10px] font-extrabold text-white"
              style={{ minHeight: 48, background: '#7c3aed', fontSize: 13 }}>
              ▶▶ 下一手
            </button>
          </div>
        ) : (
          <div style={{ height: 68 }} />
        )}
      </div>

      {/* ── FeedbackSheetV2 overlay ── */}
      {feedbackOpen && feedbackReady && (() => {
        const overlayHand = match.currentHand ?? match.handHistory[match.handHistory.length - 1]
        if (!overlayHand) return null
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <FeedbackSheetV2
              isCorrect={feedbackReady.isCorrect}
              tip={feedbackReady.tip}
              actions={feedbackReady.actions}
              streets={feedbackReady.streets}
              explanation={feedbackReady.explanation}
              expanded={feedbackExpanded}
              onToggleExpand={() => setFeedbackExpanded(v => !v)}
              onViewRange={() => setShowRange(true)}
              onNext={() => dealNextHand()}
              onAskAI={() => {
                const wasAlreadyBookmarked = aiBookmarkedHandsRef.current.includes(overlayHand.handNumber)
                if (!wasAlreadyBookmarked) {
                  const updated = [...aiBookmarkedHandsRef.current, overlayHand.handNumber]
                  setAIBookmarkedHands(updated)
                  aiBookmarkedHandsRef.current = updated
                }
                setBookmarkToast(wasAlreadyBookmarked ? 'existing' : 'new')
                setTimeout(() => setBookmarkToast(false), 1500)
              }}
            />
          </div>
        )
      })()}

      {/* ── RangeGrid overlay ── */}
      {showRange && (
        <RangeGrid
          highlightHand={heroCanonical}
          onClose={() => setShowRange(false)}
        />
      )}

      {/* ── AI bookmark toast ── */}
      {bookmarkToast && (
        <div className="px-4 py-2 rounded-full text-sm font-bold text-white pointer-events-none"
             style={{ position: 'fixed', bottom: 128, left: '50%', transform: 'translateX(-50%)', zIndex: 60, background: '#1a103a', border: '1px solid #7c3aed' }}>
          {bookmarkToast === 'new' ? '✓ 已加入賽後分析' : '已在書籤中'}
        </div>
      )}
    </div>
  )
}
