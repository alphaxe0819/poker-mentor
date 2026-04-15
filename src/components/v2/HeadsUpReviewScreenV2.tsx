import { useState, useEffect } from 'react'
import type { MatchState, HandState } from '../../lib/hu/types'
import type { FlagsByHand } from './HeadsUpMatchScreenV2'
import { handToCanonical } from '../../lib/hu/handToCanonical'
import HoleCards from '../HoleCards'
import CommunityCards from '../CommunityCards'

interface Props {
  match: MatchState
  userTier: 'free' | 'basic' | 'pro'
  gtoFlagsByHand: FlagsByHand
  aiBookmarks: number[]
  onAnalyzeHand: (handIndex: number) => Promise<string>
  onBack: () => void
}

/** Sync hero win detection — fold-based only */
function quickHeroWon(hand: HandState): boolean | null {
  if (hand.villain.hasFolded) return true
  if (hand.hero.hasFolded) return false
  return null  // showdown — needs async eval
}

export default function HeadsUpReviewScreenV2({
  match, userTier, gtoFlagsByHand, aiBookmarks, onAnalyzeHand, onBack,
}: Props) {
  const isPaid = userTier !== 'free'
  const won = match.result === 'player_won'
  const startStack = Math.floor(match.config.totalStackBB / 2)
  const totalDelta = match.playerStackBB - startStack
  const violationCount = Object.values(gtoFlagsByHand)
    .flat()
    .filter(f => !f.pass).length

  // Task 6 state
  const [analyses, setAnalyses] = useState<Record<number, string>>({})
  const [analyzing, setAnalyzing] = useState<number | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  async function handleAnalyze(handNum: number) {
    if (analyzing !== null) return
    const idx = match.handHistory.findIndex(h => h.handNumber === handNum)
    if (idx === -1) return
    setAnalyzing(handNum)
    setAnalyzeError(null)
    try {
      const text = await onAnalyzeHand(idx)
      setAnalyses(prev => ({ ...prev, [handNum]: text }))
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : '分析失敗')
    } finally {
      setAnalyzing(null)
    }
  }

  // Task 7 state
  const [heroWonArr, setHeroWonArr] = useState<(boolean | null)[]>(
    match.handHistory.map(quickHeroWon)
  )
  const [expandedHand, setExpandedHand] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const hands = match.handHistory
    const initial = hands.map(quickHeroWon)
    setHeroWonArr(initial)

    async function resolveShowdowns() {
      const { evaluateHand, compareHands } = await import('../../lib/hu/handEvaluator')
      if (cancelled) return
      const updated = hands.map((hand, i) => {
        if (initial[i] !== null) return initial[i]
        const board = hand.board
        if (board.length < 5) return null
        try {
          const heroBest = evaluateHand([...hand.hero.holeCards, ...board])
          const villainBest = evaluateHand([...hand.villain.holeCards, ...board])
          const cmp = compareHands(heroBest, villainBest)
          return cmp > 0 ? true : cmp < 0 ? false : null
        } catch {
          return null
        }
      })
      setHeroWonArr(updated)
    }
    resolveShowdowns()
    return () => { cancelled = true }
  }, [match.handHistory])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
           style={{ borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={onBack} className="text-gray-400 text-base">✕</button>
        <span className="text-sm text-gray-400 font-medium">賽事報告</span>
        <div style={{ width: 24 }} />
      </div>

      {/* Result Banner */}
      <div className="mx-3 mt-3 rounded-2xl p-4"
           style={{
             background: '#111',
             border: `1px solid ${won ? '#1e5a3d' : '#5a1a1a'}`,
             borderLeft: `4px solid ${won ? '#10b981' : '#ef4444'}`,
           }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{won ? '🏆' : '💔'}</div>
          <div>
            <div className="text-xl font-extrabold" style={{ color: won ? '#10b981' : '#ef4444' }}>
              {totalDelta >= 0 ? '+' : ''}{totalDelta} BB {won ? '勝利' : '失敗'}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              HU 對決 · {match.config.stackRatio}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="text-center">
            <div className="text-xs text-gray-500">手數</div>
            <div className="text-white font-bold text-lg">{match.handHistory.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">違規</div>
            <div className="font-bold text-lg"
                 style={{ color: violationCount > 0 ? '#fbbf24' : '#fff' }}>
              {violationCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">AI 書籤</div>
            <div className="font-bold text-lg" style={{ color: aiBookmarks.length > 0 ? '#a78bfa' : '#fff' }}>
              {aiBookmarks.length} 🤖
            </div>
          </div>
        </div>
      </div>

      {/* AI Bookmarks section (Task 6) */}
      {aiBookmarks.length > 0 && (
        <div className="mt-4">
          <div className="px-4 mb-2 flex items-center gap-2">
            <span className="text-sm font-bold text-white">🤖 賽後 AI 分析</span>
            <span className="text-xs text-gray-500">（{aiBookmarks.length} 手）</span>
          </div>
          <div className="flex gap-2 px-3 overflow-x-auto pb-2">
            {aiBookmarks.map(handNum => {
              const hand = match.handHistory.find(h => h.handNumber === handNum)
              if (!hand) return null
              const canonical = handToCanonical(hand.hero.holeCards)
              const analysis = analyses[handNum]
              const isAnalyzing = analyzing === handNum

              return (
                <div key={handNum}
                     className="flex-shrink-0 rounded-xl p-3 flex flex-col gap-2"
                     style={{ width: 200, background: '#111', border: '1px solid #2a1a4a' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-bold">手 #{handNum}</span>
                    <span className="text-xs text-gray-400">{canonical}</span>
                  </div>
                  {analysis ? (
                    <div className="text-[11px] leading-relaxed" style={{ color: '#c8ccd4' }}>
                      {analysis.slice(0, 160)}{analysis.length > 160 ? '...' : ''}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAnalyze(handNum)}
                      disabled={!isPaid || isAnalyzing}
                      className="w-full py-1.5 rounded-lg text-xs font-bold"
                      style={{
                        background: isPaid ? '#7c3aed' : '#222',
                        color: isPaid ? '#fff' : '#666',
                        opacity: isAnalyzing ? 0.6 : 1,
                      }}>
                      {isAnalyzing ? '分析中...' : isPaid ? '分析 3點' : '升級解鎖'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {analyzeError && (
            <p className="px-4 text-xs text-red-400 mt-1">{analyzeError}</p>
          )}
        </div>
      )}

      {/* Hands list (Task 7) */}
      <div className="mt-4 pb-20">
        <div className="px-4 mb-2">
          <span className="text-sm font-bold text-white">全部手牌</span>
        </div>

        <div className="flex flex-col gap-1 px-3">
          {match.handHistory.map((hand, idx) => {
            const heroWon = heroWonArr[idx]
            const hasViolation = (gtoFlagsByHand[hand.handNumber] ?? []).some(f => !f.pass)
            const hasBookmark = aiBookmarks.includes(hand.handNumber)
            const isExpanded = expandedHand === hand.handNumber
            const analysis = analyses[hand.handNumber]

            const barColor = hasViolation ? '#fbbf24'
              : heroWon === true  ? '#10b981'
              : heroWon === false ? '#6b7280'
              : '#4b5563'

            const canonical = handToCanonical(hand.hero.holeCards)

            return (
              <div key={hand.handNumber}
                   className="rounded-xl overflow-hidden"
                   style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                {/* List row */}
                <button
                  className="w-full flex items-center gap-2 p-3 text-left"
                  onClick={() => setExpandedHand(isExpanded ? null : hand.handNumber)}>
                  {/* Left color bar */}
                  <div className="self-stretch rounded-sm shrink-0" style={{ width: 4, background: barColor }} />

                  <HoleCards
                    hand={canonical}
                    actualCards={hand.hero.holeCards}
                    size="small"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 text-[11px]">手 #{hand.handNumber}</span>
                      <span className="text-gray-400 text-[11px]">{canonical}</span>
                      {hasBookmark && <span className="text-[10px]">🤖</span>}
                      {hasViolation && <span className="text-[10px] text-yellow-400">⚠</span>}
                    </div>
                    {hand.board.length > 0 && (
                      <div className="mt-0.5">
                        <CommunityCards cards={hand.board} />
                      </div>
                    )}
                  </div>

                  <div className="text-xs font-bold shrink-0"
                       style={{ color: heroWon === true ? '#10b981' : heroWon === false ? '#6b7280' : '#4b5563' }}>
                    {heroWon === true ? '贏' : heroWon === false ? '輸' : hand.board.length >= 5 ? 'SD' : '—'}
                  </div>

                  <span className="text-gray-600 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expanded area */}
                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: '#1a1a1a' }}>
                    {/* Action sequence */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hand.actions.map((a, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded"
                              style={{
                                background: a.actor === hand.hero.position ? '#1a1040' : '#1a1a1a',
                                color: a.actor === hand.hero.position ? '#a78bfa' : '#6b7280',
                                border: `1px solid ${a.actor === hand.hero.position ? '#342056' : '#2a2a2a'}`,
                              }}>
                          {a.actor.toUpperCase()} {a.kind}{a.amount !== undefined ? ` ${a.amount}` : ''}
                        </span>
                      ))}
                    </div>

                    {/* Street chips — all pending */}
                    <div className="flex gap-1.5 mb-3">
                      {(['preflop', 'flop', 'turn', 'river'] as const).map(street => (
                        <div key={street}
                             className="flex-1 rounded-[7px] flex flex-col items-center gap-[1px] py-1.5"
                             style={{ background: '#0c0e12', border: '1px solid #1f232b', opacity: 0.4 }}>
                          <div className="text-[10px] font-bold text-white">
                            {{ preflop: '翻前', flop: '翻牌', turn: '轉牌', river: '河牌' }[street]}
                          </div>
                          <div className="text-[9px] font-bold" style={{ color: '#565d6a' }}>—</div>
                        </div>
                      ))}
                    </div>

                    {/* AI analysis / bookmark button */}
                    {hasBookmark && (
                      analysis ? (
                        <div className="text-[11px] leading-relaxed rounded-lg p-2.5"
                             style={{ background: '#0c0e12', border: '1px solid #1f232b', color: '#c8ccd4' }}>
                          {analysis}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAnalyze(hand.handNumber)}
                          disabled={!isPaid || analyzing === hand.handNumber}
                          className="w-full py-2 rounded-lg text-xs font-bold"
                          style={{
                            background: isPaid ? '#7c3aed' : '#222',
                            color: isPaid ? '#fff' : '#666',
                            opacity: analyzing === hand.handNumber ? 0.6 : 1,
                          }}>
                          {analyzing === hand.handNumber ? '分析中...' : isPaid ? '🤖 AI 分析此手 · 3點' : '升級解鎖 AI 分析'}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
