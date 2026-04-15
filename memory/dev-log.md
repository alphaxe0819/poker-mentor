# Dev Log — 操作記錄

> 每次 commit 自動更新，記錄做了什麼。跟著 Git 同步到所有電腦。
> 最新的記錄在最上面。

---

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
