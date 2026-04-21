---
name: HU 模擬器開發測試流程
description: MTT HU 模擬器 v1.0 的背景、完整 smoke test 清單、架構、GTO 資料狀態、上線步驟 — 新 session 接手時必讀
type: project
originSessionId: 5065028d-7552-432a-8412-69df58de6ce6
aliases: [hu-simulator, HU模擬器, heads-up simulator]
tags: [development, hu, simulator, gto]
---

# MTT HU 模擬器 v1.0 — 開發測試流程

## 背景與狀態

使用者想從 HU 開始做 MTT 情境模擬器（最小驗證單元：2 人、單桌）。引擎 + bot AI + UI + DB + AI 賽後分析已全部實作完成。

- **完整設計 spec**：`docs/superpowers/specs/2026-04-10-mtt-hu-simulator-design.md`
- **Implementation plan**：`docs/superpowers/plans/2026-04-11-mtt-hu-simulator-implementation.md`
- **分期路線**：v1=HU / v2=SNG / v3=FT短+深 / v4=MTT截止買入 / v5=MTT中盤 / v6=MTT完整

## 目前分支狀態（2026-04-16 更新）

- 早期的 `feature/hu-simulator-v1` 已 merge → `dev` → `main`，**HU 已上線**到正式環境
- V2 UI 後續迭代全部在 `dev` 進行（已推到 main，UI_V2 已在所有環境啟用）
- `feature/hu-simulator-v1` branch 仍存在於本地/remote（歷史保留），但不再於其上開發
- **入場費**：由 `src/lib/hu/config.ts` 的 `HU_ENTRY_COST` 常數驅動，`spendPoints` 為正常扣點邏輯
- **種子用戶體驗期**：所有收費點目前仍為 0（HU 入場、HU 違規金、AI 教練、弱點分析、課程解鎖、Edge Function `analyze-hu-hand`）。全部集中在各檔案的 `*_COST` 常數。結束體驗期只要改這些常數，不用改 App.tsx。

## 本地開發環境啟動

```powershell
cd C:\Users\User\Desktop\gto-poker-trainer
npm run dev
```

- Vite dev server 預設跑在 http://localhost:5173
- Hot reload 支援，改 code 後瀏覽器自動更新
- 若 PowerShell 報 `ExecutionPolicy` 錯誤：`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## 驗證指令（每次修完 code 都要跑）

```bash
npx tsc --noEmit              # TypeScript 型別檢查
npx vitest run                # 跑所有 unit tests（目前 116 個）
npm run build                 # 生產建置（Vercel 會跑這個）
```

## Smoke Test 清單

### 進入流程
- [ ] 登入 → Train tab → 看到「HU 對決（新）」入口按鈕
- [ ] 點擊 → 進入 ScenarioSelect → 選 1:1 → 點「開始」
- [ ] 扣點成功（測試時 0 點，上線前恢復 30 點）
- [ ] 進入 HeadsUpMatchScreen

### Preflop 操作
- [ ] **BTN 開局**：看到 FOLD / CALL / RAISE 2.5 / ALLIN（4 顆按鈕，GTO Wizard 風格）
- [ ] **Raise 2.5** → bot 1 秒後回應（call / 3bet / fold）→ **不卡死**
- [ ] **Call（limp）** → bot BB check 或 iso-raise → **進入 flop**（不是 fold）
- [ ] **BB facing open**：看到 FOLD / CALL / RAISE 9 (3-bet) / ALLIN
- [ ] Bot 短碼（≤ 4BB）→ 直接 jam（不會 3bet 再 fold）

### Postflop 操作
- [ ] 進入 flop → 看到 3 張公共牌
- [ ] 動作按鈕顯示：Check / Fold / 小 / 中 / 大 / All-in
- [ ] **所有按鈕金額 ≥ 1 BB**（不會有 0.7BB）
- [ ] **面對加注時**：raise sizing 用 min-raise / 2.5x / pot-raise（不是 pot%）
- [ ] 按鈕操作後 bot 1 秒回應
- [ ] 能正常推進到 turn → river → showdown

### All-in 情境
- [ ] **雙方 preflop all-in** → 自動發完 flop/turn/river → 結算
- [ ] **flop all-in** → 自動發 turn/river → 結算
- [ ] **all-in 後看到對手手牌**（bot info 旁顯示 `[6h Ah]`）
- [ ] **結算 overlay** 顯示 +/- BB 和勝負原因
- [ ] **Showdown delta 正確**（不再顯示 0 BB）
- [ ] **不卡死** → 2.5 秒後自動進下一手或比賽結束

### 比賽結束
- [ ] 一方籌碼歸零 → 進入 HeadsUpReviewScreen（賽後報告頁）
- [ ] 摘要卡顯示：勝/敗 + BB 變化 + 手數 + 違規次數
- [ ] 手牌列表：左色帶（綠=贏 / 紅=違規 / 灰=輸）
- [ ] 點擊任一手 → **inline 展開**（公共牌、動作序列、底牌）
- [ ] 付費用戶看到「AI 分析（3 點）」按鈕 → Claude Haiku 回應
- [ ] 免費用戶看到「升級 Basic / PRO 解鎖」提示
- [ ] 點「回主選單」→ 回到 Train tab

### 違規金
- [ ] 故意用垃圾牌 raise（例如 72o UTG raise）
- [ ] 賽後報告：該手有紅色左邊框
- [ ] 賽後摘要：違規次數 > 0

### 放棄比賽
- [ ] 比賽中按 ✕ → 回到主選單
- [ ] DB 中 session 標記為 `abandoned`

## 已知 Bug（等待修復）

### Critical
（目前無 critical bug）

### Important
1. **All-in runout 沒有動畫** — 雙方 all-in 後瞬間顯示 5 張牌 + 結果，沒有逐張發牌過程。使用者期望：展示對手手牌 → 逐張發 flop → turn → river → 判定勝負。放到 UI 重構階段做。

### Minor
2. **HoleCards 顯示 canonical class** — 玩家手牌用 `handToCanonical`（如 AKo）再隨機分配花色，而非實際發到的花色。公共牌顯示真實花色。不一致。
3. **Per-hand hero_stack_before/after** — DB 寫 0/0，review 畫面 showdown 的 per-hand delta 依賴 evaluateHand 重算。
4. **PRO 賽中即時分析按鈕** — 只有賽後分析，賽中沒有。
5. **Claude API 失敗後不退費** — 扣點在 Claude 呼叫之前，API 失敗 3 點不退。

## 資料庫部署狀態

詳見 [[deployment-state]]。

| 項目 | 狀態 |
|---|---|
| `tournament_sessions` table | ✅ 已建（2026-04-11） |
| `tournament_hands` table | ✅ 已建 |
| `cleanup_tournament_sessions` RPC | ✅ 已建 |
| RLS policies | ✅ 已建 |
| `analyze-hu-hand` Edge Function | ✅ 已部署 |
| `ANTHROPIC_API_KEY` secret | ✅ 已設（和 ai-coach 共用） |

## GTO 資料狀態

| 深度 | Board 數 | 檔案格式 | 狀態 |
|---|---|---|---|
| **40BB**（1:1） | 13 | `gtoData_hu_40bb_srp_flop_*.ts` | ✅ 已產出 + 已整合 |
| **25BB**（1:2, 2:1） | 13 | `gtoData_hu_25bb_srp_flop_*.ts` | ✅ 已產出 + 使用者已整合到 postflop_index |
| **13BB**（1:5, 5:1） | 13 | `gtoData_hu_13bb_srp_flop_*.ts` | ✅ 已產出 + 使用者已整合到 postflop_index |
| **翻前** | 5 scenarios | `gtoData_tourn_hu_40bb.ts` | ✅ 手寫近似（~90% 準確） |

**使用者已自行修改的檔案**（新 session 不要覆蓋）：
- `src/lib/gto/gtoData_hu_postflop_index.ts` — 已整合 25BB/13BB imports + `getPostflopDB()` 函式
- `src/lib/gto/getHUPostflopAction.ts` — 已更新使用 `getPostflopDB`
- `src/components/PreflopActionBar.tsx` — 使用者已改成 GTO Wizard 風格（大色塊按鈕）
- `src/lib/gto/gtoData_tourn_hu_40bb.ts` — 移除了未使用的 import

## 結束種子體驗期 / 恢復收費

> ⚠️ 強制遵守 CLAUDE.md「正式環境保護規則」— 任何 push 到 main **必須**先取得用戶在聊天中明確授權。詳見 [[no-unauthorized-push]]。

把各檔案的 `*_COST` 常數改回正式定價：

- `src/lib/hu/config.ts` → `HU_ENTRY_COST`（0 → 30 或其他）
- `src/components/HeadsUpMatchScreen.tsx` → `cappedViolationPoints` 改回 `Math.min(violations * 2, 10)` 公式
- `src/components/CoachScreen.tsx` → `COST_PER_MESSAGE`
- `src/tabs/AnalysisTab.tsx` → `ANALYSIS_COST`
- `src/tabs/CourseTab.tsx` → `ADVANCED_COST`
- `supabase/functions/analyze-hu-hand/index.ts` → `ANALYSIS_COST`（改完要重新部署 Edge Function，**先測試環境再正式**）

之後跑常規上線步驟（tsc / vitest / build / 版號 / CHANGELOG / dev-log / feature→dev→main），詳見 CLAUDE.md「推送到正式機前的必做事項」章節。

## 架構快速參考

```
src/lib/hu/
├── types.ts              ← Card, HandState, MatchState, etc.
├── cards.ts              ← parseCard, formatCard, rankValue
├── deck.ts               ← newDeck, shuffleDeck, dealCard
├── handEvaluator.ts      ← evaluateHand, compareHands, HandRank
├── engine.ts             ← createMatch, dealNewHand, applyAction, resolveHand
├── botAI.ts              ← decideBotAction, preloadBotData
├── handToCanonical.ts    ← [Card,Card] → 'AKo'
├── gtoCheck.ts           ← isPreflopViolation
├── sessionStorage.ts     ← Supabase CRUD for sessions/hands
└── analyzeHand.ts        ← Edge Function client

src/lib/gto/
├── gtoData_tourn_hu_40bb.ts       ← 翻前 5 scenarios
├── gtoData_hu_40bb_srp_flop_*.ts  ← 翻後 40BB × 13 boards
├── gtoData_hu_25bb_srp_flop_*.ts  ← 翻後 25BB × 13 boards
├── gtoData_hu_13bb_srp_flop_*.ts  ← 翻後 13BB × 13 boards
├── gtoData_hu_postflop_index.ts   ← 集中管理 + getPostflopDB()
├── getHUPostflopAction.ts         ← GTO lookup + heuristic fallback
├── huHeuristics.ts                ← 8 強度分類 + 3 個性
└── gtoData_index.ts               ← 翻前 DB loader

src/components/                ← V1（舊版，仍保留）
├── HeadsUpMatchScreen.tsx    ← 主遊戲畫面
├── HeadsUpReviewScreen.tsx   ← 賽後報告頁
├── HeadsUpScenarioSelect.tsx ← 選擇籌碼比
├── PreflopActionBar.tsx      ← 翻前按鈕（GTO Wizard 風格）
├── PostflopActionBar.tsx     ← 翻後按鈕（小/中/大）
├── CommunityCards.tsx        ← 公共牌顯示
├── PokerFelt.tsx             ← 牌桌（復用現有）
└── HoleCards.tsx             ← 手牌（復用現有）

src/components/v2/             ← V2（當前使用，UI_V2 flag=on），設計規則見 [[ui-v2-rules]]
├── PokerFeltV2.tsx           ← 膠囊牌桌 + 中央 boardCards
├── HeadsUpMatchScreenV2.tsx  ← V2 主遊戲畫面
├── HeadsUpReviewScreenV2.tsx ← V2 賽後報告頁
├── BetSizingBarV2.tsx        ← 單排 action bar（取代 Preflop/PostflopActionBar）
├── FeedbackSheetV2.tsx       ← 底部 sheet 式回饋
└── ActionHistoryBarTop.tsx   ← 頂部動作序列

src/pages/App.tsx             ← 路由 hu-select / hu-match / hu-review
src/tabs/TrainTab.tsx         ← HU 入口按鈕
src/tabs/TrainSetupScreen.tsx ← HU 入口卡片

scripts/gto-pipeline/        ← TexasSolver 資料管線
supabase/migrations/          ← DB migration SQL
supabase/functions/           ← Edge Functions
```
