import { memo } from 'react'
import type { Card as CardType } from '../lib/hu/types'

interface Props {
  hand: string
  actualCards?: [CardType, CardType]
}

const SUITS = [
  { symbol: '♠', color: '#e5e5e5', bg: '#1a1f2e', border: '#2a3a5a' },
  { symbol: '♥', color: '#ef4444', bg: '#2e1a1a', border: '#5a2a2a' },
  { symbol: '♦', color: '#60a5fa', bg: '#1a2030', border: '#2a3a5a' },
  { symbol: '♣', color: '#4ade80', bg: '#1a2e1a', border: '#2a5a2a' },
]

const SUIT_MAP: Record<string, typeof SUITS[number]> = {
  s: SUITS[0],
  h: SUITS[1],
  d: SUITS[2],
  c: SUITS[3],
}

function parseHand(hand: string) {
  if (!hand || hand.length < 2) return { rank1: '?', rank2: '?', suited: false, pair: false }
  return {
    rank1:  hand[0],
    rank2:  hand[1],
    suited: hand.endsWith('s'),
    pair:   hand[0] === hand[1],
  }
}

// 用手牌字串做確定性的花色選擇（同一手牌永遠顯示同樣花色）
function getSuits(hand: string) {
  const { suited } = parseHand(hand)
  // 用手牌的字元碼決定基礎花色，確保一致性
  const base = (hand.charCodeAt(0) + hand.charCodeAt(1)) % 4

  if (suited) {
    // 同花：兩張用同一花色
    return [SUITS[base], SUITS[base]]
  } else {
    // 雜色：兩張用不同花色
    const suit1 = SUITS[base]
    const suit2 = SUITS[(base + 1) % 4]
    return [suit1, suit2]
  }
}

function Card({ rank, suit }: { rank: string; suit: typeof SUITS[number] }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg gap-0.5"
      style={{
        width: 54, height: 76, padding: '4px',
        background: suit.bg,
        border: `1px solid ${suit.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}
    >
      <span className="text-2xl font-black leading-none" style={{ color: suit.color }}>
        {rank}
      </span>
      <span className="text-2xl leading-none" style={{ color: suit.color }}>
        {suit.symbol}
      </span>
    </div>
  )
}

export default memo(function HoleCards({ hand, actualCards }: Props) {
  if (actualCards) {
    return (
      <div className="flex gap-2">
        <Card rank={actualCards[0].rank} suit={SUIT_MAP[actualCards[0].suit]} />
        <Card rank={actualCards[1].rank} suit={SUIT_MAP[actualCards[1].suit]} />
      </div>
    )
  }

  const { rank1, rank2 } = parseHand(hand)
  const [suit1, suit2] = getSuits(hand)

  return (
    <div className="flex gap-2">
      <Card rank={rank1} suit={suit1} />
      <Card rank={rank2} suit={suit2} />
    </div>
  )
})
