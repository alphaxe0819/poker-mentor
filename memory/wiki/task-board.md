---
name: Task Board
description: 中央大腦看板 — task 分派 / 執行中 / 審查中 / 已完成；支援 wip branch 雙角色模型
type: project
updated: 2026-04-20
---

## 使用規則

**四區狀態流**：`Queue` → `In Progress` → `In Review` → `Done`

**大腦模式**（session 角色 = 🧠 大腦）：
- 讀 roadmap / conversation → 拆成 task → 寫進 Queue（附 task-id / 範圍 / 依賴）
- 看 In Review → 拉 wip branch review → merge 到 dev → bump version + append dev-log → 移 Done
- 刪已 merge 的 wip branch：`git push origin --delete wip/<branch>`

**執行者模式**（session 角色 = 🛠 執行者）：
- 從 Queue 挑 task（或大腦指派）→ 移 In Progress
- `git checkout -b wip/<task-id>-<短描述>`
- 自由 commit + push wip branch（**不動** `src/version.ts` / `memory/dev-log.md`）
- 完成後移 In Review，附 wip branch 名 + 最後 commit hash

**單機快修模式**（session 角色 = ⚡ 單機）：
- 跳過 wip branch，直接在 dev 做、bump、push

**Task id**：`T-NNN`（流水號）
**Wip branch**：`wip/T-NNN-<短描述>`，例如 `wip/T010-c2-scenarios`

完整規則見 [[two-machine-workflow]]。

---

## 🎯 Queue（待做，等指派或大腦決定順序）

### Pipeline 線

- [ ] **T-010** | Pipeline | **C2 場景化（converter 接 scenarios.mjs）**
  - 建議 branch：`wip/T010-c2-scenarios`
  - 範圍：`scripts/gto-pipeline/scenarios.mjs` + 新 `parse-pd-table-name.mjs`
  - 內容：解析 pd table.name（`"BB VS MP"` / `"10bb SB Push"`）→ scenario / depth / position；加 MTT catalog
  - 依賴：C1.5 ✅
  - 產出：pd hand map → scenarios.mjs 可吃的物件

- [ ] **T-011** | Pipeline | **C3 E2E 小樣本**
  - 建議 branch：`wip/T011-c3-e2e`
  - 範圍：挑 1 MTT scenario → TexasSolver input → solve 1 flop → 入 DB → 驗 retrieval
  - 依賴：T-010
  - 產出：1 筆 DB row 可查

- [ ] **T-012** | Pipeline | **C4 MTT DB migration**
  - 建議 branch：`wip/T012-mtt-db-migration`
  - 範圍：`solver_postflop_mtt` table schema（仿 `solver_postflop_6max`）
  - 依賴：T-011
  - 產出：migration SQL + 測試 Supabase 貼碼

- [ ] **T-013** | Pipeline | **Scraping 成果盤點 + 整理**
  - 建議 branch：`wip/T013-scraping-audit`
  - 範圍：確認 Downloads 現有 10 個 `_ranges.json` 對應的 PNG 整理狀態 + 更新 roadmap S1-S4
  - 產出：Scraping 線實際進度對齊

- [ ] **T-020** | Pipeline | **Solver P1 HU 40bb SRP 補齊到 25 flops**
  - 建議 branch：`wip/T020-hu40bb-srp-fill`
  - 現況：只 13 flops
  - 預估：2-3 hr 背景
  - 產出：`src/lib/gto/gtoData_hu_40bb_srp_*.ts` +12 檔

- [ ] **T-021** | Pipeline | **Solver P2 HU 40bb 3bp × 25 flops**
  - 建議 branch：`wip/T021-hu40bb-3bp`
  - 預估：3-5 hr

- [ ] **T-022** | Pipeline | **Solver P3 6-max 100bb 4bp（10 場景 × 13 flops）**
  - 建議 branch：`wip/T022-6max-4bp`
  - 預估：3-5 hr

- [ ] **T-023** | Pipeline | **Solver P4 6-max 深度擴充（40bb/60bb SRP）**
  - 建議 branch：`wip/T023-6max-shallow`
  - 待確認具體範圍

### Product 線

- [ ] **T-030** | Product | **實機驗證 exploit-coach 5 bug（dev.16）**
  - 建議 branch：無（純手動 UI 驗證，不需 branch）
  - 操作位置：瀏覽器 `https://poker-goal-dev.vercel.app/`
  - 驗證：
    1. Bug 1 Call 2/5 顯示金額
    2. Bug 2 turn all-in → 跳 s5 攤牌
    3. Bug 3 raise 輸入框鍵盤不擠畫面
    4. Bug 4 S5b 對手手牌流程
    5. Bug 5 token refresh（久待不過期）
  - 產出：pass / fail + console log（若 fail）

- [ ] **T-031** | Product | **feature/exploit-lab WIP 處理**
  - 建議 branch：先在該分支 commit 保存，再評估
  - 現況：04-16 WIP（batch-worker、seed-batches、DB migration、getGTOPostflopFromDB）
  - 動作：保存 → checkout dev → 評估 WIP 是否補 dev 缺漏

- [ ] **T-032** | Product | **`.env` 檢查 + 環境驗證**（另一台電腦）
  - 建議 branch：無
  - 動作：`ls .env`；無則 `powershell scripts/setup-env.ps1`

### 大腦任務

- [ ] **T-040** | 大腦 | **range-collection-roadmap 同步**（依賴 T-013）
- [ ] **T-041** | 大腦 | **每日收工確認**：`git log --all --since=today` 看兩邊都 push

---

## 🔨 In Progress（執行中）

*（空）*

格式範例：
```
- [~] **T-010** | Pipeline | C2 場景化
  - branch: `wip/T010-c2-scenarios`
  - 執行者 session 起：2026-04-20 23:00
  - 進度筆記：已改 scenarios.mjs head，還在設計 parse-pd-table-name 規則
```

---

## 👀 In Review（等大腦整合）

*（空）*

格式範例：
```
- [?] **T-010** | Pipeline | C2 場景化
  - branch: `wip/T010-c2-scenarios`（推 origin 完成）
  - 最後 commit: abc1234
  - 執行者備註：unit test 已通過；看 diff 重點在 scenarios.mjs +120 / parse-pd-table-name.mjs +80
  - 等大腦 merge
```

---

## ✅ Done

- [x] **T-000** | Pipeline | Converter C0 + C1 + C1.5 | 2026-04-20 | `02af585` (dev.20)
  - 產出：`pd-to-range.mjs` + `inspect-pd.mjs`；10 個 pd project 全轉完成（~16k tables）
- [x] **T-001** | Product | exploit-coach 5 bug 程式修復 | 2026-04-19~20 | `ff6f1f9` (dev.16)
  - 產出：mockup-v3.html + ExploitCoachTab.tsx + exploit-coach/index.ts
  - 狀態：**待 T-030 實機驗證**
- [x] **T-002** | 大腦 | 跨機 auto-sync 機制 + task-board 起初 | 2026-04-20 | `fd5fc4c` / `10b0e59`
  - 產出：session-sync.sh + session-start-reminder.sh + two-machine-workflow 初版
- [x] **T-003** | Pipeline | 範圍收集成果 + .claude settings 整頓 | 2026-04-20 | `754f651` (dev.17)
- [x] **T-004** | 大腦 | range-collection-roadmap 初版 | 2026-04-20 | `ca11e86` (dev.18)
- [x] **T-005** | 大腦 | 雙角色 workflow 升級（wip branch 模型） | 2026-04-20 | 本次 commit
  - 產出：two-machine-workflow.md 重寫 + session-start-reminder 改 3 角色問句 + task-board 加 In Review

---

## 相關連結

- [[two-machine-workflow]] — 雙角色 + wip branch + 大腦整合 SOP（新）
- [[range-collection-roadmap]] — Pipeline 線三線分批進度
- [[project_gto_trainer]] — 專案整體現況
