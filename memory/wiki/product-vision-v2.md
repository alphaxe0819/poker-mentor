---
name: Poker Goal 產品願景 v2 + MVP 規格
description: 2026-04-23 用戶決定聚焦「剝削對手」閉環重整產品；pre-launch（0 用戶 0 MRR）refactor；砍/淡化/保留清單 + P0/P1/P2 功能 + 非目標
type: vision
status: draft
updated: 2026-04-23
---

> **這份文件的狀態**：草案 v1，大腦根據 2026-04-23 對話產出，等用戶修訂。
> **這份文件的角色**：之後所有 task 都以此為準，不符合願景的 feature 不做。若與 task-board 或其他 wiki 衝突，以本檔為最高優先級。

---

## 一句話願景

**幫撲克玩家建立「特定對手」的檔案、持續用牌譜更新這個檔案、並給出針對這對手的具體剝削策略。**

不是 GTO 訓練器、不是通用牌力教學、不是 solver 工具——是**針對特定 villain 的剝削助手**。

---

## 核心閉環（產品的骨架）

```
① 建檔（快速問答 / 手動設定 / 詳細範圍）
        ↓
② 陪玩紀錄（每場對戰後輸入牌譜）
        ↓
③ Range Refine（自動調整該 villain 的範圍估計）
        ↓
④ 剝削建議（AI 教練：基於「這個」對手的具體打法）
        ↓
⑤ 實戰採用
        ↓
  回到 ②（閉環持續深化對手檔案）
```

**每個階段的產品介面**：
| 閉環步驟 | UI 介面 | 現狀 |
|---|---|---|
| ① | `/exploit-coach-villain-v2-flow.html` B/C1/C2/C3 screens | ✅ 已做 |
| ② | 牌譜輸入頁（手動 / 貼文字 / 未來 HH parser） | ❌ 要做 |
| ③ | Range refine 演算法（後端自動） | ❌ 要做 |
| ④ | D 分析頁 + AI 教練問答 | ⚠ D 頁有，AI 要升級吃結構化 profile |
| ⑤ | 無專用介面（玩家線下實戰） | — |

---

## 三階段路線圖

| 階段 | 目標 | 狀態 |
|---|---|---|
| 🔧 **Phase 0**：底層重整 | Schema v2 完成 + 砍 feature + UX 重組 | 進行中（Schema v2: T-095 Done，T-096-099 in progress）|
| 🚀 **Phase 1**：對外測試版（MVP） | 陌生玩家能註冊 / 建 villain / 拿到剝削建議 | 等 Phase 0 完成 |
| 💰 **Phase 2**：商業化 | 訂閱 tier + 點數消耗設計（付費啟動）| Phase 1 對外測試反饋後 |

**現在位置**：Phase 0 進行中。Phase 1 估 4-6 週全職（Schema v2 完成後起算）。

---

## 砍 / 淡化 / 保留 清單

### 🟢 保留 + 強化（核心）

| Feature | 定位 | 動作 |
|---|---|---|
| **villain v2 profile**（C1/C2/C3/D flow）| 產品核心入口 | 整合進主 React app 成為主頁，不再是 standalone HTML |
| **exploit-coach AI 教練** | 核心交互 | 升級吃結構化 villain profile + 動態牌譜，不再只吃玩家文字描述 |
| **牌譜儲存系統**（tournament_hands / sessions）| 閉環第 ② 步基礎設施 | 擴大到非 HU 場景，成為通用 `hand_records` |
| **GTO pipeline**（gto_solutions） | 剝削建議的「應該怎麼打」背書資料 | Schema v2 進行中 |

### 🟡 保留但降級（重新定位）

| Feature | 原定位 | 新定位 |
|---|---|---|
| **HU 模擬器** | 獨立訓練器 feature | 「對著 AI villain 練剝削」— 從主選單隱藏，從 villain profile 頁進入 |
| **訓練模式（quiz）** | 獨立答題 | 「對手範圍判讀練習」— 用在 villain 認知訓練 |

### 🔴 砍（從主 UX 移除）

| Feature | 理由 |
|---|---|
| **ai-coach**（通用教練 Edge Function）| 功能被 exploit-coach 涵蓋，合併 |
| **analyze-weakness**（弱點分析）| 未來 Leak Finder 做，目前砍 |
| **任務系統**（missions）| 保留 onboarding 一條（引導建第一個 villain），其他砍 |
| **多個 quiz 類 feature** | 除非用在 villain 認知訓練否則砍 |
| **coach-onboarding** | 併入 main onboarding |

### ⚫ 基礎設施（不碰，繼續運作）

- Auth / profiles / subscriptions（未來 Phase 2 用）
- point_transactions / add_points / spend_points（測試期 idle，Phase 2 啟動）
- Supabase / Vercel infra
- GTO pipeline（Schema v2）

---

## 功能 Roadmap（P0 / P1 / P2）

### 🎯 P0（對外測試版必須）

**目標**：陌生玩家能進站 → 理解產品 → 建一個 villain → 拿到第一個剝削建議

| # | 功能 | 當前狀態 | 工作量 |
|---|---|---|---|
| P0.1 | Landing / 首頁重做（講清楚「建對手檔案 + 剝削」）| ❌ 目前是多 tab 選單 | 3-5 天 |
| P0.2 | Onboarding flow（引導建第一個 villain）| ⚠ 部分（flow 有，但沒 onboarding 包裝）| 2-3 天 |
| P0.3 | Villain 管理介面（list / 新增 / 編輯 / 刪除 / 多個並存）| ⚠ LocalStorage 版有（villain-v2-flow.html），要搬進 React app + 上雲 | 3-5 天 |
| P0.4 | 剝削建議互動頁（問答 UI）| ⚠ 有 exploit-coach-mockup-v3，要整合進 React app | 2-3 天 |
| P0.5 | 登入 / 註冊 UX 乾淨 | ⚠ 有但沒 polish | 1-2 天 |

**P0 工作量估計**：11-18 個工作日（全職），實際 2-3 週

### 🔥 P1（閉環才完整 — 2026-04-23 設計升級）

**核心洞察**：`coach_queries` 表已經半結構化儲存每次教練問答的 spot context，不需要另開「牌譜輸入頁」。用戶拍板 Q1-Q5：3 入口殊途同歸 + 教練 chat 合併 + hybrid 透明化 + 新 gto_solutions baseline + Bayesian 加權 refine。詳見 [[exploit-coach-closed-loop-design]]。

**設計核心**：
```
新建 villain（3 入口：🚀 直接開始 / 📝 快速問答 / 🎯 精準設定）
   殊途同歸 → 統一教練 chat
      → 每次問教練背景抽 villain 動作（Confidence 分級 high/medium/low）
      → Bayesian 加權 refine current_range
      → 默默更新 + 「更新歷史」tab 可看
```

| # | 功能 | 當前狀態 | 工作量 |
|---|---|---|---|
| P1.1 | `villain_profiles` 表上雲（取代 localStorage）+ 3 入口 UI 整合 React app | ⚠ villain-v2-flow standalone 有 localStorage 版 | 3-5 天 |
| P1.2 | `villain_observations` 表 + `coach_queries.villain_id` FK + migration | ❌ | 2-3 天 |
| P1.3 | Extract pipeline（coach_queries → LLM 抽 villain 動作 + confidence 分級）| ❌ | 3-5 天 |
| P1.4 | Bayesian refine 演算法（confidence-weighted update）| ❌ 要 brainstorm | 5-8 天 |
| P1.5 | `exploit-coach` Edge Function 升級吃 `current_range`（而非 summary 文字）| ⚠ | 2-3 天 |
| P1.6 | Villain 頁「更新歷史」tab（hybrid 設計 Q3）| ❌ | 3-5 天 |

**P1 工作量估計**：18-29 個工作日，實際 4-6 週

### 🚀 P2（對外測試後）

**目標**：商業化 + 進階功能

- 訂閱 tier 設計（免費 vs Pro）
- 點數消耗流（Pro 內或 a la carte）
- HH Analyzer（自動從牌譜學對手）
- Leak Finder 類（找自己漏洞）
- 公開 beta → 付費轉換

**P2 時間線**：依 P1 對外測試反饋決定

---

## 🚫 非目標（明確寫「我們不做 X」避免未來誘惑）

| # | 我們不做 | 為什麼 |
|---|---|---|
| 1 | **通用 GTO 訓練器** | GTO Wizard 已經完爆，不跟他們正面對抗 |
| 2 | **通用 AI 教練** | 不講「一般 poker 問題」，只講「剝削這個 villain」 |
| 3 | **Multiway solver / 9-way postflop** | 定位是 heads-up vs villain，多路之後再說 |
| 4 | **牌局直播 / 社群 / 排行榜 / PvP** | 工具定位，不做社群 |
| 5 | **手機 native app** | Web-first，手機靠 responsive |
| 6 | **自動 HH upload + parser**（初期）| 支援太多牌站格式會炸，手動輸入先驗證核心 |
| 7 | **代打 / 推薦自動決策機器人** | 法律風險 + 違反撲克站 ToS |
| 8 | **即時線上分析**（邊打邊用）| 違反多數撲克站 ToS，只做「線下覆盤」用 |
| 9 | **大量預解 solution library**（對標 GTO Wizard）| 我們的差異化不是資料量，是「針對特定對手」 |
| 10 | **免費 tier 無限量** | 免費 tier 要限量（測試期除外）— GTO Wizard 模式驗證過 |

---

## 產品價值主張（給陌生玩家的一句話）

**「不是教你打 GTO。是教你怎麼『針對這個特定對手』打得比 GTO 還贏。」**

對比：
- GTO Wizard：告訴你 **理論最佳解**
- Poker Goal：告訴你 **針對老張（你的朋友、你常遇到的 reg）的最佳解**

---

## 商業模式（Phase 2 啟動，先記錄思路）

**結構**：訂閱 + 點數

| Tier | 月費 | 內容 |
|---|---|---|
| Free | 0 | 1 個 villain、100 點/月（AI 教練用）、基本問答 |
| Pro | ~NT$299-399（~$10-13） | 無限 villain、1000 點/月、HH 匯入、Leak Finder |
| Elite（未來）| ~NT$599-899 | 所有 Pro + 深度分析 + 教練直播 |

**點數用途**：AI 教練訊息（5-10 點/則）、深度分析（50-100 點/次）
**點數取得**：訂閱附贈 + 任務獲得 + a la carte 儲值

⚠ **測試期（Phase 1）全部免費，不強調訂閱 / 點數**，專注驗證核心閉環。

---

## 競品定位

| 競品 | 他們做什麼 | 我們不做 | 我們做他們沒做 |
|---|---|---|---|
| GTO Wizard | 理論 GTO 解 | 大量 preflop/postflop 預解 | 針對特定對手的剝削 |
| Hold'em Manager / PokerTracker | 牌譜統計 + HUD | 牌譜 HUD（會被撲克站封）| AI 生成的具體剝削策略 |
| Run it Once / Jonathan Little | 教學影片 | 影片內容 | 個人化、可互動的 villain 檔案 |
| Power Equilab / Flopzilla | Range 建構工具 | 單純 range 計算 | Range + 牌譜 + AI 剝削 一體化 |

**獨家賣點**：「**針對性 + 互動性 + 演進性**」三合一。

---

## 上線前里程碑

### Milestone 1：底層就緒（Phase 0 完成）
- ✅ T-095：Schema v2 表建立
- ⏳ T-096 + T-097：pipeline 升級到 v2
- ⏳ T-098：retrieval 改造 + fallback
- ⏳ T-094：13bb marathon 跑 2K+ rows
- ⏳ T-099：正式 Supabase 部署

### Milestone 2：P0 完成（對外測試版 ready）
- Landing + Onboarding + Villain 管理 + 剝削互動 + Auth UX
- 內部自己用一週，catch UX bug
- 找 3-5 個朋友內測（非開發者）

### Milestone 3：對外公開 Beta
- P1 閉環完成（牌譜輸入 + range refine）
- 公開宣傳（社群 / 論壇）
- 收用戶反饋 → 迭代

### Milestone 4：商業化（Phase 2）
- 訂閱 tier 上線
- 首批付費用戶
- 驗證 PMF（product-market fit）

---

## 與現有技術債 / 規劃的銜接

| 項目 | 狀態 | 如何融入願景 |
|---|---|---|
| Schema v2 重整 | 進行中 | 底層必做，之後所有產品 feature 都用 v2 |
| exploit-coach-gtow 內測（T-082） | 測試中 | 長期可能棄用，除非玩家反饋「需要 GTO 背景」|
| villain-v2-test.html / villain-v2-flow.html | 測試 standalone | 要整合進 React app 當主產品 UX，不再 standalone |
| HU 模擬器 | 已上線 | 降級為「練剝削」的 AI 陪打 |
| GTO pipeline（T-075/T-076 9max MTT） | 凍結 | 等 Phase 1 有用戶反饋再決定要不要繼續 |
| GTO Wizard 採購方案 | 待討論 | 如果玩家真需要 GTO 背景知識，可買高级版資料 |

---

## 待用戶確認 / 修訂的決策點

1. **願景一句話**：「針對特定對手的剝削助手」這定位你同意嗎？還是想更 specific / 更廣？
2. **砍 feature 清單**：任何捨不得砍的？ai-coach / analyze-weakness / missions 真的要砍嗎？
3. **P0 範圍**：5 項夠不夠 MVP？要不要加 / 減？
4. **非目標清單**：有沒有你覺得該加的？（特別防止未來誘惑）
5. **商業模式**：訂閱金額區間合理嗎？點數設計方向對嗎？
6. **競品定位**：有沒有我漏掉的重要對手？
7. **里程碑**：對外測試版要不要訂**具體目標日期**（例如 2026-06-01 前 ship）？

---

## 相關連結

- [[task-board]] — 目前 task 狀態（P0 要新增 task：UX 重組、landing、onboarding 等，等本檔 approved 再派工）
- [[database-schema-v2-spec]] — 底層 schema 重整（Phase 0 核心）
- [[database-architecture]] — 當前 DB 狀態
- [[villain-profile-design]] — villain v2 原始設計
- [[gto-wizard-pricing-analysis]] — 競品定價 + 採購評估
- [[product-pivot-2026-04]] — 舊版產品路線圖（本檔升級取代）
