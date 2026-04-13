// src/components/CommunityCards.tsx
import { memo } from 'react'
import type { Card } from '../lib/hu/types'
import { SUIT_STYLES } from './HoleCards'

interface Props {
  cards: Card[]  // 0, 3, 4, or 5 cards
}

export default memo(function CommunityCards({ cards }: Props) {
  const slots = [0, 1, 2, 3, 4]

  return (
    <div className="flex gap-1 justify-center items-center">
      {slots.map(i => {
        const card = cards[i]
        if (!card) {
          return (
            <div key={i}
                 className="rounded-md"
                 style={{
                   width: 38, height: 52,
                   border: '1.5px dashed rgba(255,255,255,0.12)',
                   background: 'rgba(255,255,255,0.03)',
                 }} />
          )
        }
        const style = SUIT_STYLES[card.suit] || SUIT_STYLES.s
        return (
          <div key={i}
               className="relative flex items-center justify-center rounded-md overflow-hidden"
               style={{
                 width: 38, height: 52,
                 background: style.bg,
                 border: `1.5px solid ${style.borderColor}`,
                 boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
               }}>
            <span className="font-black text-white leading-none" style={{ fontSize: '1.1rem' }}>
              {card.rank}
            </span>
            <span className="absolute font-bold text-white/60" style={{ top: 2, left: 3, fontSize: '0.5rem' }}>
              {style.symbol}
            </span>
          </div>
        )
      })}
    </div>
  )
})
