# Changelog

## v0.8.1 — 2026-04-15

### 新功能
- **HU 對決 V2 介面**：全面重建 HeadsUpMatchScreenV2，以第二代 UI 為基礎
  - 單排 BetSizingBarV2 動作列（取代雙排舊版）
  - 手牌結束後直接顯示「▶▶ 下一手」按鈕，不需先開回饋
  - 每手 GTO 回饋 sheet（10 秒倒數，可點進查看）+ AI 書籤（賽後分析）
  - RangeGrid overlay 查看完整範圍
  - 手牌結算改為 felt 內浮動 chip，不影響版面高度
- **HeadsUpReviewScreenV2**：賽後結算畫面
  - 結果 banner（+BB / -BB、手數、違規數、AI 書籤數）
  - 全部手牌列表（展開顯示動作序列 + 4 街 GTO 評分 pending chip）
  - AI 書籤橫向捲動區，可對書籤手牌進行 AI 分析

### UI 改善
- 撲克牌樣式統一為 V2：數字上方大字 + 花色符號下方小字（移除角落雙花色）
- PokerFeltV2 中央社群牌：rank 19px 置上 + suit 11px 置下，提升可讀性
- HU 對決 layout 改用 `position: fixed; inset: 0`，修復 iOS 動作列被截斷問題
- Felt 容器改用 `flex-1 min-h-0`，解決 PokerFeltV2 高度塌陷問題

### 修復
- heroPosition 統一使用 `BTN/SB`（修復 HU 英雄座位顯示錯誤）
- isCorrect 改由 preflop violation flags 判斷（修復永遠顯示「正確」的問題）
- spendPoints RPC guard：入場費 0 時跳過扣點（修復無法進入 HU 的問題）

## v0.8.0 — 2026-04-11

### 新功能
- **MTT HU 對決模擬器 v1.0**：和 AI bot 打完整 80BB HU 對戰
  - 5 種起始籌碼比（1:5 / 1:2 / 1:1 / 2:1 / 5:1）
  - 入場費 30 點 / 場
  - Bot 翻前用 GTO 範圍（HU 40BB 手寫近似），翻後 13 個 board GTO + 啟發式 fallback
  - 三種 bot 個性（standard / rock / aggressive，只影響 fallback heuristic）
  - 1 秒機器人決策動畫
  - 賽後報告頁附 GTO 紅標 + AI 深度分析（付費用戶 3 點 / 手）
  - PRO 訂閱享賽事 log 1 年保留

### 技術
- 新增 13 個 HU 翻後 GTO range（`src/lib/gto/gtoData_hu_40bb_srp_flop_*.ts`）
- 新增 HU 翻前 GTO chart（`src/lib/gto/gtoData_tourn_hu_40bb.ts`）
- 新增 HU 純引擎 + 手牌評估（`src/lib/hu/`）
- 新增 bot AI 整合 + fallback 啟發式
- 新增 UI 元件：`HeadsUpMatchScreen`、`HeadsUpReviewScreen`、`HeadsUpScenarioSelect`、`PostflopActionBar`、`CommunityCards`
- 新增 Supabase tables：`tournament_sessions`、`tournament_hands`（migration 在 `supabase/migrations/`，需手動執行）
- 新增 Edge Function：`analyze-hu-hand`（Claude Haiku，需手動部署）
- 新增 TexasSolver CLI 資料管線（`scripts/gto-pipeline/`）
- 修復 `src/lib/gto/getGTOAction.ts` key 建構 bug（之前使用 `gameType` 字面字串，現改用 `gameTypeKey`）

## v0.7.2 (2026-04-10)

### 文件
- 更新產品架構白板 (`/whiteboard.html`) — 完整訂閱定價（免費/NT$299/NT$1,000）、教練記憶分層、手牌批量分析（PRO）、App Store 標準儲值分級

## v0.7.1 (2026-04-09)

### 新功能
- `/changelog` 頁面 — 版本更新紀錄網頁
- `CLAUDE.md` 專案工作規則檔案
- PointsBadge + 加號按鈕（儲值即將推出 / 任務跳轉）

### 改動
- 答題正確不再加點數
- 推送流程規範化（版本號 → CHANGELOG → MEMORY → CLAUDE.md → push）

### 修復
- 訓練完成 NaN% 閃現修復
- AI 教練切 tab 對話消失修復
- 免費用戶無限訓練次數
- localStorage 點數洩漏修復

## v0.7.0 (2026-04-09)

### 新功能
- 撲克 MBTI 測驗（10 題）取代舊 3 題體驗，含雷達圖、回饋問卷、Canvas 分享卡
- AI 聊天教練 — 3 題免費體驗 + Claude Haiku 付費對話（5 點/則）
- 任務系統 — 每日登入(+5)、連續 7 天(+50)、里程碑(100/500/1000/5000 題)、邀請好友(+100)、MBTI 完成(+20)
- PointsBadge 元件 — 所有頁面統一點數顯示 + 加號按鈕（儲值/任務導航）
- 測驗結果詳細分析頁（註冊後顯示）含個性化課程推薦

### 改動
- BottomNav 重整為 5 tabs：教練、訓練（練習+課程子 tab）、統計、分析、帳號
- 點數系統重構 — Supabase 為唯一來源，add_points / spend_points 原子 RPC
- 免費用戶不限訓練次數
- 答題正確不再加點，點數只從任務和未來儲值取得
- 註冊流程引導從「先體驗 3 題」改為「測測你的撲克 MBTI」

### 修復
- 測驗結果計分平衡（不再永遠是鯊魚型）
- 訓練完成不再閃現 NaN% 結算畫面
- AI 教練切換 tab 後對話不再消失
- localStorage 舊點數不再洩漏給新帳號

## v0.6.0 (2026-04-08)

### 改動
- Anthropic API key 從前端移至 Supabase Edge Function
- Service key 移除（不再暴露在前端）
- Error Boundary + Sentry 整合
- GTO 資料動態載入 + Tab lazy loading
- React.memo 優化（RangeGrid、PokerFelt、HoleCards、BottomNav）
- 點數同步修復（queued async + visibilitychange sendBeacon）
- Vite manualChunks（react / supabase / router 獨立 chunk）
- 每日限制啟用
- Vitest 測試（21 tests）
