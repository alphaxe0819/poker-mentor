# Dev Log — 操作記錄

> 每次 commit 自動更新，記錄做了什麼。跟著 Git 同步到所有電腦。
> 最新的記錄在最上面。

---

## 2026-04-17 v0.8.1-dev.6 [dev]
- 整合 wiki 系統到現有 workflow：CLAUDE.md 全面更新
- 新增「收工 SOP」區段：收工前跑 `/compound` 提取對話副產品
- 修正所有 auto-memory 引用 → `memory/wiki/*.md` 路徑
- 更新 session-start-reminder.sh：讀 index.md + 顯示 wiki skills
- 更新 reference_architecture.md：memory/ 目錄結構反映 wiki 子目錄
- 修正 CLAUDE.md 開工 SOP 步驟編號（去除重複步驟 5）

## 2026-04-17 v0.8.1-dev.5 [dev]
- 建立雙 Vault 知識管理系統（Karpathy Second Brain 概念）
- 個人 Vault：`~/Desktop/second-brain/`（Obsidian，已 git init + 首次錄入 Karpathy 文章）
- 專案 Vault：`memory/` 重構為 Obsidian 相容格式（8 檔遷移到 wiki/ + index.md + log.md）
- 新增 4 個 user-level skills：`/wiki-ingest`、`/wiki-healthcheck`、`/compound`、`/rescue-bookmarks`
- 更新 CLAUDE.md 開工 SOP + 分級查詢規則、建立 user-level CLAUDE.md

## 2026-04-16 v0.8.1-dev.4 [feature/exploit-lab]
- 新增 `docs/exploit-coach-mockup.html`：剝削教練完整流程 mockup（12 畫面）
- 流程一：選對手（預設 4 種 + 已儲存 + 新建問卷 6 題 + 雷達圖摘要）
- 流程二：AI 教練對話介面（4 選項：手牌問答/特殊牌面/隨機訓練/弱點報告）
- 流程三：牌桌卡片嵌入對話中，動作按鈕 + GTO vs 剝削對照
- 定義 10 種對手個性模型（standard/nit/weak_tight/fit_or_fold/CS/sticky/trapper/lag/maniac/tag）
- 問卷分類決策樹：5 題選擇 + 1 題自由描述 → 自動歸類為 10 種之一

## 2026-04-16 v0.8.1-dev.3 [feature/exploit-lab]
- 新增「剝削實驗室」獨立頁面（/exploit）— 董事長會議需求 Phase 0
- 新增 `src/lib/exploit/villainProfiles.ts`：4 種對手 profile（標準/緊弱/跟注站/激進）
- 新增 `src/lib/exploit/exploitEngine.ts`：剝削調整引擎，基於 GTO baseline + 對手弱點產出調整建議
- 新增 `src/pages/ExploitLabPage.tsx`：場景設定 + 手牌選擇 + 四欄對照面板
- 修改 `src/lib/explanations.ts`：export categorize() + HandCategory 供 exploit engine 使用
- 修改 `src/main.tsx`：加入 /exploit 路由

## 2026-04-16 v0.8.1-dev.2 [dev]
- 新增 SessionStart 第二個 hook：啟動時自動印出「開工 SOP 提醒」注入 Claude context
- 新增 `scripts/session-start-reminder.sh`：印出 SOP 5 步（讀 dev-log / 讀 MEMORY / 回報狀態 / 問角色 / 等指示）
- worktree 子目錄（POKERNEW-*）自動跳過第 4 步角色問題
- 整合 memory：刪除 project_roadmap.md + project_mtt_hu_simulator.md，更新 dev_workflow_hu_simulator.md 分支狀態，精簡 MEMORY.md 索引 10→8 項

## 2026-04-15 v0.8.1-dev.29 [dev]
- HoleCards 改為 V2 牌面格式：數字上方大字 + 花色下方小字，移除兩個角落花色符號
- 手牌結束結算改為 felt 內部浮動小 chip（absolute top:62%），不再整條橫幅占版面高度
- action bar 手牌結束時顯示「👁 回饋 Ns」+「▶▶ 下一手」兩個按鈕，不須開回饋就能換手
- 寫入 V2 UI 設計規則 memory (project_ui_v2_rules.md)

## 2026-04-15 v0.8.1-dev.28 [dev]
- HU V2：修復 6+1 個介面問題
- 動作 BAR 換成 BetSizingBarV2（單排），移除 PreflopActionBar / PostflopActionBar
- 固定 action bar 高度（68px spacer）防止畫面忽上忽下
- 手牌結算改為 felt 下方橫幅，不再疊在 PokerFeltV2 上
- isCorrect 改用 isPreflopViolation flags 判斷（非固定 true）
- feedbackExpanded 可折疊；onViewRange 串接 RangeGrid overlay
- PokerFeltV2 中央牌面：rank 19px 上方 + suit 11px 下方，改善可讀性

## 2026-04-15 v0.8.1-dev.27 [feature/hu-simulator-v1]
- HeadsUpMatchScreenV2：以 TrainTabV2 V2 版面為基礎完整重建 JSX
- 修正：`position: fixed; inset: 0` 全屏容器，解決 action bar 在 iOS 被蓋住問題
- 修正：felt 容器改為 `flex-1 relative min-h-0`，解決 PokerFeltV2 無高度（GG blob）問題
- 修正：heroPosition 統一使用 `'BTN/SB'` 而非 `'BTN'`，seatInfo key 對應正確
- 修正：community cards 改由 PokerFeltV2 `boardCards` prop 渲染（取代獨立 CommunityCards）
- 新增：ActionHistoryBarTop 顯示 HU 動作序列、showExitConfirm modal

## 2026-04-15 v0.8.1-dev.26 [dev]
- HU V2 UI 收尾完成：FeedbackSheetV2 overlay（10s 倒數）+ AI 書籤系統
- 新建 HeadsUpReviewScreenV2：結果 banner + AI 書籤橫向捲動 + 手牌列表（展開動作序列）
- App.tsx 接線 FEATURE_FLAGS.UI_V2 → HeadsUpReviewScreenV2
- 所有街別 GTO 評分顯示 pending（資料建構中）

## 2026-04-15 v0.8.1-dev.22 [feature/hu-simulator-v1]
- HeadsUpMatchScreenV2：以 10 秒倒數 + setInterval 取代舊的 setTimeout 2500ms 換牌邏輯
- 新增 `feedbackReady` / `feedbackOpen` / `feedbackCountdown` / `aiBookmarkedHands` state
- 新增 `clearCountdown()` / `dealNextHand()` helper function
- 新增浮動「👁 回饋」按鈕（fixed bottom-24 right-4），顯示剩餘秒數
- Props `onMatchComplete` 加入第三參數 `aiBookmarks: number[]`；App.tsx handler 同步更新

## 2026-04-15 v0.8.1-dev.21 [feature/hu-simulator-v1]
- 新增 `computeHandFeedback` 純函式到 HeadsUpMatchScreenV2.tsx（exported）
- 新增 `HUHandFeedback` interface（tip / actions / streets / isCorrect / explanation）
- 新增 `import type { ActionFreq, StreetScore }` from FeedbackSheetV2
- 新增 `import type { HandState }` from types
- 建立 `src/__tests__/hu/computeHandFeedback.test.ts`，6 項測試全通過

## 2026-04-15 v0.8.1-dev.20 [dev]
- HU 修：POSITION_MAP[2] 從 ['BTN', 'BB'] 改回 ['BTN/SB', 'BB']
  - 加 infoKey lookup `BTN/SB → SB`，讓 engine 寫的 SB seatInfo 找得到
  - heroPosition='SB' 時自動 map 到 'BTN/SB' 找 slot
  - 修好 HU BTN 不顯示 0.5 SB 盲注 + 加注 chip 的 bug
- 籌碼位置雙係數：水平 0.30（左右側座位拉近）/ 垂直 0.18（上下座位仍跳過蓋牌）

## 2026-04-15 v0.8.1-dev.19 [dev]
- 接上「查看範圍」按鈕：feedback sheet 點擊後彈出 RangeGrid overlay（覆蓋 felt，點背景關閉）
- 下注 chip offset 0.3 → 0.22，再往座位拉回（top/bottom 座位 chip 距離明顯縮小）

## 2026-04-15 v0.8.1-dev.18 [dev]
- 下注 chip offset 0.4 → 0.3，往座位拉回一些（仍跳過蓋牌區不被擋）

## 2026-04-15 v0.8.1-dev.17 [dev] — UI v2 第二輪用戶回饋
- 座位圓內文字往下偏（paddingTop: 14）— 蓋牌不再壓到 UTG / SB 等位置名
- 移除 hero 手牌下方的「A2s 同花」label
- Hero 手牌 marginTop -24 → -8，視覺上略低於 BTN 座位（但 action bar 位置不變）

## 2026-04-15 v0.8.1-dev.16 [dev] — Claude Code powerup：Skill + Agent + CLAUDE.md 補強
- CLAUDE.md：移除寫死的 Desktop 路徑（多機開發路徑不一致），改「本機路徑依各機器而定」
- CLAUDE.md：新增「產品核心規則」章節，精簡版座位順序 + UI v2 規則，完整版仍在 auto-memory
- 新增 Skill `.claude/skills/preflight-main/SKILL.md`：push main 守門員，11 步檢查（tsc/版號/CHANGELOG/dev-log/授權）
- 新增 Agent `.claude/agents/poker-rules-reviewer.md`：唯讀審查員，檢查 engine/PokerFelt 是否違反德州規則或座位順序
- 用法：輸入 `/preflight-main` 跑檢查、改 engine 後請 Claude 用 poker-rules-reviewer 審查

## 2026-04-15 v0.8.1-dev.15 [dev] — UI v2 第一輪用戶回饋修正
- TrainTabV2 改 `position: fixed; inset: 0; z: 50` 全螢幕，蓋住父層的「練習/課程」sub-tab + BottomNav
- PokerFeltV2 z-index 重排：輪廓線(0) → 座位圓(2) → 蓋牌(4)；座位圓改實心深色底（不透明），輪廓線不再穿透
- 下注 chip offset 0.2 → 0.4，往桌心多偏，跳過蓋牌區避免重疊
- BetSizingBarV2 雙排合併單排，所有按鈕同一 flex line，節省垂直空間
- 預期：訓練時整片牌桌全螢幕、座位/蓋牌/籌碼層級正確、按鈕一排到底

## 2026-04-15 v0.8.1-dev.14 [dev]
- UI_V2 flag resolution 改為自動判斷：staging（poker-goal-dev）預設 V2、正式機預設 V1
- 新增 `?ui=v1` / `?ui=v2` query param 強制覆蓋（方便 staging 退回舊版對照）
- 不用再貼 localStorage 指令，打開 staging 網址就直接看到新 UI

## 2026-04-15 v0.8.1-dev.13 [feature/ui-v2 → dev]
- UI v2：膠囊牌桌 + 四色卡 + 頂部 action bar + 底部 drag sheet + 街別評分 chips + AI 教練 CTA
- 新增元件：`src/components/v2/{PokerFeltV2, ActionHistoryBarTop, BetSizingBarV2, FeedbackSheetV2, HeadsUpMatchScreenV2}.tsx`
- 新增 `src/tabs/TrainTabV2.tsx`（engine 不變，只改 UI layer）
- 新增 `src/lib/featureFlags.ts` + `UI_V2` flag（localStorage 驅動）
- App.tsx 依 flag 切換 V1 / V2；HU 同樣支援
- 新增 `/v2-demo` 路由與 V2DemoPage（A/B/C 靜態場景 + D 實機 TrainTabV2）
- 更新 `docs/ui-v2-mockup.html`（完整設計定稿：9-max、6-max、HU 三場景）
- 更新 memory：`project_ui_v2_rules.md` 規則檔、`project_seat_order.md` 座位順序
- 修 .env BOM（之前 Vite 認不得 VITE_SUPABASE_URL）
- Merged 上游 HU branch 的 CLAUDE.md 規則升級（SessionStart hook、自動部署授權、測試機驗證流程）

## 2026-04-15 v0.8.1-dev.12 [feature/hu-simulator-v1]
- CLAUDE.md 新增「推送到測試機後的必做驗證」：dev push 後 Claude 自動 curl 驗證 Vite build 產出正常
- 驗證用 curl 而非 WebFetch（WebFetch 會把 HTML 總結掉，抓不到 script tags）

## 2026-04-15 v0.8.1-dev.11 [feature/hu-simulator-v1]
- CLAUDE.md 新增「自動部署授權（測試環境）」：Claude 可主動 merge→dev+push、主動產出測試 Supabase 貼碼，不需每次問
- 原「Feature Branch 保護規則」改名為「正式環境保護規則」，範圍收緊到 main + 正式 Supabase
- 「標準流程」4 步都標註授權層級（自動 / 需授權）
- CoachScreen 死碼清理：insufficientPoints 提示在 COST=0 時改顯示「目前免費體驗中」
- dev_workflow_hu_simulator.md 同步：上線步驟 8 標【自動】、步驟 10 標【需授權】

## 2026-04-14 v0.8.1-dev.10 [feature/hu-simulator-v1]
- CLAUDE.md「開工 SOP」措辭改強制：Claude 必須主動執行，不准問用戶
- 加禁止行為清單：不准問「要跑嗎」、不准跳過讀記憶檔

## 2026-04-14 v0.8.1-dev.9 [feature/hu-simulator-v1]
- 新增 SessionStart hook（.claude/settings.json）：每次開 session 自動 git fetch --all + pull 當前 branch
- 不用手動貼指令，Claude Code 啟動時就會自動同步雲端

## 2026-04-14 v0.8.1-dev.8 [feature/hu-simulator-v1]
- CLAUDE.md 新增「開工 SOP」：git pull --all + 讀 dev-log + 讀 MEMORY.md + 回報狀態

## 2026-04-14 v0.8.1-dev.7 [feature/hu-simulator-v1]
- setup-env 腳本加入 git identity 自動檢查（step 0），新電腦不用手動設
- HU 入口接上：entryCost 從 `src/lib/hu/config.ts` 常數驅動，還原 spendPoints 扣點
- 種子用戶體驗期：所有收費點改 0（HU 入場、AI 教練、弱點分析、課程解鎖、HU 違規金、Edge Function analyze-hu-hand）
- UI 文案動態化：cost=0 時顯示「免費體驗」
- CLAUDE.md 新增「Edge Function / DB Migration 部署順序」規則：強制先測試環境 → 驗證 → 再正式
- 測試環境 Edge Function analyze-hu-hand 已 deploy 到 btiqmckyjyswzrarmfxa

## 2026-04-14 v0.8.1-dev.6 [feature/hu-simulator-v1]
- 修 setup-env.ps1/sh：移除 emoji，改用純 ASCII（PowerShell 編碼問題）

## 2026-04-14 v0.8.1-dev.5 [feature/hu-simulator-v1]
- 刪除 .env.example（避免 Claude session 誤用）
- setup-env 腳本升級：合併 npm install + TypeScript 檢查，一鍵完成
- CLAUDE.md SOP 簡化為單一腳本執行

## 2026-04-14 v0.8.1-dev.4 [feature/hu-simulator-v1]
- CLAUDE.md 新增「新電腦設定 SOP」：明確指定跑 setup-env 腳本，不要用 .env.example
- 修正問題：新電腦 Claude session 沒跑 setup-env、不知道 staging 環境已存在

## 2026-04-14 v0.8.1-dev.3 [feature/hu-simulator-v1]
- 新增 memory/dev-log.md：跨機操作記錄，跟 Git 同步
- CLAUDE.md 加入操作記錄規則：每次 commit 必須更新 dev-log
- 新 session 開始時先讀 dev-log 了解最近開發脈絡

## 2026-04-14 v0.8.1-dev.2 [feature/hu-simulator-v1]
- 新增 setup-env 腳本（ps1 + sh），新電腦自動產生 .env
- 更新流程圖：新電腦 SOP 改為自動化

## 2026-04-14 v0.8.1-dev.1 [feature/hu-simulator-v1]
- 新增版號規則：每次 commit 遞增 dev 版號並在對話中回報
- 版號格式 vX.Y.Z-dev.N

## 2026-04-14 v0.8.0 [feature/hu-simulator-v1]
- 建立雲端開發流程圖 docs/two-machine-workflow.html (v3)
- 建立 dev branch 並 push 到 GitHub
- 建立測試環境：Supabase staging (btiqmckyjyswzrarmfxa) + Vercel poker-goal-dev
- 測試 Supabase 跑完所有 DB migration + 部署 5 個 Edge Functions
- 更新 CLAUDE.md：feature → dev → main 分支策略 + 雙環境部署
- 新增 docs/poker-goal-architecture.html + poker-goal-mindmap.html
