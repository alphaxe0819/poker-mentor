# POKER GOAL — 產品設計規格文件 v1.0

> 最後更新：2026-04-07

---

## 目錄

1. [產品概覽](#1-產品概覽)
2. [技術架構](#2-技術架構)
3. [核心功能模組](#3-核心功能模組)
4. [用戶體驗流程](#4-用戶體驗流程)
5. [數據模型](#5-數據模型)
6. [商業模式](#6-商業模式)
7. [行業標準對比分析](#7-行業標準對比分析)
8. [功能缺口清單](#8-功能缺口清單)
9. [優先級路線圖建議](#9-優先級路線圖建議)

---

## 1. 產品概覽

| 項目 | 說明 |
|------|------|
| **產品名稱** | Poker Goal |
| **版本** | 0.4.0 |
| **定位** | GTO 翻前策略訓練平台 |
| **目標用戶** | 初中級德州撲克玩家，想系統學習 GTO 翻前策略 |
| **平台** | Web（Mobile-first, 最大寬度 480px） |
| **語言** | 繁體中文（位置縮寫保留英文標準） |
| **技術棧** | React 19 + TypeScript + Vite + Supabase + Tailwind CSS |

### 產品願景
為中文撲克玩家提供一個易上手、系統化的 GTO 翻前訓練工具，透過遊戲化機制與 AI 分析降低 GTO 學習門檻。

---

## 2. 技術架構

### 2.1 前端
- **框架：** React 19 + TypeScript
- **建構工具：** Vite 8.0.1
- **樣式：** Tailwind CSS 3.4 + CSS Variables
- **路由：** React Router 6.30
- **字體：** Outfit (UI) + IBM Plex Mono (數據)

### 2.2 後端服務
- **資料庫/認證：** Supabase (PostgreSQL + Auth + RLS)
- **AI 分析：** Anthropic Claude API
- **部署：** Vercel / Netlify

### 2.3 數據存儲策略
| 層級 | 用途 | 同步策略 |
|------|------|----------|
| LocalStorage | 積分、課程進度、離線快取 | 登入時與 Supabase 合併（取最大值） |
| SessionStorage | 管理員 Token | 不同步 |
| Supabase | 用戶檔案、答題記錄、課程進度、分享結果 | 即時寫入 |

---

## 3. 核心功能模組

### 3.1 訓練系統（Train）

**設定畫面：**
- 遊戲類型：錦標賽 9-max / 現金桌 6-max / 4-max / 單挑 / 隨機
- 籌碼深度：15BB / 25BB / 40BB / 75BB / 100BB / 隨機
- 訓練模式：單步（僅 RFI）/ 多步（含 vs Raise）

**訓練流程：**
1. **出題階段：** 隨機手牌 + 牌桌視覺化 + 行動歷史
2. **作答階段：** 選擇動作（Fold / Call / Raise / 3-Bet）
3. **回饋階段：** 正確 GTO 動作 + 頻率 % + 13×13 範圍矩陣 + 策略解釋
4. **多步場景：** 對手回應模擬 → 第二步決策

**GTO 資料庫：** 8 個預計算資料檔
| 資料庫 | 遊戲類型 | 籌碼 |
|--------|----------|------|
| gtoData_tourn_9max_15bb | 錦標賽 | 15BB |
| gtoData_tourn_9max_25bb | 錦標賽 | 25BB |
| gtoData_tourn_9max_40bb | 錦標賽 | 40BB |
| gtoData_tourn_9max_75bb | 錦標賽 | 75BB |
| gtoData_tourn_9max_100bb | 錦標賽 | 100BB |
| gtoData_cash_6max_100bb | 現金桌 6-max | 100BB |
| gtoData_cash_4max_100bb | 現金桌 4-max | 100BB |
| gtoData_cash_hu_100bb | 現金桌單挑 | 100BB |

**位置系統：** UTG, UTG+1, UTG+2, LJ, HJ, CO, BTN, SB, BB

**動作編碼：** f(Fold), c(Call), r(Raise), 3b(3-Bet), 4b(4-Bet), allin, mr:XX(混合加注)

### 3.2 課程系統（Course）

| 課程 | 等級 | 費用 |
|------|------|------|
| 開池基礎（RFI Basics） | 初級 | 免費 |
| 位置的力量（Position Power） | 初級 | 免費 |
| 面對加注（Facing Raises） | 初級 | 免費 |
| 進階課程（規劃中） | 進階 | 10 積分解鎖 |

- 每課程 10 題測驗
- 進度追蹤（完成數 / 正確數 / 總數）
- 解鎖狀態持久化

### 3.3 統計分析（Stats）

**維度：**
- 總體正確率
- 按位置分解（各座位準確率）
- 按場景分解（RFI vs vs-Raise）
- 按手牌類型分解（同花 / 異色 / 對子）
- 時間篩選（當日 / 7天 / 30天 / 全部）

### 3.4 AI 弱點分析（Analysis）

- 使用 Claude API 分析訓練數據
- 識別 3-5 個主要弱點
- 生成個人化改善建議
- 付費用戶每日免費 1 次，其他需 50 積分

### 3.5 用戶系統（Profile）

- Email/密碼註冊登入（Supabase Auth）
- 積分顯示與管理
- 付費狀態標示
- Demo 帳號支援
- 新手引導（5 步 Onboarding）

### 3.6 訪客模式（Guest）

- 3 題固定示範
- 無數據持久化
- 引導註冊

### 3.7 分享功能（Share）

- 唯一分享 URL
- 顯示玩家名稱、準確率、連勝、分數、日期

### 3.8 管理後台（Admin）

- 獨立登入（環境變數驗證）
- 用戶統計、每日活躍度
- 位置/場景熱力圖
- 課程表現數據

### 3.9 遊戲化機制

| 機制 | 說明 |
|------|------|
| 積分系統 | 答對 +1 分 |
| 連勝計數 | 連續答對追蹤 |
| 課程解鎖 | 10 積分解鎖進階課程 |
| 每日限制 | 免費用戶每日 1 輪 |

### 3.10 UI 設計系統

| 元素 | 規格 |
|------|------|
| 配色 | 深色主題：背景 #0a0a0a, 主色 #7c3aed (紫) |
| 動作色 | Raise #dc2626, Call #4ade80, Mixed #fbbf24, Fold #1e1e1e |
| 牌桌色 | #1a4731 (綠色毛氈) |
| 最大寬度 | 480px (Mobile-first) |
| 圓角 | 12px-20px |
| 導航 | 底部 5 Tab（訓練/課程/統計/分析/個人） |

---

## 4. 用戶體驗流程

### 4.1 首次用戶旅程
```
訪問 → 訪客模式（3題體驗）→ 註冊 → Onboarding（5步）→ 訓練設定 → 開始訓練
```

### 4.2 日常訓練旅程
```
登入 → 選擇遊戲/籌碼/模式 → 訓練（N題）→ 查看結果 → 分享（可選）→ 查看統計
```

### 4.3 付費轉換旅程
```
免費用戶達每日限制 → 倒計時畫面 + 升級 CTA → 付費解鎖無限訓練
```

---

## 5. 數據模型

### 5.1 profiles
```
id          UUID PK
email       text
name        text
is_paid     boolean
player_type 'tournament' | 'cash'
is_coach    boolean
points      integer
daily_plays_count  integer
daily_plays_date   date
onboarding_done    boolean
created_at  timestamp
```

### 5.2 answer_records
```
id              UUID PK
user_id         UUID FK → profiles
db_key          text
hand            text
chosen_action   text
gto_action      text
is_correct      boolean
stack_bb        integer
hero_pos        text
scenario_type   'RFI' | 'vs_raise'
created_at      timestamp
```

### 5.3 course_progress
```
id              UUID PK
user_id         UUID FK → profiles
course_id       text
completed       integer
correct         integer
total           integer
unlocked        boolean
last_played_at  timestamp
created_at      timestamp
updated_at      timestamp
```

### 5.4 share_results
```
id          UUID PK
user_id     UUID FK → profiles
user_name   text
total       integer
correct     integer
score       integer
accuracy    integer
streak      integer
stack_bb    integer
created_at  timestamp
```

---

## 6. 商業模式

### 6.1 目前方案

| 方案 | 價格 | 內容 |
|------|------|------|
| 免費 | $0 | 每日 1 輪訓練、3 門基礎課程、基本統計 |
| 付費 | 待定 | 無限訓練、更大輪次、每日免費 AI 分析 |

### 6.2 收入來源
- 訂閱制（未實裝支付整合）
- 積分消費（AI 分析 50 積分）
- 課程解鎖（10 積分/課）

---

## 7. 行業標準對比分析

### 7.1 主要競品

| 競品 | 定位 | 月費 | 核心優勢 |
|------|------|------|----------|
| **GTO Wizard** | 全方位 GTO 訓練 | $26-$116 | 翻前+翻後、HH 分析、多語言、排行榜 |
| **Lucid Poker** (Upswing) | GTO 訓練器 | $49 | 全街道訓練、自定義鑽研、原生 App |
| **Poker Academy** | 行動端 GTO 訓練 | ~$10 | 150 萬+翻前圖表、AI 翻後求解 |
| **PokerSnowie** | AI 對戰訓練 | $8-$19 | 神經網路 AI、手牌分析、模擬對戰 |
| **Preflop+** | 翻前專項 | $10 | Nash 圖表、賠率計算、離線使用 |
| **Pokertrainer.se** | 基礎訓練 | 免費+ | 翻前+翻後、App、離線 |
| **PokerCoaching** | 影片教學 | $147 | 1800+ 互動測驗、iOS/Android App |
| **Run It Once** | 影片教學 | $25-$199 | 9500+ 影片、PLO 內容 |

### 7.2 功能覆蓋對比

| 功能 | Poker Goal | GTO Wizard | Lucid | Poker Academy | PokerSnowie | Preflop+ |
|------|:----------:|:----------:|:-----:|:-------------:|:-----------:|:--------:|
| **翻前訓練** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **翻後訓練** | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **多街道場景** | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **錦標賽 (ICM)** | ✅(基本) | ✅(完整) | ✅ | ✅ | ✅ | ✅ |
| **現金桌** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Spin & Go** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **PLO** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **原生 App** | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **手牌匯入分析** | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **AI 弱點分析** | ✅ | ✅(報告) | ✅ | ❌ | ✅ | ❌ |
| **排行榜** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **社群/好友對戰** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **自訂範圍編輯** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **影片/教學內容** | ❌ | ✅(200+hr) | ❌ | ❌ | ❌ | ❌ |
| **教練市場** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **多語言** | 繁中 | 8 語言 | 英文 | 有限 | 有限 | 有限 |
| **離線使用** | 部分 | ❌ | ✅ | ✅ | ❌ | ✅ |
| **遊戲化/積分** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **免費層** | ✅ | 有限 | ❌ | 有限 | 試用期 | 有限 |
| **課程系統** | ✅(3門) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **每日挑戰** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **新手引導** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **分享結果** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 8. 功能缺口清單

以下按行業標準分類列出 Poker Goal 目前缺少的功能：

### 🔴 關鍵缺口（行業基本要求）

| # | 缺口 | 說明 | 對標競品 |
|---|------|------|----------|
| 1 | **翻後訓練** | 目前僅支援翻前，行業標準產品均支援 Flop/Turn/River 決策 | GTO Wizard, Lucid, PokerSnowie |
| 2 | **原生行動 App** | 僅有 Web，競品多有 iOS/Android 原生 App | Lucid, Poker Academy, Preflop+ |
| 3 | **ICM 模型** | 錦標賽缺少完整 ICM 計算（泡沫/決賽桌獨立策略） | GTO Wizard, Poker Academy |
| 4 | **手牌歷史匯入** | 無法匯入實際牌局進行分析，影響進階用戶留存 | GTO Wizard HH 2.0, PokerSnowie |
| 5 | **支付整合** | 付費方案尚未實裝，無法產生收入 | 所有付費競品 |

### 🟡 重要缺口（提升競爭力）

| # | 缺口 | 說明 | 對標競品 |
|---|------|------|----------|
| 6 | **排行榜系統** | 缺少全球/好友排名，降低社群黏性 | GTO Wizard, Lucid |
| 7 | **每日挑戰/任務** | 無每日限定挑戰模式，影響日活回訪 | Lucid (Cardle) |
| 8 | **自訂範圍編輯器** | 用戶無法建立/編輯自己的範圍 | GTO Wizard, Preflop+ |
| 9 | **模擬對戰模式** | 無法與 AI/GTO Bot 進行完整牌局對戰 | GTO Wizard (Play Mode), PokerSnowie, APT |
| 10 | **PWA / 離線優化** | 離線體驗不完整，缺少 Service Worker + Manifest | Preflop+, Poker Academy |
| 11 | **Spin & Go 支援** | 缺少短碼錦標賽格式 | GTO Wizard, Poker Academy |
| 12 | **多種籌碼深度（現金桌）** | 現金桌僅支援 100BB，缺少淺碼/深碼 | GTO Wizard |
| 13 | **更多課程內容** | 僅 3 門基礎課程，內容深度不足 | PokerCoaching (1800+ 測驗) |

### 🟢 差異化機會（超越競品）

| # | 缺口 | 說明 | 對標競品 |
|---|------|------|----------|
| 14 | **間隔重複學習** | 根據遺忘曲線自動復習弱項手牌 | 無競品實裝 |
| 15 | **社群功能** | 好友系統、學習小組、對戰邀請 | GTO Wizard (Play with Friends) |
| 16 | **影片教學整合** | 內嵌位置/場景對應的教學影片 | PokerCoaching, Run It Once |
| 17 | **教練市場** | 連結學生與教練的平台 | 無主要競品做此功能 |
| 18 | **成就/徽章系統** | 里程碑成就、收集徽章增加黏性 | 無主要競品完整實裝 |
| 19 | **學習路徑** | 根據程度自動推薦下一步訓練計畫 | Upswing Lab (placement quiz) |
| 20 | **即時 AI 教練** | 訓練中即時 AI 對話解釋策略 | 無競品完整實裝 |
| 21 | **多語言擴展** | 覆蓋英文、簡中、日文、韓文等亞洲市場 | GTO Wizard (8 語言) |
| 22 | **PKO (累進賞金)** | 錦標賽 PKO 格式支援 | GTO Wizard, Poker Academy |
| 23 | **深色/淺色主題** | 目前僅深色，缺少主題切換 | 部分競品支援 |
| 24 | **數據視覺化圖表** | 統計頁缺少趨勢圖、雷達圖等進階視覺化 | GTO Wizard (GTO Reports) |
| 25 | **A/B 測試框架** | 缺少用於優化轉換率的實驗基礎設施 | 行業最佳實踐 |

---

## 9. 優先級路線圖建議

### Phase 1 — 基礎完善（1-2 個月）
> 目標：可產生收入的最小可行產品

| 優先級 | 功能 | 理由 |
|--------|------|------|
| P0 | 支付整合 (Stripe) | 無收入 = 無法持續 |
| P0 | PWA 離線優化 | 行動端體驗直接影響留存 |
| P1 | 更多課程內容 (至少 10 門) | 增加內容深度和付費價值 |
| P1 | 每日挑戰模式 | 提升日活回訪率 |
| P1 | 排行榜 (週/月) | 社群黏性與競爭動力 |

### Phase 2 — 核心擴展（2-4 個月）
> 目標：覆蓋行業基本要求

| 優先級 | 功能 | 理由 |
|--------|------|------|
| P0 | 翻後訓練 (Flop) | 最大功能缺口，行業基本要求 |
| P1 | 模擬對戰模式 | 高互動性，強差異化 |
| P1 | ICM 完整支援 | 錦標賽玩家核心需求 |
| P2 | 自訂範圍編輯器 | 進階用戶需求 |
| P2 | 現金桌多籌碼深度 | 50BB / 150BB / 200BB |

### Phase 3 — 差異化競爭（4-6 個月）
> 目標：建立獨特價值主張

| 優先級 | 功能 | 理由 |
|--------|------|------|
| P1 | 間隔重複學習系統 | 行業空白，學習效率差異化 |
| P1 | 即時 AI 教練 | 利用已有 Claude 整合優勢 |
| P1 | 手牌歷史匯入 | 進階用戶強需求 |
| P2 | 原生 App (React Native) | 擴大觸及率 |
| P2 | 多語言 (英文/簡中) | 擴大市場 |
| P2 | 社群功能 | 好友對戰、學習小組 |

### Phase 4 — 平台化（6+ 個月）
> 目標：從工具走向平台

| 優先級 | 功能 | 理由 |
|--------|------|------|
| P2 | 教練市場 | 平台化收入來源 |
| P2 | 影片教學整合 | 內容生態 |
| P2 | PKO / Spin & Go | 格式覆蓋 |
| P3 | PLO 支援 | 市場空白 |
| P3 | 學習路徑 AI 推薦 | 個人化學習體驗 |

---

## 附錄 A — 競品定價參考

| 競品 | 入門價 | 中階價 | 高階價 |
|------|--------|--------|--------|
| GTO Wizard | $26/月 | $44/月 | $116/月 |
| Lucid Poker | $49/月 | — | — |
| PokerCoaching | $147/月 | — | — |
| Run It Once | $25/月 | $199/月 | — |
| PokerSnowie | $99/年 | $230/年 | — |
| Preflop+ | $10/月 | $80/年 | — |
| Poker Academy | ~$10/月 | — | — |

**Poker Goal 建議定價區間：** $8-$15/月（定位低於 GTO Wizard，與 Preflop+/Poker Academy 競爭，以中文市場為切入點）

---

## 附錄 B — Poker Goal 獨有優勢

1. **繁中在地化** — 唯一以繁體中文為母語的 GTO 訓練平台
2. **新手友善** — 完整 Onboarding + 訪客體驗 + 結構化課程（競品幾乎沒有）
3. **免費層慷慨** — 每日免費訓練（多數競品為試用期制）
4. **AI 弱點分析** — Claude 驅動的個人化弱點報告
5. **結果分享** — 社群傳播機制
6. **低價策略** — 可以 $10/月以下切入，對亞洲市場有吸引力
7. **課程系統** — 結合結構化學習與自由訓練，競品多為二選一

---

## 附錄 C — 技術負債與風險

| 風險 | 說明 | 建議 |
|------|------|------|
| GTO 資料為靜態 JS 檔 | 資料更新需重新部署 | 遷移至 API 或 CDN JSON |
| Claude API Key 暴露風險 | 前端直接呼叫 API | 加入後端代理層 |
| 無錯誤監控 | 生產環境無 Sentry/LogRocket | 盡快加入 |
| 無自動化測試 | 無單元/整合測試 | 核心邏輯需加測試 |
| 無 CI/CD Pipeline | 手動部署 | 建立 GitHub Actions |
| 管理員認證簡易 | 環境變數比對，無真正認證 | 改用 Supabase RLS + 角色 |
| LocalStorage 容量限制 | 大量數據可能超出 5MB | 評估 IndexedDB 遷移 |
