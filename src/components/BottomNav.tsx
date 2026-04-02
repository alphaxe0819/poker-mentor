type Tab = 'train' | 'stats' | 'analysis' | 'profile'

interface Props {
  current: Tab
  onChange: (t: Tab) => void
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'train',    label: '練習' },
  { key: 'stats',    label: '統計' },
  { key: 'analysis', label: '分析' },
  { key: 'profile',  label: '帳號' },
]

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 py-3 text-xs ${current === t.key ? 'text-purple-400' : 'text-gray-500'}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
