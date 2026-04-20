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

- [ ] **T-050** | Product | **exploit-coach v2 bug 修復（3 個新 bug）** 🔥 優先
  - 建議 branch：`wip/T050-exploit-coach-bugs-v2`
  - 範圍：`public/exploit-coach-mockup-v3.html` + 可能 `src/tabs/ExploitCoachTab.tsx`
  - 使用者驗證發現：

  **Bug 0** — Hero 手牌未選仍可進「下一步 →」
  - 位置：S1 頁面（位置 & 手牌）的「下一步」按鈕
  - 成因推測：按鈕 onclick 沒檢查 `heroCards[0] && heroCards[1]`
  - 修法：加按鈕 disabled 條件或 onclick guard
  - 順便：對手位置也該必選才能「下一步」

  **Bug 1** — S5b「我知道」→ 點卡槽沒開 picker / 無法輸入
  - 位置：`openVillPicker` / `renderVillainSlots` / `pickSuit` 的 `v` prefix 分支
  - 成因推測：
    - `openVillPicker` 有設 `pickerTarget = 'v' + idx` 但 `#card-picker` DOM 沒顯示（z-index? `.show` class?）
    - 或 `pickSuit` 的 `typeof tgt === 'string' && tgt.charAt(0) === 'v'` 判斷出錯
  - Debug 步驟：iframe DevTools 看 `document.getElementById('card-picker').classList`，看點擊卡槽時是否加上 `show`
  - Console 觀察：點卡槽時有沒有 error

  **Bug 2** — AI 分析顯示「⚠ 連線錯誤：Load failed」
  - 位置：
    - `public/exploit-coach-mockup-v3.html` 的 `callCoach`
    - `src/tabs/ExploitCoachTab.tsx` 的 postMessage listener
  - 成因推測（三選一或多項同發）：
    - (a) postMessage 鏈路斷：parent listener 的 `e.source !== iframe.contentWindow` 判斷過嚴
    - (b) 未登入 → `getFreshAccessToken` 回 null → 直接 fetch 觸發 CORS error
    - (c) Edge Function 本身 4xx/5xx（測試 Supabase 的 exploit-coach Function 狀態）
  - Debug 步驟：
    1. iframe DevTools Network tab 看 `functions/v1/exploit-coach` 的 request status
    2. 若是 401/403 → token 問題（回到 postMessage 橋接 debug）
    3. 若是 CORS → parent 沒 listener（回 ExploitCoachTab.tsx debug）
    4. 若是 500 → Edge Function 掛（看 Supabase Dashboard logs）

  - 完成條件：
    - `npx tsc -b --noEmit` EXIT=0
    - 實機測試 3 個 bug 都 pass（iOS Safari + Chrome）
    - Console 無 error / warning

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

<!-- T-031 已完成，移至 Done -->

- [ ] **T-032** | Product | **`.env` 檢查 + 環境驗證**（另一台電腦）
  - 建議 branch：無
  - 動作：`ls .env`；無則 `powershell scripts/setup-env.ps1`

### 大腦任務

- [ ] **T-040** | 大腦 | **range-collection-roadmap 同步**（依賴 T-013）
- [ ] **T-041** | 大腦 | **每日收工確認**：`git log --all --since=today` 看兩邊都 push

### Follow-up（T-033 引發）

- [ ] **T-042** | Pipeline | **部署 20260416-gto-postflop.sql 到測試 Supabase**
  - 動作：貼 migration SQL 到測試 Supabase SQL Editor（btiqmckyjyswzrarmfxa）
  - 驗證：`SELECT * FROM information_schema.tables WHERE table_name IN ('gto_postflop', 'gto_batch_progress')`
  - 驗證 RPC：`SELECT claim_gto_batch('DESKTOP-TEST')` 應回空 row
- [ ] **T-043** | Pipeline | **batch-worker 環境準備 + 首次實跑**
  - 動作：scripts/gto-pipeline/ 下 `npm install @supabase/supabase-js`
  - 加 `.env` 含 `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`
  - 跑 `node seed-batches.mjs` → 應填 N 筆 pending 到 gto_batch_progress
  - 跑 `node batch-worker.mjs --machine DESKTOP-A --dry-run` 驗證領取流程
  - 依賴：T-042

---

## 🔨 In Progress（執行中）

*（空）*

<!-- T-033 已 merge 到 dev，移至 Done -->

<details>
<summary>📦 T-033 歷史紀錄（已 Done）</summary>

- [~] **T-033** | Pipeline | **GTO postflop v2 WIP — ⚠️ BLOCKED on call-site async-ify**
  - branch: `wip/T033-gto-postflop-v2-wip` (commit `c64d2eb`，已 push)
  - 大腦 review 結論：**7 檔全部有價值，採納方向確定**
    - `supabase/migrations/20260416-gto-postflop.sql` — gto_postflop + gto_batch_progress + claim_gto_batch RPC，**高品質雙機協調設計**
    - `src/lib/gto/getGTOPostflopFromDB.ts` — 乾淨的 prefetch + cache client
    - `scripts/gto-pipeline/batch-worker.mjs` + `seed-batches.mjs` — 跨平台 Node worker，比 dev 的 `batch-run.ps1` 更完整
    - `scripts/gto-pipeline/boards.mjs` — turnCards 擴充，不破壞現有用途
    - `src/lib/gto/huHeuristics.ts` — PostflopRole 加 turn/river，純擴充
  - ⚠️ **Block 原因**（merge 嘗試失敗 tsc 錯）：
    - `getHUPostflopAction` 在 wip 改為 `async` → 回傳 `Promise<ActionDecision>`
    - dev 上 `src/lib/hu/botAI.ts:317` 仍是**同步呼叫**
    - 連帶：`decidePostflop` / `decideBotAction` 需 async 化；呼叫 `decideBotAction` 的 UI 元件也要 await
    - 錯誤：`src/lib/hu/botAI.ts(328,39): error TS2345: Argument of type 'Promise<ActionDecision>' is not assignable to parameter of type 'ActionDecision'`
  - 大腦動作：merge 試做並已 revert（dev 回到 `212c097` / dev.25）
  - **執行者下一步**：拉 `wip/T033-gto-postflop-v2-wip` → 補 call-site async 化 → push amended commit → 標 In Review 再次
    - 範圍：`src/lib/hu/botAI.ts`（decidePostflop / decideBotAction 改 async）
    - 連帶：所有 `decideBotAction` 的呼叫處（可能在 `src/pages/HeadsUpMatch*` 或 `src/components/HeadsUp*`）
    - 完成條件：`npx tsc -b --noEmit` EXIT=0

</details>

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
- [x] **T-005** | 大腦 | 雙角色 workflow 升級（wip branch 模型） | 2026-04-20 | `4ccc701` (dev.23)
  - 產出：two-machine-workflow.md 重寫 + session-start-reminder 改 3 角色問句 + task-board 加 In Review
- [x] **T-033** | Pipeline + 大腦 | **GTO postflop v2 pipeline + async bot chain** | 2026-04-20 | merge commit + dev.27
  - 執行者：另一台機器（c64d2eb 初版 + b673b0b async fix）
  - 大腦：review 2 輪（第 1 輪 revert blocked on call-site；第 2 輪 merge clean）
  - 產出（12 檔）：
    - `supabase/migrations/20260416-gto-postflop.sql`（gto_postflop + gto_batch_progress + claim_gto_batch RPC）
    - `src/lib/gto/getGTOPostflopFromDB.ts`（client DB reader with prefetch cache）
    - `scripts/gto-pipeline/batch-worker.mjs` + `seed-batches.mjs`（跨平台雙機協調 worker）
    - `scripts/gto-pipeline/boards.mjs`（turn cards 擴充）
    - `src/lib/gto/getHUPostflopAction.ts` + `huHeuristics.ts`（async + turn/river roles）
    - `src/lib/hu/botAI.ts` + `HeadsUpMatchScreen{,V2}.tsx`（decision chain async 化）
    - 2 個 test 檔對應 async
- [x] **T-031** | 大腦 | feature branches 盤點 + 清理 | 2026-04-20 | 本次 commit
  - 調查結果：`feature/exploit-lab` / `feature/hu-simulator-v1` / `feature/ui-v2` 三個 branch 相對於 dev 都 **0 獨有 commits**，全是 dev 舊副本
  - 另一台之前報告的「04-16 WIP」（batch-worker / seed-batches / getGTOPostflopFromDB / DB migration）實際上已在 dev（dev.8-dev.11 那批 commit 正是）
  - 動作：remote 三個 branch 全刪（`git push --delete`）
  - 另一台 Claude 後續動作：checkout dev + pull + 跑新 SOP（見本次 dev-log）

---

## 相關連結

- [[two-machine-workflow]] — 雙角色 + wip branch + 大腦整合 SOP（新）
- [[range-collection-roadmap]] — Pipeline 線三線分批進度
- [[project_gto_trainer]] — 專案整體現況
