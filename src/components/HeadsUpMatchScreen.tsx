// src/components/HeadsUpMatchScreen.tsx
import { useState, useEffect, useCallback } from 'react'
import PokerFelt from './PokerFelt'
import HoleCards from './HoleCards'
import CommunityCards from './CommunityCards'
import PostflopActionBar, { type ActionChoice } from './PostflopActionBar'
import type { MatchConfig, MatchState, Action } from '../lib/hu/types'
import { createMatch, dealNewHand, applyAction, resolveHand } from '../lib/hu/engine'
import { decideBotAction, preloadBotData } from '../lib/hu/botAI'
import { handToCanonical } from '../lib/hu/handToCanonical'
import type { Personality } from '../lib/gto/huHeuristics'

interface Props {
  config: MatchConfig
  personality: Personality
  onMatchComplete: (finalState: MatchState) => void
  onAbandon: () => void
}

export default function HeadsUpMatchScreen({
  config, personality, onMatchComplete, onAbandon,
}: Props) {
  const [match, setMatch] = useState<MatchState | null>(null)
  const [waitingForBot, setWaitingForBot] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Init match on mount ──
  useEffect(() => {
    preloadBotData().catch(() => { /* non-fatal */ })
    const initial = dealNewHand(createMatch(config))
    setMatch(initial)
  }, [config])

  // ── Bot turn handler ──
  useEffect(() => {
    if (!match?.currentHand) return
    if (match.currentHand.isComplete) return
    const isBotTurn = match.currentHand.toAct !== match.currentHand.hero.position
    if (!isBotTurn) return
    if (waitingForBot) return

    setWaitingForBot(true)
    const timer = setTimeout(() => {
      try {
        const botAction = decideBotAction(match.currentHand!, config, personality)
        const updated = applyAction(match, botAction)
        setMatch(updated)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(`Bot error: ${msg}`)
      } finally {
        setWaitingForBot(false)
      }
    }, 1000)  // 1s decision delay per spec
    return () => clearTimeout(timer)
  }, [match, waitingForBot, config, personality])

  // ── Hand complete → resolve and deal next ──
  useEffect(() => {
    if (!match?.currentHand?.isComplete) return
    const timer = setTimeout(() => {
      const resolved = resolveHand(match)
      if (resolved.result !== 'in_progress') {
        onMatchComplete(resolved)
      } else {
        setMatch(dealNewHand(resolved))
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [match, onMatchComplete])

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

  // ── Hidden buttons reveal logic ──
  const effStack = Math.min(hand.hero.stackBB, hand.villain.stackBB)
  const spr = hand.potBB > 0 ? effStack / hand.potBB : 10
  const showXS = spr > 10
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
          {!waitingForBot && hand.isComplete && <span className="text-gray-500">結算中...</span>}
          {!waitingForBot && isPlayerTurn && !hand.isComplete && <span className="text-green-400">輪到你決策</span>}
        </div>
      </div>

      {/* Action bar */}
      {isPlayerTurn && (
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
