// src/components/v2/HeadsUpMatchScreenV2.tsx — v2 UI (capsule felt)
import { useState, useEffect, useCallback, useRef } from 'react'
import PokerFeltV2 from './PokerFeltV2'
import FeedbackSheetV2 from './FeedbackSheetV2'
import HoleCards from '../HoleCards'
import CommunityCards from '../CommunityCards'
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

  // ── In-hand chip totals (stack already committed this hand) ──
  const heroTotalBB = hand.hero.stackBB + hand.hero.committedBB
  const villainTotalBB = hand.villain.stackBB + hand.villain.committedBB

  // ── Action bar derived state ──
  const toCallBB = hand.currentBetBB - hand.hero.streetCommitBB
  const canFold = !hand.isComplete && toCallBB > 0
  const canCheck = !hand.isComplete && toCallBB === 0
  const canCall = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB >= toCallBB
  const canBet = !hand.isComplete && toCallBB === 0 && hand.hero.stackBB > 0
  const canRaise = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB > toCallBB

  // ── Preflop raise sizing (stack-aware GTO sizes) ──
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

  // ── Action history pills ──
  const actionPills = hand.actions.map((a, i) => {
    const pos = a.actor.toUpperCase()
    let label = a.kind.charAt(0).toUpperCase() + a.kind.slice(1)
    if (a.amount !== undefined) label += ` ${a.amount}`
    if (a.kind === 'allin') label = 'Allin'
    return { key: i, pos, label, isLast: i === hand.actions.length - 1 }
  })

  const showVillainCards = hand.isComplete && !hand.hero.hasFolded && !hand.villain.hasFolded

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#0a0a0a' }}>
      {/* Top action history bar (GTO Wizard style) */}
      <div className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto"
           style={{ background: '#111', borderBottom: '1px solid #1a1a1a', minHeight: 36 }}>
        <button onClick={onAbandon} className="text-gray-500 text-sm px-1 shrink-0">✕</button>
        <div className="flex items-center gap-1 text-[10px] font-mono">
          {actionPills.length === 0 && (
            <span className="text-gray-600 px-2">手 #{hand.handNumber}</span>
          )}
          {actionPills.map(p => (
            <span key={p.key}
                  className="shrink-0 px-1.5 py-0.5 rounded text-white"
                  style={{
                    background: p.isLast ? '#2a4a3a' : '#1a1a1a',
                    border: p.isLast ? '1px solid #10b981' : '1px solid #2a2a2a',
                  }}>
              {p.pos} {p.label}
            </span>
          ))}
        </div>
        <span className="ml-auto text-gray-500 text-[10px] shrink-0 pl-2">
          {heroTotalBB} BB
        </span>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col">
        {/* Table felt area with villain cards at seat */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 relative">
          {/* Villain cards — at seat position (top-left of table) */}
          <div className="absolute flex items-center gap-1.5" style={{ top: '4%', left: '8%', zIndex: 10 }}>
            {showVillainCards ? (
              <HoleCards hand={handToCanonical(hand.villain.holeCards)} actualCards={hand.villain.holeCards} size="small" />
            ) : (
              <div className="flex gap-0.5">
                <div className="rounded" style={{ width: 32, height: 44, background: '#2a2a2e', border: '1px solid #444' }} />
                <div className="rounded" style={{ width: 32, height: 44, background: '#2a2a2e', border: '1px solid #444' }} />
              </div>
            )}
            <div className="text-[10px]">
              <div className="text-gray-400">{hand.villain.position.toUpperCase()}</div>
              <div className="text-white font-bold">{villainTotalBB} BB</div>
            </div>
            {waitingForBot && (
              <span className="text-gray-500 text-[10px] animate-pulse ml-1">...</span>
            )}
          </div>

          <PokerFeltV2
            tableSize={2}
            heroPosition={hand.hero.position === 'btn' ? 'BTN' : 'BB'}
            potTotal={hand.potBB}
            seatInfo={{
              [hand.hero.position === 'btn' ? 'BTN' : 'BB']: {
                status: 'hero',
                bet: hand.hero.streetCommitBB,
                stack: hand.hero.stackBB,
              },
              [hand.villain.position === 'btn' ? 'BTN' : 'BB']: {
                status: hand.villain.hasFolded ? 'folded' : 'active',
                bet: hand.villain.streetCommitBB,
                stack: hand.villain.stackBB,
                hasCards: !hand.villain.hasFolded,
              },
            }}
          />

          {/* Community cards — centered below table */}
          {hand.board.length > 0 && (
            <div className="mt-2">
              <CommunityCards cards={hand.board} />
            </div>
          )}
        </div>

        {/* Hero cards — centered, large, with label */}
        <div className="flex flex-col items-center gap-1 pb-2 pt-1">
          <HoleCards hand={handToCanonical(hand.hero.holeCards)} actualCards={hand.hero.holeCards} />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">{handToCanonical(hand.hero.holeCards)}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400">{hand.hero.position.toUpperCase()}</span>
            <span className="text-gray-400">·</span>
            <span className="text-white font-bold">{heroTotalBB} BB</span>
            {!waitingForBot && isPlayerTurn && !hand.isComplete && (
              <span className="text-green-400 font-bold ml-2">輪到你</span>
            )}
          </div>
        </div>

        {/* Hand result overlay */}
        {handResult && (() => {
          const bg = handResult.tie ? 'rgba(250,204,21,0.12)'
            : handResult.won ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'
          const border = handResult.tie ? '#fbbf24'
            : handResult.won ? '#10b981' : '#ef4444'
          const color = handResult.tie ? '#fbbf24'
            : handResult.won ? '#10b981' : '#ef4444'
          const emoji = handResult.tie ? '🤝' : handResult.won ? '🏆' : '💔'
          const label = hand.hero.hasFolded ? '你棄牌'
            : hand.villain.hasFolded ? '對手棄牌'
            : handResult.tie ? 'Chop' : 'Showdown'
          return (
            <div className="text-center py-3 rounded-xl mx-3 mb-2 animate-pulse"
                 style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-bold text-lg" style={{ color }}>
                {handResult.tie ? 'CHOP'
                  : `${handResult.delta >= 0 ? '+' : ''}${handResult.delta.toFixed(1)} BB`}
              </div>
              <div className="text-gray-400 text-xs mt-1">{label}</div>
            </div>
          )
        })()}
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
        <div className="fixed bottom-24 right-4 z-40">
          <button
            onClick={() => {
              clearCountdown()
              setFeedbackOpen(true)
              setFeedbackCountdown(0)
            }}
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
        // Use currentHand if available, else last completed hand
        const overlayHand = match?.currentHand ?? match?.handHistory[match.handHistory.length - 1]
        if (!overlayHand) return null

        return (
          <div className="fixed inset-0 z-50">
            <FeedbackSheetV2
              isCorrect={feedbackReady.isCorrect}
              tip={feedbackReady.tip}
              actions={feedbackReady.actions}
              streets={feedbackReady.streets}
              explanation={feedbackReady.explanation}
              expanded={false}
              onToggleExpand={() => {}}
              onViewRange={() => {
                // HU 範圍資料建構中 — noop for now
              }}
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
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full text-sm font-bold text-white pointer-events-none"
             style={{ background: '#1a103a', border: '1px solid #7c3aed' }}>
          {bookmarkToast === 'new' ? '✓ 已加入賽後分析' : '已在書籤中'}
        </div>
      )}
    </div>
  )
}
