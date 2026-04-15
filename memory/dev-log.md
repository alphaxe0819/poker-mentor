# Dev Log — 操作記錄

> 每次 commit 自動更新，記錄做了什麼。跟著 Git 同步到所有電腦。
> 最新的記錄在最上面。

---

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
