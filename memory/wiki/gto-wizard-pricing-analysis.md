---
name: GTO Wizard 定價 + 功能對照 + 採購策略評估
description: GTO Wizard 5-tier 月費/功能分層完整資料（2026-04-23 截圖），對我們 T-075/T-076/T-082/T-091 pipeline 的「買資料 vs 自產」戰略選項；尚未拍板
type: reference
updated: 2026-04-23
status: 戰略評估素材，未拍板
---

## 定價（2026-04-23 官網截圖）

| Tier | 原價 | 當前顯示價 | 折扣來源 |
|---|---|---|---|
| 免費 | $0 | $0 | — |
| 初级版 | $39 | $39 | — |
| 高级版 | $79 | $69 | Loyalty -$10 |
| Elite | $139 | $129 | Loyalty -$10 |
| Ultra | $289 | $229 | Early Bird -$60 |

**重要 context**：
- 截圖是某長期訂戶視角（Loyalty discount applied）— 新戶看到的是原價
- Ultra Early Bird 表示新 tier 或近期調整
- 全 tier **7 天無條件退款**

---

## Solution Library（預解資料庫）

| 分類 | 免費 | 初级 | 高级 | Elite | Ultra |
|---|---|---|---|---|---|
| Chip EV Preflop | 100/day | 1,400+ | 3,600+ | 3,600+ | 3,600+ |
| Chip EV Postflop 2-way | 1/day | 1,400+ | 3,600+ | 3,600+ | 3,600+ |
| Chip EV Postflop 3-way | — | — | 1,700+ | 1,700+ | 1,700+ |
| **ICM Preflop** | 30+ | 1,400+ | **70,000+** | 70,000+ | 70,000+ |
| **ICM Postflop 2-way** | 1/day | 1/day | 1/day | **70,000+** | 70,000+ |
| **ICM Postflop 3-way** | — | — | — | **70,000+** | 70,000+ |
| Events | 30+ | 1,400+ | 1,400+ | 1,400+ | 1,400+ |

**三條 tier 分界線**：
1. **ICM Preflop 70,000+** → 高级版解鎖（MTT 玩家必跨）
2. **ICM Postflop 2-way 70,000+** → Elite 解鎖（MTT 深研必跨）
3. **ICM Postflop 3-way 70,000+** → Elite 解鎖（多路 MTT 必跨）

---

## AI Solver（即時求解，Ultra 核心賣點）

| 功能 | Elite | Ultra |
|---|---|---|
| 2-way Preflop | — | ✓ |
| Multiway Preflop (3-9P) | — | ✓（獨享） |
| 2-Way Postflop | ✓ | ✓ |
| 3-Way Postflop | LOYALTY ONLY | ✓ |

> ICM AI Solver 標註 coming soon，未釋出。

---

## 其他功能分層

**Study features**：
- 阻擋牌評分：初级+
- 節點鎖定（Node Lock）：高级+
- Player Profiles：Elite+

**Practice**：Trainer 免費 10 手/天，初级+ 無限

**Aggregated reports**：
- Pre-solved Flop/Turn aggregated：高级+
- Custom Flop aggregated：Elite 用 Power Credits 買 / Ultra 含 1,500 Credits/月（~$140 價值）

**Coaching**：初级+

**Analyze**（HH Analyzer，轉換率最高功能）：
- 手數分析：免 10 / 初级 100 / **高级 100K** / Elite-Ultra 150K
- **Leak Finder**：Elite+

**Extra**：
- Discord "Wizards-only" channel：初级+
- Discord "Ultra-only" channel：Ultra 專屬

---

## 對我們 pipeline 的「買資料 vs 自產」成本分析

### 需求 → 最低可行 tier

| 我們的需求 | 最低可行 tier | 月費 | 涵蓋範圍 |
|---|---|---|---|
| cash 6max 100bb postflop | 初级版 | $39 | Chip EV 2-way 1,400+ |
| MTT preflop（含 ICM） | **高级版** | **$69** | ICM preflop 70,000+ |
| MTT postflop 2-way（ICM） | **Elite** | **$129** | ICM postflop 2-way 70,000+ |
| MTT postflop 3-way | **Elite** | **$129** | ICM postflop 3-way 70,000+ |
| 9-way preflop（multiway） | Ultra | $229 | Multiway preflop 獨享 |

### T-076 MTT postflop solver marathon 替代評估

- **自跑**：3,510 batches × ~15min = 單機 878 hr（6-7 週 24/7）
- **Elite 2-3 個月 $258-$387**：Pull 70,000+ ICM postflop → 省百小時計算
- **ToS 風險**：batch pull 可能違規；T-082 當前「查一次調一次」屬灰色但低風險，batch crawl 高風險

### T-082 GTOW API 內測（當前架構）

- 走 `/v4/solutions/spot-solution/`，調 Solution Library（非 AI Solver）
- 帳戶 tier 決定可 hit 的 subset：
  - 教練 MTT 查詢 → **高级版 $69/月** 涵蓋 70,000+ ICM preflop
  - 教練 cash 查詢 → **初级版 $39/月** 即夠
  - 深 postflop ICM → 高级版撞 1/day 上限 → 需升 Elite

---

## 戰略選項（未拍板）

| 選項 | 動作 | 成本 | 風險/優劣 |
|---|---|---|---|
| 1. 買高级版 $69 1-2 個月 | Pull MTT preflop 70,000 替代 T-075 Phase 2 PD 爬資料 + metadata 工作 | $69-$138 | 省 7-8 hr 人工標 / 重爬；中等 ToS 風險 |
| 2. 買 Elite 2-3 個月 $258-387 | Pull MTT postflop 70,000+ 取代 T-091/T-076 solver marathon | $258-$387 | 省 6-7 週 solver；高 ToS 風險（batch crawl） |
| 3. 自跑路線（現狀 T-091 phased） | 照原計畫 seed 3510 + 13bb slice warm-up | $0 + 百小時機器 | 資料主權 + 無 ToS 風險；慢 |
| 4. T-082 內測延用不擴大 | 只做「查詢時打 API」不批量爬 | 按帳戶 tier 月費 | 保守；解決教練查詢，不解 pipeline |

### 大腦當前建議（可改）
- **短期**（T-045 未通 + T-091 未派）→ 選項 3 先做，自跑驗 pipeline 獨立於採購決策
- **T-091 phased 13bb slice 跑完後** → 評估選項 1 跳過 T-075 Phase 2 metadata 工作
- **選項 2 batch pull 不建議**：ToS 灰色 + 帳戶 ban 風險 + 跟 T-092 schema 改動綁死

---

## 我們沒、他們有的高價值功能

| 他們的功能 | 我們的對應 | 差距 |
|---|---|---|
| HH Analyzer 100K-150K 手/月 | 無 | 他們轉換率最高的功能 |
| Leak Finder（Elite） | AI 教練一問一答類似 | 他們自動掃描，我們互動式 |
| Player Profiles（Elite） | villain v2 21 range grid | 他們從牌譜 auto-build，我們手動 input |
| Pre-solved Aggregated Reports | 無 | MTT 研究員必備 |
| Node Lock（高级版） | 無 | 研究員工具，非我們定位 |
| Custom Aggregated Reports（Elite+） | 無 | 客製研究工具 |

---

## 商業模式對比

| 面向 | GTO Wizard | Poker Goal |
|---|---|---|
| 商業模式 | 純月/年費訂閱 | 免費訓練 + 點數扣 AI 訊息 |
| 免費策略 | 限量試吃（100/1/10）逼升級 | 無限練習，AI 互動是鉤子 |
| 目標用戶 | 嚴肅/職業玩家（美歐主） | 華人市場休閒→進階 |
| 核心賣點 | 最全 solver library + HH Analyzer | AI 教練 + villain profile 剝削 |
| 定價 | $39-$229/月 | 5 pt/訊息 |

---

## 待討論議題（下次開 session 繼續）

1. **採購方案拍板**：是否買高级版 $69 替代 T-075 Phase 2 metadata 工作？
2. **T-092 schema 改動**（role 分桶根因解）是否跟採購方案連動？
3. **ToS 風險評估**：T-082 當前「查一次調一次」模式風險多大？需不需要跟 Wizard 官方確認 API 使用政策？
4. **未來產品方向**：HH Analyzer / Leak Finder 類功能要不要做？（差異化點）
5. **訂閱 tier 設計**：Poker Goal 未來推訂閱是否參考 Wizard $39/$69/$129 分層（華人市場可能太貴）

---

## 相關連結

- [[gtow-api-reverse-eng]] — GTOW server-side 整合完整解法（T-086 signing flow）
- [[task-board]] — T-075 Phase 2 / T-076 / T-082 / T-091 / T-092 現況
- [[range-collection-roadmap]] — range 收集總進度表
