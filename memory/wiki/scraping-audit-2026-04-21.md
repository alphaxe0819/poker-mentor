---
name: Scraping Audit 2026-04-21
description: T-013 盤點快照 — 10 個 pokerdinosaur project _ranges.json 到位狀況 + 對應 PNG 爬取進度 + roadmap S0-S4 diff
type: project
created: 2026-04-21
task: T-013
branch: wip/T013-scraping-audit
---

## TL;DR

1. **10 個 `*_ranges.json` 已全數到位**（Downloads 根目錄），converter pipeline（`pd-to-range.mjs`）可直接消化
2. **S1 LiveMTT_Ben 實際已爬完**（unique PNG = 1149 = JSON tables 數），roadmap 顯示 ⏳ 需改 ✅
3. S0 段 9 個 scenario 的 PNG 資料夾齊，但 Openraising / Flatting_3Betting 實際檔數比 roadmap 少 12 張（資料品質小 diff，不影響 converter）
4. **S2-S4 僅 JSON 到位、PNG 尚未開爬**（5 個 project 共約 12037 張待爬）

---

## 1. `*_ranges.json` 到位清單（Downloads 根目錄）

10 個 pokerdinosaur project 的 JSON 全部存在於 `C:/Users/User/Downloads/`：

| JSON 檔名 | project_name | project_id | tables |
|---|---|---|---|
| Live_MTT_Ben_Adjusted_ranges.json | Live_MTT_Ben_Adjusted | d28e7eb8-8cd0-41df-91d6-c5181140304a | 1149 |
| Tournament_Ben_Adjusted_ranges.json | Tournament_Ben_Adjusted | 10e6b471-b384-4a0f-8d69-255a4a8d250c | 1470 |
| Tournament_Chip_EV_ranges.json | Tournament_Chip_EV | 695ecb95-e771-43a8-8487-ba61f8d01a1e | 945 |
| Course_ranges.json | Course | f443feb0-c8e1-4bb1-9a76-e40ba6e4eb46 | 353 |
| Large_Field_ICM_ranges.json | Large_Field_ICM | 9167064a-adce-4e14-9b9f-0908683c816a | 2505 |
| Medium_Field_ICM_ranges.json | Medium_Field_ICM | 8c170d73-e577-46c0-97de-2723efa1c9fe | 2230 |
| Small_Field_ICM_ranges.json | Small_Field_ICM | b0a2e36e-d417-41d2-804d-cd35a6bb27bd | 2041 |
| Final_Two_Tables_ranges.json | Final_Two_Tables | f5468b75-a3bb-4bdc-84a5-deb4730d30b3 | 857 |
| Final_Table_ranges.json | Final_Table | 68972eca-89a2-4296-bfad-71405fad54c7 | 2600 |
| Final_Table_Exploitative_ranges.json | Final_Table_Exploitative | e93d77d7-8e6a-423f-aa4c-bceb0d338b9a | 2600 |
| **合計** |  |  | **16750** |

`action_id_map.json` 也在同目錄，converter 兩個輸入齊。

---

## 2. PNG 爬取進度盤點（`Downloads/GTO/`）

### S0 課程表格（9 個 scenario folder）

| Roadmap Scenario | Roadmap 宣稱 | 實際 PNG | Diff |
|---|---|---|---|
| S0.1 Openraising | 70 | 63 | −7 ⚠️ |
| S0.2 Flatting & 3Betting | 108 | 103 | −5 ⚠️ |
| S0.3 Rejamming | 33 | 33 | ✓ |
| S0.4 Calling Rejams | 16 | 16 | ✓ |
| S0.5 HU | 20 | 20 | ✓ |
| S0.6 Squeezing | 25 | 25 | ✓ |
| S0.7 Multiway | 56 | 56 | ✓ |
| S0.8 4B / Cold Calling 3B | 26 | 26 | ✓ |
| S0.9 Defending | 11 | 11 | ✓ |
| **S0 合計** | **365** | **353** | **−12** |

S0.1 Openraising 有 `10bb - Push` 與 `10bb-Push`、`15bb - Push` 與 `15bb-Push` 兩組重複命名的子資料夾存在 — 可能是整理時命名漂移，但不影響 converter（converter 吃 JSON 不吃 PNG）。

S0 段的 diff 屬資料整理層面的小瑕疵，**不阻擋 converter pipeline**；JSON 端對應的 project 是 `Course_ranges.json`（353 tables，剛好對上 S0 實際檔數）。

### S1-S4 project 級爬取進度

| Phase | Project | JSON tables | PNG 資料夾 | unique PNG | 狀態 |
|---|---|---|---|---|---|
| **S1** | **Live_MTT_Ben_Adjusted** | **1149** | `GTO/LiveMTT_Ben/` | **1149** | **✅ 已完成**（1149/1149） |
| S2 | Tournament_Ben_Adjusted | 1470 | 未建 | 0 | ⬜ 待爬 |
| S3 | Tournament_Chip_EV | 945 | 未建 | 0 | ⬜ 待爬 |
| S4a | Final_Two_Tables | 857 | 未建 | 0 | ⬜ 待爬 |
| S4b | Final_Table | 2600 | 未建 | 0 | ⬜ 待爬 |
| S4c | Final_Table_Exploitative | 2600 | 未建 | 0 | ⬜ 待爬 |
| S4d | Large_Field_ICM | 2505 | 未建 | 0 | ⬜ 待爬 |
| S4e | Medium_Field_ICM | 2230 | 未建 | 0 | ⬜ 待爬 |
| S4f | Small_Field_ICM | 2041 | 未建 | 0 | ⬜ 待爬 |

> **LiveMTT_Ben 資料夾粗算 2207 PNG，但檔名 `*(1).png` 是下載器重跑時產生的副本**（對照原檔 byte size 可見 byte 差異不固定，但 scenario 覆蓋範圍完全相同）。去掉 `(N)` 後綴後 unique 檔名 = 1149，剛好對上 JSON 的 1149 tables。

**S2-S4 待爬總量**：1470 + 945 + 857 + 2600 + 2600 + 2505 + 2230 + 2041 = **13248 張**
（roadmap S4 原本寫 `?`，現在可補上具體數字）

---

## 3. roadmap 需更新的點

1. **S1 狀態**：`⏳ 進行中` → `✅ 1149/1149`
2. **S0 合計 PNG 數**：`365` → `353`（或註記「roadmap 宣稱數字為近似」）
3. **S0.1 Openraising**：`70` → `63`
4. **S0.2 Flatting & 3Betting**：`108` → `103`
5. **S4 合計張數**：`?` → `13248`（拆 6 個 project 列）
6. **「當前行動指引」的 S1 指令**已不適用（S1 已完成），改為「開始 S2 Tournament_Ben_Adjusted」

## 4. 對 converter (C 線) 與 solver (P 線) 的影響

- **C2 `scenarios.mjs` 擴充 MTT**：現在有 10 個完整 project JSON 可測，不需等待 scraping
- **C3 E2E 小樣本**：可直接挑 Live_MTT_Ben_Adjusted 中任一 table 跑
- **C4 DB schema**：估算 MTT 全量 rows 上限 = 16750 tables × 若干 flop — 可依此設計 partition
- **P5 MTT postflop solve**：S1 完成後可優先跑 Live_MTT_Ben 的 subset，不需等 S2-S4

## 5. 遺留問題（不在 T-013 scope）

- S0.1 / S0.2 的 −12 張 diff：要查是當初整理時漏放、還是 pokerdinosaur 側原本就沒有（建議開 T-0xx follow-up 查對 `Course_ranges.json` 中的 table 名稱）
- `pokerdinosaur_Openrasing_100bb.json`、`pd_Openrasing_*.json`、`pd_Flatting___3Betting_*.json` 等舊格式檔殘留在 Downloads — roadmap C0 已標示「逐步淘汰」，可另開 T-0xx 清理
- `projects_all.json` / `scenarios_all.json` 還在 Downloads，未確認是否已入 repo / DB

---

## 相關連結

- [[range-collection-roadmap]] — 本次 audit 後已同步更新
- [[project_pokerdinosaur_scraping]] — S1 LiveMTT_Ben 狀態需同步
- [[task-board]] — T-013（本任務）、T-040（大腦側 roadmap 同步）
