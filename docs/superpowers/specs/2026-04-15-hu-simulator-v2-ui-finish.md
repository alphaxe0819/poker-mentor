# HU 模擬器 V2 UI 收尾設計

**日期**: 2026-04-15
**分支**: dev
**版本**: v0.8.1-dev.20+

## 背景

HU 模擬器遊戲引擎與 V2 牌桌畫面（`HeadsUpMatchScreenV2`）已完成。本 spec 定義三個收尾項目：

1. 每手結束後的 GTO 回饋 sheet（手牌間回饋）
2. AI 教練書籤（賽中加入，賽後分析）
3. 賽後 Review 畫面完整 V2 重設計

---

## 1. 手牌間 GTO 回饋 sheet

### 觸發時機與控制

- 每手 `isComplete` → `resolveHand` 完成後，計算 `feedbackReady` 物件
- 右下角出現浮動「👁 回饋」按鈕 + **10 秒倒數圓環**
- 用戶**不點**：倒數結束 → 自動換手（原 2.5s 延遲改為整合進 10s 內）
- 用戶**點擊**：開啟 `FeedbackSheetV2` overlay，遮蓋整個畫面

### FeedbackSheetV2 資料（第一版）

| 欄位 | 值 |
|---|---|
| `isCorrect` | 固定 `true`（不顯示紅色 ✗，GTO 資料建構中） |
| `tip` | `"{手牌 canonical} · {heroPos.toUpperCase()}"` 例如 `"AKo · BTN"` |
| `actions` | 單條：`{ label: 你的選擇動作名, freq: 100, color: '#7c3aed', isYours: true }` |
| `streets` | 全部 4 街 `state: 'pending'`（顯示 `—`，文字為 `資料建構中`） |
| `explanation` | `"街別 GTO 評分建構中，未來版本將顯示詳細頻率資料。"` |
| `onAskAI` | 書籤邏輯（見第 2 節） |

> **Note**: `StreetState` 現有 `'pending'` 顯示 `—`，UI 文字已夠用，不新增新型別。

### 動作按鈕

- **「▶▶ 下一手」**：關閉 sheet → 立即換手
- **「⊞ 查看範圍」**：開啟 `RangeGrid` overlay（現有邏輯，直接複用）

### 倒數機制

- `feedbackCountdown: number` state，初始 10
- `useEffect` 每秒 decrement
- 歸零 → `feedbackReady = null`，呼叫 `dealNewHand`（**取代**現有 `setTimeout 2500ms` 邏輯，不疊加）
- 點擊「👁 回饋」→ 清掉 countdown interval（暫停），顯示 sheet
- 點「▶▶ 下一手」→ 立即 `dealNewHand`，不再倒數

---

## 2. AI 教練書籤（賽中 → 賽後）

### 賽中行為

- `aiBookmarkedHands: number[]` — 儲存被書籤的 `hand.handNumber`
- 用戶在 FeedbackSheetV2 展開後點「AI 教練」按鈕：
  - 若該手尚未書籤：加入 `aiBookmarkedHands`，顯示 toast `「✓ 已加入賽後分析」`（1.5s）
  - 若已書籤：顯示 `「已在書籤中」`（不重複加）
  - **不扣點、不呼叫 API**

### 資料流

```
HeadsUpMatchScreenV2
  onMatchComplete(finalState, flagsByHand, aiBookmarks: number[])
    ↓
App.tsx  huAIBookmarks: number[]
    ↓
HeadsUpReviewScreenV2
  props: { aiBookmarks, onAnalyzeHand }
```

### Props 型別異動

```ts
// HeadsUpMatchScreenV2 Props
onMatchComplete: (
  finalState: MatchState,
  flagsByHand: FlagsByHand,
  aiBookmarks: number[]
) => void

// App.tsx 新增
const [huAIBookmarks, setHuAIBookmarks] = useState<number[]>([])
// handleHuMatchComplete 第三參數接收並 setHuAIBookmarks
// onBack 清空：setHuAIBookmarks([])
```

> 舊版 `HeadsUpMatchScreen`（非 V2）的 `onMatchComplete` 型別**不變**。

---

## 3. HeadsUpReviewScreenV2

**新檔案**：`src/components/v2/HeadsUpReviewScreenV2.tsx`

`App.tsx` 在 `appMode === 'hu-review'` 時：
```ts
const ReviewScreen = FEATURE_FLAGS.UI_V2 ? HeadsUpReviewScreenV2 : HeadsUpReviewScreen
```

### Props

```ts
// FlagsByHand 從 HeadsUpMatchScreenV2 import（兩個 match screen 定義相同型別，V2 版為主）
import type { FlagsByHand } from '../v2/HeadsUpMatchScreenV2'

interface Props {
  match: MatchState
  userTier: 'free' | 'basic' | 'pro'
  gtoFlagsByHand: FlagsByHand
  aiBookmarks: number[]
  onAnalyzeHand: (handIndex: number) => Promise<string>
  onBack: () => void
}
```

### 版面結構（從上到下）

#### ① 結果 Banner（頂部固定）

```
[ ✕ 回主選單 ]              [ 賽事報告 ]
┌─────────────────────────────────────┐
│ 🏆  +23 BB 勝利              (綠框) │
│  或  💔  -15 BB 失敗         (紅框) │
├──────────┬──────────┬───────────────┤
│  手數 18  │ 違規  2  │  書籤  3  🤖  │
└──────────┴──────────┴───────────────┘
```

- 背景 `#0a0a0a`，Banner 卡片 `background: #111, border: 1px solid #1a1a1a`
- 勝利：左側 4px 綠色 border (`#10b981`)；失敗：紅色 (`#ef4444`)
- 三格統計 grid-cols-3

#### ② AI 書籤區（有書籤時才顯示）

- 標題列：`🤖 賽後 AI 分析（{N} 手）`
- 橫向可滾動 scroll 列，每張書籤卡：
  - 手 #N + 手牌 canonical（例如 AKo）
  - 狀態按鈕：`分析 3點` → loading → 分析完成後顯示 `✓ 已分析`
  - 分析完成後，卡片下方 inline 展開分析文字（截斷 120 字，點「展開」看全文）

#### ③ 全部手牌列表

每手一列卡片：

```
│ ▌ 🂠🂠  AKo  As Kh   [9d 7c 2h] ... │  +3 BB >
```

- 左側色帶 4px：贏 → 綠 / 違規 → 黃 / 輸 → 灰
- Hero 手牌：`HoleCards` 元件（四色卡，size="small"）
- 手牌 canonical（例如 AKo）
- 公共牌：`CommunityCards` 元件（若有）
- 右側：`+3 BB` 或 `-2 BB` + `>` 展開箭頭
- **有書籤**的手：左側色帶外加 `🤖` icon

**展開後（inline）：**
- 動作序列（文字列表，BTN Raise → BB 3-Bet → BTN Call…）
- 四個街別 chip（全 `pending` / `—`，灰色）
- 若該手有完成 AI 分析：直接顯示分析文字
- 若該手有書籤未分析：顯示「AI 分析」按鈕

#### ④ 底部 padding

最後一張卡片下方留 80px padding，防止被 BottomNav 遮住。

---

## 檔案異動清單

| 檔案 | 動作 |
|---|---|
| `src/components/v2/HeadsUpMatchScreenV2.tsx` | 加入 `feedbackReady`, `feedbackCountdown`, `aiBookmarkedHands` 狀態；渲染「👁 回饋」按鈕 + `FeedbackSheetV2` overlay；`onMatchComplete` 加第三參數 |
| `src/components/v2/HeadsUpReviewScreenV2.tsx` | **新建**，完整 V2 review 畫面 |
| `src/pages/App.tsx` | 新增 `huAIBookmarks` state；更新 `handleHuMatchComplete`；`hu-review` 切換到 `HeadsUpReviewScreenV2` |

---

## 不在本 spec 範圍內

- GTO 街別評分計算（所有街別暫顯示 `pending` / `資料建構中`）
- Turn / River GTO 資料產出
- PRO 賽中即時分析
- All-in runout 動畫
