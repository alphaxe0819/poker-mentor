# Changelog

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
