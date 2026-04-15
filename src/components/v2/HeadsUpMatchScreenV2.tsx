// src/components/v2/HeadsUpMatchScreenV2.tsx — v2 UI (capsule felt)
import { useState, useEffect, useCallback, useRef } from 'react'
import PokerFeltV2 from './PokerFeltV2'
import ActionHistoryBarTop, { type HistoryItem } from './ActionHistoryBarTop'
import FeedbackSheetV2 from './FeedbackSheetV2'
import HoleCards from '../HoleCards'
import PostflopActionBar, { type ActionChoice } from '../PostflopActionBar'
import PreflopActionBar, { type PreflopAction } from '../PreflopActionBar'
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
export function computeHandFeedback(hand: HandState): HUHandFeedback {
  const canonical = handToCanonical(hand.hero.holeCards)
  const pos = hand.hero.position.toUpperCase()

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
    isCorrect: true,
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
  /** Brief result display between hands: '+3 BB 🏆' or '-2 BB' */
  const [handResult, setHandResult] = useState<{ delta: number; won: boolean; tie?: boolean } | null>(null)
  const violationsRef = useRef(0)
  const flagsRef = useRef<FlagsByHand>({})
  const resolvedRef = useRef<MatchState | null>(null)
  const [feedbackReady, setFeedbackReady] = useState<HUHandFeedback | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackCountdown, setFeedbackCountdown] = useState(0)
  const [aiBookmarkedHands, setAIBookmarkedHands] = useState<number[]>([])
  const [bookmarkToast, setBookmarkToast] = useState<false | 'new' | 'existing'>(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
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
    setFeedbackCountdown(0)
    const res = resolvedRef.current
    if (!res) return
    resolvedRef.current = null
    if (res.result !== 'in_progress') {
      const cappedViolationPoints = 0
      const withViolations: MatchState = { ...res, violationPoints: cappedViolationPoints }
      onMatchComplete(withViolations, flagsRef.current, aiBookmarkedHandsRef.current)
    } else {
      setHandResult(null)
      setMatch(dealNewHand(res))
    }
  }

  // ── Init match on mount ──
  // Must await preloadBotData() BEFORE setting the match,
  // otherwise getDBByGameType returns undefined (cache empty)
  // and the bot folds every hand.
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

  // ── Bot turn handler ──
  // Schedules bot action 1s after detecting it's bot's turn.
  // Uses a ref to prevent duplicate scheduling and to hold latest match.
  const matchRef = useRef(match)
  matchRef.current = match

  useEffect(() => {
    if (!match?.currentHand) return
    if (match.currentHand.isComplete) return
    const isBotTurn = match.currentHand.toAct !== match.currentHand.hero.position
    if (!isBotTurn) return
    if (waitingRef.current) return

    waitingRef.current = true
    setWaitingForBot(true)

    setTimeout(() => {
      const currentMatch = matchRef.current
      if (!currentMatch?.currentHand || currentMatch.currentHand.isComplete) {
        waitingRef.current = false
        setWaitingForBot(false)
        return
      }
      try {
        const botAction = decideBotAction(currentMatch.currentHand, config, personality)
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

    // Do NOT return cleanup — we want the timer to survive re-renders.
    // waitingRef.current prevents duplicate scheduling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.currentHand?.toAct, match?.currentHand?.handNumber, match?.currentHand?.street])

  // ── Hand complete → show result briefly → resolve and deal next ──
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

    // Compute feedback data (v1: all streets pending)
    setFeedbackReady(computeHandFeedback(hand))
    setFeedbackOpen(false)

    // Start 10-second countdown
    clearCountdown()
    let remaining = 10
    setFeedbackCountdown(remaining)
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1
      setFeedbackCountdown(remaining)
      if (remaining <= 0) {
        dealNextHand()
      }
    }, 1000)

    return () => { clearCountdown() }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.currentHand?.isComplete, match?.currentHand?.handNumber])

  // ── Player action handler ──
  const handlePlayerAction = useCallback((choice: ActionChoice) => {
    if (!match?.currentHand) return
    const hand = match.currentHand
    const heroPos = hand.hero.position
    let action: Action
    switch (choice.kind) {
      case 'fold':
        action = { kind: 'fold', actor: heroPos, street: hand.street }
        break
      case 'check':
        action = { kind: 'check', actor: heroPos, street: hand.street }
        break
      case 'call':
        action = { kind: 'call', actor: heroPos, street: hand.street }
        break
      case 'bet':
        action = { kind: 'bet', amount: choice.bbAmount, actor: heroPos, street: hand.street }
        break
      case 'raise':
        action = { kind: 'raise', amount: choice.bbAmount, actor: heroPos, street: hand.street }
        break
      case 'allin':
        action = { kind: 'allin', actor: heroPos, street: hand.street }
        break
    }

    // Detect preflop violation (only for preflop, v1.0 spec)
    if (hand.street === 'preflop') {
      const isViolation = isPreflopViolation(hand, heroPos, choice.kind)
      const flag: GtoFlag = {
        street: 'preflop',
        actor: heroPos,
        pass: !isViolation,
      }
      const handNum = hand.handNumber
      const existing = flagsRef.current[handNum] ?? []
      flagsRef.current = { ...flagsRef.current, [handNum]: [...existing, flag] }
      if (isViolation) {
        violationsRef.current = violationsRef.current + 1
      }
    }

    setMatch(applyAction(match, action))
  }, [match])

  // ── Preflop action handler ──
  const handlePreflopAction = useCallback((choice: PreflopAction) => {
    if (!match?.currentHand) return
    const hand = match.currentHand
    const heroPos = hand.hero.position
    let action: Action
    switch (choice.kind) {
      case 'fold':
        action = { kind: 'fold', actor: heroPos, street: hand.street }
        break
      case 'check':
        action = { kind: 'check', actor: heroPos, street: hand.street }
        break
      case 'call':
        action = { kind: 'call', actor: heroPos, street: hand.street }
        break
      case 'raise':
        action = { kind: 'raise', amount: choice.bbAmount, actor: heroPos, street: hand.street }
        break
      case 'allin':
        action = { kind: 'allin', actor: heroPos, street: hand.street }
        break
    }

    // Detect preflop violation
    const isViolation = isPreflopViolation(hand, heroPos, choice.kind)
    const flag: GtoFlag = { street: 'preflop', actor: heroPos, pass: !isViolation }
    const handNum = hand.handNumber
    const existing = flagsRef.current[handNum] ?? []
    flagsRef.current = { ...flagsRef.current, [handNum]: [...existing, flag] }
    if (isViolation) {
      violationsRef.current = violationsRef.current + 1
    }

    setMatch(applyAction(match, action))
  }, [match])

  // ── Render guards ──
  if (!match || !match.currentHand) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400"
                style={{ background: '#0a0a0a' }}>載入中...</div>
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 p-6"
           style={{ background: '#0a0a0a' }}>
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

  // ── In-hand chip totals ──
  const heroTotalBB = hand.hero.stackBB + hand.hero.committedBB
  const villainTotalBB = hand.villain.stackBB + hand.villain.committedBB

  // ── Action bar derived state ──
  const toCallBB = hand.currentBetBB - hand.hero.streetCommitBB
  const canFold = !hand.isComplete && toCallBB > 0
  const canCheck = !hand.isComplete && toCallBB === 0
  const canCall = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB >= toCallBB
  const canBet = !hand.isComplete && toCallBB === 0 && hand.hero.stackBB > 0
  const canRaise = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB > toCallBB

  // ── Preflop raise sizing ──
  const preflopRaises = hand.actions.filter(a => a.street === 'preflop' && (a.kind === 'raise' || a.kind === 'bet')).length
  const totalEffStack = Math.min(heroTotalBB, villainTotalBB)
  const isMidStack = totalEffStack <= 25
  const preflopRaiseAmount = preflopRaises === 0
    ? (isMidStack ? 2 : 2.5)
    : preflopRaises === 1
    ? (isMidStack ? 6 : 9)
    : (isMidStack ? heroTotalBB : 22)
  const preflopRaiseLabel = preflopRaises === 0
    ? `Raise ${preflopRaiseAmount}`
    : preflopRaises === 1
    ? `3-Bet ${preflopRaiseAmount}`
    : (isMidStack ? `All-in ${Math.round(preflopRaiseAmount)}` : `4-Bet ${preflopRaiseAmount}`)
  const isPreflop = hand.street === 'preflop'

  // ── Hidden buttons reveal logic (postflop only) ──
  const effStack = Math.min(hand.hero.stackBB, hand.villain.stackBB)
  const spr = hand.potBB > 0 ? effStack / hand.potBB : 10
  const showXS = !isPreflop && spr > 10
  const showXL = hand.street === 'river' && hand.potBB > 20

  // ── ActionHistoryBarTop items ──
  const historyItems: HistoryItem[] = hand.actions.map(a => huActionToHistoryItem(a, hand.hero.position))

  // ── PokerFeltV2 seat keys (HU 2-player: 'BTN/SB' or 'BB') ──
  const heroSeatKey  = hand.hero.position    === 'btn' ? 'BTN/SB' : 'BB'
  const villainSeatKey = hand.villain.position === 'btn' ? 'BTN/SB' : 'BB'

  const showVillainCards = hand.isComplete && !hand.hero.hasFolded && !hand.villain.hasFolded

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Exit confirm modal */}
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

      {/* Top: ActionHistoryBarTop */}
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

      {/* Felt — fills all remaining space (min-h-0 lets flex shrink correctly) */}
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

        {/* Villain showdown cards — overlay on felt */}
        {showVillainCards && (
          <div className="absolute" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <HoleCards
              hand={handToCanonical(hand.villain.holeCards)}
              actualCards={hand.villain.holeCards}
              size="small"
            />
          </div>
        )}

        {/* Hand result — overlay at felt bottom */}
        {handResult && (() => {
          const bg = handResult.tie ? 'rgba(250,204,21,0.12)'
            : handResult.won ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'
          const border = handResult.tie ? '#fbbf24' : handResult.won ? '#10b981' : '#ef4444'
          const color  = handResult.tie ? '#fbbf24' : handResult.won ? '#10b981' : '#ef4444'
          const emoji  = handResult.tie ? '🤝' : handResult.won ? '🏆' : '💔'
          const label  = hand.hero.hasFolded ? '你棄牌'
            : hand.villain.hasFolded ? '對手棄牌'
            : handResult.tie ? 'Chop' : 'Showdown'
          return (
            <div className="absolute inset-x-4 bottom-2 text-center py-2 rounded-xl animate-pulse"
                 style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="text-xl mb-0.5">{emoji}</div>
              <div className="font-bold text-base" style={{ color }}>
                {handResult.tie ? 'CHOP' : `${handResult.delta >= 0 ? '+' : ''}${handResult.delta.toFixed(1)} BB`}
              </div>
              <div className="text-gray-400 text-[11px] mt-0.5">{label}</div>
            </div>
          )
        })()}
      </div>

      {/* Hero hole cards */}
      <div className="flex flex-col items-center relative z-[5]" style={{ marginTop: -8, paddingBottom: 4 }}>
        <HoleCards hand={handToCanonical(hand.hero.holeCards)} actualCards={hand.hero.holeCards} />
        <div className="flex items-center gap-2 text-xs mt-1">
          <span className="text-gray-500">{handToCanonical(hand.hero.holeCards)}</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400">{hand.hero.position.toUpperCase()}</span>
          <span className="text-gray-600">·</span>
          <span className="text-white font-bold">{heroTotalBB} BB</span>
          {!waitingForBot && isPlayerTurn && !hand.isComplete && (
            <span className="font-bold ml-1" style={{ color: '#10b981' }}>輪到你</span>
          )}
        </div>
      </div>

      {/* Action bar */}
      {isPlayerTurn && isPreflop && (
        <PreflopActionBar
          canFold={canFold}
          canCheck={canCheck}
          canCall={canCall}
          callAmount={toCallBB}
          canRaise={canRaise}
          raiseAmount={preflopRaiseAmount}
          raiseLabel={preflopRaiseLabel}
          effectiveStackBB={hand.hero.stackBB}
          onAction={handlePreflopAction}
        />
      )}
      {isPlayerTurn && !isPreflop && (
        <PostflopActionBar
          canFold={canFold}
          canCheck={canCheck}
          canCall={canCall}
          callAmount={toCallBB}
          canBet={canBet}
          canRaise={canRaise}
          potBB={hand.potBB}
          effectiveStackBB={hand.hero.stackBB}
          currentBetBB={hand.currentBetBB}
          heroStreetCommitBB={hand.hero.streetCommitBB}
          showXS={showXS}
          showXL={showXL}
          onAction={handlePlayerAction}
        />
      )}

      {/* Feedback floating button */}
      {feedbackReady && !feedbackOpen && (
        <div style={{ position: 'fixed', bottom: 96, right: 16, zIndex: 40 }}>
          <button
            onClick={() => { clearCountdown(); setFeedbackOpen(true); setFeedbackCountdown(0) }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold text-white shadow-lg"
            style={{ background: '#7c3aed', border: '1px solid #9d5bff' }}>
            👁 回饋
            {feedbackCountdown > 0 && (
              <span className="text-xs font-mono opacity-70">·{feedbackCountdown}</span>
            )}
          </button>
        </div>
      )}

      {/* FeedbackSheetV2 overlay */}
      {feedbackOpen && feedbackReady && (() => {
        const overlayHand = match?.currentHand ?? match?.handHistory[match.handHistory.length - 1]
        if (!overlayHand) return null
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <FeedbackSheetV2
              isCorrect={feedbackReady.isCorrect}
              tip={feedbackReady.tip}
              actions={feedbackReady.actions}
              streets={feedbackReady.streets}
              explanation={feedbackReady.explanation}
              expanded={false}
              onToggleExpand={() => {}}
              onViewRange={() => {}}
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

      {/* AI bookmark toast */}
      {bookmarkToast && (
        <div className="px-4 py-2 rounded-full text-sm font-bold text-white pointer-events-none"
             style={{ position: 'fixed', bottom: 128, left: '50%', transform: 'translateX(-50%)', zIndex: 60, background: '#1a103a', border: '1px solid #7c3aed' }}>
          {bookmarkToast === 'new' ? '✓ 已加入賽後分析' : '已在書籤中'}
        </div>
      )}
    </div>
  )
}
