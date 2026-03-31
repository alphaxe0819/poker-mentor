interface Props {
  highlightHand?: string
}

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']

function handKey(r1: string, r2: string): string {
  const i1 = RANKS.indexOf(r1)
  const i2 = RANKS.indexOf(r2)
  if (i1 === i2) return r1 + r2
  if (i1 < i2)   return r1 + r2 + 's'
  return r2 + r1 + 'o'
}

export default function RangeGrid({ highlightHand }: Props) {
  return (
    <div className="w-full">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 1.5 }}>
        {RANKS.map((r1, i) =>
          RANKS.map((r2, j) => {
            const key      = handKey(r1, r2)
            const isPair   = i === j
            const isSuited = i < j
            const isHero   = key === highlightHand

            let bg      = '#2a2a2a'
            let textClr = '#666'
            if (isPair)   { bg = '#1a3a1a'; textClr = '#4ade80' }
            if (isSuited) { bg = '#1a2a3a'; textClr = '#60a5fa' }
            if (isHero)   { bg = '#5b21b6'; textClr = '#fff'    }

            return (
              <div
                key={key}
                title={key}
                style={{
                  aspectRatio: '1',
                  background: bg,
                  border: isHero ? '1.5px solid #a78bfa' : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isHero ? '0 0 8px rgba(167,139,250,0.7)' : 'none',
                }}
              >
                <span style={{ fontSize: 7, color: textClr, fontWeight: isHero ? 700 : 400, lineHeight: 1 }}>
                  {key}
                </span>
              </div>
            )
          })
        )}
      </div>

      <div className="flex gap-3 mt-2 justify-center">
        {[
          { bg: '#1a3a1a', color: '#4ade80', label: '對子' },
          { bg: '#1a2a3a', color: '#60a5fa', label: '同花' },
          { bg: '#2a2a2a', color: '#666',    label: '異花' },
          { bg: '#5b21b6', color: '#fff',    label: '當前手牌' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: item.bg }} />
            <span style={{ fontSize: 10, color: item.color }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
