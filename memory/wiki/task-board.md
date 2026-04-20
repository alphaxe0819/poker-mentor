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

<!-- T-010 → Done 2026-04-20 -->
<!-- T-020 → In Progress 2026-04-20 -->
<!-- T-042 → In Progress 2026-04-20 -->

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

<!-- T-050 已完成，移至 Done -->

<details>
<summary>📦 T-050 原任務描述（參考）</summary>

  **Bug 0** — Hero 手牌未選仍可進「下一步 →」
  - 位置：S1 頁面（位置 & 手牌）的「下一步」按鈕
  - 成因推測：按鈕 onclick 沒檢查 `heroCards[0] && heroCards[1]`
  - 修法：加按鈕 disabled 條件或 onclick guard
  - 順便：對手位置也該必選才能「下一步」

  **Bug 1** — S5b「我知道」→ 點卡槽沒開 picker / 無法輸入
  - **根本原因（已查出）**：`#card-picker` DOM 只在 `<div id="s3">` 內（`public/exploit-coach-mockup-v3.html:257`）
    - 當用戶在 S5b screen 時，`#s3` 被 CSS `.screen:not(.active)` 隱藏
    - `openVillPicker` 呼叫 `classList.add('show')` **成功**，但父層 `#s3` 隱藏 → 看不見
  - **修法建議（三選一）**：
    - **A 最乾淨**：把 `#card-picker` 從 `#s3` 內移到 body 層級，CSS 加 `position: fixed; z-index: 1000`，讓任何 screen 都能共用
    - **B 最小改動**：S5b screen 裡再複製一份 `<div class="picker" id="vill-card-picker">...</div>`（改 id），`openVillPicker` 改用新 id
    - **C JavaScript 搬家**：`openVillPicker` 執行時用 `appendChild` 把 picker 暫時搬到 S5b 的 DOM 裡，close 時再搬回
  - 推薦 A：最一勞永逸
  - 完成後驗證：S5b 點卡槽 → picker 浮出 → 選牌 → 卡槽填入

  **Bug 2** — AI 分析顯示「⚠ 連線錯誤：Load failed」
  - **重要線索**：「Load failed」是 iOS Safari 的 **fetch 網路層失敗**訊息（不是 HTTP 4xx/5xx）
    - 走到 `callCoach` 的 `catch(e) { return { error: '連線錯誤：' + e.message } }`
    - `e.message === "Load failed"` = iOS Safari 對 network error 的 message
  - **排除項**（從代碼看已處理）：
    - ❌ token null → callCoach 會提前 `return { error: '需要先登入...' }`，不會走到 Load failed
    - ❌ Edge Function 4xx/5xx → 會走 `r.status === 401` 分支，不是 catch
  - **最可能成因**（依機率）：
    - (a) 🔴 **iOS Safari + iframe + cross-origin fetch** 在 4G 下的特殊行為
      - Supabase 是 `*.supabase.co`（不同 origin），iframe fetch 要 CORS preflight
      - 某些 iOS 版本 + 4G ISP 會對 iframe 跨域 POST 做額外限制
    - (b) 🟡 postMessage refresh race：iframe 發 `request-supabase-refresh` → parent listener 的 `e.source !== iframe.contentWindow` 判斷**過嚴**，訊息被 drop → iframe 永遠等不到 token → 用過期 token fetch → 401 → 又 askParentRefresh 又失敗 → 最終某處 throw → Load failed
    - (c) 🟡 `ExploitCoachTab.tsx:26` 的 `iframe.contentWindow?.postMessage(...)` 若 iframe 在 Safari 重新整理過，`iframeRef.current?.contentWindow` 可能指向舊 window，訊息 drop
  - **Debug 步驟（必做）**：
    1. **用 Mac Safari 遠端 Web Inspector 連 iPhone**（重現 bug 時 inspector 要開著）
       - iPhone: 設定 > Safari > 進階 > 網頁檢閱器 ON
       - Mac Safari: 開發 > [iPhone 名稱] > 選 poker-goal-dev.vercel.app
    2. **Network tab** 看 `functions/v1/exploit-coach` 的 request：
       - 有送出？status？response body？
       - OPTIONS preflight 通過嗎？
    3. **Console** 看 `console.error('refresh failed', e)` 等訊息
    4. **在 iframe context 跑** `localStorage.getItem('sb-btiqmckyjyswzrarmfxa-auth-token')` 看 token 是否存在
    5. **測試 parent listener**：在 iframe console 跑
       ```js
       window.parent.postMessage({type:'request-supabase-refresh'}, '*')
       window.addEventListener('message', e => console.log('got', e.data))
       ```
       確認 parent 有回 `supabase-token-refreshed`
  - **修法方向**：
    - 若是 (a) iOS 4G → 加 retry + longer timeout，或 fallback 改 Supabase client SDK（會自己處理很多 edge case）
    - 若是 (b) → 改 parent listener 的 source 判斷為 `e.origin === window.location.origin`（用 origin 而非 contentWindow）
    - 若是 (c) → 每次 `iframeRef.current?.contentWindow` 先存 local variable 再用，避免 ref 變動

  - 完成條件：
    - `npx tsc -b --noEmit` EXIT=0
    - 實機測試 3 個 bug 都 pass（iOS Safari + Chrome）
    - Console 無 error / warning

</details>

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

<!-- T-055 → In Review 2026-04-20 -->

<!-- T-051 → In Review 2026-04-20 -->

<!-- T-052 → Done 2026-04-20（T-053 自動化 parent-env log 驗證 VITE_SUPABASE_URL=btiqmckyjyswzrarmfxa，mismatch=false，RC1 排除）-->
<!-- T-054 → Done 2026-04-20（wiki supabase-edge-function-gotchas 記錄完整）-->

<details>
<summary>📦 T-052 原任務描述（已 Done，RC1 排除）</summary>

- [ ] **T-052** | 大腦 + 用戶 | **Vercel dev 環境 env var 核對（poker-goal-dev）**
  - 建議 branch：無（純 dashboard 確認 + 截圖）
  - 背景：同 T-051 RC1；最快 60 秒能排除/確認的根因
  - 動作（用戶在 Vercel dashboard 操作）：
    1. 登入 Vercel → 選 `poker-goal-dev` project → Settings → Environment Variables
    2. 確認 `VITE_SUPABASE_URL` 值 = `https://btiqmckyjyswzrarmfxa.supabase.co`（測試）
    3. 確認 `VITE_SUPABASE_ANON_KEY` 值 = 測試 Supabase 的 anon public key（開頭 `eyJ...`，可去測試 Supabase Dashboard → Settings → API 比對）
    4. 同時確認 poker-goal（正式）的 env 是 `qaiwsocjwkjrmyzawabt`（對比用）
  - 額外：實機 debug 一併做
    5. iPhone：設定 → Safari → 進階 → 網頁檢閱器 ON
    6. Mac Safari → 開發 → [iPhone 名稱] → 選 `poker-goal-dev.vercel.app`
    7. 在 iframe context 的 Console 跑：
       ```js
       Object.keys(localStorage).filter(k => k.includes('auth-token'))
       ```
       → 看有幾把 `sb-*-auth-token`、哪個 project ref
  - 產出：
    - Vercel env 截圖（或文字回報）
    - localStorage key list
    - 若 env 設錯 → 用戶改正並 redeploy（觸發 Vercel 重新 build）
    - 若 env 對 → 回饋給 T-051 執行者，往 RC2/RC3 方向深挖

</details>

### 大腦任務

- [ ] **T-040** | 大腦 | **range-collection-roadmap 同步**（依賴 T-013）
- [ ] **T-041** | 大腦 | **每日收工確認**：`git log --all --since=today` 看兩邊都 push

### Follow-up（T-033 引發）

<!-- T-042 → Done 2026-04-20 -->
<!-- T-043 → Done 2026-04-20 -->
<!-- T-044 → Done 2026-04-20 -->

- [ ] **T-045** | Pipeline | **真跑 1 個 batch（去掉 --dry-run，完整鏈路）**
  - 建議 branch：`wip/T045-first-real-batch`
  - 範圍：從 T-043 已 seed 的 390 turn batches 挑 1 個 → TexasSolver 實解 → JSON parse → upload 到 `gto_postflop` → mark done
  - 前置：TexasSolver 已解壓到 `scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/`（batch-worker 會自動偵測 nested/flat 路徑）
  - 預估：15-30 min（solver ~10-20 min + upload/verify）
  - 完成條件：`gto_postflop` 表新增 N 筆 row（一個 turn 節點約 10 roles × 169 hand_class ≈ 1690 row），`gto_batch_progress` 該筆 status=done
  - 用：`node batch-worker.mjs --machine <機器名> --max 1`（不加 --dry-run）

- [ ] **T-046** | Pipeline | **seed --include-river 前的 row 數估算**
  - 建議 branch：`wip/T046-seed-river-estimate`
  - 範圍：先**不**真的 seed，計算 include-river 會插入多少 row（`generateRiverCards` × 390 turn × river/turn 的 fan-out）
  - 評估：若 > 10k row 要考慮分批 seed 或 partitioned batch；若可接受再實 seed
  - 產出：實際數字 + 建議（full seed / phased seed / skip）

---

## 🔨 In Progress（執行中）

<!-- T-010 已 merge 到 dev，移至 Done -->

- [~] **T-020** | Pipeline | **Solver P1 HU 40bb SRP 補齊到 21 flops（peer parity 25bb）**
  - branch: `wip/T020-hu40bb-srp-fill`
  - 機器：另一台電腦
  - 執行者 session 起：2026-04-20
  - **scope 修正（2026-04-20 大腦）**：原寫「25 flops」是 6-max 早期規劃殘留數字，
    實際應對齊 HU 25bb SRP 的 21 unique flops（BOARDS 13 + 8 個 Ace-low extras）
  - 現況：13 flops（= BOARDS 全集）→ 補 +8 個 extras
  - 8 extras：5s5c5d / 6d5h4c / 8s5h2c / 8s7s5d / 9s7s3s / Ah2d2c / Ah5c2d / Ah8h3c
  - 實作：boards.mjs 加 `export const BOARDS_HU`（不動 BOARDS 主常數，避免影響 6-max scope）
  - 預估：2 hr 背景（8 flops × ~15 min）
  - 產出：`src/lib/gto/gtoData_hu_40bb_srp_*.ts` +8 檔
  - 完成條件：21 unique flops 全 solve 完，gtoData_index 接上，tsc EXIT=0
  - **連帶**：T-021（HU 40bb 3bp）/ T-023（HU 深度擴充）後續也應對齊 21 flops

<!-- T-042 已部署完成，移至 Done -->

<!-- T-043 → In Review 2026-04-20 -->

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

- [?] **T-055** | Product | **exploit-coach 連續對話沒帶本輪 context — 修法 A** ⚠ 含 Edge Function 部署
  - branch: `wip/T055-coach-context-continuity`（從 origin/dev `f0b0f7d` 切出）
  - 最後 commit: 待 push
  - 機器：這台主目錄
  - 採用方案：**A 最保守**（只改 Edge Function `buildSystemPrompt`，不動前端 mockup / chatHistory 結構）
  - 改動範圍（單檔 `supabase/functions/exploit-coach/index.ts:159-200`，+10 / -4 行）：
    - **base prompt 新增「本輪場景 grounding」段**：明確告訴 Claude「下方場景整輪沿用」「若用戶在後續訊息假設不同手牌（如 QQ）以假設為準但 flop/對手/位置不變」「每次回答必須提到 flop+對手+位置讓用戶知道接住上下文」「不要退化成翻前公式化答案」
    - `villain_type` 段加 `【本輪場景】` 前綴
    - `hero_hand` 段加註「若用戶在對話中假設不同手牌，以假設為準，但 flop/對手/位置沿用本輪」
    - `hero_pos` 段加「（本輪實況，不變）」
  - 不變動：retrieveSolverNode / summarizeNodeForPrompt / Anthropic call / auth.getUser / villain labels / 前端 mockup / ExploitCoachTab / 今天剛修的 fuzzy match / JWT decode / parent-env log
  - 驗證：✅ `npx tsc -b --noEmit` EXIT=0（注：Edge Function 走 Deno，tsc 看的是其他 TS code 沒被誤改）
  - **⚠ 部署流程（Edge Function，需手動）**：
    1. **大腦 merge wip 到 dev** + bump version + push（mockup 部分自動上 Vercel）
    2. **大腦或執行者另一輪** 產出 `supabase/functions/exploit-coach/index.ts` 完整檔案內容貼碼指令給用戶
    3. **用戶手動貼到測試 Supabase Dashboard** → Edge Functions → `exploit-coach` → Via Editor → 整檔取代 → Deploy
    4. **用戶實機重測**：iPhone Safari 開 AI 分析後追問「如果我拿 QQ 呢」→ 預期 AI 回覆會明確點出「本場景 [位置] vs [對手類型] / flop=...」並結合 QQ 在此 flop 的玩法
  - 預期判讀：
    - ✅ AI 回覆有「本輪場景描述（flop+對手+位置）」+ 結合假設手牌 → A 修好，移 Done
    - ⚠ AI 仍公式化只講 QQ 翻前範圍 → 疊 B（前端 callCoach 強制注入「[本輪場景] hero=X flop=Y vill=Z」到 userMsg 前面），開 T-056
    - ⚠ AI 過度依賴本輪原本的手牌（忽略假設）→ 微調 prompt 強化「以假設為準」字眼
  - 相關記憶：[[supabase-edge-function-gotchas]]（部署流程 + ES256 坑）
  - 等大腦 merge + 安排 Edge Function 部署

<!-- T-051 已 merge 到 dev，移至 Done；等用戶實機 log 才能判根因（bug fix 未必已解） -->
  - 等大腦 merge（無論實機結果）— 診斷 log 跟著 merge 進測試環境，下次實機重現可立刻看

<!-- T-010 已 merge 到 dev，移至 Done -->
<!-- T-043 已 merge 到 dev，移至 Done -->
<!-- T-050 已 merge 到 dev，移至 Done -->

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
- [x] **T-050** | Product + 大腦 | **exploit-coach v2 3 bugs** | 2026-04-20 | merge + dev.28
  - 執行者：另一台（身邊機器，`8e715b6` + task-board In Review 3878a5e）
  - 大腦：review + merge（這台）
  - Bug 0 (hero-guard)：新 `proceedFromS3()` + `flashError`
  - Bug 1 (picker-dom)：`#card-picker` 移到 body + CSS fixed z-index 1000
  - Bug 2 (load-failed)：origin 判斷 + capture contentWindow；Bug 2 仍需實機回驗
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
- [x] **T-042** | Pipeline | **部署 gto_postflop migration 到測試 Supabase** | 2026-04-20 | wip/T042-deploy-gto-migration
  - 執行者：這台主目錄（`wip/T042-deploy-gto-migration`）
  - 動作：兩個 table（gto_postflop / gto_batch_progress）+ RLS policies + RPC `claim_gto_batch` 全部部署到測試 Supabase（btiqmckyjyswzrarmfxa）
  - 驗證：`information_schema.tables` 回 2 row、`SELECT claim_gto_batch('DESKTOP-TEST')` 回空 row（pending 為空）
  - 踩坑：原 plpgsql function `RETURNING ... INTO v_id` 在 Supabase SQL Editor 報 `42P01: relation "v_id" does not exist`（`$$` 與 `$func$` 都擋不住），最終改成 `LANGUAGE sql` 純 UPDATE...RETURNING 才過
  - 衍生：T-044（修 migration 檔以對齊正式機部署流程）
  - T-043 阻塞已解，可開始
- [x] **T-031** | 大腦 | feature branches 盤點 + 清理 | 2026-04-20 | 本次 commit
  - 調查結果：`feature/exploit-lab` / `feature/hu-simulator-v1` / `feature/ui-v2` 三個 branch 相對於 dev 都 **0 獨有 commits**，全是 dev 舊副本
  - 另一台之前報告的「04-16 WIP」（batch-worker / seed-batches / getGTOPostflopFromDB / DB migration）實際上已在 dev（dev.8-dev.11 那批 commit 正是）
  - 動作：remote 三個 branch 全刪（`git push --delete`）
  - 另一台 Claude 後續動作：checkout dev + pull + 跑新 SOP（見本次 dev-log）
- [x] **T-054** | 大腦（純 flow） | **exploit-coach 401 + AI 兜底 bug 根因 + wiki 記錄** | 2026-04-20 | [flow]
  - 雙 bug 完修 ✅：
    - 「登入已過期」401 → Supabase Invocation log `sb_error_code: UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM` → ES256 JWT 不被 Edge Function runtime 支援 → 測試 project 每個 auth function 關 **Verify JWT**
    - 「抱歉，暫時無法回答」→ 測試 Supabase Secrets 缺 `ANTHROPIC_API_KEY` → 加進去
  - 產出：
    - `memory/wiki/supabase-edge-function-gotchas.md`（新）— 3 個坑 + 診斷捷徑 + 新 project secret checklist + 相關 Supabase issue links
    - `memory/index.md` 加連結
    - `memory/dev-log.md` 完整記錄事件鏈路
  - 併收 T-052（RC1 排除）
  - 副產物 TODO：Edge Function code 加 `response.ok` check + log Claude error body（記在 wiki 坑 3，未做）
  - 正式 Supabase `qaiwsocjwkjrmyzawabt` 若啟用 ES256 會同樣壞，待用戶授權
- [x] **T-055** | Product + 大腦 | **exploit-coach 連續對話 context grounding（修法 A）** | 2026-04-20 | merge + dev.35
  - 執行者：`wip/T055-coach-context-continuity` @ `4583694`
  - 改動：單檔 `supabase/functions/exploit-coach/index.ts:159-200`（+10/-4 行）— `buildSystemPrompt` base prompt 加「本輪場景 grounding」段 + 各 context 段加「【本輪場景】/【本輪實際手牌】/本輪實況不變」前綴
  - 驗證：tsc EXIT=0
  - ⚠ 部署：用戶手動貼整檔到測試 Supabase Edge Function editor（大腦產指令）
  - 實機驗收待：用戶追問「如果拿 QQ 呢」→ AI 會明確提本輪場景 + 結合 QQ 玩法
  - 預期判讀：pass → 真 Done；公式化持續 → 疊 B 開 T-056；過度依賴本輪手牌 → 微調 prompt
- [x] **T-053** | 大腦（單機快修） | **exploit-coach 401 自動化診斷 log（JWT decode + parent env）** | 2026-04-20 | dev.34
  - 背景：用戶無 Mac Web Inspector、無法手動跑 console 指令 → 把診斷 baked into code，任何人開 Console 就能看到
  - `public/exploit-coach-mockup-v3.html` `[exploit-coach-401][first]` log 擴充：JWT decode 自動印 `payload_iss / payload_aud / payload_role / payload_ref / payload_exp_date / payload_expired / payload_full`
  - `src/tabs/ExploitCoachTab.tsx` useEffect 頂部新增 `[parent-env]` log：印 `VITE_SUPABASE_URL / project_ref / mismatch`（= T-052 自動化核對，parent 載入就印）
  - 併 T-051 首輪實機 log 分析：ES256 token、origin match、但缺 `[parent-refresh] replied` → 下輪重測就會有完整拼圖
- [x] **T-051** | Product + 大腦 | **exploit-coach 401 診斷 + fuzzy → exact storage key** | 2026-04-20 | merge + dev.33
  - 執行者：這台主目錄（`wip/T051-exploit-coach-401-diag` @ `8817e74`）
  - 大腦：review + merge（這台 `-brain` worktree）
  - 產出：
    - `public/exploit-coach-mockup-v3.html` — A) readTokenFromStorage exact match 'sb-btiqmckyjyswzrarmfxa-auth-token'; B) callCoach 加 3 個診斷 log [first]/[refresh]/[retry-failed]
    - `src/tabs/ExploitCoachTab.tsx` — C) onMessage 加 5 path log (got request / origin blocked / no targetWindow / refresh threw / replied)
  - 驗證：tsc EXIT=0；測試機 Vite build OK
  - ⚠ **bug 是否已解未知** — 等用戶實機 iPhone Safari + Mac Inspector 抓 log 回來才能判根因：
    - 若 bug 消失（RC2）→ fuzzy match 是元凶，收工
    - 若 [exploit-coach-401][refresh] sameAsOld=true → RC1 env 問題，看 T-052
    - 若 [parent-refresh] replied hasToken=false → parent supabase 拿不到 session
- [x] **T-043** | Pipeline + 大腦 | **batch-worker 環境準備 + dry-run validated** | 2026-04-20 | merge + dev.32
  - 執行者：這台主目錄（`wip/T043-batch-worker-setup` @ `90ee465`）
  - 大腦：review + merge（這台 `-brain` worktree）
  - 產出：
    - `scripts/gto-pipeline/package.json` + `package-lock.json`（新，單 dep `@supabase/supabase-js`，13 packages, 0 vulns）
    - `.env` + `node_modules/` 確認 root `.gitignore` 子目錄覆蓋（不入 commit）
  - 驗證結果：
    - seed：**390 turn batches** = 13 BOARDS × 平均 10 turnCards × 3 STACK_RATIOS（預設不含 river）
    - dry-run：claim RPC 領到 `turn | 7s7d2h+3c | 13bb`，`--dry-run` skip solver (line 391-396) + 自動還原 row
    - tsc EXIT=0
  - 派單勘誤（大腦記錄給未來參考）：`status='processing'` 是筆誤（schema 只有 pending/claimed/uploading/done/failed）；dry-run 自動還原，手動 reset SQL 多餘；seed 量 390 而非 156（STACK_RATIOS=3）
  - 衍生：T-045（真跑 1 個 batch）+ T-046（river seed 估算）進 Queue
- [x] **T-044** | 大腦（單機快修） | **修 migration 20260416-gto-postflop.sql 對齊正式機部署流程** | 2026-04-20 | dev.31
  - 拆兩檔：`20260416-gto-postflop.sql`（tables + RLS + CHECK，idempotent DO block 包）+ `20260416b-gto-postflop-function.sql`（pure SQL `claim_gto_batch`）
  - function 由 `LANGUAGE plpgsql` + `RETURNING...INTO v_id` 改成 `LANGUAGE sql` + 單一 `UPDATE...RETURNING`，語意相同但不會觸發 Supabase SQL Editor 的 `$$...INTO v_id...$$` 解析 bug
  - 測試 Supabase 已是 pure SQL 版（T-042 執行者手動貼），本次只對齊 git 上的 migration 檔；正式 Supabase 部署時依檔順序貼兩段即可
- [x] **T-010** | Pipeline + 大腦 | **C2 場景化（pd table.name parser + MTT catalog）** | 2026-04-20 | merge + dev.29
  - 執行者：這台（worktree `POKERNEW-wipT010`，`4914334` + task-board In Review `b79718a`）
  - 大腦：review + merge（這台 `-brain` worktree）
  - 產出（3 檔）：
    - `scripts/gto-pipeline/parse-pd-table-name.mjs`（新，prefix-based token scanner，VS 抽取、unknown 都附 reason）
    - `scripts/gto-pipeline/__tests__/parse-pd-table-name.test.mjs`（新，57 tests pass）
    - `scripts/gto-pipeline/scenarios.mjs`（+MTT_SCENARIOS 54 個 + `enumerateMTTFromPD` async scanner，mtt 進 ALL_FORMATS）
  - 驗證：57/57 tests pass，`npx tsc -b --noEmit` EXIT=0
  - 限制：pd hand map → TexasSolver range 字串轉換屬 T-011（C3）；真實 ~16k pd tables parsing rate 需跑 CLI 實測

---

## 相關連結

- [[two-machine-workflow]] — 雙角色 + wip branch + 大腦整合 SOP（新）
- [[range-collection-roadmap]] — Pipeline 線三線分批進度
- [[project_gto_trainer]] — 專案整體現況
