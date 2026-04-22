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

<!-- T-011 → Done 2026-04-21 -->

<!-- T-012 → Code Done 2026-04-21，migration 部署待 T-063 -->

<!-- T-063 → Done 2026-04-21（含 RLS policy patch 修正） -->

<details>
<summary>📦 T-063 原任務（已 Done）</summary>

- [ ] **T-063** | 用戶 + 大腦 | **T-012 migration 部署到測試 Supabase + 實測 verify**
  - 建議 branch：無（純 Dashboard 操作 + retrieval verify）
  - 前置：T-012 code 已 merge @ `065ee0f`，`supabase/migrations/20260421-solver-postflop-mtt.sql` 就緒
  - 動作（用戶）：
    1. 打開 `supabase/migrations/20260421-solver-postflop-mtt.sql` 全選複製
    2. 登入測試 Supabase Dashboard (`btiqmckyjyswzrarmfxa`) → SQL Editor
    3. 貼整檔 → Run（idempotent 可重跑）
    4. 驗證 SQL 輸出：最後 `SELECT scenario_slug, flop FROM public.solver_postflop_mtt` 應看到 1 row (`mtt_40bb_srp_btn_open_bb_call / As7d2c`)
    5. 回報：SQL Run 結果 + 1 row 確認
  - 動作（大腦，用戶貼完後）：
    6. 跑 `cd scripts/gto-pipeline && node test-retrieval.mjs`（要配好 .env）
    7. 驗 MTT scenario tier A 命中 `solver_postflop_mtt`（不是 6max）
    8. 全通過 → 標 T-012 / T-063 Done
    9. 失敗 → 開 follow-up 修

</details>

<!-- T-013 → In Review 2026-04-21（家裡電腦 wip1 執行者接手，士林原派工未動） -->

<!-- T-021 骨架 → In Review 2026-04-21（家裡主目錄執行者，剩 20 flops marathon 待接手） -->

- [ ] **T-022** | Pipeline | **Solver P3 6-max 100bb 4bp — 從 pokerdinosaur 抓 4B range（C 線對接）**
  - 建議 branch：`wip/T022-6max-4bp`
  - scope 定案（2026-04-21，用戶選 D）：不手寫 range，走 converter 線
  - 步驟：
    1. `inspect-pd.mjs` 掃 pokerdinosaur **S0.8 4B / Cold Calling 3B**（26 PNG + 對應 JSON）+ `Course_ranges.json` / `Tournament_Ben_ranges.json` 看 4bp 場景結構
    2. 挑 10 個適合跑 solver 的 matchup（opener × 3better × 4better 組合）
    3. `pd-to-range.mjs` 產 TexasSolver range 字串
    4. 加進 `scripts/gto-pipeline/scenarios.mjs` 作 6max 100bb 4bp 場景 + effective_stack/pot 估算（典型 100bb 4bp pot ~94bb / eff ~73bb）
    5. 產 inputs → `batch-run.ps1 -Filter "^6max_100bb_4bp_"` marathon
    6. 產 `src/lib/gto/gtoData_6max_100bb_4bp_*.ts` + index 更新
  - 前置依賴：T-013 盤點完成（Downloads/ 檔案到位）
  - 預估：converter 對接 1-2 hr + solver marathon（SPR 預估 1-2 淺，參考 T-021 教訓可能 5-10 min）
  - 執行者紀律：不動 `src/version.ts` / `memory/dev-log.md`

- [ ] **T-023** | Pipeline | **Solver P4 6-max 深度擴充（40bb/60bb SRP）**
  - 建議 branch：`wip/T023-6max-shallow`
  - 待確認具體範圍

---

### 🚨 正式版重建（用戶 2026-04-21 v2 決策 — 三塊切法）

**用戶決策（2026-04-21）**：資料切三塊，各自獨立管理
- **HU**：維持現狀（手寫 placeholder range），T-074 已標 TEST DATA。**未來有更明確資料源時再取代**，現在不動
- **CASH（6max 100bb）**：同上，維持現狀 TEST DATA。**現在不動**
- **9MAX-MTT**：**全部從頭重做**，以 pokerdinosaur 為真相來源
  - Phase 1（T-075）：從 PD 構建 preflop range
  - Phase 2（T-076）：用 preflop range 跑 solver 產 postflop

<!-- T-074 → Done 2026-04-21（既有 gtoData_*.ts 全標 TEST DATA） -->
<!-- T-075 Phase 0 盤點 → Done 2026-04-21，見 [[pd-mtt-scenario-coverage-2026-04-21]] -->
<!-- 關鍵發現：auto-parse 率僅 1.2%（205/16750）；只 Course 可直接用；HU/6max cash pd 沒資料 → 維持 TEST DATA -->
<!-- 用戶 2026-04-21 決策：走路徑 A（只做 Course 205 tables），Phase 1 派工中 -->

- [ ] **T-075 Phase 1** | Pipeline | **9MAX-MTT preflop range 只做 Course（205 tables）**
  - 建議 branch：同 `wip/T075-mtt-preflop-from-pd`（Phase 0 已 push 完成，切新 commit 繼續做）
  - scope：只處理 Course project 的 205 個 auto-parseable tables，其他 9 project 不動
  - 範圍：
    1. 從 Course_ranges.json 抽 205 auto-parseable entries（Phase 0 已確認可解）
    2. 用 parse-pd-table-name + pd-to-range.mjs 產 TexasSolver range 字串
    3. 寫入新 `scripts/gto-pipeline/mtt_9max_ranges.mjs`（或 scenarios-prod.mjs），每個 depth × matchup 一個 entry
    4. scenarios.mjs 加對接（MTT 正式版區塊）
  - 不動：HU / 6max cash 既有 TEST DATA
  - 產出：205 entry preflop range 可直接用於 T-076 solver marathon
  - 預估：1-2 hr
  - 後續（T-075 Phase 2，非本 scope，待 sid metadata 方案拍板）：
    - Ben 系 876 sid 的 metadata 解鎖路徑 — 先做**技術偵察**（pokerdinosaur UI 是否能自動抓 scenario label）
    - 若可自動 → 重爬解鎖；若需人工 → user 花 ~7-8 hr 標
    - ICM 12833 table 太大，暫不處理


- [ ] **T-075** | Pipeline | **9MAX-MTT preflop range 從 pokerdinosaur 構建（正式版 Phase 1）**
  - 建議 branch：`wip/T075-mtt-preflop-from-pd`
  - scope 收斂（2026-04-21 v2）：**只做 9max MTT**，不碰 HU / cash（PD 本來就沒這兩塊資料）
  - 範圍：
    - 從 PD 10 個 project 的 9-max MTT 資料建 preflop range
    - 資料源分類：
      - **Course**（353 tables，`name` 欄可 auto-decode）→ parse-pd-table-name 能解，立刻可做
      - **Live_MTT_Ben_Adjusted / Tournament_Ben_Adjusted / Tournament_Chip_EV**（共 3564 tables，scenario_id 為 UUID，**需補 metadata**）
      - **Large/Medium/Small_Field_ICM / Final_Table* / Final_Two_Tables**（10833 tables，ICM 情境）
    - 每個 depth × position × action 出一個 range entry（open / defend / 3bet / rejam / squeeze / ICM）
  - **前置 blocker**（scenario_id metadata）：
    - Live_MTT_Ben / Tournament_Ben / ICM 系列的 scenario_id → 人類可讀 label 對照表缺失
    - 解法二選一：(a) 重爬 PD 補 scenario label，(b) 人工標 UUID → label
  - 執行者第一步：**先盤點 PD 各 project 的 scenario coverage**（哪些 depth × matchup 有資料），回報給用戶決定 metadata 補法
  - 產出：新 `scripts/gto-pipeline/mtt_9max_ranges.mjs` + scenarios.mjs MTT 場景對接
  - 預估：盤點 1-2 hr + metadata 補齊 3-5 hr（看選 a 或 b）+ range 構建 2-3 hr

- [ ] **T-076** | Pipeline | **9MAX-MTT postflop solver marathon（正式版 Phase 2）**
  - 建議 branch：`wip/T076-mtt-postflop-solver`
  - 前置：T-075 完成（MTT preflop range 齊備）
  - 範圍：用 T-075 的 MTT preflop range 跑 solver 產 postflop → `src/lib/gto/prod/gtoData_mtt_9max_*.ts`（或統一 index PROD 區）
  - 依 T-021 經驗：MTT 深度淺（13-40bb），SPR 通常 < 3，收斂快（~5-15s/flop）
  - **不碰 HU / cash 既有 TEST DATA**（維持現狀，未來另開 task）

<!-- T-022（原 6max 100bb 4bp）scope 廢棄：cash 維持現狀 TEST DATA，不走 PD 路徑 -->
<!-- T-023（原 6max 深度擴充）同上廢棄 -->

<!-- T-062 → In Review 2026-04-21 -->

<details>
<summary>📦 T-062 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-062** | Pipeline | **wip1 worktree 隔離強化（防 T-011 踩坑重演）** `(派工 2026-04-21)`
  - **建議 branch**：`wip/T062-wip1-isolation`（從 origin/dev 切出）
  - **背景**：T-011 執行者 feat commit 誤落在 `wip/T056-skipexisting-dual-naming`，原因：T-056 執行者完成後 wip1 HEAD 留在 wip/T056（沒切 detached），T-011 執行者接手時 `git checkout -b wip/T011-c3-e2e` **沒指定 base**，從當前 HEAD (wip/T056) 切出 → commits 疊到 wip/T056。花 solver 16:28 跑完才發現，cherry-pick 救回。
  - **範圍**：`scripts/session-start-reminder.sh` 的 `*-wip*` 分支
  - **禁碰**：其他 script / src / supabase

  **實作（2 處）**：

  **1. `-wip*` 模式偵測當前 HEAD 非 detached → 警告**
  在 `if [[ "$cwd" == *-wip* ]]` 區塊內加：
  ```bash
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
  if [[ -n "$CURRENT_BRANCH" ]]; then
    echo ""
    echo "⚠️ 當前 HEAD 在 branch: $CURRENT_BRANCH（不是 detached）"
    echo "   上一個 task 可能沒切回 detached。若要開新 wip，請先："
    echo "     git checkout --detach origin/dev"
    echo "   否則 git checkout -b wip/T0xx 會從 $CURRENT_BRANCH 切出，"
    echo "   commits 會疊到上個 wip branch（T-011 踩坑實例）"
    echo ""
    echo "   繼續當前 task 則忽略此警告"
  fi
  ```

  **2. 指令範例改明確指定 base**
  現有：`git checkout -b wip/T0xx-短描述 origin/dev`
  這個指令本來就對，但某些執行者會縮短成 `git checkout -b wip/T0xx-短描述`（沒 base），就會從當前 HEAD 切。task-board 的執行者 SOP 段 / reminder 輸出要**反覆強調**必須帶 `origin/dev`。

  **完成條件**：
  1. reminder script 改動
  2. 手動驗證：cd 到 `-wip1`（當前在 wip/T056 local branch 還在），跑 `bash scripts/session-start-reminder.sh`，應看到警告
  3. commit（**不動** `src/version.ts` / `memory/dev-log.md`）
  4. push wip + task-board 移 In Review

  **後續延伸**（不在 T-062 scope）：
  - 寫進 `memory/wiki/two-machine-workflow.md`「執行者紀律」段：開工前 `git worktree list` + 確認 HEAD detached

</details>

<!-- T-059 → Done 2026-04-20（deploy guide 產出） -->
<!-- T-060 → Done 2026-04-20（用戶實機驗收 3 條全 pass） -->
<!-- T-058 → 升級 真正 Done（完整部署 + 驗收） -->

<!-- T-056 → In Review 2026-04-20 -->

<!-- T-058 → In Review 2026-04-20 -->

<!-- T-057 → In Review 2026-04-20 -->

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

<!-- T-030 → In Review 2026-04-21（Claude_in_Chrome 自動化驗收，3 pass / 2 partial） -->

- [ ] **T-064** | Product | **exploit-coach parent refresh handshake hang follow-up**（T-030 衍生）
  - 建議 branch：`wip/T064-parent-refresh-hang`
  - 背景：T-030 驗 Bug 5 時，iframe → parent `postMessage({type:'request-supabase-refresh'})` 到達，parent `ExploitCoachTab.tsx:23-59` 的 handler 有 log `[parent-refresh] got request`，但 `await supabase.auth.refreshSession()` 30s 內沒回覆 → 沒看到 `[parent-refresh] replied` → iframe 3s timeout 後 token=null
  - 現場狀態 token 仍新鮮（expires 40min 後），**正常使用流程不會觸發 401 path**，但若 token 真過期 → 401 → askParentRefresh → parent 同樣 hang → `登入已過期`
  - 範圍：`src/tabs/ExploitCoachTab.tsx:23-59`
  - 建議修法：
    - 加 race timeout：`Promise.race([supabase.auth.refreshSession(), timeoutPromise(2500)])`
    - timeout → fallback 讀 localStorage 現有 token（若還沒過期）
    - 或先 `getSession()` 驗活性，真過期才 `refreshSession()`
  - 實測驗證方式：掛 tab 不動 40+ min 讓 token 過期 → 回來發問 → 看 console log + 能否順利發送（不用重新整理頁面）
  - 相關：T-054 wiki `supabase-edge-function-gotchas`

<!-- T-031 已完成，移至 Done -->

- [ ] **T-032** | Product | **`.env` 檢查 + 環境驗證**（另一台電腦）
  - 建議 branch：無
  - 動作：`ls .env`；無則 `powershell scripts/setup-env.ps1`

<!-- T-080 → In Review 2026-04-21 -->

<details>
<summary>📦 T-080 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-080** | Product | **exploit-coach 快速分析（文字敘述）**
  - 建議 branch：`wip/T080-quick-analysis-text`
  - 用戶需求：貼一段手牌敘述（含賭場口語，e.g.「50/100/100 n+4」「A2o open 1500」「SB donk 2800」等）→ AI 直接給 preflop → river 分街建議
  - 跳過現有結構化 S1-S5a 流程，降低 UX 門檻
  - **前端**（`public/exploit-coach-mockup-v3.html`）：
    - S1 加「🚀 快速分析」入口（與「建立新對手」並列）
    - 新 screen（建議 id `s_quick`）：textarea（placeholder 範例手牌） + 送出按鈕 → 跳 s6 顯示分析
  - **Edge Function**（`supabase/functions/exploit-coach/index.ts`）：
    - 新 request field `mode: 'narrative'` + `narrative: string`
    - 不走 solver retrieval（沒結構化 context）
    - 改用 narrative-focused prompt：教 Claude parse 賭場口語 + 依街別 breakdown + 繁中規則沿用 v0.8.4 準則
  - **模型**：維持 Haiku（純文字，不需 vision）
  - **點數**：10 點/次（含完整 hand breakdown，比單則對話貴）
  - **對話歷史**：一次性分析不存 history（或存但標 `mode:'narrative'`，回頭可重看）
  - 完成條件：
    - 手動驗：貼用戶提供的範例手牌 → AI 給 preflop / flop / turn / river 4 段分析 + 關鍵判斷
    - 繁中術語符合 v0.8.4 規範（「持續下注」不「c-bet」）
    - tsc EXIT=0
  - 圖片分析（原構想的 T-081）**暫不做**（用戶 2026-04-21 決議）

</details>

- [ ] **T-082** | Product 內測 | **exploit-coach 內測版：retrieval 換 GTO Wizard API（獨立環境，與正式機 A/B 對照）** `(派工 2026-04-22 → 家裡 wip1 執行者)`
  - 建議 branch：`wip/T082-exploit-coach-gtow-test`
  - **目的**：fork 一份 exploit-coach 內測版，**只換 retrieval 資料源**（我們的 `solver_postflop_6max` 表 → GTO Wizard API），prompt / Claude 模型 / 術語規則完全不動
  - **A/B 對照玩法（用戶自己手動跑）**：
    - **A 邊（正式機）**：用戶在 `poker-goal.vercel.app` 的原版 exploit-coach 問問題（用我們自己的 retrieval）
    - **B 邊（獨立內測 URL）**：用戶在 `poker-goal-dev.vercel.app/exploit-coach-gtow-test.html` 問**同樣問題**（用 GTOW retrieval）
    - 用戶肉眼比兩邊回答差異
    - **不做同頁並排 UI**（環境完全隔離，內測壞掉不影響正式）
  - **scope（嚴格遵守，不擴張）**：
    - **後端**：
      1. 複製 `supabase/functions/exploit-coach/` → `supabase/functions/exploit-coach-gtow/`
      2. **只改** `retrieveSolverNode()` 內部實作：
         - 移除：對 `solver_postflop_6max` 的 Tier A/B/C query
         - 替換：呼叫 GTO Wizard API（`next-actions` + `spot-solution`，參考 ai-poker-wizard `gto_api.py` 模式）
         - reshape GTOW response 成現有 `{ tier, row, nodeSummary }` 同 shape，下游 `summarizeNodeForPrompt()` 不用改
      3. **不變動**：prompt builder、TERMINOLOGY_RULES、Claude call、auth、point spend、narrative mode
      4. **絕對不寫 DB / 不 cache GTOW 回傳**（ToS 保護 + 不污染 own 資料）
      5. **Token**：團隊自己的 GTOW 帳號，放 Edge Function Secrets `GTO_WIZARD_TOKEN`（內測者不需各自綁，**token 不貼對話**）
    - **前端**（獨立 mockup，**只接 B 邊 endpoint**）：
      6. 複製 `public/exploit-coach-mockup-v3.html` → `public/exploit-coach-gtow-test.html`
      7. **只改 fetch endpoint**：原本打 `exploit-coach`，改成打 `exploit-coach-gtow`
      8. 加明顯的「⚠ 內測版（GTO Wizard 後端）」橫幅，避免誤認為正式版
      9. 不在主 nav / app 露出，只給知道內測 URL 的人用
    - **Mapping 工程**（執行者要研究 GTOW API spec）：
      - 籌碼深度格式：GTOW `bb + 0.125`（30bb → `"30.125"`）
      - `ctx.scenario_slug` / `ctx.flop` / `ctx.path` → GTOW spot 參數對應
      - bet sizing tree 對齊（我們 `b33/b50/b100` vs GTOW sizing；不一致就盡量挑最接近）
      - **ICM 不做**，內測 v1 只跑 cash / Chip EV
  - **完成條件**：
    - 內測 URL：`https://poker-goal-dev.vercel.app/exploit-coach-gtow-test.html`
    - 用戶在正式機 + 內測 URL 各問同一個問題 5 次 → 都正常出回答 → 肉眼能看出差異
    - console 看得到 GTOW raw response（debug 用）
    - `npx tsc -b --noEmit` EXIT=0
  - **out of scope（明確排除）**：
    - ❌ 不上線給一般玩家（純內測 URL，不掛主 nav）
    - ❌ 不寫 DB / 不 cache GTOW 資料（ToS 保護）
    - ❌ 不接玩家自己 GTOW token（只用團隊 token）
    - ❌ 不做 ICM 模式
    - ❌ 不改原版 exploit-coach（fork 出去獨立，原版繼續用 own retrieval）
    - ❌ 不做同頁並排 UI（兩個環境完全隔離，用戶手動切瀏覽器分頁比）
  - **部署**：執行者寫完 → 大腦產出 Edge Function 整檔貼碼指令（用戶手貼**測試** Supabase Dashboard） → 內測 URL 驗證 → task 結案；**不部署到正式 Supabase**
  - 相關 wiki：[[supabase-edge-function-gotchas]]、ai-poker-wizard repo（gto_api.py / gto_formatter.py 參考）

<!-- T-070 → In Review 2026-04-21（士林主目錄執行者 localStorage 版） -->

<!-- T-071 → Done 2026-04-22（code merge @ 937c07e + bump v0.8.3-dev.4 d2b8c31，已隨 v0.8.4/v0.8.5 上線；單檔 public/exploit-coach-mockup-v3.html localStorage FIFO 3 則對話歷史；remote wip branch 已清） -->

<!-- T-072 → In Review 2026-04-21 -->

<details>
<summary>📦 T-072 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-072** | Product | **流程順序：對手手牌 picker 移到確認牌譜之前（s5b → s5a）** `(派工 2026-04-21 → 士林 或 家裡 wip1 執行者)`
  - 建議 branch：`wip/T072-villain-hand-s5a`
  - 問題：目前 `s4 → s5 確認牌譜 → s5b 對手手牌 picker → s6 AI 分析`，對手手牌問得太晚
  - 目標：`s4 → s5a 對手手牌 picker → s5 確認牌譜 → s6 AI 分析`
  - 具體動作：
    1. 把 `public/exploit-coach-mockup-v3.html` 的 `<div id="s5b">` **rename 成 `<div id="s5a">`**（連帶所有 `'s5b'` / `s5b` 字串引用都改 `s5a`）
    2. 調整 screen 切換邏輯：原本 s4 完成 → go('s5')，改成 s4 完成 → go('s5a')；s5a 完成 → go('s5')；s5「確認牌譜」「開始分析」按鈕照樣 → go('s6')
    3. s5「確認牌譜」頁如果已知對手手牌（`villainHandKnown=true`）→ 直接顯示對手牌面（替換原本「？？」佔位）
    4. T-050 Bug 1 的 S5b picker DOM 修法（body 層級 + z-index 1000）保留，只是 id 改 s5a
  - 完成條件：
    - 手動驗證：玩到 all-in → 先看到 s5a 問對手手牌 → 選完或 skip → 進 s5 確認牌譜 → 開始分析 → s6
    - `npx tsc -b --noEmit` EXIT=0

</details>

<!-- T-073 → In Review 2026-04-21 -->

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

- [ ] **T-045** | Pipeline | **真跑 1 個 batch（去掉 --dry-run，完整鏈路）** `(派工 2026-04-21 → 家裡電腦執行者，需 TexasSolver binary)`
  - 建議 branch：`wip/T045-first-real-batch`（從 `origin/dev` 切出）
  - **建議順序**：先跑 T-045（15-30min 驗 pipeline 通），再開 T-021 長跑（3-5hr）
  - 範圍：從 T-043 已 seed 的 390 turn batches 挑 1 個 → TexasSolver 實解 → JSON parse → upload 到 `gto_postflop` → mark done
  - 前置：TexasSolver 已解壓到 `scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/`（batch-worker 會自動偵測 nested/flat 路徑）
  - 預估：15-30 min（solver ~10-20 min + upload/verify）
  - 完成條件：`gto_postflop` 表新增 N 筆 row（一個 turn 節點約 10 roles × 169 hand_class ≈ 1690 row），`gto_batch_progress` 該筆 status=done
  - 用：`node batch-worker.mjs --machine <機器名> --max 1`（不加 --dry-run）

<!-- T-046 → Done 2026-04-21（code merge @ 9ee0222 estimate-river-seed.mjs dry-run；實測 Turn 390 / River 3120 / Grand 3510 rows < 10k 門檻 → seed 本身 OK；瓶頸在 solver 吞吐 878-1170hr 單機；剩「phased by stack_label 策略 + 真 seed」屬戰略決策，留給用戶後續拍板；remote wip branch 已清） -->

---

## 🔨 In Progress（執行中）

<!-- T-010 已 merge 到 dev，移至 Done -->

<!-- T-020 → In Review 2026-04-20，見下方 In Review 區 -->

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

<!-- T-013 / T-030 / T-021 / T-074 / T-073 / T-071 / T-072 / T-070 / T-075 Phase 0 / T-075 Phase 1 / T-080 已 merge 2026-04-21 -->
<!-- T-080 真 Done 2026-04-22：正式 Supabase Edge Function 已部署 + v0.8.5 正式機已上（繞過 Vercel webhook silent drop，改用 CLI prebuilt+tgz；詳見 [[vercel-deployment-troubleshooting]]） -->
<!-- T-075 Phase 1 merge @ 4d40f27 — Course 205 tables → mtt_9max_ranges.mjs (110 distinct entries)；scenarios.mjs re-export COURSE_RANGES + caveat 註解；等 T-076 消化 -->

<!-- T-070 / T-021 / T-072 已 merge 2026-04-21 -->

<!-- T-071 → Done 2026-04-22（task-board cleanup，code 早已 merge @ 937c07e + bump v0.8.3-dev.4 d2b8c31，已隨 v0.8.4/v0.8.5 上線；remote wip branch 已清） -->

- [?] **T-046** | Pipeline | **seed --include-river row 估算（dry-run 完成）**
  - branch: `wip/T046-seed-river-estimate`
  - 機器：這台主目錄
  - 改動：單檔新增 `scripts/gto-pipeline/estimate-river-seed.mjs`（+75 行，純計算不碰 DB）
  - **實測數字**（`node estimate-river-seed.mjs`）：
    - Turn rows：**390**（13 flops × 10 turns × 3 stacks）— 與 T-043 實跑一致
    - River rows：**3,120**（13 × 10 × 8 rivers/turn × 3 stacks；`generateRiverCards` 對 13 BOARDS 每 turn 穩定產 8 張）
    - Grand total：**3,510** rows in `gto_batch_progress`
    - 下游 `gto_postflop`：若全解完 ~5.93M rows（3510 × 1690 hands/batch）
    - Solver wall-time：~878–1170 hr 單機（3510 × 15–20 min）
  - **判讀（T-046 criterion）**：
    - ✅ `gto_batch_progress` seed 量 3510 < 10k 門檻 → **seed 本身沒問題**
    - ⚠️ 瓶頸不在 seed 而在 solver 吞吐：單機跑完 river 約 6–7 週 24/7；3 機並行約 2 週
  - **建議（phased seed）**：
    1. **seed 全量**（`--include-river` 一次下 3120 row）— 對 DB 無壓力，upsert 可重跑
    2. **但 batch-worker 採分階段領取**：用 `stack_label` 或 `board_key` filter 先跑一個 slice（例：先做 13bb 全部 river = 1040 row），驗 pipeline 穩定再放另外兩個 stack
    3. 或用 `--max N` 節流，搭配多機 claim 分散
  - **不推薦**：
    - ❌ full seed + 單機序列跑（878 hr 不現實）
    - ❌ 完全 skip river（river 是訓練模式最後一街，沒補就代表河牌訓練永遠走 fallback）
  - **追加發現**：`generateRiverCards` 實測每個 turn 穩定回 8 張（未觸發 <8 的邊界；13 BOARDS 的 flop+turn 組合都有 ≥8 個剩餘 rank），代表 river fan-out 可以當確定的 × 8 估算
  - 驗證：script 純 import boards.mjs + 運算，無外部 side effect；多跑多次結果相同
  - 純 flow 改動（scripts/，不影響 Vercel build），無 version bump
  - 等大腦 review（要不要採納「phased by stack_label」策略 + 要不要真 seed）

<!-- T-012 → Code Done 2026-04-21，migration 部署待 T-063 -->

<!-- T-062 → Done 2026-04-21（見 Done 區） -->

<!-- T-011 → Done 2026-04-21（見 Done 區） -->

<!-- T-056 → Done 2026-04-20 -->

<!-- T-059 → Done 2026-04-20，實機驗收見 T-060 -->

<!-- T-057 → Done 2026-04-20 -->

<!-- T-058 → Done 2026-04-20，實機部署/驗收見 follow-up T-059 -->

<details>
<summary>📦 T-058 原 In Review 描述（已 merged）</summary>

- [?] **T-058** | Product | **exploit-coach 繁中 poker 術語 grounding** ⚠ 含 Edge Function 部署
  - branch: `wip/T058-zh-tw-terminology`（從 origin/dev `9b51e30` 切出）
  - 最後 commit: 待 push
  - 機器：這台主目錄
  - 改動範圍（單檔 `supabase/functions/exploit-coach/index.ts:170-204`，+31 / -1 行）：
    - 在 base prompt 的「本輪場景 grounding」段**之後**新增「繁中 poker 術語校準」段（位置：T-055 段尾接續，符合派單禁碰「不動 T-055 grounding 段」要求）
    - 內容（依派單範本完整貼入）：
      - **5 個 LLM 高風險詞錯譯阻擋**：dominate→壓制 / cooler→冤家牌 / bluff catcher→抓詐唬牌 / polarized→極化範圍 / merged→合併範圍（每條都附 ❌ 錯譯黑名單）
      - **保留英文清單**（21 詞）：c-bet / 3-bet / 4-bet / GTO / MDF / ICM / SRP / BTN / SB / BB / UTG / CO / HJ / LJ / IP / OOP / TAG / LAG / nit / maniac / SPR
      - **推薦譯法**（12 詞）：bluff / equity / pot odds / implied odds / fold equity / blocker / squeeze / donk / float / set / trips / calling station
      - **3 條使用規則**：保留英文字樣→直接英文、表外術語→英文+括號白話、避免大陸用語
    - 預估 prompt 增 ~700 token（在派單預估 500-800 範圍內）
  - 不變動：retrieve / Anthropic call / auth.getUser / hero/villain context push / 前端 mockup / T-055 grounding 段
  - 驗證：✅ `npx tsc -b --noEmit` EXIT=0
  - **⚠ 部署流程（Edge Function，需手動）**：
    1. **大腦 merge** wip 到 dev + bump version + push
    2. **大腦或執行者另一輪**：產出 `supabase/functions/exploit-coach/index.ts` 整檔貼碼指令
    3. **用戶手動**貼到測試 Supabase Dashboard → Edge Functions → `exploit-coach` → Via Editor → 整檔取代 → Deploy
    4. **用戶實機重測**：
       - 重現原 QQ vs AK/AA/KK 對話 → 驗 AI 用「壓制」而非「過度」
       - 追問「bluff catcher 是什麼」→ 驗 AI 回「抓詐唬牌」或保留英文，不講「詐唬捕手」
       - 隨機詢問翻後場景 → 確認沒蹦出「蝨子」「踢子」等大陸用語
  - 預期判讀：
    - ✅ 5 高風險詞 + 12 譯法都符合 → A 修好，移 Done
    - ⚠ 仍有零星錯譯 → 補加違規詞到「最容易翻錯」清單，或改用 strong negative example
    - ⚠ Token cost / latency 顯著上升 → 評估是否要把術語表搬到 system prompt cache（Anthropic prompt caching）
  - 相關記憶：[[poker-terminology-zh-tw]]（完整表 + 8 來源）/ [[supabase-edge-function-gotchas]]（部署流程）
  - 等大腦 merge + 安排 Edge Function 部署

</details>

<!-- T-010 / T-020 / T-043 / T-050 / T-051 / T-055 今日全部 merge 到 dev，見 Done 區 -->

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
- [x] **T-058** | Product + 大腦 | **exploit-coach Claude 教練繁中術語 grounding** | 2026-04-20 | merge + dev.37
  - 執行者：`wip/T058-zh-tw-terminology` @ `ff496c1`
  - 大腦：review + merge（這台 `-brain` worktree）+ 產 Edge Function 貼碼指令
  - 改動：單檔 `supabase/functions/exploit-coach/index.ts:170-204`（+31/-1）
  - 內容（接在 T-055 grounding 之後）：5 LLM 高風險詞 ❌ 黑名單（dominate/cooler/bluff catcher/polarized/merged）+ 21 保留英文清單 + 12 推薦譯法 + 3 使用規則
  - Prompt 增加 ~700 token（派單預估範圍內）
  - 驗證：tsc EXIT=0
  - ⚠ 部署：用戶手動貼整檔到測試 Supabase Edge Function editor
  - 實機驗收 3 條：QQ vs AK/AA/KK 不再出現「過度」；「bluff catcher」用「抓詐唬牌」或保留英文；不蹦「蝨子/踢子」大陸用語
- [x] **T-020** | Pipeline + 大腦 | **HU 40bb SRP 13 → 21 flops (peer parity 25bb) + 命名統一去除 FLOP_** | 2026-04-20 | merge + dev.36
  - 執行者：另一台電腦（`wip/T020-hu40bb-srp-fill`：`6119d74` → `9545e7c` → `5e3c7ee`）
  - 大腦：review + merge（這台 `-brain` worktree）
  - 產出（25 files, +1718/-348）：
    - 8 新 extras `gtoData_hu_40bb_srp_{5s5c5d/6d5h4c/8s5h2c/8s7s5d/9s7s3s/Ah2d2c/Ah5c2d/Ah8h3c}.ts`
    - 10 base `_flop_` rename 去 FLOP_（As7d2c/Kc8h3s/Jc7d2h/KsQd4h/Td8h4c/Js9c3h/JsTc9h/Tc9c6d/KcKd5h/QsJh2h）
    - 3 base（7s7d2h/9d5c2h/9h8d7c）為 solver 新跑產出覆蓋（104→151 行，新版本 output）
    - `gtoData_hu_postflop_index.ts` map 13→21 entries + 命名更新
    - `boards.mjs` 加 `BOARDS_HU_EXTRAS` + `BOARDS_HU`
    - `generate-input-v2.mjs` 加 `--boards hu` 支援
  - 驗證：tsc EXIT=0
  - **踩坑（執行者抓到）**：`batch-run.ps1 -SkipExisting` 只 check 新命名（無 `_flop_`），舊命名會誤判「未產」→ 全部 base 意外重跑。執行者 kill 救回 3hr churn
  - **衍生 T-056 / T-057**（防未來再踩）+ T-021 / T-023 做 HU 3bp / 深度擴充時順便 rename HU 25bb/13bb SRP
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
- [x] **T-063** | 用戶 + 大腦 | **T-012 migration 部署到測試 Supabase + verify Tier A** | 2026-04-21 | dev.38
  - 用戶動作：貼 migration SQL → 貼 RLS patch（大腦補）
  - 實機驗證：`test-retrieval.mjs` MTT scenario → **Tier A 命中** `solver_postflop_mtt`
  - 副 fix (dev.38)：RLS policy `TO authenticated` → `TO anon, authenticated` 對齊 6max（anon key pipeline scripts 才讀得到）
- [x] **T-012** | Pipeline + 大腦 | **C4 MTT DB migration（完整：code + 部署 + verify）** | 2026-04-21 | merge + T-063 完成
  - 升級為真正 Done（含測試 Supabase 部署 + Tier A 實機驗證）
  - 執行者：Sandbox `wip/T012-mtt-db-migration` @ `3d308a4` / `27acc0f` / `cc561bb`
  - 改動 3 檔：
    - 新 `supabase/migrations/20260421-solver-postflop-mtt.sql`（+107，CREATE TABLE + CHECK + RLS + index + INSERT...SELECT + DELETE）
    - `convert-to-db.mjs`：slug prefix 分流（mtt_* → mtt table）
    - `test-retrieval.mjs`：Tier A+B prefix routing；Tier C 固定 6max fallback（MTT 稀疏時退回 cash 近似，合理設計，採納）
  - 驗證：SQL 肉眼檢查 OK（idempotent、無 plpgsql parser 地雷）；script 純變數路由
  - migration 部署 → T-063 follow-up
  - 踩坑：執行者 scripts commit 原誤落 wip/T062（T-062 要防的情境在 T-062 merge 前踩進），cherry-pick 救回
- [x] **T-062** | Pipeline + 大腦 | **wip1 worktree HEAD 隔離強化** | 2026-04-21 | merge only (flow, no bump)
  - 執行者：Sandbox `wip/T062-wip1-isolation` @ `fafaa16` / `83c1dd6`
  - 改動：單檔 `scripts/session-start-reminder.sh`（+15 行）`*-wip*` 區塊
    - SOP 第 3 步加 ⚠ 強調 `origin/dev` base 必須帶
    - 加 HEAD 非 detached 偵測 → 印警告 + 救法
  - 驗證：執行者在當前 wip1 觸發警告 OK
  - 防 T-011 踩坑重演
- [x] **T-011** | Pipeline + 大腦 | **C3 E2E 小樣本（MTT scenario 入 DB）** | 2026-04-21 | merge only (flow, no bump)
  - 執行者：Sandbox `wip/T011-c3-e2e` @ `f861b6a` / `50d85fb`（base 4d6a0e2）
  - 改動（全 .mjs pipeline，17 檔 / +474 / -4）：
    - `scenarios.mjs`：加 `mtt_40bb_srp_btn_open_bb_call` override（骨架近似 HU_40BB_RANGES）
    - `convert-to-db.mjs`：擴吃 `ALL_FORMATS`（不只 `SIXMAX_SCENARIOS`）
    - `test-retrieval.mjs`：加 MTT tier A 測試
    - 13 個 `mtt_40bb_srp_btn_open_bb_call_*.txt` inputs（全 13 BOARDS）
  - 實跑：
    - Solver fast 16:28，exploitability 3.22%
    - DB upsert：`mtt_40bb_srp_btn_open_bb_call + As7d2c` → `solver_postflop_6max`（82 MB → 31.5 KB tree）
    - Tier A retrieval 命中（BB CHECK 79.7% / BET 50% pot 20.3%）
  - 暫借 `solver_postflop_6max`（T-012 migration 用 `WHERE scenario_slug LIKE 'mtt_%'` 搬）
  - ⚠ range 是 HU_40BB_RANGES 近似，非真 MTT range（pd→range converter 另開 task）
  - 踩坑：執行者 feat commit 先誤落 wip/T056（wip1 被外部 session 切走），cherry-pick 救回 wip/T011
- [x] **T-056** | Pipeline + 大腦 | **batch-run.ps1 -SkipExisting 雙命名偵測（防 T-020 churn 重演）** | 2026-04-20 | merge only (flow, no bump)
  - 執行者：`wip/T056-skipexisting-dual-naming` @ `01421bb` / `28b9d75`
  - 改動：單檔 `scripts/gto-pipeline/batch-run.ps1` 第 127-139 行（+8/-3）
    - `-SkipExisting` else branch 同時 Test-Path 新命名 + 舊 `_flop_` 命名
    - skip 訊息附 matched filename
  - 驗證：
    - ✅ 執行者 fixture 4-case 全 pass（舊存新無 / 新舊都有 / 新存舊無 / 皆無）
    - ✅ 大腦補跑 real batch dry-run：HU 25bb SRP 前 7 個 SKIP 都正確印 matched filename
  - ⚠ 副產物發現：HU 25bb SRP 有 9 個 input 無對應 .ts（pipeline state gap，跟 T-056 無關，未來 task 處理）
- [x] **T-060** | 用戶 + 大腦 | **T-058 Edge Function 實機部署 + 3 條驗收全 pass** | 2026-04-20 | no branch / flow
  - 用戶動作：照 deploy guide (`docs/supabase-migrations/20260420-T058-zh-tw-terminology-deploy.md`) 貼整檔到測試 Supabase Dashboard
  - 驗收結果：3 條全 pass ✅
    - ✅ 壓制：QQ vs AK 對話 → AI 用「壓制」
    - ✅ bluff catcher：追問 → AI 回「抓詐唬牌」/ 保留英文
    - ✅ 大陸用語：翻後場景 → 無「蝨子」/「踢子」等
  - 影響：T-058 升級為「真正 Done（含部署 + 驗收）」，繁中 poker 術語 grounding 正式上線到測試 Supabase
- [x] **T-059** | Product + 大腦 | **T-058 Edge Function deploy guide** | 2026-04-20 | merge only (flow, no bump)
  - 執行者：`wip/T059-T058-deploy-guide` @ `716b802` / `e7501b5`（Sandbox session）
  - 產出：`docs/supabase-migrations/20260420-T058-zh-tw-terminology-deploy.md`（42 行，含部署 7 步 + 3 條驗收）
  - 驗證：tsc EXIT=0
  - 純 doc 改動，不 bump version
  - 後續：T-060（用戶實機驗收）
- [x] **T-057** | Pipeline + 大腦 | **wiki: gto-pipeline-conventions.md 命名規範** | 2026-04-20 | merge only (flow, no bump)
  - 執行者：`wip/T057-gto-pipeline-conventions` @ `6d944fc` / `75ecb05`（Sandbox session）
  - 產出：
    - 新 `memory/wiki/gto-pipeline-conventions.md`：檔名規範 + Export 名規範 + 遺留清單（HU 25bb/13bb SRP _flop_）
    - `memory/index.md` Development 區加連結
  - 驗證：tsc EXIT=0
  - 純 flow 改動（memory/wiki + index），不 bump version
- [x] **T-058** | Product + 大腦 | **exploit-coach 繁中 poker 術語 grounding** | 2026-04-20 | merge + dev.37
  - 執行者：`wip/T058-zh-tw-terminology` @ `ff496c1`
  - 大腦整合：身邊機器 `-brain` worktree
  - 改動：單檔 `supabase/functions/exploit-coach/index.ts:170-204`（+31/-1 行）
  - 內容：buildSystemPrompt 加繁中術語校準段（5 高風險詞 + 21 保留英文 + 12 推薦譯法 + 3 使用規則）
  - prompt +~700 token
  - 驗證：tsc EXIT=0
  - ⚠ **Edge Function 未部署**（merge 到 repo ≠ 部署到 Supabase）→ 由 T-059 follow-up
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
