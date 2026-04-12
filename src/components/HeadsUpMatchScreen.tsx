// src/components/HeadsUpMatchScreen.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import PokerFelt from './PokerFelt'
import HoleCards from './HoleCards'
import CommunityCards from './CommunityCards'
import PostflopActionBar, { type ActionChoice } from './PostflopActionBar'
import PreflopActionBar, { type PreflopAction } from './PreflopActionBar'
import type { MatchConfig, MatchState, Action } from '../lib/hu/types'
import { createMatch, dealNewHand, applyAction, resolveHand } from '../lib/hu/engine'
import { decideBotAction, preloadBotData } from '../lib/hu/botAI'
import { handToCanonical } from '../lib/hu/handToCanonical'
import type { Personality } from '../lib/gto/huHeuristics'
import { isPreflopViolation } from '../lib/hu/gtoCheck'

export interface GtoFlag {
  street: string
  actor: string
  pass: boolean
}
export type FlagsByHand = Record<number, GtoFlag[]>

interface Props {
  config: MatchConfig
  personality: Personality
  onMatchComplete: (finalState: MatchState, flagsByHand: FlagsByHand) => void
  onAbandon: () => void
}

export default function HeadsUpMatchScreen({
  config, personality, onMatchComplete, onAbandon,
}: Props) {
  const [match, setMatch] = useState<MatchState | null>(null)
  const [waitingForBot, setWaitingForBot] = useState(false)
  const waitingRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  /** Brief result display between hands: '+3 BB 🏆' or '-2 BB' */
  const [handResult, setHandResult] = useState<{ delta: number; won: boolean } | null>(null)
  const violationsRef = useRef(0)
  const flagsRef = useRef<FlagsByHand>({})

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

    const timer = setTimeout(() => {
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

    // Compute hand result for display
    let delta = 0
    let won = false
    if (hand.villain.hasFolded) {
      delta = hand.villain.committedBB
      won = true
    } else if (hand.hero.hasFolded) {
      delta = -hand.hero.committedBB
      won = false
    }
    // Showdown delta would need evaluateHand — skip for now, show 0
    setHandResult({ delta, won })

    // After 2.5s, resolve and move to next hand (or match end)
    const timer = setTimeout(() => {
      setHandResult(null)
      const resolved = resolveHand(match)
      if (resolved.result !== 'in_progress') {
        const cappedViolationPoints = Math.min(violationsRef.current * 2, 10)
        const withViolations: MatchState = { ...resolved, violationPoints: cappedViolationPoints }
        onMatchComplete(withViolations, flagsRef.current)
      } else {
        setMatch(dealNewHand(resolved))
      }
    }, 2500)
    return () => clearTimeout(timer)
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
  const isPlayerTurn = hand.toAct === hand.hero.position && !hand.isComplete

  // ── Action bar derived state ──
  const toCallBB = hand.currentBetBB - hand.hero.streetCommitBB
  const canFold = !hand.isComplete && toCallBB > 0
  const canCheck = !hand.isComplete && toCallBB === 0
  const canCall = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB >= toCallBB
  const canBet = !hand.isComplete && toCallBB === 0 && hand.hero.stackBB > 0
  const canRaise = !hand.isComplete && toCallBB > 0 && hand.hero.stackBB > toCallBB

  // ── Preflop raise sizing (GTO-correct fixed sizes) ──
  const preflopRaises = hand.actions.filter(a => a.street === 'preflop' && (a.kind === 'raise' || a.kind === 'bet')).length
  const preflopRaiseAmount = preflopRaises === 0 ? 2.5 : preflopRaises === 1 ? 9 : 22
  const preflopRaiseLabel = preflopRaises === 0 ? `Raise ${preflopRaiseAmount}` : preflopRaises === 1 ? `3-Bet ${preflopRaiseAmount}` : `4-Bet ${preflopRaiseAmount}`
  const isPreflop = hand.street === 'preflop'

  // ── Hidden buttons reveal logic (postflop only) ──
  const effStack = Math.min(hand.hero.stackBB, hand.villain.stackBB)
  const spr = hand.potBB > 0 ? effStack / hand.potBB : 10
  const showXS = !isPreflop && spr > 10
  const showXL = hand.street === 'river' && hand.potBB > 20

  // ── In-hand chip totals (stack already committed this hand) ──
  const heroTotalBB = hand.hero.stackBB + hand.hero.committedBB
  const villainTotalBB = hand.villain.stackBB + hand.villain.committedBB

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 text-xs text-gray-400 border-b"
           style={{ borderColor: '#1a1a1a' }}>
        <button onClick={onAbandon} className="text-base">✕</button>
        <span>HU {config.stackRatio} · 手 #{hand.handNumber}</span>
        <span>💎 {heroTotalBB} BB</span>
      </div>

      {/* Bot info */}
      <div className="text-center text-gray-300 text-xs pt-2">
        🤖 Bot · {villainTotalBB} BB · {hand.villain.position.toUpperCase()}
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col gap-3 p-3">
        <div className="flex-1 relative">
          <PokerFelt
            tableSize={2}
            heroPosition={hand.hero.position === 'btn' ? 'BTN/SB' : 'BB'}
            potTotal={hand.potBB}
            seatInfo={{
              [hand.hero.position === 'btn' ? 'SB' : 'BB']: {
                status: 'hero',
                bet: hand.hero.streetCommitBB,
                stack: hand.hero.stackBB,
              },
              [hand.villain.position === 'btn' ? 'SB' : 'BB']: {
                status: hand.villain.hasFolded ? 'folded' : 'active',
                bet: hand.villain.streetCommitBB,
                stack: hand.villain.stackBB,
              },
            }}
          />

          {/* Community cards centered over felt */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-6">
            <CommunityCards cards={hand.board} />
          </div>
        </div>

        {/* Player info + hole cards */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-gray-300 text-xs">
            你 · {heroTotalBB} BB · {hand.hero.position.toUpperCase()}
          </div>
          <HoleCards hand={handToCanonical(hand.hero.holeCards)} />
        </div>

        {/* Status indicator */}
        <div className="text-center text-xs h-4">
          {waitingForBot && <span className="text-purple-300">🤖 對手思考中...</span>}
          {!waitingForBot && isPlayerTurn && !hand.isComplete && <span className="text-green-400">輪到你決策</span>}
        </div>

        {/* Hand result overlay — shown briefly when hand ends */}
        {handResult && (
          <div className="text-center py-3 rounded-xl mx-4 mb-2 animate-pulse"
               style={{
                 background: handResult.won ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                 border: `1px solid ${handResult.won ? '#10b981' : '#ef4444'}`,
               }}>
            <div className="text-2xl mb-1">{handResult.won ? '🏆' : '💔'}</div>
            <div className="font-bold text-lg"
                 style={{ color: handResult.won ? '#10b981' : '#ef4444' }}>
              {handResult.delta >= 0 ? '+' : ''}{handResult.delta.toFixed(1)} BB
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {hand.hero.hasFolded ? '你棄牌' : hand.villain.hasFolded ? '對手棄牌' : 'Showdown'}
            </div>
          </div>
        )}
      </div>

      {/* Action bar — preflop uses fixed GTO sizes, postflop uses pot-% sizes */}
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
          showXS={showXS}
          showXL={showXL}
          onAction={handlePlayerAction}
        />
      )}
    </div>
  )
}
