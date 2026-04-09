# Poker MBTI Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-question guest trial with a 10-question poker personality quiz ("撲克 MBTI") that reveals play style + skill level, with shareable result cards, and feeds personalized recommendations into the registration flow.

**Architecture:** New quiz data module (`quizQuestions.ts`) drives a `QuizScreen` component through 10 questions. Results are computed by a pure scoring function, displayed in `QuizResultScreen` with an SVG `RadarChart`, and rendered as a shareable image via `html2canvas`. Results persist in `localStorage` pre-registration and sync to Supabase `profiles` post-registration.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind (inline styles matching existing patterns), SVG for radar chart, `html2canvas` for share card, Supabase for persistence.

---

### Task 1: Install html2canvas dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install html2canvas**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npm install html2canvas
```

- [ ] **Step 2: Verify installation**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && node -e "require('html2canvas'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add package.json package-lock.json
git commit -m "chore: add html2canvas for quiz share card"
```

---

### Task 2: Create quiz data and scoring logic

**Files:**
- Create: `src/data/quizQuestions.ts`

This file contains all 10 questions, type definitions, and the pure scoring function. No UI code.

- [ ] **Step 1: Create `src/data/quizQuestions.ts`**

```typescript
// ── Types ──────────────────────────────────────────────

export interface DimensionScores {
  aggression: number
  position: number
  discipline: number
  potControl: number
  tiltResistance: number
}

export interface QuizOption {
  label: string
  /** GTO-correct answer (only for scenario questions) */
  isGTO?: boolean
  /** Dimension score adjustments when this option is chosen */
  dims: Partial<DimensionScores>
}

export interface QuizQuestion {
  /** 'scenario' = poker situation, 'preference' = opinion/tendency */
  type: 'scenario' | 'preference'
  /** Question text or scenario description */
  prompt: string
  /** Optional: cards to display (e.g. "AJo") — only for scenario questions */
  hand?: string
  /** Optional: hero position label */
  heroPos?: string
  options: QuizOption[]
}

export type StyleType = 'shark' | 'fox' | 'rock' | 'octopus'
export type LevelType = 'beginner' | 'novice' | 'intermediate' | 'advanced'

export interface QuizResult {
  style: StyleType
  level: LevelType
  dimensions: DimensionScores
  gtoCorrect: number
  completedAt: string
}

// ── Style metadata ─────────────────────────────────────

export const STYLE_META: Record<StyleType, {
  emoji: string
  name: string
  tag: string
  description: string
  tips: string[]
}> = {
  shark: {
    emoji: '🦈',
    name: '鯊魚型',
    tag: 'TAG (Tight-Aggressive)',
    description: '你是牌桌上的獵食者。選牌嚴格、出手果斷，總是在最好的時機給對手致命一擊。你的風格最接近 GTO 理論的核心思維——用紀律創造優勢，用攻擊性兌現利潤。',
    tips: [
      '繼續保持你的紀律性，這是最大的優勢',
      '可以適當增加一些詐唬頻率，讓對手更難讀你',
      '學習在有利位置適度放寬範圍',
    ],
  },
  fox: {
    emoji: '🦊',
    name: '狐狸型',
    tag: 'LAG (Loose-Aggressive)',
    description: '你是牌桌上最難對付的類型。參與度高、攻擊性強，善於在各種情境中製造壓力。你的創造力和膽識讓對手難以預測你的下一步行動。',
    tips: [
      '你的攻擊性是雙刃劍，注意在不利位置收緊範圍',
      '加強對手牌範圍的判讀，讓攻擊更精準',
      '學習適時踩煞車，不是每個底池都需要爭奪',
    ],
  },
  rock: {
    emoji: '🪨',
    name: '岩石型',
    tag: 'Rock (Tight-Passive)',
    description: '你是牌桌上的堡壘。耐心等待好機會，不輕易冒險。你的穩定性讓你很少犯大錯，但對手也容易讀透你的策略——當你下注時，大家都知道你有好牌。',
    tips: [
      '嘗試在有利位置增加攻擊頻率',
      '加入適當的詐唬，讓對手無法輕易棄牌面對你的下注',
      '學習利用位置優勢，不只依賴手牌強度',
    ],
  },
  octopus: {
    emoji: '🐙',
    name: '章魚型',
    tag: 'Calling Station (Loose-Passive)',
    description: '你是牌桌上的探險家。好奇心旺盛，喜歡看到更多的牌，享受撲克帶來的刺激感。你的存在讓牌桌更有趣，而你需要的是把這份熱情轉化為更有策略的打法。',
    tips: [
      '學習在翻前收緊手牌範圍，品質重於數量',
      '把「跟注」的習慣轉換為「加注或棄牌」的思維',
      '從位置概念開始學起，位置是免費的優勢',
    ],
  },
}

export const LEVEL_META: Record<LevelType, { label: string }> = {
  beginner:     { label: '撲克新星' },
  novice:       { label: '潛力玩家' },
  intermediate: { label: '策略好手' },
  advanced:     { label: 'GTO 思維者' },
}

// ── Questions ──────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Scenario 1: BTN RFI ──
  {
    type: 'scenario',
    prompt: '6-max 現金桌，你在 BTN，前面都棄牌。',
    hand: 'AJo',
    heroPos: 'BTN',
    options: [
      { label: '棄牌', dims: { discipline: 15, aggression: -10 } },
      { label: '跟注大盲', dims: { potControl: 10 } },
      { label: '加注 2.5BB', isGTO: true, dims: { aggression: 10, position: 10, discipline: 5 } },
      { label: '加注 5BB', dims: { aggression: 15 } },
    ],
  },
  // ── Scenario 2: BB defend vs CO raise ──
  {
    type: 'scenario',
    prompt: '6-max，你在 BB，CO 加注 3BB。',
    hand: '87s',
    heroPos: 'BB',
    options: [
      { label: '棄牌', dims: { discipline: 15 } },
      { label: '跟注', isGTO: true, dims: { potControl: 10, discipline: 5 } },
      { label: '3-Bet 到 10BB', dims: { aggression: 15 } },
      { label: '全下', dims: { aggression: 20, tiltResistance: -10 } },
    ],
  },
  // ── Scenario 3: Flop c-bet ──
  {
    type: 'scenario',
    prompt: '你在 CO 開局加注，BB 跟注。翻牌 K♠ 7♦ 2♣。',
    hand: 'AQo',
    heroPos: 'CO',
    options: [
      { label: '過牌', dims: { potControl: 15 } },
      { label: '下注 1/3 底池', isGTO: true, dims: { aggression: 5, potControl: 10 } },
      { label: '下注 3/4 底池', dims: { aggression: 10 } },
      { label: '全下', dims: { aggression: 20, tiltResistance: -5 } },
    ],
  },
  // ── Scenario 4: UTG hand selection ──
  {
    type: 'scenario',
    prompt: '6-max，你在 UTG（最早位置）。',
    hand: 'KTo',
    heroPos: 'UTG',
    options: [
      { label: '棄牌', isGTO: true, dims: { discipline: 15, position: 10 } },
      { label: '跟注（limp）', dims: { potControl: 5 } },
      { label: '加注 2.5BB', dims: { aggression: 10 } },
      { label: '加注 4BB', dims: { aggression: 15, discipline: -5 } },
    ],
  },
  // ── Scenario 5: Facing 3-bet ──
  {
    type: 'scenario',
    prompt: '你在 HJ 加注，BTN 3-Bet 到 9BB。',
    hand: 'TTs',
    heroPos: 'HJ',
    options: [
      { label: '棄牌', dims: { discipline: 10, tiltResistance: 5 } },
      { label: '跟注', isGTO: true, dims: { potControl: 10, discipline: 5 } },
      { label: '4-Bet 到 22BB', dims: { aggression: 15 } },
      { label: '全下', dims: { aggression: 20, tiltResistance: -5 } },
    ],
  },
  // ── Scenario 6: River decision ──
  {
    type: 'scenario',
    prompt: '底池 30BB，河牌出現第三張同花。對手下注 20BB，你有頂對但無同花。',
    hand: 'AKo',
    heroPos: 'BTN',
    options: [
      { label: '棄牌', isGTO: true, dims: { discipline: 15, potControl: 10 } },
      { label: '跟注', dims: { potControl: 5, tiltResistance: 5 } },
      { label: '加注到 50BB', dims: { aggression: 20, tiltResistance: -10 } },
      { label: '全下', dims: { aggression: 25, tiltResistance: -15 } },
    ],
  },
  // ── Preference 7: Hand preference ──
  {
    type: 'preference',
    prompt: '你比較喜歡拿到哪種手牌？',
    options: [
      { label: 'A♠ A♦ 一對大 Ace', dims: { discipline: 15, potControl: 5 } },
      { label: '7♠ 6♠ 同花連張', dims: { aggression: 10, position: 5 } },
      { label: 'K♠ Q♦ 大高牌', dims: { discipline: 5, potControl: 10 } },
      { label: '什麼牌都能打，看情況', dims: { aggression: 5, discipline: -10 } },
    ],
  },
  // ── Preference 8: Tilt response ──
  {
    type: 'preference',
    prompt: '連輸 5 手牌後，你通常會？',
    options: [
      { label: '收緊範圍，等好牌再出手', dims: { discipline: 15, tiltResistance: 10 } },
      { label: '維持原本策略不變', dims: { tiltResistance: 15 } },
      { label: '放寬範圍，積極找機會反擊', dims: { aggression: 15, tiltResistance: -5 } },
      { label: '可能會有點衝動，想把輸的贏回來', dims: { aggression: 10, tiltResistance: -15 } },
    ],
  },
  // ── Preference 9: Position awareness ──
  {
    type: 'preference',
    prompt: '選桌位時，你最在意什麼？',
    options: [
      { label: '我要坐在魚（弱玩家）的左邊', dims: { position: 20 } },
      { label: '離莊家位越近越好', dims: { position: 15 } },
      { label: '無所謂，牌好就會贏', dims: { position: -10, discipline: 5 } },
      { label: '我沒特別想過桌位的問題', dims: { position: -5 } },
    ],
  },
  // ── Preference 10: Pot control ──
  {
    type: 'preference',
    prompt: '拿到中等牌力（如中對子），你的策略傾向是？',
    options: [
      { label: '小注控池，盡量便宜看到攤牌', dims: { potControl: 20 } },
      { label: '看情況，對手弱就下注，強就過牌', dims: { potControl: 10, position: 10 } },
      { label: '積極下注，不讓對手免費看牌', dims: { aggression: 15 } },
      { label: '通常直接棄牌，不想冒險', dims: { discipline: 15, tiltResistance: 5 } },
    ],
  },
]

// ── Scoring ────────────────────────────────────────────

const INITIAL_SCORE = 50

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function computeQuizResult(answers: number[]): QuizResult {
  const dims: DimensionScores = {
    aggression: INITIAL_SCORE,
    position: INITIAL_SCORE,
    discipline: INITIAL_SCORE,
    potControl: INITIAL_SCORE,
    tiltResistance: INITIAL_SCORE,
  }

  let gtoCorrect = 0

  answers.forEach((chosenIdx, qIdx) => {
    const q = QUIZ_QUESTIONS[qIdx]
    const opt = q.options[chosenIdx]
    if (!opt) return

    // Accumulate dimension scores
    for (const [key, val] of Object.entries(opt.dims)) {
      dims[key as keyof DimensionScores] += val
    }

    // Count GTO correct (scenario questions only)
    if (q.type === 'scenario' && opt.isGTO) {
      gtoCorrect++
    }
  })

  // Clamp all dimensions to 0-100
  for (const key of Object.keys(dims) as (keyof DimensionScores)[]) {
    dims[key] = clamp(dims[key], 0, 100)
  }

  // Determine style: discipline >= 50 → tight, aggression >= 50 → aggressive
  const tight = dims.discipline >= 50
  const aggressive = dims.aggression >= 50
  let style: StyleType
  if (tight && aggressive) style = 'shark'
  else if (!tight && aggressive) style = 'fox'
  else if (tight && !aggressive) style = 'rock'
  else style = 'octopus'

  // Determine level from GTO correct count (out of 6 scenario questions)
  let level: LevelType
  if (gtoCorrect <= 1) level = 'beginner'
  else if (gtoCorrect <= 3) level = 'novice'
  else if (gtoCorrect <= 5) level = 'intermediate'
  else level = 'advanced'

  return {
    style,
    level,
    dimensions: dims,
    gtoCorrect,
    completedAt: new Date().toISOString(),
  }
}

/** Save quiz result to localStorage for post-registration sync */
export function saveQuizResultLocal(result: QuizResult): void {
  localStorage.setItem('poker-mbti-result', JSON.stringify(result))
}

/** Load quiz result from localStorage (returns null if not found) */
export function loadQuizResultLocal(): QuizResult | null {
  const raw = localStorage.getItem('poker-mbti-result')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

/** Clear quiz result from localStorage */
export function clearQuizResultLocal(): void {
  localStorage.removeItem('poker-mbti-result')
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit src/data/quizQuestions.ts
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/data/quizQuestions.ts
git commit -m "feat: add quiz questions data and scoring logic"
```

---

### Task 3: Create RadarChart SVG component

**Files:**
- Create: `src/components/RadarChart.tsx`

Pure SVG radar chart, no external libraries. Accepts 5 dimension scores and renders a pentagonal radar.

- [ ] **Step 1: Create `src/components/RadarChart.tsx`**

```tsx
import { memo } from 'react'
import type { DimensionScores } from '../data/quizQuestions'

interface Props {
  dimensions: DimensionScores
  /** Chart size in pixels (width & height) */
  size?: number
}

const LABELS: { key: keyof DimensionScores; label: string }[] = [
  { key: 'aggression',     label: '攻擊性' },
  { key: 'position',       label: '位置意識' },
  { key: 'discipline',     label: '手牌紀律' },
  { key: 'potControl',     label: '底池控制' },
  { key: 'tiltResistance', label: '抗壓性' },
]

/** Get (x, y) for a point on the radar at given angle and radius */
function polarToXY(cx: number, cy: number, angle: number, radius: number): [number, number] {
  // Start from top (−90°)
  const rad = ((angle - 90) * Math.PI) / 180
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
}

function RadarChart({ dimensions, size = 220 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 30 // leave room for labels
  const angleStep = 360 / LABELS.length

  // Grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]

  // Data polygon points
  const dataPoints = LABELS.map((item, i) => {
    const value = dimensions[item.key] / 100
    const angle = i * angleStep
    return polarToXY(cx, cy, angle, maxR * value)
  })
  const dataPath = dataPoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map(r => {
        const pts = LABELS.map((_, i) => polarToXY(cx, cy, i * angleStep, maxR * r))
        const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'
        return <path key={r} d={path} fill="none" stroke="#333" strokeWidth={1} />
      })}

      {/* Axis lines */}
      {LABELS.map((_, i) => {
        const [x, y] = polarToXY(cx, cy, i * angleStep, maxR)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#333" strokeWidth={1} />
      })}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(124, 58, 237, 0.25)" stroke="#7c3aed" strokeWidth={2} />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="#7c3aed" />
      ))}

      {/* Labels */}
      {LABELS.map((item, i) => {
        const [x, y] = polarToXY(cx, cy, i * angleStep, maxR + 20)
        return (
          <text key={item.key} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fill="#999" fontSize={11} fontFamily="sans-serif">
            {item.label}
          </text>
        )
      })}
    </svg>
  )
}

export default memo(RadarChart)
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit src/components/RadarChart.tsx
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/components/RadarChart.tsx
git commit -m "feat: add SVG RadarChart component for quiz results"
```

---

### Task 4: Create QuizScreen component

**Files:**
- Create: `src/components/QuizScreen.tsx`

Full-screen quiz flow. Shows progress bar, question card with optional HoleCards for scenario questions, and option buttons. Auto-advances on selection. When all 10 answered, computes result and transitions to QuizResultScreen.

- [ ] **Step 1: Create `src/components/QuizScreen.tsx`**

```tsx
import { useState, useCallback } from 'react'
import { QUIZ_QUESTIONS, computeQuizResult, saveQuizResultLocal } from '../data/quizQuestions'
import type { QuizResult } from '../data/quizQuestions'
import HoleCards from './HoleCards'
import QuizResultScreen from './QuizResultScreen'

interface Props {
  onFinish: () => void
  onRegister: () => void
}

export default function QuizScreen({ onFinish, onRegister }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [animating, setAnimating] = useState(false)

  const handleSelect = useCallback((optionIdx: number) => {
    if (animating) return
    const newAnswers = [...answers, optionIdx]
    setAnswers(newAnswers)

    if (newAnswers.length === QUIZ_QUESTIONS.length) {
      // All questions answered — compute result
      const r = computeQuizResult(newAnswers)
      saveQuizResultLocal(r)
      setAnimating(true)
      setTimeout(() => {
        setResult(r)
        setAnimating(false)
      }, 400)
    } else {
      // Advance to next question with brief animation
      setAnimating(true)
      setTimeout(() => {
        setCurrent(c => c + 1)
        setAnimating(false)
      }, 300)
    }
  }, [answers, animating])

  // Show result screen
  if (result) {
    return (
      <QuizResultScreen
        result={result}
        onRegister={onRegister}
        onBack={onFinish}
      />
    )
  }

  const q = QUIZ_QUESTIONS[current]
  const progress = ((current) / QUIZ_QUESTIONS.length) * 100

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 text-xs">撲克 MBTI 測驗</span>
          <span className="text-gray-500 text-xs">{current + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 rounded-full" style={{ background: '#222' }}>
          <div className="h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: '#7c3aed' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-6 max-w-lg mx-auto w-full"
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}>

        {/* Question type badge */}
        <div className="flex justify-center mb-4">
          <span className="text-xs px-3 py-1 rounded-full"
            style={{
              background: q.type === 'scenario' ? '#1a1a2e' : '#1a2e1a',
              color: q.type === 'scenario' ? '#a78bfa' : '#86efac',
              border: `1px solid ${q.type === 'scenario' ? '#2d2d4a' : '#2d4a2d'}`,
            }}>
            {q.type === 'scenario' ? '🃏 情境題' : '💭 偏好題'}
          </span>
        </div>

        {/* Scenario prompt */}
        <div className="text-white text-base font-medium text-center mb-4 leading-relaxed">
          {q.prompt}
        </div>

        {/* Hand display for scenario questions */}
        {q.hand && (
          <div className="flex justify-center mb-4">
            <HoleCards hand={q.hand} />
          </div>
        )}

        {q.heroPos && (
          <div className="text-center text-gray-500 text-xs mb-4">
            你的位置：<span className="text-purple-400 font-bold">{q.heroPos}</span>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-2.5 mt-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-medium text-left transition-all active:scale-[0.98]"
              style={{ background: '#111', border: '1px solid #222', color: '#ddd' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit src/components/QuizScreen.tsx
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/components/QuizScreen.tsx
git commit -m "feat: add QuizScreen component with 10-question flow"
```

---

### Task 5: Create QuizResultScreen component

**Files:**
- Create: `src/components/QuizResultScreen.tsx`

Displays: style name + emoji (hero section), description, radar chart, tips, level (subtle), share button, register CTA.

- [ ] **Step 1: Create `src/components/QuizResultScreen.tsx`**

```tsx
import { useRef, useState } from 'react'
import type { QuizResult } from '../data/quizQuestions'
import { STYLE_META, LEVEL_META } from '../data/quizQuestions'
import RadarChart from './RadarChart'

interface Props {
  result: QuizResult
  onRegister: () => void
  onBack: () => void
}

export default function QuizResultScreen({ result, onRegister, onBack }: Props) {
  const shareRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)
  const meta = STYLE_META[result.style]
  const levelMeta = LEVEL_META[result.level]

  const handleShare = async () => {
    if (!shareRef.current || sharing) return
    setSharing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      })
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png')
      )
      if (!blob) { setSharing(false); return }

      // Try native share first, fallback to download
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'poker-mbti.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `我的撲克 MBTI 是「${meta.name}」`,
          files: [new File([blob], 'poker-mbti.png', { type: 'image/png' })],
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'poker-mbti.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // User cancelled share or error — ignore
    }
    setSharing(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex-1 overflow-y-auto pb-32">
        {/* ─── Share card area (captured by html2canvas) ─── */}
        <div ref={shareRef} className="px-6 pt-8 pb-6" style={{ background: '#0a0a0a' }}>
          {/* Style hero */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{meta.emoji}</div>
            <div className="text-2xl font-black text-white mb-1">{meta.name}</div>
            <div className="text-gray-500 text-sm">{meta.tag}</div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed text-center mb-6 max-w-sm mx-auto">
            {meta.description}
          </p>

          {/* Radar chart */}
          <div className="flex justify-center mb-4">
            <RadarChart dimensions={result.dimensions} size={240} />
          </div>

          {/* App branding (for share card) */}
          <div className="text-center">
            <span className="text-xs text-gray-700">
              Poker <span style={{ color: '#7c3aed' }}>Goal</span> — 撲克 MBTI
            </span>
          </div>
        </div>

        {/* ─── Below share area (not captured) ─── */}
        <div className="px-6">
          {/* Tips */}
          <div className="mb-6">
            <div className="text-white text-sm font-bold mb-3">💡 個性化訓練建議</div>
            <div className="flex flex-col gap-2">
              {meta.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl p-3"
                  style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                  <span className="text-purple-400 text-xs mt-0.5">●</span>
                  <span className="text-gray-300 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level (subtle) */}
          <div className="rounded-xl p-4 mb-4"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="text-gray-500 text-xs mb-2">📊 詳細分析</div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">GTO 理解度</span>
              <span className="text-white text-sm font-medium">{levelMeta.label}</span>
            </div>
            <div className="w-full h-1.5 rounded-full mt-1" style={{ background: '#222' }}>
              <div className="h-1.5 rounded-full"
                style={{
                  width: `${(result.gtoCorrect / 6) * 100}%`,
                  background: '#7c3aed',
                }}
              />
            </div>
            <div className="text-gray-600 text-xs mt-1 text-right">
              {result.gtoCorrect} / 6 情境題正確
            </div>
          </div>
        </div>
      </div>

      {/* ─── Fixed bottom buttons ─── */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-3"
        style={{ background: 'linear-gradient(transparent, #0a0a0a 30%)' }}>
        <div className="max-w-lg mx-auto flex flex-col gap-2.5">
          <button onClick={handleShare} disabled={sharing}
            className="w-full py-3 rounded-full text-sm font-medium transition"
            style={{ background: '#111', border: '1px solid #333', color: '#ccc', opacity: sharing ? 0.6 : 1 }}>
            {sharing ? '產生圖片中...' : '📤 分享我的撲克 MBTI'}
          </button>
          <button onClick={onRegister}
            className="w-full py-3.5 rounded-full text-sm font-bold text-white transition"
            style={{ background: '#7c3aed' }}>
            註冊開始訓練 →
          </button>
          <button onClick={onBack}
            className="w-full py-2 text-xs transition"
            style={{ color: '#555' }}>
            返回登入
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit src/components/QuizResultScreen.tsx
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/components/QuizResultScreen.tsx
git commit -m "feat: add QuizResultScreen with radar chart, tips, and share"
```

---

### Task 6: Wire up App.tsx and AuthPage.tsx

**Files:**
- Modify: `src/pages/App.tsx`
- Modify: `src/pages/AuthPage.tsx`

Replace GuestTrainTab with QuizScreen, update AuthPage button text, add quiz result sync on registration.

- [ ] **Step 1: Update App.tsx imports and guest mode rendering**

In `src/pages/App.tsx`:

1. Replace the `GuestTrainTab` import (line 10) with:
```typescript
import QuizScreen from '../components/QuizScreen'
```

2. Replace the guest mode block (lines 174-181):
```typescript
  if (appMode === 'guest') {
    return (
      <QuizScreen
        onFinish={() => setAppMode('auth')}
        onRegister={() => setAppMode('auth')}
      />
    )
  }
```
(This is the same JSX shape — just replacing `GuestTrainTab` with `QuizScreen`.)

3. Add quiz result sync after registration. In the `onAuthStateChange` handler, after `setProfile(p)` and before `setShowLimit(false)` (around line 110), add:
```typescript
        // Sync quiz result from localStorage to profile
        if (p && session.user) {
          const { loadQuizResultLocal, clearQuizResultLocal } = await import('../data/quizQuestions')
          const quizResult = loadQuizResultLocal()
          if (quizResult) {
            await supabase.from('profiles').update({
              quiz_style: quizResult.style,
              quiz_level: quizResult.level,
              quiz_dimensions: quizResult.dimensions,
            }).eq('id', session.user.id)
            clearQuizResultLocal()
          }
        }
```

- [ ] **Step 2: Update AuthPage.tsx button text**

In `src/pages/AuthPage.tsx`, replace lines 151-159:
```tsx
        {/* 撲克 MBTI */}
        <div className="mt-6 text-center">
          <button onClick={onGuest}
            className="text-sm font-medium transition"
            style={{ color: '#7c3aed' }}>
            🧠 測測你的撲克 MBTI →
          </button>
        </div>
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/pages/App.tsx src/pages/AuthPage.tsx
git commit -m "feat: wire QuizScreen into app flow, replace GuestTrainTab"
```

---

### Task 7: Update UserProfile type and OnboardingScreen personalization

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `src/components/OnboardingScreen.tsx`

- [ ] **Step 1: Add quiz fields to UserProfile interface**

In `src/lib/auth.ts`, update the `UserProfile` interface (lines 3-12) to add the three quiz fields at the end:

```typescript
export interface UserProfile {
  id: string
  email: string
  name: string
  is_paid: boolean
  player_type: 'tournament' | 'cash'
  daily_plays_date: string | null
  daily_plays_count: number
  promo_expires_at: string | null
  quiz_style: string | null
  quiz_level: string | null
  quiz_dimensions: Record<string, number> | null
}
```

- [ ] **Step 2: Add personalized recommendation to OnboardingScreen**

In `src/components/OnboardingScreen.tsx`, update the last step (index 4, "準備好了嗎？") content function to accept a second parameter and show a recommendation.

First, update the Props interface and component to accept `quizStyle` and `quizLevel`:

```typescript
interface Props {
  userName: string
  quizStyle?: string | null
  quizLevel?: string | null
  onComplete: () => void
}
```

Then update the last step's content to show a quiz recommendation banner when quiz data exists. Replace the last STEPS entry (index 4) with:

```typescript
  {
    title: '準備好了嗎？',
    content: (_name: string, quizStyle?: string | null, quizLevel?: string | null) => {
      const RECO: Record<string, string> = {
        'rock-beginner': '推薦從「RFI 基礎」課程開始，學習在各位置主動出擊',
        'rock-novice': '推薦「位置的力量」課程，學會利用位置優勢',
        'octopus-beginner': '推薦從「RFI 基礎」課程開始，建立正確的翻前範圍',
        'octopus-novice': '推薦「面對加注」課程，學習何時該棄牌',
        'octopus-intermediate': '推薦「面對加注」課程，提升防守效率',
        'fox-beginner': '推薦從「RFI 基礎」課程開始，打好基礎再發揮創意',
        'fox-novice': '推薦「面對加注」課程，讓攻擊更有紀律',
        'fox-intermediate': '推薦直接開始訓練，用實戰磨練你的攻擊技巧',
        'shark-beginner': '推薦從「RFI 基礎」課程開始，鞏固基本功',
        'shark-novice': '推薦「位置的力量」課程，讓你的優勢更全面',
      }
      const recoKey = quizStyle && quizLevel ? `${quizStyle}-${quizLevel}` : null
      const reco = recoKey ? RECO[recoKey] : null
      const fallbackReco = quizStyle ? '推薦直接開始訓練，從實戰中持續進步' : null
      const displayReco = reco || fallbackReco

      return (
        <>
          <div className="text-xl font-bold text-white mb-3">
            開始你的 GTO 之旅！
          </div>
          {displayReco && (
            <div className="rounded-xl p-4 mb-3 text-center"
              style={{ background: '#0f1a0f', border: '1px solid #1a4a1a' }}>
              <div className="text-green-400 font-bold text-sm mb-1">🧠 根據你的撲克 MBTI</div>
              <div className="text-gray-300 text-xs">{displayReco}</div>
            </div>
          )}
          <div className="flex flex-col gap-3 mt-1">
            <div className="rounded-xl p-4 text-center"
              style={{ background: '#1a1a2e', border: '1px solid #4c1d95' }}>
              <div className="text-purple-400 font-bold text-sm mb-1">免費帳戶</div>
              <div className="text-gray-400 text-xs">每天 1 關（10 題）全隨機練習</div>
            </div>
            <div className="rounded-xl p-4 text-center"
              style={{ background: '#1a0a2e', border: '1px solid #7c3aed' }}>
              <div className="text-purple-300 font-bold text-sm mb-1">付費帳戶</div>
              <div className="text-gray-400 text-xs">無限練習 + 自選桌型/籌碼深度/題數</div>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">
            從實戰中學習，每一手都在進步
          </p>
        </>
      )
    },
  },
```

Update `OnboardingScreen` component to pass quiz data to content:

```typescript
export default function OnboardingScreen({ userName, quizStyle, quizLevel, onComplete }: Props) {
```

And update the content render call (in the JSX, where `{current.content(userName)}` is called):
```tsx
{current.content(userName, quizStyle, quizLevel)}
```

- [ ] **Step 3: Update App.tsx to pass quiz data to OnboardingScreen**

In `src/pages/App.tsx`, update the onboarding block (lines 200-210):

```typescript
  if (appMode === 'onboarding' && user) {
    return (
      <OnboardingScreen
        userName={profile?.name ?? '玩家'}
        quizStyle={profile?.quiz_style}
        quizLevel={profile?.quiz_level}
        onComplete={() => {
          syncMarkOnboardingDone(user.id)
          setAppMode('app')
        }}
      />
    )
  }
```

- [ ] **Step 4: Verify build passes**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/lib/auth.ts src/components/OnboardingScreen.tsx src/pages/App.tsx
git commit -m "feat: add quiz fields to UserProfile and personalize onboarding"
```

---

### Task 8: Create Supabase migration

**Files:**
- Create: `supabase/migrations/20260409_add_quiz_columns.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Add poker MBTI quiz result columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS quiz_style TEXT,
  ADD COLUMN IF NOT EXISTS quiz_level TEXT,
  ADD COLUMN IF NOT EXISTS quiz_dimensions JSONB;
```

- [ ] **Step 2: Show SQL in chat for easy copy**

Display the SQL above in the conversation for the user to manually run in Supabase dashboard if needed.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
mkdir -p supabase/migrations
git add supabase/migrations/20260409_add_quiz_columns.sql
git commit -m "chore: add migration for quiz result columns"
```

---

### Task 9: Delete old guest trial files

**Files:**
- Delete: `src/tabs/GuestTrainTab.tsx`
- Delete: `src/data/guestQuestions.ts`

- [ ] **Step 1: Remove old files**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
rm src/tabs/GuestTrainTab.tsx src/data/guestQuestions.ts
```

- [ ] **Step 2: Verify no remaining imports**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && grep -r "GuestTrainTab\|guestQuestions" src/ --include="*.ts" --include="*.tsx"
```

Expected: no results (the import was already changed in Task 6)

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add -A
git commit -m "chore: remove old GuestTrainTab and guestQuestions"
```

---

### Task 10: Manual testing and visual QA

- [ ] **Step 1: Start dev server**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npm run dev
```

- [ ] **Step 2: Test complete flow**

Manual checklist:
1. Open the app (not logged in) → AuthPage shows「🧠 測測你的撲克 MBTI →」
2. Click the button → QuizScreen shows with progress bar, question 1/10
3. Answer all 10 questions → each advances with animation
4. Result screen shows: emoji + style name + tag + description + radar chart
5. Scroll down → tips, GTO level bar visible
6. Click "分享" → image downloads (or native share on mobile)
7. Click "註冊開始訓練" → goes to AuthPage register mode
8. Register → Onboarding shows with personalized recommendation on last step
9. Check Supabase profiles table → quiz_style, quiz_level, quiz_dimensions populated

- [ ] **Step 3: Commit any fixes**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add -A
git commit -m "fix: visual and functional adjustments from QA"
```
