// src/components/CommunityCards.tsx
import { memo } from 'react'
import type { Card } from '../lib/hu/types'

interface Props {
  cards: Card[]  // 0, 3, 4, or 5 cards
}

const SUIT_INFO: Record<string, { symbol: string; color: string }> = {
  s: { symbol: '♠', color: '#e5e5e5' },
  h: { symbol: '♥', color: '#ef4444' },
  d: { symbol: '♦', color: '#60a5fa' },
  c: { symbol: '♣', color: '#4ade80' },
}

export default memo(function CommunityCards({ cards }: Props) {
  const slots = [0, 1, 2, 3, 4]

  return (
    <div className="flex gap-1.5 justify-center items-center">
      {slots.map(i => {
        const card = cards[i]
        if (!card) {
          return (
            <div key={i}
                 className="w-9 h-12 rounded border border-dashed"
                 style={{ borderColor: '#1a3a22', background: 'rgba(255,255,255,0.05)' }} />
          )
        }
        const info = SUIT_INFO[card.suit]
        return (
          <div key={i}
               className="w-9 h-12 rounded flex flex-col items-center justify-center font-bold"
               style={{ background: '#fafafa', border: '1px solid #ccc', color: info.color }}>
            <div className="text-sm leading-none">{card.rank}</div>
            <div className="text-base leading-none mt-0.5">{info.symbol}</div>
          </div>
        )
      })}
    </div>
  )
})
