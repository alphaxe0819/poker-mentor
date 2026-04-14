// src/components/HeadsUpReviewScreen.tsx
import { useState } from 'react'
import type { MatchState, HandState } from '../lib/hu/types'
import { handToCanonical } from '../lib/hu/handToCanonical'
import { formatCard } from '../lib/hu/cards'
import type { FlagsByHand } from './HeadsUpMatchScreen'

interface Props {
  match: MatchState
  userTier: 'free' | 'basic' | 'pro'
  gtoFlagsByHand: FlagsByHand
  /** Returns the analysis text for hand at index. Implementation must charge points. */
  onAnalyzeHand: (handIndex: number) => Promise<string>
  onBack: () => void
}

export default function HeadsUpReviewScreen({
  match, userTier, gtoFlagsByHand, onAnalyzeHand, onBack,
}: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [analyses, setAnalyses] = useState<Record<number, string>>({})
  const [analyzing, setAnalyzing] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isPaid = userTier !== 'free'
  const won = match.result === 'player_won'
  const startStack = Math.floor(match.config.totalStackBB / 2)
  const totalDelta = match.playerStackBB - startStack

  async function handleAnalyze(idx: number) {
    setAnalyzing(idx)
    setError(null)
    try {
      const text = await onAnalyzeHand(idx)
      setAnalyses(prev => ({ ...prev, [idx]: text }))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '分析失敗')
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center p-3 text-sm text-gray-400 border-b"
           style={{ borderColor: '#1a1a1a' }}>
        <button onClick={onBack} className="text-base">✕</button>
        <span className="flex-1 text-center">賽事報告</span>
      </div>

      {/* Summary card */}
      <div className="m-3 p-4 rounded-2xl"
           style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-center mb-3">
          <div className="text-3xl mb-1">{won ? '🏆' : '💔'}</div>
          <div className="font-bold text-lg" style={{ color: won ? '#10b981' : '#ef4444' }}>
            {won ? '勝利' : '失敗'} {totalDelta >= 0 ? '+' : ''}{totalDelta} BB
          </div>
          <div className="text-gray-500 text-xs mt-1">HU 對決 · {match.config.stackRatio}</div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="text-center">
            <div className="text-gray-500 text-xs">手數</div>
            <div className="text-white font-bold text-lg">{match.handHistory.length}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">違規</div>
            <div className="font-bold text-lg"
                 style={{ color: match.violationPoints > 0 ? '#fbbf24' : '#fff' }}>
              {match.violationPoints}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">分析點</div>
            <div className="text-red-400 font-bold text-lg">-{match.analysisPointsSpent}</div>
          </div>
        </div>
      </div>

      {/* Hand list */}
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>所有手牌</span>
          <span style={{ color: '#ef4444' }}>🔴 = GTO 違規</span>
        </div>

        {match.handHistory.map((hand, idx) => {
          const handFlags = gtoFlagsByHand[hand.handNumber] ?? []
          const isFlagged = handFlags.some(f => !f.pass)
          const heroDelta = computeHeroDelta(hand)
          const isExpanded = expanded === idx
          return (
            <div key={idx}>
              <div
                onClick={() => setExpanded(isExpanded ? null : idx)}
                className="my-1 p-3 rounded-lg cursor-pointer flex items-center gap-2 text-xs"
                style={{
                  background: '#111',
                  border: '1px solid #1a1a1a',
                  borderLeft: `3px solid ${
                    isFlagged ? '#ef4444'
                    : heroDelta > 0 ? '#10b981'
                    : '#1a1a1a'
                  }`,
                }}
              >
                <span className="text-gray-500 font-bold w-6">#{hand.handNumber}</span>
                <span className="text-white font-bold">{handToCanonical(hand.hero.holeCards)}</span>
                <span className="text-gray-500">{hand.hero.position.toUpperCase()}</span>
                <span className="ml-auto" style={{ color: heroDelta >= 0 ? '#10b981' : '#ef4444' }}>
                  {heroDelta >= 0 ? '+' : ''}{heroDelta.toFixed(1)} BB
                </span>
              </div>

              {isExpanded && (
                <div className="ml-3 mb-3 p-3 rounded-lg text-xs"
                     style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
                  <div className="text-gray-400 mb-1">底牌</div>
                  <div className="text-white mb-2">
                    {hand.hero.holeCards.map(formatCard).join(' ')}
                    {!hand.hero.hasFolded && !hand.villain.hasFolded && (
                      <> vs {hand.villain.holeCards.map(formatCard).join(' ')}</>
                    )}
                  </div>
                  {hand.board.length > 0 && (
                    <>
                      <div className="text-gray-400 mb-1">公共牌</div>
                      <div className="text-white mb-2">{hand.board.map(formatCard).join(' ')}</div>
                    </>
                  )}
                  <div className="text-gray-400 mb-1">動作序列</div>
                  <div className="text-white mb-3 text-[10px] font-mono break-all">
                    {hand.actions.map(a =>
                      `${a.actor}:${a.kind}${a.amount !== undefined ? `(${a.amount})` : ''}`
                    ).join(' → ')}
                  </div>

                  {analyses[idx] ? (
                    <div className="mt-3 p-2 rounded" style={{ background: '#1a1a2e' }}>
                      <div className="text-purple-300 text-[10px] mb-1">AI 分析</div>
                      <div className="text-white text-[11px] whitespace-pre-wrap">{analyses[idx]}</div>
                    </div>
                  ) : isPaid ? (
                    <button onClick={() => handleAnalyze(idx)}
                            disabled={analyzing === idx}
                            className="mt-2 px-3 py-1.5 rounded text-[11px] font-bold text-white"
                            style={{ background: '#7c3aed', opacity: analyzing === idx ? 0.5 : 1 }}>
                      {analyzing === idx ? '分析中...' : 'AI 分析（免費體驗）'}
                    </button>
                  ) : (
                    <div className="text-gray-500 text-[10px] mt-2">
                      升級 Basic / PRO 解鎖 AI 深度分析
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {error && (
          <div className="m-2 p-2 rounded text-xs text-red-400" style={{ background: '#2a0f0f' }}>
            {error}
          </div>
        )}
      </div>

      <button onClick={onBack}
              className="m-3 py-3 rounded-full font-bold text-white text-sm"
              style={{ background: '#7c3aed' }}>
        回主選單
      </button>
    </div>
  )
}

/**
 * Approximate hero delta for a hand based on fold vs showdown.
 * v1.0 uses in-memory match state directly (no DB roundtrip) so we compute
 * from commitments. Fold: loser loses their committed chips. Showdown (neither
 * folded): we don't re-evaluate here — v1.0 just returns 0 for showdown and
 * relies on the match-level stack delta for summary accuracy.
 * Future v1.1 can store hero_stack_before/after on the HandState for precise
 * per-hand delta.
 */
function computeHeroDelta(hand: HandState): number {
  if (hand.hero.hasFolded) return -hand.hero.committedBB
  if (hand.villain.hasFolded) return hand.villain.committedBB
  return 0  // showdown — v1.1 should compute from stored deltas
}
