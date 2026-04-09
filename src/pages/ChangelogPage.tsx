import { type ReactNode } from 'react'
import changelogRaw from '../../CHANGELOG.md?raw'

export default function ChangelogPage() {
  const lines = changelogRaw.split('\n')
  const elements: ReactNode[] = []

  lines.forEach((line, i) => {
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl font-black text-white mb-6">{line.slice(2)}</h1>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-white mt-8 mb-3 pb-2"
          style={{ borderBottom: '1px solid #222' }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-purple-400 mt-4 mb-2">{line.slice(4)}</h3>
      )
    } else if (line.startsWith('- ')) {
      const text = line.slice(2)
      elements.push(
        <div key={i} className="flex items-start gap-2 mb-1.5 pl-2">
          <span className="text-purple-400 text-xs mt-1">●</span>
          <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
        </div>
      )
    } else if (line.trim() !== '') {
      elements.push(
        <p key={i} className="text-gray-400 text-sm mb-2">{line}</p>
      )
    }
  })

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="max-w-lg mx-auto px-6 py-8">
        <button onClick={() => window.location.href = '/'}
          className="text-gray-500 text-xs mb-6 transition hover:text-gray-300">
          ← 返回 Poker Goal
        </button>
        {elements}
        <div className="mt-12 pt-4 text-center" style={{ borderTop: '1px solid #1a1a1a' }}>
          <span className="text-gray-700 text-xs">
            Poker <span style={{ color: '#7c3aed' }}>Goal</span> — 更新紀錄
          </span>
        </div>
      </div>
    </div>
  )
}
