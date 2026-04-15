import { memo } from 'react'
import type { Card as CardType } from '../lib/hu/types'

interface Props {
  hand: string
  actualCards?: [CardType, CardType]
  /** Smaller card size for compact displays */
  size?: 'normal' | 'small'
}

// GTO Wizard style: suit determines the ENTIRE card background color
const SUIT_STYLES: Record<string, { bg: string; borderColor: string; symbol: string }> = {
  s: { bg: '#3a3d44', borderColor: '#555860', symbol: '♠' },  // spade = grey
  h: { bg: '#8b2232', borderColor: '#b02e42', symbol: '♥' },  // heart = red
  d: { bg: '#1e5faa', borderColor: '#2a78d4', symbol: '♦' },  // diamond = blue
  c: { bg: '#1a7a3a', borderColor: '#22994a', symbol: '♣' },  // club = green
}

function parseHand(hand: string) {
  if (!hand || hand.length < 2) return { rank1: '?', rank2: '?', suited: false, pair: false }
  return {
    rank1: hand[0],
    rank2: hand[1],
    suited: hand.endsWith('s'),
    pair: hand[0] === hand[1],
  }
}

function getSuitKeys(hand: string): [string, string] {
  const { suited } = parseHand(hand)
  const base = (hand.charCodeAt(0) + hand.charCodeAt(1)) % 4
  const keys = ['s', 'h', 'd', 'c']
  if (suited) return [keys[base], keys[base]]
  return [keys[base], keys[(base + 1) % 4]]
}

// V2 card style: rank top-center (large) + single suit bottom-center
function PokerCard({ rank, suitKey, size = 'normal' }: { rank: string; suitKey: string; size?: 'normal' | 'small' }) {
  const style = SUIT_STYLES[suitKey] || SUIT_STYLES.s
  const w = size === 'small' ? 40 : 56
  const h = size === 'small' ? 56 : 78
  const rankSize = size === 'small' ? '1.5rem' : '2.1rem'
  const suitSize = size === 'small' ? '0.8rem' : '1.05rem'
  const py = size === 'small' ? 5 : 7

  return (
    <div
      className="flex flex-col items-center justify-between rounded-lg overflow-hidden"
      style={{
        width: w, height: h,
        paddingTop: py, paddingBottom: py,
        background: style.bg,
        border: `1.5px solid ${style.borderColor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      <span className="font-black leading-none text-white" style={{ fontSize: rankSize }}>
        {rank}
      </span>
      <span className="font-bold leading-none" style={{ fontSize: suitSize, color: 'rgba(255,255,255,0.85)' }}>
        {style.symbol}
      </span>
    </div>
  )
}

export default memo(function HoleCards({ hand, actualCards, size = 'normal' }: Props) {
  if (actualCards) {
    return (
      <div className="flex gap-1.5">
        <PokerCard rank={actualCards[0].rank} suitKey={actualCards[0].suit} size={size} />
        <PokerCard rank={actualCards[1].rank} suitKey={actualCards[1].suit} size={size} />
      </div>
    )
  }

  const { rank1, rank2 } = parseHand(hand)
  const [suit1, suit2] = getSuitKeys(hand)

  return (
    <div className="flex gap-1.5">
      <PokerCard rank={rank1} suitKey={suit1} size={size} />
      <PokerCard rank={rank2} suitKey={suit2} size={size} />
    </div>
  )
})

// Export for reuse in CommunityCards
export { PokerCard, SUIT_STYLES }
