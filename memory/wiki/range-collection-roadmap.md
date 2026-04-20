---
name: Range Collection Roadmap
description: 範圍收集總進度表 — scraping 線 + converter 串接 + solver 線的分批勾選清單
type: project
updated: 2026-04-20
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

### 已完成（365 PNG + 對應 JSON）

| Phase | Scenario | 檔數 | 狀態 |
|---|---|---|---|
| S0.1 | Openraising | 70 | ✅ |
| S0.2 | Flatting & 3Betting | 108 | ✅ |
| S0.3 | Rejamming | 33 | ✅ |
| S0.4 | Calling Rejams | 16 | ✅ |
| S0.5 | HU | 20 | ✅ |
| S0.6 | Squeezing | 25 | ✅ |
| S0.7 | Multiway | 56 | ✅ |
| S0.8 | 4B / Cold Calling 3B | 26 | ✅ |
| S0.9 | Defending | 11 | ✅ |

### 進行中 / 待爬

| Phase | Project | 張數 | 狀態 |
|---|---|---|---|
| **S1** | **LiveMTT_Ben（現場錦標賽 - Ben 調整版）** | **1145** | **⏳ 進行中** |
| S2 | 錦標賽 - Ben 調整版 | 1470 | ⬜ |
| S3 | 錦標賽 - 籌碼期望值 | 945 | ⬜ |
| S4 | 決賽桌 ICM 系列（決賽桌 / 削剛策略 / 最後兩桌 / 大中小 ICM） | ? | ⬜ |

**執行方式**：Chrome MCP + scrape-pokerdinosaur.js（詳見 [[project_pokerdinosaur_scraping]]）

---

## 線 2：Converter（新，串接 scraping → solver）

| Phase | 任務 | 產出 | 狀態 |
|---|---|---|---|
| C0 | 探查 pd JSON 實際 schema | `inspect-pd.mjs` + 映射規則 | ✅ 2026-04-20 |
| C1 | 寫 `pd-to-range.mjs`（輸入 `_ranges.json` + `action_id_map.json` → per-table hand map JSON） | `pd-to-range.mjs`（對 Ben 系 projects 可用，乾淨 7 label） | ✅ 2026-04-20 |
| C1.5 | 擴充 label 規則處理複合策略（Course / ICM 系列的 Ben 教練式 label，如 `3B Value / Jam < 35bb`） | LABEL_RULES 擴充 | ⬜ |
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

**Course / ICM 系（label 複合，需 C1.5）**
`3B Value / Jam < 35bb`、`raise/4bet bluff` 這種複合語義，當前走 `unknown` bucket。

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
1. 繼續 S1：Chrome 打開 pokerdinosaur LiveMTT_Ben project → 跑 scrape-pokerdinosaur.js
2. 抓完把 PNG 移到 `C:/Users/User/Downloads/GTO/LiveMTT_Ben/`、JSON 留 Downloads 根目錄
3. 跑 `node scripts/upload-pd-data.js` 把 JSON 入測試 Supabase
4. 更新本頁 S1 狀態為 ✅，然後進 S2

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
- [[hu-simulator]] — HU solver 使用情境
- [[deployment-state]] — Supabase 基礎設施
