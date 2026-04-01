
interface PositionAction {
  position: string
  stack: number
  action: 'fold' | 'raise' | 'call' | 'allin' | 'limp' | 'hero'
  amount?: number
}

interface Props {
  actions: PositionAction[]
}

const ACTION_LABEL: Record<string, string> = {
  fold:   'Fold',
  raise:  'Raise',
  call:   'Call',
  allin:  'All-in',
  limp:   'Call',
  hero:   '採取行動',
  posted: '盲注',
}

const ACTION_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  fold:   { bg: '#1a1a1a', text: '#555',    border: '#2a2a2a' },
  raise:  { bg: '#2a0a0a', text: '#f87171', border: '#7f1d1d' },
  call:   { bg: '#0a1a0a', text: '#86efac', border: '#14532d' },
  allin:  { bg: '#3a0a0a', text: '#fca5a5', border: '#991b1b' },
  limp:   { bg: '#0a1a2a', text: '#60a5fa', border: '#1e3a5f' },
  hero:   { bg: '#1a0a3a', text: '#c084fc', border: '#7c3aed' },
  posted: { bg: '#111',    text: '#444',    border: '#222'    },
}

export default function ActionHistory({ actions }: Props) {
  if (actions.length === 0) return null

  return (
    <div
      className="flex gap-1.5 pb-1 scrollbar-none"
      style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      ref={el => { if (el) setTimeout(() => { el.scrollLeft = el.scrollWidth }, 50) }}
    >
      {actions.map((item, i) => {
        const style = ACTION_STYLE[item.action] ?? ACTION_STYLE.fold
        return (
          <div
            key={i}
            className="flex-shrink-0 flex flex-col items-center px-2 py-1.5 rounded-lg"
            style={{ background: style.bg, border: `1px solid ${style.border}`, minWidth: 52 }}
          >
            <span className="text-[9px] text-gray-500 leading-none">{item.position}</span>
            <span className="text-[9px] text-gray-600 leading-none mt-0.5">{item.stack}</span>
            <span className="text-[10px] font-bold leading-none mt-1" style={{ color: style.text }}>
              {ACTION_LABEL[item.action]}
              {item.amount ? ` ${item.amount}` : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
