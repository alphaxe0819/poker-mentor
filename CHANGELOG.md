# Changelog

## v0.8.5 — 2026-04-21 (快速分析功能)

### 新功能
- **exploit-coach 快速分析**（T-080）：S1 首頁新增「🚀 快速分析」入口，貼一段手牌敘述（支援台灣 / 大陸賭場口語：n+4、有效籌碼、小瞎大瞎、埋伏、抽隨機數 call 等）直接獲得 AI 4 街 breakdown
  - 跳過原結構化 S1→S5a 流程
  - AI 回覆：🎯 結論 / 📊 GTO 基準 / 🎭 對手調整 / 🔑 關鍵判斷 每街一段 + ⚡ 整手關鍵收尾
  - 體驗期免費（設計點數 10/次，暫設 0）

### AI 教練文案進一步精修
- 禁詞擴充：「街別分析」「後街」「跑出」「改進跡象」全黑名單
- 段落標題強制具體街名（翻牌分析 / 轉牌分析 / 河牌分析）

## v0.8.4 — 2026-04-21 (exploit-coach 多項 bug fix + AI 中文化)

### 新功能
- **exploit-coach 新建對手 localStorage persist**（T-070）：建新對手關掉 app 不會消失
- **exploit-coach 對話歷史 localStorage + FIFO 3 則**（T-071）：免費版存最新 3 則，假對話可展開當示範
- **流程順序調整：s5b → s5a**（T-072）：對手手牌 picker 提前到「確認牌譜」之前，s5 已知對手牌時直接顯示

### AI 教練文案
- 老張 preset 類型：calling_station 跟注站型 → **standard 標準 GTO 對手**（T-073）
- Edge Function prompt 中文化：大幅縮保留英文 list（只留 BTN/SB/BB/UTG/CO/HJ/LJ/IP/OOP/GTO/ICM/MDF/SPR/4-bet），其他 30+ 術語強制中文翻譯（c-bet → 持續下注 / nit → 緊弱 / check-raise → 過牌加注 等）

### 基礎建設
- 既有 `src/lib/gto/gtoData_*.ts`（150 檔）全部標測試版（T-074）：檔頭加 `// ⚠️ TEST DATA` 註解，index 切 TEST/PROD 兩區，正式版 range 待 T-075 從 pokerdinosaur 建立 + T-076 重跑 solver

## v0.8.3 — 2026-04-21 (AI 教練文案修正)

### exploit-coach Edge Function prompt 調整
- 禁止使用模糊詞「後街」「改進跡象」「跑出」
- 指稱街別一律用具體名：翻牌（flop）/ 轉牌（turn）/ 河牌（river）
- 指 turn+river 用「轉牌或河牌」「後續兩街」，不用「後街」
- ⚠ 需手動貼整檔到測試 + 正式 Supabase Edge Function

## v0.8.2 — 2026-04-21 (hotfix)

### 修復
- **exploit-coach 正式機「需要先登入」hotfix**：`public/exploit-coach-mockup-v3.html` 原本硬寫測試 Supabase project ref，ship 到正式機後 iframe 讀錯 localStorage storage key → 永遠顯示「需要先登入」即使用戶已登入
  - parent `ExploitCoachTab.tsx` 透過 iframe URL query string 注入 `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
  - iframe HTML 從 URL params 推導 `STORAGE_KEY = 'sb-' + projectRef + '-auth-token'`
  - 正式機 / 測試機自動對齊，不再 env 錯位

## v0.8.1 — 2026-04-21

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
- **exploit-coach AI 教練品質大升級**：
  - 繁中 poker 術語精準化：5 個高風險詞黑名單（dominate→壓制 / cooler→冤家牌 / bluff catcher→抓詐唬牌 / polarized→極化範圍 / merged→合併範圍），21 個保留英文清單，12 個推薦譯法，3 條使用規則
  - 連續對話 context 一致性：AI 追問時固定引用本輪場景 + 手牌，不再公式化回覆

### UI 改善
- 撲克牌樣式統一為 V2：數字上方大字 + 花色符號下方小字（移除角落雙花色）
- PokerFeltV2 中央社群牌：rank 19px 置上 + suit 11px 置下，提升可讀性
- HU 對決 layout 改用 `position: fixed; inset: 0`，修復 iOS 動作列被截斷問題
- Felt 容器改用 `flex-1 min-h-0`，解決 PokerFeltV2 高度塌陷問題
- exploit-coach S5b 對手手牌流程：點卡槽 → picker 浮出 → 選牌 → 卡槽填入
- Turn all-in 時主按鈕變「All-in → 攤牌」，直接跳 S5 攤牌頁
- Call 按鈕顯示金額 + 跟注 hint（`跟注需補 N BB`）

### 修復
- heroPosition 統一使用 `BTN/SB`（修復 HU 英雄座位顯示錯誤）
- isCorrect 改由 preflop violation flags 判斷（修復永遠顯示「正確」的問題）
- spendPoints RPC guard：入場費 0 時跳過扣點（修復無法進入 HU 的問題）
- S1 頁面「下一步」按鈕加 hero/對手手牌 guard（未選時不能進下一步）
- S5b `#card-picker` DOM 搬移到 body 層級（修復 picker 在非 S3 screen 無法顯示）
- iOS Safari 401 / Load failed：storage key 從 fuzzy match 改 exact match，加 parent-iframe postMessage token refresh 架構
- raise 輸入框 `inputmode=decimal` + viewport 固定 + scrollIntoView（軟鍵盤體驗改善）

### 後台基礎建設（使用者看不到，但為下一代功能準備）
- **MTT postflop pipeline 打通**：scraping → converter (C0-C4) → solver → DB retrieval 完整鏈路
  - 新 `solver_postflop_mtt` table（獨立於 6max，避免 query 衝突）
  - Tier A 實機驗證：MTT scenario 精準命中 MTT table，非 6max fallback
- **GTO postflop v2 pipeline**：`gto_postflop` + `gto_batch_progress` 雙機協調 schema，batch-worker 跨平台 Node worker
- **bot decision chain async 化**：支援未來更複雜的 DB-driven GTO 查詢
- **Supabase Edge Function 部署**：測試環境 JWT 驗證關閉，繁中術語 grounding 上線
- **Scraping 盤點**：10 個 `_ranges.json` 到位（converter 可吃），S1 Live_MTT_Ben 1149 張已爬完

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
