import React from 'react'
import type { TabId } from '../types'

interface TabDef {
  id: TabId
  label: string
  icon: string
  coachOnly?: boolean
}

const TABS: TabDef[] = [
  { id: 'train',   label: '練習',  icon: '🃏' },
  { id: 'coaches', label: '選教練', icon: '🎓' },
  { id: 'quiz',    label: '測驗',  icon: '📝' },
  { id: 'stats',   label: '統計',  icon: '📊' },
  { id: 'profile', label: '帳號',  icon: '👤' },
  { id: 'editor',  label: '編輯',  icon: '✏️', coachOnly: true },
]

interface Props {
  activeTab: TabId
  isCoach: boolean
  onChange: (tab: TabId) => void
}

const BottomNav: React.FC<Props> = ({ activeTab, isCoach, onChange }) => {
  const visible = TABS.filter(t => !t.coachOnly || isCoach)

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 50,
        background: 'rgba(13,13,20,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 8,
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        // total height ~60px + safe area
      }}
    >
      {visible.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '4px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: 52,
              position: 'relative',
            }}
          >
            {/* Active indicator dot */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: -1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 2,
                  borderRadius: 2,
                  background: 'var(--primary)',
                }}
              />
            )}
            <span
              style={{
                fontSize: 22,
                lineHeight: 1,
                filter: isActive ? 'none' : 'grayscale(0.7) opacity(0.45)',
                transition: 'filter 0.15s',
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'color 0.15s',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.01em',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav
