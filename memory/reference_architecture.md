---
name: Poker Goal 架構總覽
description: 專案目錄結構、技術棧、資料流、關鍵檔案對照表，新 session 必讀
type: reference
---

# Poker Goal 架構總覽

## 技術棧
- **前端**: React 19 + TypeScript 5.9 + Vite 8 + Tailwind CSS
- **後端**: Supabase（PostgreSQL + Auth + Edge Functions / Deno）
- **部署**: Vercel（前端）+ Supabase Cloud（DB / Edge Functions）
- **監控**: Sentry
- **付費**: Lemon Squeezy

## 產品定位
GTO 撲克訓練 App（行動優先 web app），核心功能：
1. **訓練模式**（6-max / 9-max 翻前 + 翻後 GTO 訓練）
2. **HU 模擬器**（Heads-Up 對戰 bot，翻前 + 翻後多街）
3. **AI 教練**（Claude Haiku，付費 5 點/則）
4. **課程 / 測驗 / 統計分析**

## 目錄結構

```
poker-mentor/
├── src/
│   ├── main.tsx              # 進入點，路由分流（/v2-demo, /exploit, 主 App）
│   ├── version.ts            # 版號（每次 commit 必遞增）
│   ├── index.css             # Tailwind + 全域樣式
│   ├── pages/                # 頂層頁面
│   │   ├── App.tsx           # 主 App（auth → 底部 nav → tab 切換）
│   │   ├── AuthPage.tsx      # 登入 / 註冊
│   │   ├── AdminDashboard.tsx
│   │   ├── UpgradePage.tsx   # 付費升級
│   │   ├── SharePage.tsx
│   │   ├── ChangelogPage.tsx
│   │   ├── V2DemoPage.tsx    # UI v2 獨立展示頁
│   │   └── ExploitLabPage.tsx
│   ├── tabs/                 # App.tsx 底部 nav 對應的 tab
│   │   ├── TrainTab.tsx      # 訓練模式 v1（6/9-max GTO）
│   │   ├── TrainTabV2.tsx    # 訓練模式 v2（UI v2 版本）
│   │   ├── TrainSetupScreen.tsx
│   │   ├── StatsTab.tsx
│   │   ├── AnalysisTab.tsx
│   │   ├── CourseTab.tsx
│   │   ├── CoachListTab.tsx
│   │   ├── EditorTab.tsx
│   │   ├── ProfileTab.tsx
│   │   └── QuizTab.tsx
│   ├── components/           # UI 元件
│   │   ├── PokerFelt.tsx     # 牌桌 v1（座位 POSITION_MAP 是權威）
│   │   ├── PreflopActionBar.tsx
│   │   ├── PostflopActionBar.tsx
│   │   ├── ActionFeedback.tsx
│   │   ├── ActionHistory.tsx
│   │   ├── HoleCards.tsx     # 手牌顯示（花色配色規則）
│   │   ├── CommunityCards.tsx
│   │   ├── BottomNav.tsx     # 底部導航列
│   │   ├── HeadsUpMatchScreen.tsx   # HU 對戰 v1
│   │   ├── HeadsUpReviewScreen.tsx  # HU 回顧 v1
│   │   ├── HeadsUpScenarioSelect.tsx
│   │   ├── CoachScreen.tsx   # AI 教練聊天
│   │   ├── RangeGrid.tsx     # GTO 範圍格
│   │   ├── v2/              # UI v2 元件（設計規則見 memory project_ui_v2_rules.md）
│   │   │   ├── PokerFeltV2.tsx
│   │   │   ├── BetSizingBarV2.tsx
│   │   │   ├── FeedbackSheetV2.tsx
│   │   │   ├── ActionHistoryBarTop.tsx
│   │   │   ├── HeadsUpMatchScreenV2.tsx
│   │   │   └── HeadsUpReviewScreenV2.tsx
│   │   └── ...（其他 UI 元件）
│   ├── lib/                  # 業務邏輯 / 引擎
│   │   ├── supabase.ts       # Supabase client 初始化
│   │   ├── auth.ts           # 登入、profile、daily limit
│   │   ├── points.ts         # 點數系統（add_points / spend_points RPC）
│   │   ├── featureFlags.ts   # Feature flag（UI_V2 開關）
│   │   ├── missions.ts       # 每日任務
│   │   ├── lemonsqueezy.ts   # 付費訂閱
│   │   ├── courseSync.ts     # 課程進度同步
│   │   ├── explanations.ts   # GTO 解釋文字
│   │   ├── gto/              # GTO 引擎
│   │   │   ├── getGTOAction.ts         # 查 GTO 翻前動作
│   │   │   ├── getGTOPostflopFromDB.ts # 查 GTO 翻後（從 Supabase）
│   │   │   ├── getHUPostflopAction.ts  # HU 翻後 GTO
│   │   │   ├── gtoData_index.ts        # 翻前 GTO 資料索引
│   │   │   ├── gtoData_*.ts            # 各桌型/籌碼深度的 GTO 靜態資料
│   │   │   ├── helpers.ts
│   │   │   └── huHeuristics.ts         # HU 啟發式判斷
│   │   ├── hu/               # HU 模擬器引擎
│   │   │   ├── engine.ts     # 核心：發牌、下注流程、街推進
│   │   │   ├── botAI.ts      # Bot AI（基於 GTO + 啟發式）
│   │   │   ├── gtoCheck.ts   # 檢查 hero 動作是否符合 GTO
│   │   │   ├── handEvaluator.ts  # 牌力評估
│   │   │   ├── cards.ts / deck.ts
│   │   │   ├── config.ts     # HU 設定（入場費、起始籌碼等）
│   │   │   ├── types.ts      # HU 專用型別
│   │   │   └── sessionStorage.ts
│   │   └── exploit/          # Exploit 實驗室引擎
│   │       ├── exploitEngine.ts
│   │       └── villainProfiles.ts
│   ├── data/                 # 靜態資料
│   │   ├── quizQuestions.ts
│   │   └── coachOnboarding.ts
│   └── types/                # 共用型別
│       ├── index.ts
│       └── poker.ts
├── supabase/
│   ├── functions/            # Edge Functions（Deno，手動部署到 Dashboard）
│   │   ├── ai-coach/         # AI 教練（呼叫 Claude Haiku）
│   │   ├── analyze-hu-hand/  # HU 手牌分析
│   │   ├── analyze-weakness/ # 弱點分析
│   │   ├── lemon-webhook/    # Lemon Squeezy webhook
│   │   └── redeem-promo/     # 兌換促銷碼
│   └── migrations/           # DB migration（手動貼到 SQL Editor）
├── docs/                     # 文件 / mockup
├── memory/                   # 專案知識庫（Obsidian Vault）
│   ├── wiki/                 # 知識頁面（Obsidian [[wikilink]] 互連）
│   ├── raw/                  # 開發決策原始記錄
│   ├── index.md              # 分級查詢入口（取代舊 MEMORY.md）
│   ├── log.md                # wiki 操作記錄
│   ├── dev-log.md            # commit 操作記錄
│   └── reference_architecture.md  # 本檔案
├── scripts/                  # setup-env 等工具腳本
└── public/                   # 靜態資源
```

## 資料流

```
用戶操作（手機瀏覽器）
  → React 前端（Vite SPA）
    → 訓練/HU：本地 GTO 引擎（lib/gto/, lib/hu/）計算
    → 需要後端時：Supabase client（lib/supabase.ts）
      → Supabase Auth（登入/註冊）
      → Supabase PostgreSQL（profile, points, stats, GTO postflop data）
      → Supabase Edge Functions（AI 教練, 手牌分析, 付費 webhook）
        → 外部 API（Claude Haiku, Lemon Squeezy）
```

## 關鍵進入點

| 場景 | 起點檔案 |
|---|---|
| 用戶開啟 App | `main.tsx` → `App.tsx` → auth check → BottomNav |
| 6/9-max 訓練 | `TrainTab.tsx`（v1）/ `TrainTabV2.tsx`（v2） |
| HU 模擬器 | `HeadsUpScenarioSelect` → `HeadsUpMatchScreen(V2)` → `HeadsUpReviewScreen(V2)` |
| AI 教練 | `CoachScreen.tsx` → Edge Function `ai-coach` |
| GTO 翻前查詢 | `lib/gto/getGTOAction.ts` → 本地靜態資料 |
| GTO 翻後查詢 | `lib/gto/getGTOPostflopFromDB.ts` → Supabase DB |
| HU 引擎 | `lib/hu/engine.ts`（狀態機）+ `botAI.ts`（AI 決策） |
| 點數增減 | `lib/points.ts` → Supabase RPC（原子操作） |

## UI 版本切換
- `featureFlags.ts` 的 `UI_V2` 控制（目前預設 V2）
- 可用 URL param `?ui=v1` / `?ui=v2` 或 localStorage 覆蓋
- V2 元件在 `src/components/v2/`，設計規則見 `memory/wiki/ui-v2-rules.md`

## 雙環境
- **測試**: `poker-goal-dev.vercel.app` + Supabase `btiqmckyjyswzrarmfxa`
- **正式**: `poker-goal.vercel.app` + Supabase `qaiwsocjwkjrmyzawabt`
