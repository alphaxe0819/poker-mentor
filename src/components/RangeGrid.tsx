
interface Props {
  highlightHand?: string
  gtoRange?: Record<string, string>
  onClose: () => void
}

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']

function handKey(r1: string, r2: string): string {
  const i1 = RANKS.indexOf(r1)
  const i2 = RANKS.indexOf(r2)
  if (i1 === i2) return r1 + r2
  if (i1 < i2)   return r1 + r2 + 's'
  return r2 + r1 + 'o'
}

function getActionStyle(action: string | undefined): { bg: string; text: string } {
  if (!action) return { bg: '#1e1e1e', text: '#555' }
  if (action === 'r' || action === '3b' || action === '4b' || action === 'allin')
    return { bg: '#7f1d1d', text: '#fca5a5' }   // 紅：加注
  if (action === 'c')
    return { bg: '#14532d', text: '#86efac' }    // 綠：跟注
  if (action.startsWith('mr:') && !action.includes('_'))
    return { bg: '#713f12', text: '#fde68a' }    // 黃：混合 raise
  if (action.includes('_3b') || action.includes('_4b'))
    return { bg: '#713f12', text: '#fde68a' }    // 黃：混合 3b/4b
  return { bg: '#1e1e1e', text: '#555' }         // 深灰：棄牌
}

export default function RangeGrid({ highlightHand, gtoRange, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4"
        style={{ background: '#111', border: '1px solid #222' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-white text-sm font-bold">完整範圍 13×13</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg px-2">✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 1.5 }}>
          {RANKS.map((r1, _i) =>
            RANKS.map((r2, _j) => {
              const key    = handKey(r1, r2)
              const isHero = key === highlightHand
              const action = gtoRange?.[key]
              const { bg, text } = getActionStyle(action)

              return (
                <div
                  key={key}
                  title={`${key}${action ? ': ' + action : ': fold'}`}
                  style={{
                    aspectRatio: '1',
                    background: bg,
                    // 當前手牌：只加紫色外框，不覆蓋底色
                    border: isHero
                      ? '2px solid #a78bfa'
                      : '1px solid rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isHero ? '0 0 6px rgba(167,139,250,0.7)' : 'none',
                    outline: isHero ? '1px solid #7c3aed' : 'none',
                  }}
                >
                  <span style={{
                    fontSize: 7,
                    color: isHero ? '#e9d5ff' : text,
                    fontWeight: isHero ? 700 : 400,
                    lineHeight: 1,
                  }}>
                    {key}
                  </span>
                </div>
              )
            })
          )}
        </div>

        <div className="flex gap-3 mt-3 justify-center flex-wrap">
          {[
            { bg: '#7f1d1d', color: '#fca5a5', label: '加注' },
            { bg: '#14532d', color: '#86efac', label: '跟注' },
            { bg: '#713f12', color: '#fde68a', label: '混合' },
            { bg: '#1e1e1e', color: '#555',    label: '棄牌' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: item.bg }} />
              <span style={{ fontSize: 10, color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
