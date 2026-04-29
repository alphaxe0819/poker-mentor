---
name: Train Table V2 Handover (Level A — UI 1:1 複製)
description: 訓練模式 V2 牌桌 UI/UX 100% 不跑版搬遷包 — 設計系統、CSS variables、capsule 數學、4 chips 街別評分、所有元件源碼路徑（含 mock props 讓新專案直接 render）
type: project
created: 2026-04-27
level: A
---

> 本頁是**訓練模式 V2 牌桌的 Level A 搬遷包**（版型 + 設計系統 + mock props，**不含資料層**）。
> 新專案 Claude session 讀完這份就能在自己 codebase 重現 pixel-perfect 的訓練牌桌 UI。
> 資料層（gtoData / auth / Supabase）見 §12 — Level A **不搬**，要 Level B 另開搬遷任務。

---

## §0 一句話 + 視覺概念

**訓練模式 V2 牌桌 = 直立 capsule wireframe 牌桌 + 頂部 action history + 底部 action bar + 答題後彈出的底部 sheet 回饋（永遠顯示 4 chips：翻前/翻牌/轉牌/河牌）。**

UI v2 設計規則（不可改）：
- 牌桌：**直立 capsule 線框**，不是寫實綠 felt
- 座位：空心圓，2/6/9 桌型統一視覺
- Action bar：**不做自訂 bet slider**，只給指定尺寸按鈕（FOLD / CHECK / CALL / 3B 2.5x / Bet 33% / ALL-IN ...）
- 回饋：**底部 sheet**（不是全螢幕 modal）。正確 → collapsed，錯誤 → expanded
- 街別評分：永遠顯示 4 chips，4 級（最佳/正確/存疑/錯誤）
- 決策期**不顯示**「查看範圍」按鈕（等於作弊），只有回饋階段才能看
- HU 比賽中：用實際位置名（BTN/BB），**不要**寫 BOT/YOU

---

## §1 技術棧鎖定（version.json 必帶）

來源檔：`C:\Users\User\Desktop\gto-poker-trainer\package.json`

```json
{
  "name": "poker-mentor",
  "type": "module",
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^6.30.3"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
```

**版本鎖死**：
- **Tailwind 3.4**（不是 4.x，4.x preflight 跟 theme.extend 寫法差很多）
- **React 19**（function component memo 簽名穩定，但若新專案是 React 18 部分 hook 行為差異要驗）
- **Vite 8** + `@vitejs/plugin-react` 6（HMR 設定都走預設）

---

## §2 設計系統（CSS variables ↔ Tailwind 對映）

### 2.1 `tailwind.config.js`（**全文必帶**）

來源：`C:\Users\User\Desktop\gto-poker-trainer\tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          muted: 'var(--primary-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        felt: 'var(--felt)',
      },
    },
  },
  plugins: [],
}
```

**重點**：所有 color 都指向 `var(--xxx)`，**真值寫在 `index.css` 的 `:root`**。少一個 → Tailwind class 會 fallback 透明。

### 2.2 `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## §3 全域樣式（`src/index.css` — **整檔必帶**）

來源：`C:\Users\User\Desktop\gto-poker-trainer\src\index.css`（208 行）

### 3.1 字型 import（檔案第 1 行，不能漏）

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
```

**⚠ 不能用 npm 套件版本** — Tailwind config 寫死 `'Outfit'` 字串，必須從 Google Fonts 載。

### 3.2 CSS Variables（`:root`）

```css
:root {
  /* Surfaces */
  --surface-base: #0d0d14;
  --surface: #0a0e1a;
  --surface-card: #111827;
  --surface-elevated: #1a2235;

  /* Brand */
  --primary: #6366f1;
  --primary-hover: #818cf8;
  --primary-muted: rgba(99, 102, 241, 0.15);

  /* Accent (gold) */
  --accent: #f59e0b;
  --accent-hover: #fbbf24;

  /* Semantic */
  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;

  /* Text */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #475569;

  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);

  /* Poker felt */
  --felt: #1a4731;

  /* Range action colors */
  --range-raise: #6366f1;
  --range-call: #10b981;
  --range-fold: #1e293b;
}
```

### 3.3 Reset / iOS quirks（**必帶，省略會跑版**）

```css
*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
html, body { height: 100%; margin: 0; padding: 0; }
html { overscroll-behavior: none; }                 /* 防 iOS overscroll bounce */
body {
  font-family: 'Outfit', sans-serif;
  background-color: var(--surface-base);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
```

### 3.4 `#root` 容器（手機寬度框 — 桌面置中）

```css
#root {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;        /* 用 dvh 不是 vh，iOS Safari URL bar 會收 */
  max-width: 480px;          /* ⚠ 桌面不全寬，做手機 frame */
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04);
  background-color: var(--surface);
}
```

### 3.5 Animations（`animate-*` class 用）

```css
@keyframes fade-in   { from { opacity: 0; transform: translateY(8px); }   to { opacity: 1; transform: translateY(0); } }
@keyframes slide-up  { from { opacity: 0; transform: translateY(32px); }  to { opacity: 1; transform: translateY(0); } }
@keyframes pop       { 0% { transform: scale(0.8); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
@keyframes shake     { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
@keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); } }

.animate-fade-in    { animation: fade-in 0.35s ease both; }
.animate-slide-up   { animation: slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both; }
.animate-pop        { animation: pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
.animate-shake      { animation: shake 0.4s ease both; }
.animate-pulse-glow { animation: pulse-glow 2s infinite; }
```

### 3.6 Component Utilities（`@layer utilities`）

`.glass` / `.card` / `.card-elevated` / `.btn-primary` / `.btn-ghost` / `.input-field` / `.tab-bar` — 整段見 `src/index.css` 第 91–177 行。

---

## §4 `index.html`（meta tags 必帶）

來源：`C:\Users\User\Desktop\gto-poker-trainer\index.html`（21 行整檔）

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♠</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0d0d14" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <meta name="apple-mobile-web-app-title" content="Poker Mentor" />
    <title>Poker Goal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**iOS quirks 不能漏**：
- `viewport-fit=cover` → 安全區延伸到瀏海／Home indicator
- `theme-color="#0d0d14"` → status bar 背景
- `apple-mobile-web-app-status-bar-style="black-translucent"` → 全屏沉浸
- Google Fonts `preconnect` → DNS 預熱，字型載得快

也要附 `public/icon-192.png`（手機加到主畫面用 icon）。

---

## §5 訓練模式架構（11 元件）

```
TrainTabV2.tsx (956 行)
├─ TrainSetupScreen.tsx (178)        — 設定頁（牌型/籌碼/題數）
│  └─ PointsBadge.tsx (54)           — 點數顯示徽章
├─ PokerFeltV2.tsx (266)            ← ⭐ 核心牌桌
├─ ActionHistoryBarTop.tsx (80)     — 頂部 action history
├─ HoleCards.tsx (89)               — 手牌（exports SUIT_STYLES）
├─ CommunityCards.tsx (52)          — 公共牌（imports SUIT_STYLES from HoleCards）
├─ BetSizingBarV2.tsx (83)          — 底部 action bar
├─ FeedbackSheetV2.tsx (218)        — 底部 sheet 回饋（4 chips）
├─ RangeGrid.tsx (106)              — 13×13 range overlay（決策期不顯示）
└─ RoundResultScreen.tsx (85)       — 一輪結束結算
```

---

## §6 ⭐ 核心牌桌：`PokerFeltV2.tsx`

**來源**：`C:\Users\User\Desktop\gto-poker-trainer\src\components\v2\PokerFeltV2.tsx`（266 行整檔搬）

### 6.1 數學常數（**不能改，改了座位排列就跑版**）

```typescript
const PILL_W = 84, PILL_H = 120  // pill 長寬比
const PILL_R = PILL_W / 2        // 半圓半徑 = 42
const PILL_L = PILL_H - PILL_W   // 直邊長度 = 36

// pill 周長 = 2πR + 2L
// 把座位均勻分布在周長上，slot 0 = 底部正中（hero 固定底部）
// 座位用 % 定位（left/top），原點透過 `pointAt(s)` 算出
```

### 6.2 POSITION_MAP（**權威來源，禁止憑直覺擺**）

```typescript
const POSITION_MAP: Record<number, string[]> = {
  2:  ['BTN/SB', 'BB'],
  3:  ['BTN', 'SB', 'BB'],
  4:  ['UTG', 'BTN', 'SB', 'BB'],
  5:  ['HJ', 'CO', 'BTN', 'SB', 'BB'],
  6:  ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  7:  ['UTG', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  8:  ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  9:  ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'],
  10: ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB', 'BB2'],
}
```

順時針：BTN → SB → BB → UTG → UTG+1 → UTG+2 → LJ → HJ → CO → (回 BTN)。Hero 固定螢幕底部。

### 6.3 STATUS_STYLE（座位狀態 → 視覺）

```typescript
const STATUS_STYLE = {
  hero:    { border: '2px solid #a78bfa', bg: '#16181d', shadow: '0 0 10px rgba(167,139,250,.4)' },  // 紫
  raised:  { border: '2px solid #dc2626', bg: '#16181d', shadow: '0 0 8px rgba(220,38,38,.35)' },     // 紅（加注）
  active:  { border: '2px solid #10b981', bg: '#16181d', shadow: '0 0 8px rgba(16,185,129,.35)' },    // 綠（輪到）
  posted:  { border: '1.5px solid #4a5060', bg: '#14161b' },                                          // 灰（已下盲）
  waiting: { border: '1.5px solid #4a5060', bg: '#14161b' },                                          // 灰（等待）
  folded:  { border: '1.5px dashed #4a5060', bg: '#0d0f13' },                                         // 虛線灰（棄牌）
}
```

### 6.4 卡片花色配色（**GTOW 風格，整個卡牌背景=花色色**）

```typescript
const SUIT_BG = { s: '#3a3d44', h: '#8b2232', d: '#1e5faa', c: '#1a7a3a' }
const SUIT_BORDER = { s: '#555860', h: '#b02e42', d: '#2a78d4', c: '#22994a' }
const SUIT_SYMBOL = { s: '♠', h: '♥', d: '♦', c: '♣' }
//                    spade灰     heart紅      diamond藍      club綠
```

### 6.5 z-index 層級（不能弄反）

```
z-1: pill outline
z-2: 座位圈
z-3: 下注 chip
z-4: face-down 手牌（在座位上方）
z-5: dealer button (D)
```

### 6.6 Props（外部要塞給 PokerFeltV2 的東西）

```typescript
interface Props {
  tableSize?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  heroPosition?: string
  showPositions?: boolean
  seatInfo?: Record<string, {
    status: 'hero' | 'raised' | 'posted' | 'folded' | 'waiting' | 'active'
    bet: number
    stack?: number
    hasCards?: boolean
  }>
  potTotal?: number
  boardCards?: Array<{ rank: string; suit: 's' | 'h' | 'd' | 'c' }>
}
```

---

## §7 卡片元件：`HoleCards.tsx` + `CommunityCards.tsx`

### 7.1 `HoleCards.tsx`（89 行，整檔搬）

來源：`C:\Users\User\Desktop\gto-poker-trainer\src\components\HoleCards.tsx`

**Export `SUIT_STYLES` + `PokerCard`** — `CommunityCards` 跟 `PokerFeltV2` 都會用。

```typescript
export const SUIT_STYLES = {
  s: { bg: '#3a3d44', borderColor: '#555860', symbol: '♠' },  // spade 灰
  h: { bg: '#8b2232', borderColor: '#b02e42', symbol: '♥' },  // heart 紅
  d: { bg: '#1e5faa', borderColor: '#2a78d4', symbol: '♦' },  // diamond 藍
  c: { bg: '#1a7a3a', borderColor: '#22994a', symbol: '♣' },  // club 綠
}
```

### 7.2 卡片視覺：rank 上方大字 + 花色下方小字

```
┌──────┐
│  A   │  ← rank（font-black, fontSize 1.5–2.1rem）
│      │
│  ♠   │  ← suit（font-bold, fontSize 0.8–1.05rem）
└──────┘
size 'normal'  → 56×78 px
size 'small'   → 40×56 px
```

### 7.3 `CommunityCards.tsx`（52 行整檔搬）

依賴 `import { SUIT_STYLES } from './HoleCards'`。
5 個 slot，未發的牌用 dashed border 空白卡顯示。
卡片尺寸 38×52 px（比 HoleCards 小）。

### 7.4 Hand → Suit 推導（虛擬手牌 demo 用）

```typescript
function getSuitKeys(hand: string): [string, string] {
  const suited = hand.endsWith('s')
  const base = (hand.charCodeAt(0) + hand.charCodeAt(1)) % 4
  const keys = ['s', 'h', 'd', 'c']
  if (suited) return [keys[base], keys[base]]
  return [keys[base], keys[(base + 1) % 4]]
}
```

---

## §8 Action Bar：`BetSizingBarV2.tsx`（83 行整檔）

### 8.1 規則（不可改）
- **單行** flex 排列（一排塞滿，max felt space）
- **不做** `<input type="range">` 自訂 slider
- 按鈕固定組合：FOLD（藍）/ CHECK（深灰）/ CALL（綠）/ 各種 bet sizing（紅）/ ALL-IN（深紅）

### 8.2 顏色 token（hardcoded RGB，不走 CSS variable）

```typescript
FOLD     #2563eb
CHECK    #374151
CALL     #059669
BET/RAISE #dc2626
ALL-IN   #7f1d1d
```

### 8.3 按鈕高度

```
minHeight: 48px   (符合 iOS 觸控 hit-target ≥44px)
fontSize:  11–12px
flex-1     (撐滿可用寬度)
```

### 8.4 Props

```typescript
interface Props {
  canFold: boolean
  canCheck: boolean
  canCall: boolean
  callAmount?: number
  sizingOptions: Array<{
    label: string      // "3B 2.5x" / "Bet 33%"
    amount: number     // BB 數
    kind: 'bet' | 'raise'
  }>
  canAllIn: boolean
  allInAmount?: number
  onAction: (a: BetAction) => void
  disabled?: boolean
}

export type BetAction =
  | { kind: 'fold' }
  | { kind: 'check' }
  | { kind: 'call'; amount: number }
  | { kind: 'bet'; amount: number; label: string }
  | { kind: 'raise'; amount: number; label: string }
  | { kind: 'allin'; amount: number }
```

---

## §9 Feedback Sheet：`FeedbackSheetV2.tsx`（218 行整檔）

### 9.1 規則
- **底部** sheet（不是全螢幕 modal）
- 上有 drag handle（往上拉展開、往下推收起）
- 4 chips 街別評分（preflop/flop/turn/river）**永遠顯示**（pending 狀態 opacity 0.4）
- 4 級顏色：

```typescript
const STREET_STATE_STYLE = {
  best:    { border: '#1e5a3d', bg: '#0a1d14', color: '#34d399', text: '✓✓ 最佳' },
  ok:      { border: '#1a4770', bg: '#0a1523', color: '#60a5fa', text: '✓ 正確' },
  doubt:   { border: '#6b4a1a', bg: '#1a1208', color: '#fbbf24', text: '! 存疑' },
  err:     { border: '#5a1a1a', bg: '#1a0a0a', color: '#f87171', text: '⊘ 錯誤' },
  pending: { border: '#1f232b', bg: '#0c0e12', color: '#565d6a', text: '—' },
}
```

### 9.2 街別評分判定（公式硬編碼）

```typescript
export function scoreByFreq(chosenFreq: number): StreetState {
  if (chosenFreq >= 60) return 'best'
  if (chosenFreq >= 20) return 'ok'
  if (chosenFreq >= 5)  return 'doubt'
  return 'err'
}
```

### 9.3 結構（從上到下）

```
┌─ drag handle ─┐
│  ✓ 正確 / ✗ 不對 + tip                  │
│  Frequency bar (彩色長條)               │
│  各 action % 列表                       │
│  4 chips 街別評分                        │
│  [ expanded only ] explanation 段落      │
│  [ expanded only ] 「和 AI 教練深入討論」 │
│  [⊞ 查看範圍] [▶▶ 下一手]                │
└──────────────────────────────────────────┘
```

### 9.4 Drag handle 行為

```typescript
// 往上拉 dy < -30 → expand
// 往下推 dy > 30 → collapse
// 點 handle / 點 backdrop → toggle
```

### 9.5 Backdrop

```css
absolute inset-0 bg-black/45 z-[9]   /* 半透明遮罩 */
sheet itself: z-[10] rounded-t-2xl
```

---

## §10 頂部 Action History：`ActionHistoryBarTop.tsx`（80 行整檔）

### 10.1 視覺
- 高度緊湊（py-1.5）
- 橫向 overflow scroll（隱藏 scrollbar：`scrollbarWidth: 'none'`）
- 每個 chip：`{label} {detail}`（label 粗體在前，detail 細體在後）
- 4 種 kind 顏色：

```typescript
villain:  { bg: '#1f0f0f', border: '#3a1818', color: '#fca5a5' }   // 紅（對手 action）
hero:     { bg: '#14102a', border: '#3a2a6a', color: '#c8b6ff' }   // 紫（你 action）
folded:   { bg: '#0f1218', border: '#1f232b', color: '#8a92a0' }   // 灰（已棄）opacity 0.5
neutral:  { bg: '#151820', border: '#1f232b', color: '#8a92a0' }   // 中性（街分隔）
```

### 10.2 右側可選 stats

```typescript
stats?: {
  accuracy?: number   // 正確率 (0–100)
  streak?: number     // 連擊
  progress?: string   // "4/10"
}
```

正確率顯示綠色（#8be58b），連擊/進度顯示白色。

---

## §11 設定頁：`TrainSetupScreen.tsx`（178 行整檔）

### 11.1 三個選項區塊
1. **遊戲類型**（pill 按鈕）：全隨機 / 9-max 錦標 / 6-max 現金 / 4-max 現金 / HU
   - 選中：紫色 `#7c3aed` + 白字
   - 未選：黑底 `#111` + 灰字 `#555`
   - 鎖定（免費用戶）：opacity 0.5 + 🔒 emoji
2. **籌碼深度**：random / 100 / 75 / 40 / 25 / 15 BB
   - 現金局自動鎖定 100BB（顯示「現金局固定 100BB」提示卡）
   - 選中色：藍色 `#1d4ed8`
3. **題數**：10 / 30 / 100
   - 選中色：綠色 `#059669`
4. **答錯顯示說明** checkbox（紫色 accent）
5. **HU 對決入口**（卡片，可選）
6. **開始練習** 按鈕（紫色 `#7c3aed`，full width）

### 11.2 Props

```typescript
interface Props {
  points?: number
  isPaid?: boolean
  onNavigateToMissions?: () => void
  onNavigateToHU?: () => void
  onStart: (config: {
    gameTypeKey: 'random' | 'tourn_9max' | 'cash_6max' | 'cash_4max' | 'cash_hu'
    stackDepth: number | 'random'
    trainMode: 'single' | 'multi'
    roundSize: number
    showExplanation: boolean
  }) => void
}
```

---

## §12 Round Result + Range Grid

### 12.1 `RoundResultScreen.tsx`（85 行整檔）
一輪訓練結束後的結算畫面：
- 大 emoji（🏆 ≥80% / 💪 ≥60% / 📚 < 60%）
- 進度條（綠/橘/紅）
- 三欄：正確率 / 連勝 / 分數
- 紫色 CTA「學習更多」

### 12.2 `RangeGrid.tsx`（106 行整檔）
13×13 range overlay（fixed inset-0 modal）：
- 點背景關閉
- 4 種顏色：紅（加注）/ 綠（跟注）/ 黃（混合）/ 深灰（棄牌）
- 當前手牌：紫色外框（`2px solid #a78bfa`）+ 紫色光暈

---

## §13 完整檔案清單（家中電腦絕對路徑）

> Repo root：`C:\Users\User\Desktop\gto-poker-trainer\`

### UI 元件（11 檔，~2350 行，**全部整檔搬**）
```
C:\Users\User\Desktop\gto-poker-trainer\src\tabs\TrainTabV2.tsx                       # 956 — 主控制器
C:\Users\User\Desktop\gto-poker-trainer\src\tabs\TrainSetupScreen.tsx                 # 178 — 設定頁
C:\Users\User\Desktop\gto-poker-trainer\src\components\v2\PokerFeltV2.tsx             # 266 — ⭐ 核心牌桌
C:\Users\User\Desktop\gto-poker-trainer\src\components\v2\BetSizingBarV2.tsx          #  83 — Action bar
C:\Users\User\Desktop\gto-poker-trainer\src\components\v2\FeedbackSheetV2.tsx         # 218 — 底部回饋 sheet
C:\Users\User\Desktop\gto-poker-trainer\src\components\v2\ActionHistoryBarTop.tsx     #  80 — 頂部 history
C:\Users\User\Desktop\gto-poker-trainer\src\components\HoleCards.tsx                  #  89 — 手牌 + SUIT_STYLES export
C:\Users\User\Desktop\gto-poker-trainer\src\components\CommunityCards.tsx             #  52 — 公共牌
C:\Users\User\Desktop\gto-poker-trainer\src\components\RangeGrid.tsx                  # 106 — 13×13 overlay
C:\Users\User\Desktop\gto-poker-trainer\src\components\RoundResultScreen.tsx          #  85 — 結算
C:\Users\User\Desktop\gto-poker-trainer\src\components\PointsBadge.tsx                #  54 — 點數徽章
```

### 設計系統（6 檔，~344 行，**全部整檔搬**）
```
C:\Users\User\Desktop\gto-poker-trainer\package.json              # 41 — 版本鎖
C:\Users\User\Desktop\gto-poker-trainer\tailwind.config.js        # 39 — theme.extend.colors（CSS var 對映）
C:\Users\User\Desktop\gto-poker-trainer\postcss.config.js         #  6
C:\Users\User\Desktop\gto-poker-trainer\src\index.css             # 208 — :root variables + reset + utilities + animations
C:\Users\User\Desktop\gto-poker-trainer\index.html                # 21 — meta tags + Google Fonts preconnect
C:\Users\User\Desktop\gto-poker-trainer\vite.config.ts            # 31 — build 設定
```

### Type 依賴（**Level A 要 mock，見 §14**）
```
C:\Users\User\Desktop\gto-poker-trainer\src\lib\hu\types.ts       # 89 — Card / Rank / Suit type
```

### Static 資源
```
C:\Users\User\Desktop\gto-poker-trainer\public\icon-192.png       # PWA icon
```

---

## §14 lib 依賴（Level A — 全部 mock）

`TrainTabV2.tsx` 有 4 條會被搬遷打斷的 import — Level A 全部用 mock 取代：

| 原 import | 用途 | Level A mock 策略 |
|---|---|---|
| `import { saveAnswerRecord } from '../lib/auth'` | 答題記錄寫 Supabase | `() => Promise.resolve()` no-op |
| `import { ... } from '../lib/gtoData'` | GTO 翻前 lookup | mock 回傳 `{ action: 'r', freq: 80, note: 'mock' }` |
| `import type { Card } from '../lib/hu/types'` | 卡片 type | **整檔搬**（無外部依賴） |
| `import { HU_ENTRY_COST } from '../lib/hu/config'` | HU 入場費常數 | 直接 hardcode `0` 或新建一個 config.ts |

### Level A 最小 mock 範例

```typescript
// src/lib/auth.ts (mock)
export const saveAnswerRecord = async (_: any) => Promise.resolve()
export const saveShareResult = async (_: any) => Promise.resolve()

// src/lib/gtoData.ts (mock)
export const preloadDB = async () => {}
export const getStep2GTOFromDB = (..._args: any[]) => null
export const getValidScenarios = (..._args: any[]) => []
export const getRangeByKey = (..._args: any[]) => ({})
export const getActionByKey = (..._args: any[]) => null
export const getTopActionsByKey = (..._args: any[]) => []
export const isActionValid = (..._args: any[]) => true

// src/lib/hu/config.ts (mock)
export const HU_ENTRY_COST = 0
```

> **完整資料層搬遷 = Level B**（要再開搬遷任務）。包含 `src/lib/gto/` 下 50+ 個 `gtoData_*.ts`（手寫 GTO range data 約 5–8 萬行）+ Supabase migration。

---

## §15 Mock Props 範例（讓新專案直接 render 看效果）

### 15.1 PokerFeltV2 — 6-max BTN open 場景

```tsx
import PokerFeltV2 from './components/v2/PokerFeltV2'

export default function Demo() {
  return (
    <div style={{ width: 360, height: 480, background: '#0a0e1a', padding: 16 }}>
      <PokerFeltV2
        tableSize={6}
        heroPosition="BTN"
        showPositions={true}
        seatInfo={{
          UTG: { status: 'folded', bet: 0, stack: 100, hasCards: false },
          HJ:  { status: 'folded', bet: 0, stack: 100, hasCards: false },
          CO:  { status: 'folded', bet: 0, stack: 100, hasCards: false },
          BTN: { status: 'hero',   bet: 0, stack: 100 },                    // hero 自己
          SB:  { status: 'posted', bet: 0.5, stack: 99.5 },
          BB:  { status: 'posted', bet: 1,   stack: 99 },
        }}
        potTotal={1.5}
        boardCards={[]}
      />
    </div>
  )
}
```

### 15.2 FeedbackSheetV2 — 答對顯示 collapsed 範例

```tsx
import FeedbackSheetV2 from './components/v2/FeedbackSheetV2'

<FeedbackSheetV2
  isCorrect={true}
  tip="AKo · BTN vs UTG 高頻 3-bet"
  actions={[
    { label: '3-Bet 7.5', freq: 65, color: '#dc2626', isYours: true },
    { label: 'Call',      freq: 25, color: '#10b981' },
    { label: 'Fold',      freq: 10, color: '#475569' },
  ]}
  streets={[
    { street: 'preflop', state: 'best' },
    { street: 'flop',    state: 'pending' },
    { street: 'turn',    state: 'pending' },
    { street: 'river',   state: 'pending' },
  ]}
  expanded={false}
  onToggleExpand={() => {}}
  onViewRange={() => {}}
  onNext={() => {}}
/>
```

### 15.3 BetSizingBarV2 — 翻前 BTN 場景

```tsx
<BetSizingBarV2
  canFold={true}
  canCheck={false}
  canCall={true}
  callAmount={1}
  sizingOptions={[
    { label: 'R 2x',   amount: 2,   kind: 'raise' },
    { label: 'R 2.5x', amount: 2.5, kind: 'raise' },
    { label: 'R 3x',   amount: 3,   kind: 'raise' },
  ]}
  canAllIn={true}
  allInAmount={100}
  onAction={(a) => console.log(a)}
/>
```

### 15.4 ActionHistoryBarTop — preflop 場景

```tsx
<ActionHistoryBarTop
  items={[
    { label: 'UTG', detail: 'F', kind: 'folded' },
    { label: 'HJ',  detail: 'F', kind: 'folded' },
    { label: 'CO',  detail: 'F', kind: 'folded' },
    { label: 'BTN', detail: 'R 2.5', kind: 'hero' },
    { label: 'SB',  detail: 'F', kind: 'folded' },
    { label: 'BB',  detail: '?', kind: 'neutral' },
  ]}
  stats={{ accuracy: 75, streak: 3, progress: '4/10' }}
/>
```

---

## §16 視覺驗收 Checklist

### 16.1 Viewport 覆蓋（每個 viewport 都要過）

| 裝置 | viewport | 預期 |
|---|---|---|
| iPhone SE | 375×667 | 牌桌不被切，pill 完整顯示 |
| Pixel 5 | 393×851 | 同上，但下方留白多 |
| iPad mini | 768×1024 | `#root` max-width:480px 把畫面框在中央，左右是黑色 |
| Desktop | 1440×900 | 同 iPad 中央框，看到 box-shadow 線 |

### 16.2 視覺逐項 check

- [ ] 字型：所有文字是 Outfit（不是系統預設 sans-serif）
- [ ] 背景：`body` 是 `#0d0d14`（接近黑），`#root` 是 `#0a0e1a`
- [ ] PokerFeltV2 capsule outline：`1.5px solid #2a2f3a` 接近全暗色
- [ ] 6-max 桌型 hero（BTN）固定在底部正中
- [ ] 9-max 桌型 hero（隨機位置）也固定在底部，其他人順時針排
- [ ] 卡片花色顏色：♠灰 / ♥紅 / ♦藍 / ♣綠（**不是**標準紅黑）
- [ ] FeedbackSheetV2 永遠顯示 4 chips（即使 turn/river 還沒到，pending opacity 0.4）
- [ ] BetSizingBarV2 按鈕高度 ≥48px（手指觸控不誤觸）
- [ ] ActionHistoryBarTop 橫向 scroll 時 scrollbar 隱形（`scrollbar-width: none`）
- [ ] iOS Safari URL bar 收起時 `#root` min-height: 100dvh 跟著伸展（不是 100vh 卡死）
- [ ] 拖 FeedbackSheetV2 handle 上拉展開、下推收起（dy ±30 閾值）

### 16.3 動畫

- [ ] `animate-fade-in`：0.35s 淡入 + Y 8px → 0
- [ ] `animate-slide-up`：0.4s slide 32px → 0（cubic-bezier 0.16,1,0.3,1，elastic feel）
- [ ] `animate-pop`：0.35s scale 0.8 → 1.05 → 1（彈性 overshoot）
- [ ] `animate-shake`：0.4s 左右晃 8px（答錯時用）

---

## §17 PowerShell 一鍵驗證（家中電腦）

```powershell
$root = "C:\Users\User\Desktop\gto-poker-trainer"
$files = @(
  "package.json",
  "tailwind.config.js",
  "postcss.config.js",
  "vite.config.ts",
  "index.html",
  "src\index.css",
  "src\tabs\TrainTabV2.tsx",
  "src\tabs\TrainSetupScreen.tsx",
  "src\components\v2\PokerFeltV2.tsx",
  "src\components\v2\BetSizingBarV2.tsx",
  "src\components\v2\FeedbackSheetV2.tsx",
  "src\components\v2\ActionHistoryBarTop.tsx",
  "src\components\HoleCards.tsx",
  "src\components\CommunityCards.tsx",
  "src\components\RangeGrid.tsx",
  "src\components\RoundResultScreen.tsx",
  "src\components\PointsBadge.tsx",
  "src\lib\hu\types.ts",
  "public\icon-192.png"
)
$files | ForEach-Object {
  $p = Join-Path $root $_
  "{0}  {1}" -f $(if (Test-Path $p) { "OK" } else { "!!" }), $p
}
```

---

## §18 給新專案 Claude 的搬遷 SOP

1. **先建設計系統**（順序不能反）：
   1. 把 `package.json` 的 `devDependencies` 完整複製到新專案 → `npm install`
   2. 複製 `tailwind.config.js` + `postcss.config.js` 到新專案 root
   3. 複製 `index.html` + `src/index.css` 到對應位置
   4. 確認 `npm run dev` 起得來、`bg-primary` class 顯示紫色 `#6366f1`（不是透明）

2. **搬 type**：複製 `src/lib/hu/types.ts`（全文，無外部依賴）

3. **搬 Components 11 檔**（按順序）：
   1. `HoleCards.tsx`（**先搬**，export SUIT_STYLES 給其他用）
   2. `CommunityCards.tsx`（依賴 HoleCards）
   3. `PokerFeltV2.tsx`（無內部依賴，可獨立 render）
   4. `BetSizingBarV2.tsx` / `FeedbackSheetV2.tsx` / `ActionHistoryBarTop.tsx`（獨立）
   5. `RangeGrid.tsx` / `RoundResultScreen.tsx` / `PointsBadge.tsx`（獨立）
   6. `TrainSetupScreen.tsx`（依賴 PointsBadge）
   7. `TrainTabV2.tsx`（最後搬，依賴上面所有）

4. **建 mock lib**（§14）：`src/lib/auth.ts` / `src/lib/gtoData.ts` / `src/lib/hu/config.ts` 三個 mock 檔

5. **建 demo route** 用 §15.1 範例先 render PokerFeltV2 — 看到 capsule outline + 6 個座位 → 設計系統 OK

6. **跑 §16 視覺驗收 18 項** — 全 pass = 1:1 複製成功

7. **若要跑訓練流程**（不只 render）→ 接 Level B 資料層搬遷（gtoData / Supabase）

---

## 相關連結

- [[ui-v2-rules]] — UI v2 設計規則（capsule wireframe / 4 chips / 不做 slider）
- [[poker-terminology-zh-tw]] — 繁中撲克術語對照
- [[reference_architecture]] — 整體架構總覽（含資料流）
