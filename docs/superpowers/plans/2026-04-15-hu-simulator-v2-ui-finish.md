# HU 模擬器 V2 UI 收尾 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 V2 HU 比賽畫面加入手牌間回饋 sheet（含 AI 書籤），並建立全新 V2 賽後 review 畫面。

**Architecture:** 方案 A（改動集中在現有檔案）。`HeadsUpMatchScreenV2` 加入 feedback/countdown/bookmark 狀態；新建 `HeadsUpReviewScreenV2`；`App.tsx` 加入 `huAIBookmarks` 並根據 `UI_V2` flag 切換 review 畫面。GTO 計算全部延後（所有街別顯示 `pending`）。

**Tech Stack:** React 19, TypeScript 5.9, Vite, Vitest, Tailwind CSS（inline styles 為主，與現有 V2 元件一致）

---

## File Map

| 動作 | 檔案 |
|---|---|
| Modify | `src/components/v2/HeadsUpMatchScreenV2.tsx` |
| Create | `src/components/v2/HeadsUpReviewScreenV2.tsx` |
| Modify | `src/pages/App.tsx` |
| Create (test) | `src/__tests__/hu/computeHandFeedback.test.ts` |

---

## Task 1：`computeHandFeedback` 純函式 + 測試

**Files:**
- Modify: `src/components/v2/HeadsUpMatchScreenV2.tsx` （在 imports 之後，`export default` 之前加入）
- Create: `src/__tests__/hu/computeHandFeedback.test.ts`

### 背景

這個函式把一個已結束的 `HandState` 轉成 `FeedbackSheetV2` 所需的 props 資料。目前所有街別 GTO 都是 `pending`；函式本身純粹、可測試。

- [ ] **Step 1：在 `HeadsUpMatchScreenV2.tsx` 的 import 區塊後、`export default` 前加入函式定義**

找到 `HeadsUpMatchScreenV2.tsx` 第 21 行附近（`export interface GtoFlag {` 之後），在 `export default function HeadsUpMatchScreenV2` 之前插入：

```ts
// ── Hand feedback data ────────────────────────────────────────────

export interface HUHandFeedback {
  tip: string
  actions: import('../v2/../FeedbackSheetV2').ActionFreq[]  // re-exported type
  streets: import('../v2/../FeedbackSheetV2').StreetScore[]
  isCorrect: boolean
  explanation: string
}

/** 把已結束的 HandState 轉成 FeedbackSheetV2 所需資料（v1：全街 pending）*/
export function computeHandFeedback(hand: import('../../lib/hu/types').HandState): HUHandFeedback {
  const { handToCanonical } = require('../../lib/hu/handToCanonical') as typeof import('../../lib/hu/handToCanonical')
  const canonical = handToCanonical(hand.hero.holeCards)
  const pos = hand.hero.position.toUpperCase()

  // 找出 hero 在翻前的第一個動作
  const preflopAction = hand.actions.find(a => a.street === 'preflop' && a.actor === hand.hero.position)
  let actionLabel = '未行動'
  if (preflopAction) {
    switch (preflopAction.kind) {
      case 'fold':  actionLabel = 'Fold'; break
      case 'check': actionLabel = 'Check'; break
      case 'call':  actionLabel = `Call ${preflopAction.amount ?? ''}`; break
      case 'bet':   actionLabel = `Bet ${preflopAction.amount ?? ''}`; break
      case 'raise': actionLabel = `Raise ${preflopAction.amount ?? ''}`; break
      case 'allin': actionLabel = 'All-in'; break
    }
  }

  const streets: import('../v2/../FeedbackSheetV2').StreetScore[] = [
    { street: 'preflop', state: 'pending' },
    { street: 'flop',    state: 'pending' },
    { street: 'turn',    state: 'pending' },
    { street: 'river',   state: 'pending' },
  ]

  return {
    tip: `${canonical} · ${pos}`,
    actions: [{ label: actionLabel, freq: 100, color: '#7c3aed', isYours: true }],
    streets,
    isCorrect: true,
    explanation: '街別 GTO 評分建構中，未來版本將顯示詳細頻率資料。',
  }
}
```

> **注意**：`require` 在 ESM+TypeScript 環境下需改用靜態 import。實際寫法：把 `handToCanonical` 加進現有的 import 區（該檔案頂部已有 `import { handToCanonical } from '../../lib/hu/handToCanonical'`），函式內直接呼叫即可。

**實際正確寫法**（`computeHandFeedback` 不用 require，直接用頂部 import 的 `handToCanonical`）：

```ts
import { handToCanonical } from '../../lib/hu/handToCanonical'
// （頂部 import 已存在，不需重複加）

export function computeHandFeedback(hand: HandState): HUHandFeedback {
  const canonical = handToCanonical(hand.hero.holeCards)
  const pos = hand.hero.position.toUpperCase()

  const preflopAction = hand.actions.find(
    a => a.street === 'preflop' && a.actor === hand.hero.position
  )
  let actionLabel = '未行動'
  if (preflopAction) {
    switch (preflopAction.kind) {
      case 'fold':  actionLabel = 'Fold'; break
      case 'check': actionLabel = 'Check'; break
      case 'call':  actionLabel = `Call ${preflopAction.amount ?? ''}`; break
      case 'bet':   actionLabel = `Bet ${preflopAction.amount ?? ''}`; break
      case 'raise': actionLabel = `Raise ${preflopAction.amount ?? ''}`; break
      case 'allin': actionLabel = 'All-in'; break
    }
  }

  return {
    tip: `${canonical} · ${pos}`,
    actions: [{ label: actionLabel, freq: 100, color: '#7c3aed', isYours: true }],
    streets: [
      { street: 'preflop', state: 'pending' },
      { street: 'flop',    state: 'pending' },
      { street: 'turn',    state: 'pending' },
      { street: 'river',   state: 'pending' },
    ],
    isCorrect: true,
    explanation: '街別 GTO 評分建構中，未來版本將顯示詳細頻率資料。',
  }
}
```

- [ ] **Step 2：寫測試檔 `src/__tests__/hu/computeHandFeedback.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { computeHandFeedback } from '../../components/v2/HeadsUpMatchScreenV2'
import type { HandState } from '../../lib/hu/types'

const makeHand = (overrides: Partial<HandState> = {}): HandState => ({
  handNumber: 1,
  street: 'preflop',
  board: [],
  potBB: 2,
  toAct: 'btn',
  currentBetBB: 1,
  minRaiseBB: 2,
  actions: [],
  isComplete: true,
  hero: {
    position: 'btn',
    stackBB: 39,
    holeCards: [{ rank: 'A', suit: 's' }, { rank: 'K', suit: 'h' }],
    committedBB: 1,
    streetCommitBB: 0.5,
    isAllIn: false,
    hasFolded: false,
  },
  villain: {
    position: 'bb',
    stackBB: 39,
    holeCards: [{ rank: '2', suit: 'c' }, { rank: '7', suit: 'd' }],
    committedBB: 1,
    streetCommitBB: 1,
    isAllIn: false,
    hasFolded: false,
  },
  ...overrides,
})

describe('computeHandFeedback', () => {
  it('tip contains canonical hand + position', () => {
    const hand = makeHand()
    const fb = computeHandFeedback(hand)
    expect(fb.tip).toBe('AKs · BTN')
  })

  it('all 4 streets are pending', () => {
    const fb = computeHandFeedback(makeHand())
    expect(fb.streets).toHaveLength(4)
    fb.streets.forEach(s => expect(s.state).toBe('pending'))
  })

  it('isCorrect is always true', () => {
    expect(computeHandFeedback(makeHand()).isCorrect).toBe(true)
  })

  it('shows preflop action label when present', () => {
    const hand = makeHand({
      actions: [{ kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' }],
    })
    const fb = computeHandFeedback(hand)
    expect(fb.actions[0].label).toBe('Raise 2.5')
  })

  it('shows 未行動 when no preflop action', () => {
    const fb = computeHandFeedback(makeHand({ actions: [] }))
    expect(fb.actions[0].label).toBe('未行動')
  })

  it('actions has exactly one item at 100%', () => {
    const fb = computeHandFeedback(makeHand())
    expect(fb.actions).toHaveLength(1)
    expect(fb.actions[0].freq).toBe(100)
    expect(fb.actions[0].isYours).toBe(true)
  })
})
```

- [ ] **Step 3：執行測試確認通過**

```bash
npx vitest run src/__tests__/hu/computeHandFeedback.test.ts
```

預期：6 tests pass

- [ ] **Step 4：Commit**

```bash
git add src/components/v2/HeadsUpMatchScreenV2.tsx src/__tests__/hu/computeHandFeedback.test.ts
git commit -m "feat(hu-v2): add computeHandFeedback utility + tests"
```

---

## Task 2：HeadsUpMatchScreenV2 — 倒數機制 + 回饋按鈕

**Files:**
- Modify: `src/components/v2/HeadsUpMatchScreenV2.tsx`

### 背景

修改 `isComplete` 的 `useEffect`：把原本的 `setTimeout 2500ms` 換成 10 秒倒數。倒數結束 → 換手。用戶點「👁 回饋」→ 暫停倒數 + 開啟 sheet（Task 3 處理）。

- [ ] **Step 1：加入新狀態宣告**

在 `HeadsUpMatchScreenV2` function body 的 state 宣告區（`const [match, setMatch]` 附近），加入：

```ts
const [feedbackReady, setFeedbackReady] = useState<HUHandFeedback | null>(null)
const [feedbackOpen, setFeedbackOpen] = useState(false)
const [feedbackCountdown, setFeedbackCountdown] = useState(0)
const [aiBookmarkedHands, setAIBookmarkedHands] = useState<number[]>([])
const [bookmarkToast, setBookmarkToast] = useState(false)
const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

/** 清除 countdown interval（防止 memory leak）*/
function clearCountdown() {
  if (countdownIntervalRef.current !== null) {
    clearInterval(countdownIntervalRef.current)
    countdownIntervalRef.current = null
  }
}

/** 呼叫換手或結束比賽（替代原 setTimeout 的邏輯）*/
function dealNextHand() {
  clearCountdown()
  setFeedbackReady(null)
  setFeedbackOpen(false)
  setFeedbackCountdown(0)
  const res = resolvedRef.current
  if (!res) return
  resolvedRef.current = null
  if (res.result !== 'in_progress') {
    const cappedViolationPoints = 0
    const withViolations: MatchState = { ...res, violationPoints: cappedViolationPoints }
    onMatchComplete(withViolations, flagsRef.current, aiBookmarkedHands)
  } else {
    setHandResult(null)
    setMatch(dealNewHand(res))
  }
}
```

- [ ] **Step 2：修改 `isComplete` useEffect，換掉 setTimeout**

找到現有的 `useEffect` block（約第 106–138 行，依賴 `match?.currentHand?.isComplete`），**完整替換**為：

```ts
useEffect(() => {
  if (!match?.currentHand?.isComplete) return
  const hand = match.currentHand

  try {
    const resolved = resolveHand(match)
    resolvedRef.current = resolved
    const delta = resolved.playerStackBB - match.playerStackBB
    const won = delta > 0
    const tie = delta === 0 && !hand.hero.hasFolded && !hand.villain.hasFolded
    setHandResult({ delta, won, tie })
  } catch (e) {
    console.error('[HeadsUpMatch] resolveHand failed:', e)
    setHandResult({ delta: 0, won: false, tie: true })
    resolvedRef.current = resolveHandSafe(match)
  }

  // 計算 feedback 資料（v1 全 pending）
  setFeedbackReady(computeHandFeedback(hand))
  setFeedbackOpen(false)

  // 啟動 10 秒倒數
  clearCountdown()
  let remaining = 10
  setFeedbackCountdown(remaining)
  countdownIntervalRef.current = setInterval(() => {
    remaining -= 1
    setFeedbackCountdown(remaining)
    if (remaining <= 0) {
      dealNextHand()
    }
  }, 1000)

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [match?.currentHand?.isComplete, match?.currentHand?.handNumber])
```

> **注意**：`dealNextHand` 在 closure 內使用 `aiBookmarkedHands`。因為 `aiBookmarkedHands` 是 state，需用 ref 同步。在 state 宣告區加一行：
> ```ts
> const aiBookmarkedHandsRef = useRef<number[]>([])
> // 在 aiBookmarkedHands 後面立即加：
> aiBookmarkedHandsRef.current = aiBookmarkedHands
> ```
> 並在 `dealNextHand` 裡把 `aiBookmarkedHands` 改為 `aiBookmarkedHandsRef.current`。

- [ ] **Step 3：在 JSX 底部加入「👁 回饋」浮動按鈕**

找到 return 的最外層 `<div>` 結尾（`</div>` 收尾），在最後一個 `{isPlayerTurn && !isPreflop && ...}` 之後，`</div>` 之前插入：

```tsx
{/* Feedback 浮動按鈕（手牌結束後顯示，倒數期間可見） */}
{feedbackReady && !feedbackOpen && (
  <div className="fixed bottom-24 right-4 z-40">
    <button
      onClick={() => {
        clearCountdown()
        setFeedbackOpen(true)
        setFeedbackCountdown(0)
      }}
      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold text-white shadow-lg"
      style={{ background: '#7c3aed', border: '1px solid #9d5bff' }}>
      👁 回饋
      {feedbackCountdown > 0 && (
        <span className="text-xs font-mono opacity-70">·{feedbackCountdown}</span>
      )}
    </button>
  </div>
)}
```

- [ ] **Step 4：TypeScript 編譯確認**

```bash
npx tsc -b --noEmit
```

預期：零錯誤。若有 `aiBookmarkedHands` closure 問題，按 Step 2 的 Note 加 ref。

- [ ] **Step 5：Commit**

```bash
git add src/components/v2/HeadsUpMatchScreenV2.tsx
git commit -m "feat(hu-v2): add feedback countdown + floating feedback button"
```

---

## Task 3：HeadsUpMatchScreenV2 — FeedbackSheetV2 Overlay + AI 書籤

**Files:**
- Modify: `src/components/v2/HeadsUpMatchScreenV2.tsx`

- [ ] **Step 1：在 Props interface 加第三參數**

找到：
```ts
interface Props {
  config: MatchConfig
  personality: Personality
  onMatchComplete: (finalState: MatchState, flagsByHand: FlagsByHand) => void
  onAbandon: () => void
}
```

改為：
```ts
interface Props {
  config: MatchConfig
  personality: Personality
  onMatchComplete: (
    finalState: MatchState,
    flagsByHand: FlagsByHand,
    aiBookmarks: number[]
  ) => void
  onAbandon: () => void
}
```

- [ ] **Step 2：在 JSX 最外層 div 加入 FeedbackSheetV2 overlay**

找到最外層 `<div className="min-h-screen flex flex-col" ...>`，把 `className` 加上 `relative`：

```tsx
<div className="min-h-screen flex flex-col relative" style={{ background: '#0a0a0a' }}>
```

然後在浮動按鈕 block 之後（`</div>` 收尾之前）加入：

```tsx
{/* FeedbackSheetV2 overlay（固定全螢幕，覆蓋整個畫面）*/}
{feedbackOpen && feedbackReady && (() => {
  const hand = match.currentHand ?? match.handHistory[match.handHistory.length - 1]
  return (
    <div className="fixed inset-0 z-50">
      <FeedbackSheetV2
        isCorrect={feedbackReady.isCorrect}
        tip={feedbackReady.tip}
        actions={feedbackReady.actions}
        streets={feedbackReady.streets}
        explanation={feedbackReady.explanation}
        expanded={false}
        onToggleExpand={() => {}}
        onViewRange={() => {
          // TODO: HU 範圍資料建構中，先 noop
        }}
        onNext={() => dealNextHand()}
        onAskAI={() => {
          if (!hand) return
          const handNum = hand.handNumber
          if (!aiBookmarkedHandsRef.current.includes(handNum)) {
            const updated = [...aiBookmarkedHandsRef.current, handNum]
            setAIBookmarkedHands(updated)
            aiBookmarkedHandsRef.current = updated
            setBookmarkToast(true)
            setTimeout(() => setBookmarkToast(false), 1500)
          } else {
            setBookmarkToast(true)
            setTimeout(() => setBookmarkToast(false), 1500)
          }
        }}
      />
    </div>
  )
})()}

{/* AI 書籤 toast */}
{bookmarkToast && (
  <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full text-sm font-bold text-white"
       style={{ background: '#1a103a', border: '1px solid #7c3aed' }}>
    {aiBookmarkedHandsRef.current.includes(
      (match.currentHand ?? match.handHistory[match.handHistory.length - 1])?.handNumber ?? -1
    ) ? '✓ 已加入賽後分析' : '已在書籤中'}
  </div>
)}
```

> **import FeedbackSheetV2**：在檔案頂部加入（若尚未存在）：
> ```ts
> import FeedbackSheetV2 from './FeedbackSheetV2'
> ```

- [ ] **Step 3：TypeScript 編譯確認**

```bash
npx tsc -b --noEmit
```

預期：零錯誤。

- [ ] **Step 4：本地確認功能**

```bash
npm run dev
```

開啟 http://localhost:5173，進 HU 對決，打一手牌結束後確認：
1. 右下角出現「👁 回饋 ·10」按鈕
2. 按鈕倒數到 0 後自動換手
3. 點擊按鈕後開啟 FeedbackSheetV2（4 個街別全顯示 `—`）
4. 展開 sheet 後出現 AI 教練 CTA，點擊後出現 toast
5. 「▶▶ 下一手」→ 繼續下一手

- [ ] **Step 5：Commit**

```bash
git add src/components/v2/HeadsUpMatchScreenV2.tsx
git commit -m "feat(hu-v2): wire FeedbackSheetV2 overlay + AI bookmark system"
```

---

## Task 4：App.tsx — aiBookmarks 資料流

**Files:**
- Modify: `src/pages/App.tsx`

- [ ] **Step 1：加入 `huAIBookmarks` state**

找到 App.tsx 中的 state 宣告區（`const [huFlagsByHand, ...` 附近），加入：

```ts
const [huAIBookmarks, setHuAIBookmarks] = useState<number[]>([])
```

- [ ] **Step 2：更新 `handleHuMatchComplete` 接收第三參數**

找到：
```ts
const handleHuMatchComplete = useCallback(async (finalState: MatchState, flagsByHand: FlagsByHand) => {
```

改為：
```ts
const handleHuMatchComplete = useCallback(async (
  finalState: MatchState,
  flagsByHand: FlagsByHand,
  aiBookmarks: number[] = []
) => {
```

在函式最後 `setAppMode('hu-review')` 之前加：
```ts
setHuAIBookmarks(aiBookmarks)
```

- [ ] **Step 3：`onBack` 清空 `huAIBookmarks`**

找到 `hu-review` block 中的 `onBack` callback：
```ts
onBack={() => {
  setAppMode('app')
  setHuConfig(null)
  setHuFinalMatch(null)
  setHuSessionId(null)
  setHuFlagsByHand({})
}}
```

加入一行：
```ts
setHuAIBookmarks([])
```

- [ ] **Step 4：TypeScript 編譯確認**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 5：Commit**

```bash
git add src/pages/App.tsx
git commit -m "feat(hu-v2): add huAIBookmarks state + data flow in App.tsx"
```

---

## Task 5：HeadsUpReviewScreenV2 — 檔案骨架 + 結果 Banner

**Files:**
- Create: `src/components/v2/HeadsUpReviewScreenV2.tsx`

- [ ] **Step 1：建立檔案，加入 Props 介面與結果 Banner**

```tsx
// src/components/v2/HeadsUpReviewScreenV2.tsx
import { useState, useEffect } from 'react'
import type { MatchState, HandState } from '../../lib/hu/types'
import type { FlagsByHand } from './HeadsUpMatchScreenV2'

interface Props {
  match: MatchState
  userTier: 'free' | 'basic' | 'pro'
  gtoFlagsByHand: FlagsByHand
  aiBookmarks: number[]
  onAnalyzeHand: (handIndex: number) => Promise<string>
  onBack: () => void
}

/** 計算 hero 是否赢得該手（同步，only fold info）*/
function quickHeroWon(hand: HandState): boolean | null {
  if (hand.villain.hasFolded) return true
  if (hand.hero.hasFolded) return false
  return null  // showdown，需非同步評估
}

export default function HeadsUpReviewScreenV2({
  match, userTier, gtoFlagsByHand, aiBookmarks, onAnalyzeHand, onBack,
}: Props) {
  const isPaid = userTier !== 'free'
  const won = match.result === 'player_won'
  const startStack = Math.floor(match.config.totalStackBB / 2)
  const totalDelta = match.playerStackBB - startStack
  const violationCount = Object.values(gtoFlagsByHand)
    .flat()
    .filter(f => !f.pass).length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
           style={{ borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={onBack} className="text-gray-400 text-base">✕</button>
        <span className="text-sm text-gray-400 font-medium">賽事報告</span>
        <div style={{ width: 24 }} />
      </div>

      {/* Result Banner */}
      <div className="mx-3 mt-3 rounded-2xl p-4"
           style={{
             background: '#111',
             border: `1px solid ${won ? '#1e5a3d' : '#5a1a1a'}`,
             borderLeft: `4px solid ${won ? '#10b981' : '#ef4444'}`,
           }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{won ? '🏆' : '💔'}</div>
          <div>
            <div className="text-xl font-extrabold" style={{ color: won ? '#10b981' : '#ef4444' }}>
              {totalDelta >= 0 ? '+' : ''}{totalDelta} BB {won ? '勝利' : '失敗'}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              HU 對決 · {match.config.stackRatio}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="text-center">
            <div className="text-xs text-gray-500">手數</div>
            <div className="text-white font-bold text-lg">{match.handHistory.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">違規</div>
            <div className="font-bold text-lg"
                 style={{ color: violationCount > 0 ? '#fbbf24' : '#fff' }}>
              {violationCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">AI 書籤</div>
            <div className="font-bold text-lg" style={{ color: aiBookmarks.length > 0 ? '#a78bfa' : '#fff' }}>
              {aiBookmarks.length} 🤖
            </div>
          </div>
        </div>
      </div>

      {/* 其他 section 待 Task 6/7 加入 */}
      <div className="flex-1" />
    </div>
  )
}
```

- [ ] **Step 2：TypeScript 編譯確認**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 3：Commit**

```bash
git add src/components/v2/HeadsUpReviewScreenV2.tsx
git commit -m "feat(hu-v2): HeadsUpReviewScreenV2 skeleton + result banner"
```

---

## Task 6：HeadsUpReviewScreenV2 — AI 書籤區

**Files:**
- Modify: `src/components/v2/HeadsUpReviewScreenV2.tsx`

- [ ] **Step 1：加入 AI 書籤 state 與分析邏輯**

在 `export default function HeadsUpReviewScreenV2` 的 state 宣告區加入：

```ts
const [analyses, setAnalyses] = useState<Record<number, string>>({})
const [analyzing, setAnalyzing] = useState<number | null>(null)
const [analyzeError, setAnalyzeError] = useState<string | null>(null)

async function handleAnalyze(handNum: number) {
  // handNum 是 hand.handNumber（1-based）
  // onAnalyzeHand 接收的是 handHistory index（0-based）
  const idx = match.handHistory.findIndex(h => h.handNumber === handNum)
  if (idx === -1) return
  setAnalyzing(handNum)
  setAnalyzeError(null)
  try {
    const text = await onAnalyzeHand(idx)
    setAnalyses(prev => ({ ...prev, [handNum]: text }))
  } catch (e) {
    setAnalyzeError(e instanceof Error ? e.message : '分析失敗')
  } finally {
    setAnalyzing(null)
  }
}
```

- [ ] **Step 2：在 Result Banner 之後、`{/* 其他 section */}` 之前插入 AI 書籤區**

找到 `{/* 其他 section 待 Task 6/7 加入 */}` 這行，**替換**為：

```tsx
{/* AI 書籤區 */}
{aiBookmarks.length > 0 && (
  <div className="mt-4">
    <div className="px-4 mb-2 flex items-center gap-2">
      <span className="text-sm font-bold text-white">🤖 賽後 AI 分析</span>
      <span className="text-xs text-gray-500">（{aiBookmarks.length} 手）</span>
    </div>
    <div className="flex gap-2 px-3 overflow-x-auto pb-2">
      {aiBookmarks.map(handNum => {
        const hand = match.handHistory.find(h => h.handNumber === handNum)
        if (!hand) return null
        const { handToCanonical } = require('../../lib/hu/handToCanonical') as any
        // 改用靜態 import（見 Note）
        const canonical = handToCanonical(hand.hero.holeCards)
        const analysis = analyses[handNum]
        const isAnalyzing = analyzing === handNum

        return (
          <div key={handNum}
               className="flex-shrink-0 rounded-xl p-3 flex flex-col gap-2"
               style={{ width: 200, background: '#111', border: '1px solid #2a1a4a' }}>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">手 #{handNum}</span>
              <span className="text-xs text-gray-400">{canonical}</span>
            </div>
            {analysis ? (
              <div className="text-[11px] leading-relaxed" style={{ color: '#c8ccd4' }}>
                {analysis.slice(0, 160)}{analysis.length > 160 ? '...' : ''}
              </div>
            ) : (
              <button
                onClick={() => handleAnalyze(handNum)}
                disabled={!isPaid || isAnalyzing}
                className="w-full py-1.5 rounded-lg text-xs font-bold"
                style={{
                  background: isPaid ? '#7c3aed' : '#222',
                  color: isPaid ? '#fff' : '#666',
                  opacity: isAnalyzing ? 0.6 : 1,
                }}>
                {isAnalyzing ? '分析中...' : isPaid ? '分析 3點' : '升級解鎖'}
              </button>
            )}
          </div>
        )
      })}
    </div>
    {analyzeError && (
      <p className="px-4 text-xs text-red-400 mt-1">{analyzeError}</p>
    )}
  </div>
)}

{/* 其他 section 待 Task 7 加入 */}
<div className="flex-1" />
```

> **Note about require**：改用靜態 import。在檔案頂部加入：
> ```ts
> import { handToCanonical } from '../../lib/hu/handToCanonical'
> ```
> 並把 JSX 裡的 require 呼叫改為直接呼叫 `handToCanonical(...)`。

- [ ] **Step 3：TypeScript 編譯確認**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 4：Commit**

```bash
git add src/components/v2/HeadsUpReviewScreenV2.tsx
git commit -m "feat(hu-v2): HeadsUpReviewScreenV2 AI bookmarks section"
```

---

## Task 7：HeadsUpReviewScreenV2 — 全部手牌列表

**Files:**
- Modify: `src/components/v2/HeadsUpReviewScreenV2.tsx`

- [ ] **Step 1：加入 HoleCards / CommunityCards import**

在檔案頂部 import 區加入：
```ts
import HoleCards from '../HoleCards'
import CommunityCards from '../CommunityCards'
import { handToCanonical } from '../../lib/hu/handToCanonical'
import { formatCard } from '../../lib/hu/cards'
```

- [ ] **Step 2：加入 heroWon 計算 state 和 useEffect**

在 state 宣告區加入：

```ts
const [heroWonArr, setHeroWonArr] = useState<(boolean | null)[]>(
  match.handHistory.map(quickHeroWon)
)
const [expandedHand, setExpandedHand] = useState<number | null>(null)

// 非同步補齊 showdown 手的勝負
useEffect(() => {
  const hands = match.handHistory
  const initial = hands.map(quickHeroWon)
  setHeroWonArr(initial)

  async function resolveShowdowns() {
    const { evaluateHand, compareHands } = await import('../../lib/hu/handEvaluator')
    const updated = hands.map((hand, i) => {
      if (initial[i] !== null) return initial[i]
      // Showdown
      const board = hand.board
      if (board.length < 5) return null
      try {
        const heroBest = evaluateHand([...hand.hero.holeCards, ...board])
        const villainBest = evaluateHand([...hand.villain.holeCards, ...board])
        return compareHands(heroBest, villainBest) > 0
      } catch {
        return null
      }
    })
    setHeroWonArr(updated)
  }
  resolveShowdowns()
}, [match.handHistory])
```

- [ ] **Step 3：加入手牌列表 JSX**

找到 `{/* 其他 section 待 Task 7 加入 */}` 並**替換**為：

```tsx
{/* 全部手牌列表 */}
<div className="mt-4 pb-20">
  <div className="px-4 mb-2">
    <span className="text-sm font-bold text-white">全部手牌</span>
  </div>

  <div className="flex flex-col gap-1 px-3">
    {match.handHistory.map((hand, idx) => {
      const heroWon = heroWonArr[idx]
      const hasViolation = (gtoFlagsByHand[hand.handNumber] ?? []).some(f => !f.pass)
      const hasBookmark = aiBookmarks.includes(hand.handNumber)
      const isExpanded = expandedHand === hand.handNumber
      const analysis = analyses[hand.handNumber]

      // 左色帶顏色
      const barColor = hasViolation ? '#fbbf24'
        : heroWon === true  ? '#10b981'
        : heroWon === false ? '#6b7280'
        : '#4b5563'  // showdown 未計算

      const canonical = handToCanonical(hand.hero.holeCards)

      return (
        <div key={hand.handNumber}
             className="rounded-xl overflow-hidden"
             style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          {/* 列表行 */}
          <button
            className="w-full flex items-center gap-2 p-3 text-left"
            onClick={() => setExpandedHand(isExpanded ? null : hand.handNumber)}>
            {/* 左側色帶 */}
            <div className="self-stretch rounded-sm shrink-0" style={{ width: 4, background: barColor }} />

            {/* 手牌 */}
            <HoleCards
              hand={canonical}
              actualCards={hand.hero.holeCards}
              size="small"
            />

            {/* 資訊 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-[11px]">手 #{hand.handNumber}</span>
                <span className="text-gray-400 text-[11px]">{canonical}</span>
                {hasBookmark && <span className="text-[10px]">🤖</span>}
                {hasViolation && <span className="text-[10px] text-yellow-400">⚠</span>}
              </div>
              {/* 公共牌縮圖 */}
              {hand.board.length > 0 && (
                <div className="mt-0.5">
                  <CommunityCards cards={hand.board} />
                </div>
              )}
            </div>

            {/* 勝負指示 */}
            <div className="text-xs font-bold shrink-0"
                 style={{ color: heroWon === true ? '#10b981' : heroWon === false ? '#6b7280' : '#4b5563' }}>
              {heroWon === true ? '贏' : heroWon === false ? '輸' : hand.board.length >= 5 ? 'SD' : '—'}
            </div>

            <span className="text-gray-600 text-xs">{isExpanded ? '▲' : '▼'}</span>
          </button>

          {/* 展開區 */}
          {isExpanded && (
            <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: '#1a1a1a' }}>
              {/* 動作序列 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {hand.actions.map((a, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded"
                        style={{
                          background: a.actor === hand.hero.position ? '#1a1040' : '#1a1a1a',
                          color: a.actor === hand.hero.position ? '#a78bfa' : '#6b7280',
                          border: `1px solid ${a.actor === hand.hero.position ? '#342056' : '#2a2a2a'}`,
                        }}>
                    {a.actor.toUpperCase()} {a.kind}{a.amount !== undefined ? ` ${a.amount}` : ''}
                  </span>
                ))}
              </div>

              {/* 街別 chips（全 pending） */}
              <div className="flex gap-1.5 mb-3">
                {(['preflop', 'flop', 'turn', 'river'] as const).map(street => (
                  <div key={street}
                       className="flex-1 rounded-[7px] flex flex-col items-center gap-[1px] py-1.5"
                       style={{ background: '#0c0e12', border: '1px solid #1f232b', opacity: 0.4 }}>
                    <div className="text-[10px] font-bold text-white">
                      {{ preflop: '翻前', flop: '翻牌', turn: '轉牌', river: '河牌' }[street]}
                    </div>
                    <div className="text-[9px] font-bold" style={{ color: '#565d6a' }}>—</div>
                  </div>
                ))}
              </div>

              {/* AI 分析 / 書籤按鈕 */}
              {hasBookmark && (
                analysis ? (
                  <div className="text-[11px] leading-relaxed rounded-lg p-2.5"
                       style={{ background: '#0c0e12', border: '1px solid #1f232b', color: '#c8ccd4' }}>
                    {analysis}
                  </div>
                ) : (
                  <button
                    onClick={() => handleAnalyze(hand.handNumber)}
                    disabled={!isPaid || analyzing === hand.handNumber}
                    className="w-full py-2 rounded-lg text-xs font-bold"
                    style={{
                      background: isPaid ? '#7c3aed' : '#222',
                      color: isPaid ? '#fff' : '#666',
                      opacity: analyzing === hand.handNumber ? 0.6 : 1,
                    }}>
                    {analyzing === hand.handNumber ? '分析中...' : isPaid ? '🤖 AI 分析此手 · 3點' : '升級解鎖 AI 分析'}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )
    })}
  </div>
</div>
```

- [ ] **Step 4：TypeScript 編譯確認**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 5：Commit**

```bash
git add src/components/v2/HeadsUpReviewScreenV2.tsx
git commit -m "feat(hu-v2): HeadsUpReviewScreenV2 hands list + expand + AI analysis"
```

---

## Task 8：App.tsx 接線 HeadsUpReviewScreenV2 + 全套驗證 + push dev

**Files:**
- Modify: `src/pages/App.tsx`

- [ ] **Step 1：加入 import**

在 App.tsx 的 lazy import 區加入：

```ts
const HeadsUpReviewScreenV2 = lazy(() => import('../components/v2/HeadsUpReviewScreenV2'))
```

- [ ] **Step 2：修改 `hu-review` block**

找到：
```ts
if (appMode === 'hu-review' && huFinalMatch && user) {
  const userTier: 'free' | 'basic' | 'pro' = ...
  return (
    <Suspense fallback={<LazyFallback />}>
      <HeadsUpReviewScreen
        match={huFinalMatch}
        ...
      />
    </Suspense>
  )
}
```

替換為：
```ts
if (appMode === 'hu-review' && huFinalMatch && user) {
  const userTier: 'free' | 'basic' | 'pro' =
    profile && isUserPaid(profile) ? 'pro' : 'free'

  const ReviewScreen = FEATURE_FLAGS.UI_V2 ? HeadsUpReviewScreenV2 : HeadsUpReviewScreen

  // 共用 props（V2 多一個 aiBookmarks）
  const sharedReviewProps = {
    match: huFinalMatch,
    userTier,
    gtoFlagsByHand: huFlagsByHand,
    onAnalyzeHand: async (idx: number) => {
      const { analyzeHand } = await import('../lib/hu/analyzeHand')
      const { formatCard, formatBoard } = await import('../lib/hu/cards')
      const hand = huFinalMatch.handHistory[idx]
      const bothShown = !hand.hero.hasFolded && !hand.villain.hasFolded
      const result = await analyzeHand({
        userId: user.id,
        sessionId: huSessionId ?? '',
        handIndex: idx,
        handData: {
          hero_position: hand.hero.position,
          hero_cards: hand.hero.holeCards.map(formatCard).join(''),
          villain_cards: bothShown ? hand.villain.holeCards.map(formatCard).join('') : null,
          board: hand.board.length > 0 ? formatBoard(hand.board) : null,
          action_sequence: hand.actions,
          pot_total_bb: Math.round(hand.potBB),
          hero_won: await computeHeroWonForHand(hand),
        },
      })
      await refreshPoints()
      return result.analysis
    },
    onBack: () => {
      setAppMode('app')
      setHuConfig(null)
      setHuFinalMatch(null)
      setHuSessionId(null)
      setHuFlagsByHand({})
      setHuAIBookmarks([])
    },
  }

  return (
    <Suspense fallback={<LazyFallback />}>
      {FEATURE_FLAGS.UI_V2 ? (
        <HeadsUpReviewScreenV2 {...sharedReviewProps} aiBookmarks={huAIBookmarks} />
      ) : (
        <HeadsUpReviewScreen {...sharedReviewProps} />
      )}
    </Suspense>
  )
}
```

- [ ] **Step 3：全套測試確認**

```bash
npx tsc -b --noEmit && npx vitest run
```

預期：TypeScript 零錯誤，所有測試通過（含新的 6 個 computeHandFeedback 測試）

- [ ] **Step 4：更新 version + dev-log**

在 `src/version.ts` 把版本號遞增（`v0.8.1-dev.20` → `v0.8.1-dev.21`）：

```ts
export const VERSION = 'v0.8.1-dev.21'
```

在 `memory/dev-log.md` 最上方（`---` 下方）新增：

```markdown
## 2026-04-15 v0.8.1-dev.21 [dev]
- HU V2 UI 收尾：手牌間 FeedbackSheetV2 overlay（10s 倒數 + 👁 回饋按鈕）
- AI 書籤系統：賽中書籤，賽後在 HeadsUpReviewScreenV2 分析
- 新建 HeadsUpReviewScreenV2：V2 深色設計，結果 banner + AI 書籤區 + 手牌列表（展開動作序列）
- 所有街別 GTO 評分顯示 pending（資料建構中），未來版本補上
```

- [ ] **Step 5：Commit + push dev**

```bash
git add src/version.ts memory/dev-log.md src/pages/App.tsx
git commit -m "feat(hu-v2): wire HeadsUpReviewScreenV2 + version v0.8.1-dev.21"
git checkout dev
git merge feature/hu-simulator-v1
```

> **注意**：目前已在 `dev` branch，不需 checkout。直接 commit 後 push：

```bash
git push origin dev
```

- [ ] **Step 6：驗證測試環境**

```bash
sleep 60 && curl -s -o /tmp/dev-index-v21.html -w "HTTP=%{http_code} SIZE=%{size_download}\n" https://poker-goal-dev.vercel.app/
```

確認 `HTTP=200`，然後：

```bash
grep -o 'src="/assets/[^"]*\.js"' /tmp/dev-index-v21.html | head -3
```

預期：看到新的 script hash（代表 Vite build 成功）。

---

## Self-Review Checklist

- [x] **Spec coverage**
  - [x] 手牌間 feedback sheet → Task 1–3
  - [x] AI 書籤（賽中加入，賽後分析）→ Task 3–4
  - [x] App.tsx data flow → Task 4, 8
  - [x] HeadsUpReviewScreenV2 完整重設計 → Task 5–7, 8
  - [x] 所有街別 `pending` → Task 1, 7 都寫死 pending

- [x] **Type consistency**
  - `HUHandFeedback` 定義在 Task 1，Task 3 使用
  - `FlagsByHand` import from `HeadsUpMatchScreenV2`（與 spec 一致）
  - `onMatchComplete(finalState, flagsByHand, aiBookmarks: number[])` 在 Task 3 改型別，Task 4 呼叫端同步更新

- [x] **No placeholders** — 所有 code block 完整，無 TBD

- [x] **dealNextHand closure** — Task 2 明確指出需用 `aiBookmarkedHandsRef`

- [x] **require → static import** — Task 6, 7 都有 Note 說明需改為靜態 import
