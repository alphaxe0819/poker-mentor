import React from 'react'

interface Props {
  hand: string        // e.g. "AKs", "72o", "AA"
  revealed?: boolean  // false = show card backs
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const RED_SUITS = new Set(['♥', '♦'])

function getSuits(hand: string): [string, string] {
  const isPair = hand.length === 2 && hand[0] === hand[1]
  const isSuited = hand.endsWith('s')

  if (isPair) return ['♠', '♣']
  if (isSuited) return ['♠', '♠']
  return ['♠', '♥']
}

function getCardRanks(hand: string): [string, string] {
  if (hand.length === 2 && hand[0] === hand[1]) {
    return [hand[0], hand[1]]
  }
  return [hand[0], hand[1]]
}

const SIZE_MAP = {
  sm: { width: 38, height: 52, fontSize: 14, suitSize: 10, cornerSize: 9 },
  md: { width: 56, height: 78, fontSize: 20, suitSize: 14, cornerSize: 12 },
  lg: { width: 72, height: 100, fontSize: 26, suitSize: 18, cornerSize: 14 },
  xl: { width: 60, height: 84, fontSize: 22, suitSize: 15, cornerSize: 13 },
}

interface CardProps {
  rank: string
  suit: string
  size: 'sm' | 'md' | 'lg' | 'xl'
}

const Card: React.FC<CardProps> = ({ rank, suit, size }) => {
  const s = SIZE_MAP[size]
  const isRed = RED_SUITS.has(suit)

  return (
    <div
      style={{
        width: s.width,
        height: s.height,
        background: 'white',
        borderRadius: s.width * 0.12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
        position: 'relative',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Top-left corner */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: s.cornerSize,
            fontWeight: 800,
            color: isRed ? '#dc2626' : '#1e293b',
            fontFamily: '"IBM Plex Mono", monospace',
          }}
        >
          {rank}
        </span>
        <span style={{ fontSize: s.cornerSize - 2, color: isRed ? '#dc2626' : '#1e293b' }}>
          {suit}
        </span>
      </div>

      {/* Center */}
      <span
        style={{
          fontSize: s.fontSize,
          color: isRed ? '#dc2626' : '#1e293b',
          lineHeight: 1,
        }}
      >
        {suit}
      </span>

      {/* Bottom-right corner (rotated) */}
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          right: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
          transform: 'rotate(180deg)',
        }}
      >
        <span
          style={{
            fontSize: s.cornerSize,
            fontWeight: 800,
            color: isRed ? '#dc2626' : '#1e293b',
            fontFamily: '"IBM Plex Mono", monospace',
          }}
        >
          {rank}
        </span>
        <span style={{ fontSize: s.cornerSize - 2, color: isRed ? '#dc2626' : '#1e293b' }}>
          {suit}
        </span>
      </div>
    </div>
  )
}

const CardBack: React.FC<{ size: keyof typeof SIZE_MAP }> = ({ size }) => {
  const s = SIZE_MAP[size]
  return (
    <div
      style={{
        width: s.width,
        height: s.height,
        borderRadius: s.width * 0.12,
        background: 'linear-gradient(135deg, #312e81, #4f46e5)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 4,
          borderRadius: s.width * 0.08,
          border: '2px solid rgba(255,255,255,0.2)',
          background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 8px)',
        }}
      />
      <span style={{ fontSize: s.fontSize * 0.7, zIndex: 1 }}>🂠</span>
    </div>
  )
}

const HoleCards: React.FC<Props> = ({ hand, revealed = true, size = 'md' }) => {
  const [rank1, rank2] = getCardRanks(hand)
  const [suit1, suit2] = getSuits(hand)

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {revealed ? (
        <>
          <Card rank={rank1} suit={suit1} size={size} />
          <Card rank={rank2} suit={suit2} size={size} />
        </>
      ) : (
        <>
          <CardBack size={size} />
          <CardBack size={size} />
        </>
      )}
    </div>
  )
}

export default HoleCards
