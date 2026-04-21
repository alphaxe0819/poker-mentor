---
name: PD MTT Scenario Coverage 2026-04-21
description: T-075 Phase 0 盤點 — 10 個 pokerdinosaur _ranges.json 的 table.name 語義完整度 + auto-parse 可行性
type: project
created: 2026-04-21
task: T-075 Phase 0
branch: wip/T075-mtt-preflop-from-pd
---

## TL;DR

1. **整體 auto-parse 率 = 1.2%**（16,750 tables 中只有 205 可自動 decode 成場景）
2. **只有 Course project 可以直接用**（58.1% auto-parse，353 tables）
3. 其他 9 個 MTT project 的 `table.name` 只 encode **depth（"10bb"）或 "ICM"/"GTO"/"cEV" 分類 tag**；場景語義在 `scenario_id` UUID 上，**沒 dump 進 JSON**
4. **T-075 原目標 HU + 6max cash 100bb 都不在 pd 資料裡**（pd 10 個 project 全是 9-max MTT）
5. 後續可行路徑：
   - 短期：用 Course 的 205 parseable tables 做 9-max MTT preflop range E2E 驗證
   - 中期：為 MTT projects 的 scenario_id 補 metadata（重爬 pd 網站上的 scenario 命名 UI，或人工標）才能解鎖其餘 16,545 tables
   - HU / 6max cash：**pd 沒資料**，需另找來源（GTOWizard / TexasSolver preflop solver / 其他 wiki）

---

## 方法

- 對 `C:/Users/User/Downloads/*_ranges.json` 10 個檔逐一掃
- 每張 table 套 `scripts/gto-pipeline/parse-pd-table-name.mjs::parseTableName(t.name)`
- 統計 auto-parse 率、distinct `scenario_id`、depth 集合、matchup 分布、unknown sample
- 純讀、未改 scripts；未動 scenarios.mjs；未產 range

---

## 每 Project 盤點

### 🟢 Course（**唯一可自動解**）

| 指標 | 值 |
|---|---|
| tables | 353 |
| distinct `table.name` | 149 |
| distinct `scenario_id` | 39 |
| auto-parse OK | **205 / 353 (58.1%)** |
| depth 範圍 | 10, 15, 20, 25, 30, 40, 50 bb |

**Top matchups（auto-parse 結果）**：

| matchup | tables |
|---|---|
| BB vs MP | 14 |
| BB vs CO | 12 |
| BTN vs EP | 10 |
| BB vs EP | 10 |
| SB vs CO | 9 |
| BB vs BTN | 9 |
| BTN vs MP | 8 |
| CO vs MP | 8 |
| SB vs EP | 7 |
| SB vs MP | 7 |

**Scenario tag 分布**：`flat 137 / open 61 / limp 4 / 3bet 2 / jam 1`

**Unknown 原因**：148 個 unknown 多半是純位置 token（`"UTG"`, `"BU"`, `"UTG1"` 等無 scenario verb），實際帶位置資訊但 parser 不 confirm scenario。擴 parser 規則（把純位置 token 當 `open` default）可能再撈 50-100 張。

**可用性**：**立刻可用**，不需補 metadata。

---

### 🔴 Live_MTT_Ben_Adjusted（MTT depth-sweep）

| 指標 | 值 |
|---|---|
| tables | 1,149 |
| distinct `table.name` | **11**（純 depth） |
| distinct `scenario_id` | 182 |
| auto-parse OK | **0 / 1149 (0.0%)** |
| depth 範圍 | 5, 7, 10, 12, 15, 20, 25, 30, 40, 50, 75 bb |

**Name 全部長這樣**：`"10bb"` / `"25bb"` / `"50bb"` 等純 depth，沒場景。

**結構**：每個 `scenario_id` 對應 ~6.3 tables（= 跨深度展開），所以真正 distinct 場景 ~= 182 個。

**解鎖需求**：補 `scenario_id → 場景語義` 對照表（需重爬 pd UI 或人工標 182 項）。

---

### 🔴 Tournament_Ben_Adjusted

| 指標 | 值 |
|---|---|
| tables | 1,470 |
| distinct `table.name` | 9（純 depth） |
| distinct `scenario_id` | **513** |
| auto-parse OK | **0 / 1470 (0.0%)** |
| depth 範圍 | 5, 7, 10, 20, 30, 40, 60, 70, 80 bb |

每 sid ~2.9 tables（depth coverage 較淺）。解鎖成本高（513 個 sid 要標）。

---

### 🔴 Tournament_Chip_EV

| 指標 | 值 |
|---|---|
| tables | 945 |
| distinct `table.name` | 7 |
| distinct `scenario_id` | 181 |
| auto-parse OK | **0 / 945 (0.0%)** |
| depth 範圍 | 15, 20, 30, 40, 50, 60, 70 bb |

結構類似 Live_MTT_Ben（181 場景 × 5.2 depth = ~945）。

---

### 🟥 Final_Two_Tables（**最極端 — 1 name 配 857 sid**）

| 指標 | 值 |
|---|---|
| tables | 857 |
| distinct `table.name` | **1**（全部叫 `"ICM"`） |
| distinct `scenario_id` | **857** |
| auto-parse OK | **0 / 857 (0.0%)** |

每張 table 1 個獨立 sid，**完全靠 UUID 區分**，name 欄位零資訊。不重爬完全無法用。

---

### 🟥 Final_Table / Final_Table_Exploitative

| 指標 | Final_Table | Final_Table_Exploitative |
|---|---|---|
| tables | 2,600 | 2,600 |
| distinct `table.name` | 5 | 5 |
| distinct `scenario_id` | 2,285 | 2,285 |
| auto-parse OK | 0 (0%) | 0 (0%) |

Name 限於 `"GTO"` / `"ICM"` / `"cEV"` 類分類 tag，無場景 / 無 depth。sid:table ≈ 1:1.14，幾乎一張表一個場景。

---

### 🟥 Large / Medium / Small Field ICM

| 指標 | Large | Medium | Small |
|---|---|---|---|
| tables | 2,505 | 2,230 | 2,041 |
| distinct `table.name` | 2 | 2 | 2 |
| distinct `scenario_id` | 1,378 | 1,115 | 1,209 |
| auto-parse OK | 0 | 0 | 0 |

Name 限 `"ICM"` / `"cEV"`。sid:table ≈ 1:1.8。全靠 UUID。

---

## 聚合 Summary

| 類別 | projects | tables | auto-parse OK | 可用性 |
|---|---|---|---|---|
| 🟢 語義豐富（可直接 decode） | Course | 353 | 205 (58%) | 立刻可用 |
| 🔴 Depth-sweep（name=depth，靠 sid） | Live_MTT_Ben / Tournament_Ben / Tournament_Chip_EV | 3,564 | 0 | 需補 sid metadata |
| 🟥 分類 tag（name=ICM/GTO/cEV） | Final_Two_Tables / Final_Table / Final_Table_Exploitative / Large_ICM / Medium_ICM / Small_ICM | 12,833 | 0 | 需大量補 sid metadata（~9,133 個獨立 sid） |
| **合計** | **10** | **16,750** | **205 (1.2%)** | — |

---

## T-075 原目標 vs pd 資料 gap 分析

T-075 列的目標場景：
- HU 13bb / 25bb / 40bb × SRP / 3bp（6 個場景家族）
- 6max 100bb × SRP / 3bp / 4bp（3 個場景家族）

pd 10 個 project 的 format 歸類：
- **全部是 9-max MTT**（Ben 系 / ICM 系 / Final_Table / Course）
- **沒有 HU 專門 project**（Heads-Up 1v1，但 pd 資料全是 9 人桌）
- **沒有 cash 6-max**（pd 全是 tournament，depth 隨 blind 縮）

→ **T-075 目標 ∩ pd 資料 = 空集**。HU 與 6max 100bb cash 無法從 pd 建 preflop range。

---

## 後續路徑建議（不是本 Phase scope，只是把選項列清楚給大腦決策）

**路徑 A — Course-only 極簡版**
- 用 Course 的 205 個 auto-parsable tables 產 9-max MTT preflop range（主要是 BB defend / SB defend / BTN open / CO open × 多種 depth）
- 不處理 HU / 6max cash / 非 Course 的 MTT
- 工作量：1-2 hr（Course 資料已在 output/pd-ranges/Course/，T-013 前置完成）
- 產出場景數：估 ~40-60 個（合併重複 matchup × depth bins 後）

**路徑 B — Course + scenario_id metadata 擴充**
- 路徑 A + 為 Live_MTT_Ben / Tournament_Ben / Tournament_Chip_EV 的主要 sid（~876 個）補語義
- 兩種方法：(i) 重爬 pd 網站的 scenario 列表頁（含人類可讀的場景名）(ii) 人工看 grid 內容反推場景
- 工作量：2-5 hr 爬取 / 人工標
- 解鎖 ~3,564 tables

**路徑 C — 全 pd 資料解鎖（含 ICM / Final_Table 系列）**
- 路徑 B + 為 Final_Table / ICM 系列補 metadata（~9,133 個 sid）
- 工作量巨大（人工標 9000+ 場景），可能需要程式化解析 pd 網站
- 實務上 Final_Table / ICM 的 range 差異細節可能不值得全量轉換

**路徑 D — 放棄 pd 做 HU / 6max cash range**
- HU / 6max cash 的 preflop range **絕對拿不到 pd**
- 另找：GTOWizard API、TexasSolver 自跑 preflop solver、GTO+ 抄、Upswing/RIO 文件
- 獨立於路徑 A-C

---

## Unknown Parser 改善（Course 58% → 可能 90%+）

Course 的 148 unknown 多半是純位置 token：`"UTG"` / `"UTG1"` / `"BU"` 等。parse-pd-table-name 目前要求 scenario verb 才歸為 ok；把「單 token 位置」默認為 `open` 可再撈 ~100 張（保守估計）。

但這不是本 Phase scope（只盤點，不改 parser）。如果採路徑 A，第一步就會需要這個 parser 擴充。

---

## 相關連結

- [[scraping-audit-2026-04-21]] — T-013 pd 資料盤點前置
- [[range-collection-roadmap]] — converter C 線脈絡
- [[task-board]] — T-075 原 description
