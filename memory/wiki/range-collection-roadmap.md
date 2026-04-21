---
name: Range Collection Roadmap
description: 範圍收集總進度表 — scraping 線 + converter 串接 + solver 線的分批勾選清單
type: project
updated: 2026-04-21
---

## 總體目標

**Pipeline**：
```
pokerdinosaur scrape
  → JSON (169 格 × 顏色分類)
  → converter (新)
  → TexasSolver range string
  → solve postflop
  → DB / src/lib/gto/
  → app 查詢
```

目前 scraping 線和 solver 線獨立跑，中間 converter 尚未存在。本頁追蹤三條線的分批進度，確保兩台電腦協作不脫節。

---

## 線 1：Scraping（pokerdinosaur → JSON + PNG）

詳細技術規則見 [[project_pokerdinosaur_scraping]]。

### S0 已完成（課程表格，實測 353 PNG；對應 JSON: `Course_ranges.json` 353 tables）

| Phase | Scenario | 實際 PNG | 原宣稱 | 狀態 |
|---|---|---|---|---|
| S0.1 | Openraising | 63 | 70 | ✅（−7 diff，見 [[scraping-audit-2026-04-21]]） |
| S0.2 | Flatting & 3Betting | 103 | 108 | ✅（−5 diff） |
| S0.3 | Rejamming | 33 | 33 | ✅ |
| S0.4 | Calling Rejams | 16 | 16 | ✅ |
| S0.5 | HU | 20 | 20 | ✅ |
| S0.6 | Squeezing | 25 | 25 | ✅ |
| S0.7 | Multiway | 56 | 56 | ✅ |
| S0.8 | 4B / Cold Calling 3B | 26 | 26 | ✅ |
| S0.9 | Defending | 11 | 11 | ✅ |
| **小計** | | **353** | **365** | |

### S1-S4 project 級進度（JSON 10 個全到位，見 [[scraping-audit-2026-04-21]]）

| Phase | Project | JSON tables | 已爬 PNG | 狀態 |
|---|---|---|---|---|
| **S1** | **Live_MTT_Ben_Adjusted（現場錦標賽 - Ben 調整版）** | **1149** | **1149** | **✅ 2026-04-21 完成** |
| S2 | Tournament_Ben_Adjusted | 1470 | 0 | ⬜ 待爬 |
| S3 | Tournament_Chip_EV | 945 | 0 | ⬜ 待爬 |
| S4a | Final_Two_Tables | 857 | 0 | ⬜ 待爬 |
| S4b | Final_Table | 2600 | 0 | ⬜ 待爬 |
| S4c | Final_Table_Exploitative | 2600 | 0 | ⬜ 待爬 |
| S4d | Large_Field_ICM | 2505 | 0 | ⬜ 待爬 |
| S4e | Medium_Field_ICM | 2230 | 0 | ⬜ 待爬 |
| S4f | Small_Field_ICM | 2041 | 0 | ⬜ 待爬 |
| **S2-S4 待爬小計** | | **13248** | **0** | |

**執行方式**：Chrome MCP + scrape-pokerdinosaur.js（詳見 [[project_pokerdinosaur_scraping]]）

---

## 線 2：Converter（新，串接 scraping → solver）

| Phase | 任務 | 產出 | 狀態 |
|---|---|---|---|
| C0 | 探查 pd JSON 實際 schema | `inspect-pd.mjs` + 映射規則 | ✅ 2026-04-20 |
| C1 | 寫 `pd-to-range.mjs`（輸入 `_ranges.json` + `action_id_map.json` → per-table hand map JSON） | `pd-to-range.mjs`（對 Ben 系 projects 可用，乾淨 7 label） | ✅ 2026-04-20 |
| C1.5 | 擴充 label 規則處理複合策略（Course / ICM 系列的 Ben 教練式 label，如 `3B Value / Jam < 35bb`） | prefix-based token scanner + `allin` normalize | ✅ 2026-04-20 |
| C2 | `scenarios.mjs` 擴充 MTT 場景 + `table.name` 解析（`"BB VS MP"` → scenario/depth/position） | catalog 新增 MTT block | ⬜ |
| C3 | E2E 小樣本：選 1 個 scenario → 產 input → solve 1 flop → 入 DB → 驗 retrieval | 1 筆 DB row 可查 | ⬜ |
| C4 | 建 MTT 專用 DB table（`solver_postflop_mtt`）或擴充現有 6max table | schema migration | ⬜ |

### C0 探查結果備忘

**JSON 格式兩種**
- 新：`*_ranges.json`（用 action_id，配 `action_id_map.json`）— 主力
- 舊：`pd_*.json`（用 `rgb(...)`，配 scrape-pokerdinosaur.js COLOR_MAP）— 逐步淘汰

**label → TexasSolver bucket 映射（C1 現行）**
- `raise` ← Raise / 4B / 3B* / Jam / All-in / `Raise 2.5bb` 等
- `call` ← Call / Check / Limp / Defend*
- `fold` ← Fold
- mixed strategy：`{action_id: 權重%}` → 保留權重（`AKs:0.5`）

**Ben 系 projects（label 乾淨，C1 OK）**
Live MTT Ben / Tournament Ben / Tournament Chip EV 一類 — 7 個標準 label。

**Course / ICM 系（label 複合，C1.5 已處理）**
用 **first-matching-token + prefix** 掃描：`3B Value / Jam < 35bb` → token `3B` → raise；`limp3bet/bluff` → prefix `limp` → call；`"All in"` normalize 成 `allin`。

**10 個 project 現況**（C1.5 後）
- ✅ 0 unknown：Live MTT Ben / Tournament Ben / Tournament Chip EV / Large/Medium/Small ICM / Final Two Tables
- ⚠️ 少量資料品質 unknown（converter 不負責）：
  - Course：少數 cells 以 `20bb/25bb` 深度字串當 label → skip 為 unknown（pd 教練填錯）
  - Final Table / Final Table Exploitative：字面 `Unknown` label（pd 資料源本身缺）

**注意**：C0-C3 不阻擋 Scraping 繼續；C4 需測試 Supabase SQL Editor 貼碼（依 CLAUDE.md 規則）。

---

## 線 3：Solver（已存在，持續跑 Cash + HU）

| Phase | 範圍 | Flops | 狀態 | 存放 |
|---|---|---|---|---|
| ✅ Done | 6-max 100bb SRP × 25 場景 | 13 | ✅ | DB `solver_postflop_6max`（325 rows） |
| ✅ Done | HU 40bb SRP | 13 | ✅ | src/lib/gto/gtoData_hu_40bb_srp_*.ts |
| ✅ Done | HU 25bb SRP | 25 | ✅ | src/lib/gto/gtoData_hu_25bb_srp_*.ts |
| ✅ Done | HU 25bb 3bp | 30 | ✅ | src/lib/gto/gtoData_hu_25bb_3bp_*.ts |
| ✅ Done | HU 13bb SRP | 42 | ✅ | src/lib/gto/gtoData_hu_13bb_srp_*.ts |
| ⬜ P1 | HU 40bb 補齊到 25 flops | +12 | ⬜ | 同上 |
| ⬜ P2 | HU 40bb 3bp | 25 | ⬜ | 新檔 |
| ⬜ P3 | 6-max 100bb 4bp（10 場景 × 13 flops） | 130 | ⬜ | DB 擴充 |
| ⬜ P4 | 6-max 深度擴充（60bb / 40bb SRP） | ? | ⬜ | 新 DB rows |
| ⬜ P5 | **MTT scenario postflop**（串 C4 後才跑） | ? | ⬜ **依賴 C4** | 新 table |

---

## 依賴與平行度

```
S1 ────► S2 ────► S3 ────► S4     (這台：scraping)
                    │
                    ▼
C0 ─► C1 ─► C2 ─► C3 ─► C4 ─► P5  (任一台：converter + MTT solve)

P1 ─────── 獨立可跑                (任一台：solver 補齊)
P2 ─────── 獨立可跑
P3 ─────── 獨立可跑
P4 ─────── 獨立可跑
```

- Scraping（S 線）和 Converter（C 線）可完全平行
- Solver 補齊（P1-P4）不依賴任何新 scraping
- P5（MTT postflop）是串接目標，等 S + C 都到位才能跑

---

## 當前行動指引

**這台電腦（範圍收集）**
1. ✅ S1 LiveMTT_Ben 已完成（1149/1149，2026-04-21 audit 確認）
2. 開始 S2：Chrome 打開 pokerdinosaur **Tournament_Ben_Adjusted** project（id `10e6b471-b384-4a0f-8d69-255a4a8d250c`，1470 tables）→ 跑 scrape-pokerdinosaur.js
3. 抓完把 PNG 移到 `C:/Users/User/Downloads/GTO/Tournament_Ben/`、JSON 已在 Downloads 根目錄
4. 跑 `node scripts/upload-pd-data.js` 把 JSON 入測試 Supabase（若尚未入庫）
5. 更新本頁 S2 狀態為 ✅，然後進 S3

**另一台電腦（修 bug + 若有空接 C 線）**
- 主要任務：exploit-coach bug 修正（見 dev-log）
- 若 bug 修完有空：從 C0 開始（探查 JSON schema 可 local 讀 Downloads/GTO/*.json）

**協作紀律**
- 每次 commit `src/version.ts` + `memory/dev-log.md` 會衝突，手動解即可
- 動到 scripts/gto-pipeline/ 的前 pull 一次
- converter 完成前 S 線不 block（繼續爬）

---

## 相關連結

- [[project_pokerdinosaur_scraping]] — scraping 技術規則
- [[scraping-audit-2026-04-21]] — T-013 scraping 現況盤點快照（10 個 JSON + PNG diff）
- [[hu-simulator]] — HU solver 使用情境
- [[deployment-state]] — Supabase 基礎設施
