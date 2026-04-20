---
name: Task Board
description: 中央大腦看板 — 兩台電腦的 task 分派、執行中、已完成狀態
type: project
updated: 2026-04-20
---

## 使用規則

- **大腦模式**（你 + Claude）：讀 roadmap → 拆成 task → 寫進 Queue，指派機器 / 範圍 / 依賴 / 預計產出
- **Worker 模式**（各台 Claude）：開工讀 board → 挑**指派給本機**的 task → 標 In Progress + 時間 → 做完改 Done + 附 commit hash
- 每個 commit 完如果有 task 狀態變動，同步更新這頁再一起 push
- 兩台同 task 衝突（極少）→ 停下問使用者

**Task id**：`T-NNN`（流水號，從已完成的倒過來編）

---

## 🎯 Queue（待做）

### 桌機 Pipeline 線

- [ ] **T-010** | 桌機 | **C2 場景化（converter 接 scenarios.mjs）**
  - 範圍：`scripts/gto-pipeline/scenarios.mjs` + 新 `parse-pd-table-name.mjs`
  - 內容：解析 pd table.name（`"BB VS MP"` / `"10bb SB Push"`）→ scenario / depth / position；加 MTT catalog block
  - 依賴：C1.5 ✅
  - 產出：能把 pd hand map 轉成現有 pipeline 可吃的 scenario object

- [ ] **T-011** | 桌機 | **C3 E2E 小樣本**
  - 範圍：挑 1 個 MTT scenario（如 Live MTT Ben BTN 40bb RFI）→ 產 TexasSolver input → solve 1 flop → 入 DB → 驗 retrieval
  - 依賴：T-010
  - 產出：1 筆 DB row 可查 + 確認流程通暢

- [ ] **T-012** | 桌機 | **C4 MTT DB migration**
  - 範圍：新 `solver_postflop_mtt` table schema（仿 `solver_postflop_6max`）
  - 依賴：T-011
  - 產出：migration SQL + 測試 Supabase 貼碼

- [ ] **T-013** | 桌機 | **Scraping 成果盤點 + 整理**
  - 現況：Downloads 已有 10 個 `_ranges.json`（包括 Live_MTT_Ben、Tournament_Ben、Tournament_Chip_EV、4 個 ICM、Final_Table 等）
  - 範圍：(a) 確認哪些 PNG 還沒進 `C:/Users/User/Downloads/GTO/` 子夾；(b) 更新 [[range-collection-roadmap]] 的 S1-S4 實際狀態
  - 產出：Scraping 線實際進度對齊

- [ ] **T-020** | 桌機 | **Solver P1 HU 40bb SRP 補齊到 25 flops**
  - 現況：只 13 flops
  - 範圍：batch-run.ps1 跑剩下 12 個 flops
  - 預估：2-3 hr 背景
  - 產出：`src/lib/gto/gtoData_hu_40bb_srp_*.ts` +12 檔

- [ ] **T-021** | 桌機 | **Solver P2 HU 40bb 3bp × 25 flops**
  - 依賴：無
  - 預估：3-5 hr
  - 產出：`src/lib/gto/gtoData_hu_40bb_3bp_*.ts` ×25

- [ ] **T-022** | 桌機 | **Solver P3 6-max 100bb 4bp（10 場景 × 13 flops = 130）**
  - 依賴：無
  - 預估：3-5 hr
  - 產出：DB 擴充

- [ ] **T-023** | 桌機 | **Solver P4 6-max 深度擴充（40bb/60bb SRP）**
  - 依賴：無
  - 待確認範圍

### 行動機 Product 線

- [ ] **T-030** | 行動機 | **實機驗證 exploit-coach 5 bug（dev.16）**
  - 操作位置：瀏覽器開 `https://poker-goal-dev.vercel.app/`
  - 驗證項目：
    1. Bug 1：Call 2bb vs Call 5bb 在座位旁顯示 `call 2` / `call 5`
    2. Bug 2：turn all-in 被 call → 按鈕「All-in → 攤牌」直接到 s5，跳過 river
    3. Bug 3：raise 輸入框按下 → 數字鍵盤 + 輸入框捲到畫面中央（iOS）
    4. Bug 4：河牌結束 → S5b「你知道對手手牌嗎？」→ 知道選 2 張 → 分析帶對手手牌
    5. Bug 5（重要）：等 1h+ 或去別 tab 再回來按開始分析 → 不再「登入已過期」
  - 產出：每個 bug pass / fail 紀錄
  - 若 fail：回報錯誤訊息 + DevTools Console log

- [ ] **T-031** | 行動機 | **feature/exploit-lab WIP 處理**
  - 現況：該分支有 04-16 WIP（batch-worker、seed-batches、DB migration、getGTOPostflopFromDB）
  - 動作：(1) 先 commit 到 feature/exploit-lab 保存；(2) checkout dev；(3) 評估 WIP 檔是否補 dev 缺漏的 migration 歷史
  - 產出：WIP 分類清單（保留 / 丟棄 / cherry-pick 進 dev）

- [ ] **T-032** | 行動機 | **`.env` 檢查 + 環境驗證**
  - 動作：`ls .env`；若無則 `powershell scripts/setup-env.ps1`
  - 產出：確認 dev 可跑 `npm run build` 不報錯

### 共用 / 大腦任務

- [ ] **T-040** | 大腦 | **range-collection-roadmap 同步**
  - 依賴：T-013（Scraping 盤點）
  - 動作：把 Scraping 線實際狀態（10 個 _ranges.json 都已抓）更新到 roadmap S1-S4

- [ ] **T-041** | 大腦 | **每日收工確認兩台都 push**
  - 頻率：每日
  - 動作：看 `git log --all --since=today` 確認兩台 commit 都在 origin

---

## 🔄 In Progress（執行中）

（無，等 worker 接任務）

---

## ✅ Done

- [x] **T-000** | 桌機 | Converter C0 + C1 + C1.5 | 2026-04-20 | `02af585` / `36619df` / `02af585`
  - 產出：`scripts/gto-pipeline/pd-to-range.mjs` + `inspect-pd.mjs` + 10 個 pd project 全轉完成（~16k tables）
- [x] **T-001** | 桌機 | exploit-coach 5 bug 程式修復 | 2026-04-19~20 | `ff6f1f9` (dev.16)
  - 產出：`public/exploit-coach-mockup-v3.html` + `src/tabs/ExploitCoachTab.tsx` + `supabase/functions/exploit-coach/index.ts`
  - 狀態：**待 T-030 實機驗證**
- [x] **T-002** | 桌機 | 跨機 auto-sync + task-board 機制 | 2026-04-20 | `fd5fc4c` (dev.21)
  - 產出：`scripts/session-sync.sh` + `session-start-reminder.sh` + `memory/wiki/two-machine-workflow.md`
- [x] **T-003** | 桌機 | 範圍收集成果 + .claude settings 整頓 | 2026-04-20 | `754f651` (dev.17)
  - 產出：200+ input 檔 + 70+ HU gto data + sharp 依賴 + shared permissions
- [x] **T-004** | 桌機 | 範圍收集 roadmap 初版 | 2026-04-20 | `ca11e86` (dev.18)
  - 產出：`memory/wiki/range-collection-roadmap.md`

---

## 相關連結

- [[two-machine-workflow]] — 跨機共工 SOP（SessionStart 自動化、角色偏好、衝突解法）
- [[range-collection-roadmap]] — Pipeline 線三線分批進度（scraping / converter / solver）
- [[project_gto_trainer]] — 專案整體現況（memory root）
