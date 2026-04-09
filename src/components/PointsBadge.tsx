import { useState, useRef, useEffect } from 'react'

interface Props {
  points: number
  onNavigateToMissions?: () => void
}

export default function PointsBadge({ points, onNavigateToMissions }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-1">
        <button onClick={() => setShowMenu(!showMenu)}
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition active:scale-90"
          style={{ background: '#7c3aed', color: '#fff' }}>
          +
        </button>
        <span className="text-yellow-400 text-xs font-medium">⭐ {points}</span>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-8 z-50 rounded-xl py-1 min-w-[140px] shadow-lg"
          style={{ background: '#1a1a1a', border: '1px solid #333' }}>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-4 py-2.5 text-left text-xs text-gray-400 transition"
            style={{ borderBottom: '1px solid #222' }}>
            💰 儲值獲得
            <span className="text-gray-600 text-[10px] ml-1">即將推出</span>
          </button>
          <button
            onClick={() => { setShowMenu(false); onNavigateToMissions?.() }}
            className="w-full px-4 py-2.5 text-left text-xs text-gray-300 transition">
            🎯 任務獲得
          </button>
        </div>
      )}
    </div>
  )
}
