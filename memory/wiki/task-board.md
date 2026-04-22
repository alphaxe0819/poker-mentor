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

<!-- T-084 → In Review 2026-04-22（士林電腦執行者完成於 wip/T084-gtow-token-grabber；待大腦 merge + 用戶實機驗 token 抓取） -->

<details>
<summary>📦 T-084 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-084** | 工具 / 開發流程 | **GTO Wizard Token Grabber Script（解 T-082 部署阻擋）** `(派工 2026-04-22 → 士林電腦執行者，優先序：先做 T-084 → 再回 T-083)`
  - 建議 branch：`wip/T084-gtow-token-grabber`
  - **目的**：寫個自動化 script，從本地已開啟並登入的 GTO Wizard 抓 Bearer token，避免每次手動翻 DevTools Network tab。**T-082 部署阻擋在用戶找不到 token，這個 script 一勞永逸解決**
  - **方法**：Playwright connect to existing Chrome（CDP，remote debugging port 9222），listen `api.gtowizard.com` 請求的 `Authorization` header
  - **scope（嚴格）**：
    1. **新檔** `scripts/dev-tools/grab-gtow-token.mjs`（Node script，純 dev 工具）
    2. **新檔** `scripts/dev-tools/README.md`（用法說明）
    3. **流程**（用戶手動 + script 自動）：
       - 用戶**手動**關閉所有 Chrome → 用 `chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-gtow"` 啟動（避免污染 main profile）
       - 用戶**手動**登入 GTO Wizard
       - 跑 `node scripts/dev-tools/grab-gtow-token.mjs`
       - script connect Chrome via CDP → 找 GTO Wizard tab → 觸發或 listen API call → 抓 `Authorization: Bearer <token>`
       - script print token 到 console（也可選擇寫到 `scripts/dev-tools/.gtow-token.local.txt`，需先 gitignore）
       - 用戶複製 token → 貼 Supabase Dashboard → Edge Functions → Secrets → `GTO_WIZARD_TOKEN`
    4. **gitignore 加** `scripts/dev-tools/.gtow-token.local.txt` 和 `scripts/dev-tools/node_modules/`
    5. **依賴**：`playwright` 或 `playwright-core`（npm install 在 `scripts/dev-tools/` 或 root，看你怎麼設計，但**不要污染 main package.json** — 建議獨立 `scripts/dev-tools/package.json`）
  - **out of scope**：
    - ❌ 不自動 set Supabase Secret（需要 Supabase service role key + 額外 risk）
    - ❌ 不做 Chrome Extension（更大工程，留 phase 2）
    - ❌ 不做 token 自動 refresh（JWT 過期重抓即可）
    - ❌ 不做大量自動 API 抓取（避免 GTO Wizard ToS 風險，**只抓 token 不批次撈資料**）
    - ❌ 不寫進 main package.json dependencies
  - **完成條件**：
    - script 跑起來能印出 token（格式 `eyJhbGciOi...`）
    - README 寫清楚 Chrome 啟動參數 + script 執行步驟
    - 用戶實機驗證：能抓到 token → 貼進 Supabase Secret → T-082 Edge Function 跑起來不再「GTO_WIZARD_TOKEN secret missing」
  - **工時估算**：4-8 hr
  - **完成後**：執行者切回 T-083 繼續 villain profile v2 MVP

</details>

<!-- T-083 → ⚠ 部分 revert 2026-04-22（mockup-v3.html + exploit-coach Edge Function 還原為 pre-T-083；保留 src/lib/villainProfile/ + public/exploit-coach-villain-lib.js 給 T-085 用；原因：T-083 違反「fork 獨立」原則改了原版正式入口檔，見專案 CLAUDE.md「內測 / 實驗性改動：fork 獨立原則」section）→ 重派 T-085 做 fork 版 -->

<!-- T-085 → Done 2026-04-22（家裡 wip1 執行者完成 wip/T085-villain-v2-fork @ ebbdc85；大腦 merge @ f6f5fbf；用戶部署 exploit-coach-villain-v2 Edge Function 到測試 Supabase btiqmckyjyswzrarmfxa + 驗 dev URL https://poker-goal-dev.vercel.app/exploit-coach-villain-v2-test.html 通過；villain profile v2 21 range 內測上線） -->

<details>
<summary>📦 T-085 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-085** | Product 內測 | **villain profile v2 fork 版（獨立 mockup + 獨立 Edge Function，原版不動）** `(派工 2026-04-22 → 家裡 wip1 執行者，T-083 partial revert 補做)`
  - 建議 branch：`wip/T085-villain-v2-fork`
  - **目的**：T-083 改錯方式（改原版），現在 fork 獨立做 — 跟 T-082（exploit-coach-gtow）同模式
  - **背景 / 必讀**：
    - [[villain-profile-design]] §11 v2 鎖定規格（T-083 已寫完）
    - 專案 CLAUDE.md「內測 / 實驗性改動：fork 獨立原則」section（為何要 fork）
    - 已有可重用 lib：`src/lib/villainProfile/` 7 個 TS 檔 + `public/exploit-coach-villain-lib.js`（T-083 留下，**不要重做**）
  - **scope（嚴格 fork 模式）**：
    1. **fork 後端**：複製 `supabase/functions/exploit-coach/` → `supabase/functions/exploit-coach-villain-v2/`
       - 加 `villain_profile_summary` + `villain_name` field 處理（T-083 寫過的 18 行 diff，照抄到新 fork）
       - 原版 `supabase/functions/exploit-coach/index.ts` **完全不動**
    2. **fork 前端**：複製 `public/exploit-coach-mockup-v3.html` → `public/exploit-coach-villain-v2-test.html`
       - 加內測橫幅「⚠ 內測版（villain v2 21 range，原版未上線）」
       - 改 fetch endpoint：`exploit-coach` → `exploit-coach-villain-v2`
       - 改 LS key namespace：`exploit-coach-villains-v1` → `exploit-coach-villain-v2-villains`、`exploit-coach-conversations-v1` → `exploit-coach-villain-v2-conversations`
       - 加 sv2-intro / sv2-q / sv2-name 三個 screen（T-083 寫過，照抄到新 HTML）
       - 改 S1 「+ 建立新對手」按鈕 onclick 為 `startV2Flow()`（T-083 寫過）
       - 原版 `public/exploit-coach-mockup-v3.html` **完全不動**（partial revert 已還原）
    3. **共用 lib**：直接 reuse `src/lib/villainProfile/` + `public/exploit-coach-villain-lib.js`，**不改動 lib code**
  - **out of scope**：
    - ❌ 不改原版 `exploit-coach` Edge Function
    - ❌ 不改原版 `exploit-coach-mockup-v3.html`
    - ❌ 不改 `exploit-coach-gtow` (T-082 內測版)
    - ❌ 不改 villainProfile lib signature（T-083 已穩定）
  - **完成條件**：
    - 內測 URL：`https://poker-goal-dev.vercel.app/exploit-coach-villain-v2-test.html`
    - 走完 21 題 → save → v2 profile 持久化（檢查獨立 LS key）→ 進 chat → AI 回答能看到「後位 35% open（偏緊 -14%）」具體 grounding
    - 原版 URL `https://poker-goal-dev.vercel.app/exploit-coach-mockup-v3.html` 完全沒變化（看到老張 + 舊 quiz）
    - `npx tsc -b --noEmit` EXIT=0
  - **部署**：執行者寫完 → 大腦 produce **新** Edge Function 整檔貼碼指令（用戶手貼測試 Supabase Dashboard 新建 `exploit-coach-villain-v2`）→ 內測 URL 驗證 → task 結案
  - **工時估算**：6-10 hr（lib 已寫好，主要是 fork + scope 切換）
  - **相關 task**：T-083（partial revert 後 lib 留下供 reuse）

</details>

<!-- T-087 → In Review 2026-04-22（家裡 wip1 執行者完成） -->

<details>
<summary>📦 T-087 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-090** | Product / 玩家入口整合 | **ExploitCoachTab iframe src 改載 villain-v2-flow.html（測試機主站玩家看到新流程）** `(派工 2026-04-22 → 任一執行者)`
  - 建議 branch：`wip/T090-exploit-coach-tab-iframe-switch`
  - **目的**：T-087/T-088 已 ship 新流程到內測 URL `/exploit-coach-villain-v2-flow.html`，但玩家進主站還是看到舊 quiz（因為 ExploitCoachTab.tsx iframe 寫死載 `mockup-v3.html`）。本 task 改 iframe src 讓測試機主站玩家直接看新流程
  - **⚠ 違反「fork 獨立原則」明確授權**：用戶 2026-04-22 明確說「做 T-090 直接可以在測試機看到內容」 → 這是 production-level 取代決策（不是內測 fork）。允許動原版正式入口檔
  - **scope（極簡，1-2 hr）**：
    1. 改 `src/tabs/ExploitCoachTab.tsx` 的 iframe src：
       - 從 `/exploit-coach-mockup-v3.html` → `/exploit-coach-villain-v2-flow.html`
       - 應該只是改一個 string literal（grep `mockup-v3.html` 找位置）
    2. 確認 React app ↔ iframe 之間的 postMessage / supabase token 傳遞還能 work：
       - villain-v2-flow.html 的 IS_STANDALONE = false 時走 askParentRefresh path（T-088 保留原 iframe path）
       - ExploitCoachTab.tsx 既有 `request-supabase-refresh` listener 應該已經 handle（mockup-v3.html 同樣機制）
    3. **不改** `public/exploit-coach-mockup-v3.html`（保留，未來 fallback / rollback 用）
    4. **不改** villain-v2-flow.html（已 production-ready）
    5. **不改任何 Edge Function**
  - **out of scope**：
    - ❌ 不刪 mockup-v3.html（保留 backup）
    - ❌ 不改 React app 其他邏輯（只動 iframe src 一行）
    - ❌ 不部署到正式 Supabase（不需要，Edge Function 已部署）
    - ❌ **絕對不 push main**（push dev 即可，正式機保持舊流程直到用戶明確授權上線）
  - **完成條件**：
    - 改 1 行 iframe src
    - tsc EXIT=0
    - 開 `https://poker-goal-dev.vercel.app` 主站 → 進剝削教練 tab → 看到 villain v2 新流程（B 選擇頁，3 個入口）
    - 走完 C2 / C3 / D 任一路徑驗證
    - chat 能拿到 AI 回覆（驗證 iframe-parent token 傳遞 work）
    - **不要 push main**
  - **工時估算**：1-2 hr

<!-- T-089 → In Review 2026-04-22（家裡 wip1 執行者完成；wip/T089-standalone-auth-fix @ 76ae9c6；抄 T-088 standalone auth patch 到 gtow-test + villain-v2-test；tsc EXIT=0；待大腦 merge + 用戶重驗 T-082/T-085） -->

<details>
<summary>📦 T-089 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-089** | Product 內測 / Bugfix | **villain-v2-test + gtow-test standalone auth bug 修（抄 T-088 patch）** `(派工 2026-04-22 → 任一執行者)`
  - 建議 branch：`wip/T089-standalone-auth-fix`
  - **目的**：T-082 部署完成後驗證撞到「需要先登入才能呼叫 AI 教練」 — 跟 T-088 修的 villain-v2-flow.html 同根因（standalone HTML，auth code 假設 iframe + parent，window === window.parent → 永遠沒 token）。本 task 把 T-088 的修法照抄到剩下兩個 standalone HTML
  - **必讀**：T-088 commit（merged 2026-04-22）— 看 `public/exploit-coach-villain-v2-flow.html` 的 `IS_STANDALONE` + `getFreshAccessTokenStandalone()` 實作
  - **scope（純 bugfix，不擴張）**：
    1. 改 `public/exploit-coach-gtow-test.html`（T-082 fork 的內測 HTML）
       - 抄 T-088 的 `IS_STANDALONE` 旗標 + standalone supabase client（`persistSession: true` + `autoRefreshToken: true`）+ `getFreshAccessTokenStandalone()` 用 SDK `auth.getSession()` / `refreshSession()`
       - `getFreshAccessToken` 頂部分流（IS_STANDALONE → 走新 SDK path；iframe → 原邏輯）
    2. 改 `public/exploit-coach-villain-v2-test.html`（T-085 fork 的內測 HTML）
       - 同 #1 patch
    3. **不改** `public/exploit-coach-villain-v2-flow.html`（T-088 已修）
    4. **不改原版** `public/exploit-coach-mockup-v3.html`（玩家走 React app iframe，不需 standalone path）
    5. **不改任何 Edge Function**
  - **out of scope**：
    - ❌ 不重構 supabase client 抽 lib（每個 HTML 自己一份）
    - ❌ 不改 React app（ExploitCoachTab.tsx）
    - ❌ 不部署到正式環境
  - **完成條件**：
    - 用戶先在主站 `poker-goal-dev.vercel.app` 登入
    - 開 `gtow-test.html` 問教練 → 拿到 GTOW 後端 AI 回覆 → T-082 內測通關
    - 開 `villain-v2-test.html` 問教練 → 拿到 v1 21 題後端 AI 回覆 → T-085 補完
    - `npx tsc -b --noEmit` EXIT=0
  - **部署**：純 HTML，Vercel dev 自動部署
  - **工時估算**：1-2 hr（純 copy-paste T-088 patch + 兩個檔測試）

</details>

<!-- T-088 → In Review 2026-04-22（家裡 wip1 執行者完成） -->

<details>
<summary>📦 T-088 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-088** | Product 內測 / Polish + Bugfix | **villain-v2-flow polish + 登入 bug 修** `(派工 2026-04-22 → 任一執行者，全包 5 點 issue)`
  - 建議 branch：`wip/T088-villain-v2-flow-polish-bugfix`
  - **目的**：用戶 review T-087 ship 後找出 5 個 issue，一次修完
  - **必讀**：[[villain-profile-design]]
  - **scope（嚴格 fork 獨立 — 只改 villain-v2-flow.html，不動其他檔）**：
    1. **C2 設定比例 — 模板選中高亮**：
       - 當前載入的模板按鈕（GTO/LAG/TAG/Nit）顯示 active 狀態（顏色不同 + ✓ icon）
       - 用戶調整 % 後（與該模板的 % 不一致）→ 移除 active 狀態（顯示「已自訂」或單純清掉高亮）
    2. **C3 詳細範圍 — 模板擴充 + 改名**：
       - 「載入 baseline」按鈕改名 → **「載入指定範圍」**
       - 除既有 GTO 外，加三個快速預設範圍按鈕：**LAG（鬆兇）** / **TAG（緊兇）** / **Nit（緊弱）**
       - 預設範圍 % 從 villain-lib.js 既有 4 個模板取（已寫好，T-083 留下）
       - 模板按鈕點選後同 #1 高亮顯示
    3. **C3 動作互斥檢查（同位置內）**：
       ```
       面對前手 open 時:   CALL ⊥ 3BET   (跟注 vs 3-bet 同手只能選一個)
       面對 3-bet 時:      CALL_3BET ⊥ 4BET   (跟 3-bet vs 4-bet 同手只能選一個)
       面對 4-bet 時:      CALL_4BET ⊥ 5BET   (我們沒做 5BET，CALL_4BET 自由)
       ```
       - **UI 表現**：切到「4BET」grid 時，把該位置「CALL_3BET」已選的 hand 顯示**灰色不可點**
       - hover 灰格顯示 tooltip「已在 跟3-bet 選擇，點此切換到 4-bet」
       - 強制點下去 → **從 CALL_3BET 移除 + 加進 4BET**（互斥切換）
       - 反之亦然（CALL_3BET grid 切到時，4BET 已選 hand 灰掉）
       - **跨位置 / RAISE 不互斥**（不同 phase）
    4. **命名頁顏色選擇 bug**：
       - 8 色卡片 onclick 不要 reset 暱稱 input（保留用戶已輸入的字串）
       - 純 bug fix（onclick 邏輯多餘的 reset 拿掉）
    5. **登入 bug 修**：
       - 症狀：villain-v2-flow.html「請教練分析」（chat fetch Edge Function）出現「要前往登入」
       - 可能根因（執行者要 debug 確認）：
         - (a) Supabase session 過期 / refresh failed
         - (b) Edge Function 401 → 前端 callCoach catch 顯示登入錯誤訊息
         - (c) standalone HTML 沒接好 supabase auth flow（與 React app iframe 環境差異）
       - **debug 順序**：
         - 1. 開 dev URL → F12 → Network tab 看 fetch exploit-coach-villain-v2 的 status code
         - 2. 看 request header 的 Authorization 是不是有 Bearer token
         - 3. 看 Edge Function logs（Supabase Dashboard）— 401 還是其他
       - 修法依根因而定（可能是 supabase session 初始化、或 token refresh 邏輯、或 fetch retry）
       - 對照 T-085 villain-v2-test.html（同樣 standalone HTML，理論上同 auth flow），看 test 頁有沒有同 bug
  - **out of scope（明確排除）**：
    - ❌ 不改原版 mockup-v3.html / villain-v2-test.html / 任何 Edge Function
    - ❌ 不改 villain-lib.js
    - ❌ 不改 React app（ExploitCoachTab.tsx）
    - ❌ 不做新功能（純修既有 5 個 issue）
  - **完成條件**：
    - C2 切換模板看得出當前用哪個（顏色 / icon）
    - C3 4 個模板按鈕都 work（GTO/LAG/TAG/Nit）+ 改名「載入指定範圍」
    - C3 互斥邏輯：選 CALL_3BET[AA] → 切 4BET → AA 灰掉；強制點 → 從 CALL_3BET 移除 + 4BET 加
    - 命名頁打字後選顏色，暱稱字串不消失
    - 「請教練分析」能正常拿到 AI 回覆，不再撞登入錯誤
    - `npx tsc -b --noEmit` EXIT=0
    - 內測 URL：`https://poker-goal-dev.vercel.app/exploit-coach-villain-v2-flow.html`
  - **部署**：執行者 push wip → 大腦 merge → Vercel dev 自動部署 → 用戶驗收
  - **工時估算**：4-8 hr（5 點看登入 bug debug 複雜度，可能多 2 hr）

</details>

- [ ] **T-087** | Product 內測 | **villain v2 新流程 production 版（B 選擇頁 / C1 快速問答 / C2 設定比例 / C3 詳細範圍 / D 用戶檔案頁，接真 Edge Function）** `(派工 2026-04-22 → 任一執行者，直接做 production，不做 mockup wireframe)`
  - 建議 branch：`wip/T087-villain-v2-flow`
  - **目的**：用戶要重新設計 villain v2 建立流程（取代現有 T-085 的「21 題傻問」）。**直接做 production 版**（接真 Edge Function `exploit-coach-villain-v2` + 真 ship 測試機 dev URL）
  - **必讀**：[[villain-profile-design]]（schema + 21 range 定義 + summarizer 邏輯）
  - **新流程設計（用戶 2026-04-22 拍板）**：
    ```
    A 剝削教練頁
      ↓ 點「新建對手」
    B 選擇頁（3 個入口）
      ├─ 1. 快速問答 → C1
      ├─ 2. 設定比例 → C2
      └─ 3. 詳細範圍 → C3
      ↓
    C1 快速問答（5-7 題人話問答，類似 T-074 之前的 quiz）→ 推導 21 grid 比例 + 套 baseline → D
    C2 設定比例（4 頁，每頁一個位置 6 動作）→ 21 grid 比例 + 套 baseline → D
    C3 詳細範圍（4 頁，每頁一個位置 13×13 grid 純 0/1，先載 baseline 模板再改）→ D
      ↓
    D 用戶檔案頁
      - 風格摘要（創建時靜態規則生成）
      - 21 Range 一覽表（4×6 表格 + 鬆/緊顏色標註）
      - 範圍縮圖（動作 tab 切換，4 位置並排顯示一個動作的 mini grid）
      - AI 剝削策略（升級 5 點）
      - 編輯按鈕 → 進 C3 編輯該 grid
    ```
  - **scope（嚴格 fork 模式 — production 但 fork 不取代既有檔）**：
    1. **新檔** `public/exploit-coach-villain-v2-flow.html`（fork from `exploit-coach-villain-v2-test.html`，**production 版接真 Edge Function**）
    2. **頂部加內測橫幅**：「⚠ 內測版（villain v2 新流程，原版未上線）」
    3. **screens 實作**：
       - **B 選擇頁**：3 個大按鈕卡片（快速問答 / 設定比例 / 詳細範圍），每個卡片含 icon + 短說明 + 預估時間
       - **C1 快速問答**：5-7 題人話 quiz（採用 design doc § 3 骨架），每題 4 個語義化選項，逐題推進（progress bar），完成 → D
       - **C2 設定比例**：4 頁（前/中/後/盲注），每頁一個位置 6 動作 dropdown table（含 GTO baseline 比較 + 偏離度 colored badge）+ 「載入預設」按鈕（GTO/LAG/TAG/Nit 4 個模板），存完進下一頁，第 4 頁存完 → 命名 → D
       - **C3 詳細範圍**：4 頁（前/中/後/盲注），每頁顯示該位置 6 個動作 tab + 13×13 hand grid（純 0/1，點/拖拉切換）+ 載入 baseline 模板按鈕，6 動作切完進下一頁，第 4 頁完進 → 命名 → D
       - **D 用戶檔案頁**：風格摘要區塊 + 21 range 4×6 表 + 動作 tab 切換顯示 4 位置 mini grid 縮圖 + AI 剝削策略 (預設靜態 + 「升級 AI 版 5 點」按鈕) + 編輯按鈕
    4. **reuse 既有 lib**：
       - `public/exploit-coach-villain-lib.js`（21 range schema + baseline 套用 + summarizer，T-083 寫過）
       - 不改 lib code，只 import 用
    5. **D 頁風格摘要 + 剝削策略**（用戶 design 決策 C）：
       - **創建時靜態規則生成**：用 villain-lib.js 的 summarizer 算各 range 偏離度 → 規則庫對應「鬆型/緊型/激進型」+ 3 條剝削建議 → 存進 villain profile
       - **「升級 AI 版」按鈕**：點下去 fetch `exploit-coach-villain-v2` Edge Function（用 villain_profile_summary + 特殊 prompt 「給 4 句風格摘要 + 5 條深度剝削策略」）→ 拿到 LLM 回覆覆蓋 villain.aiSummary 欄位 → 重新渲染 D 頁
       - **點數扣款**：MVP 階段先免費（按鈕標「升級 AI 版（內測階段免費）」）。註解標記：「TODO: production 上線時改 5 點，需 service role key 過 RLS spend_points」
    6. **storage**：localStorage namespace `exploit-coach-villain-v2-flow-*`（與既有 `exploit-coach-villain-v2-test.html` 的 LS 隔離）
  - **out of scope（明確排除）**：
    - ❌ 不取代既有 `exploit-coach-villain-v2-test.html`（兩個共存，dev URL 並列）
    - ❌ 不改 villain-lib.js
    - ❌ 不改 `exploit-coach-villain-v2` Edge Function（reuse T-085 的，已 merged）
    - ❌ 不改原版 `exploit-coach` 或 `exploit-coach-mockup-v3.html`
    - ❌ 不做 mixed strategy（純 0/1）
    - ❌ 不做跨裝置同步（純 localStorage）
    - ❌ 不接點數扣款（內測階段升級 AI 版免費）
    - ❌ 不部署到正式環境（永遠不要）
  - **完成條件**：
    - 內測 URL：`https://poker-goal-dev.vercel.app/exploit-coach-villain-v2-flow.html`
    - **依賴**：T-085 的 `exploit-coach-villain-v2` Edge Function 必須先部署到測試 Supabase（用戶手貼）
    - 走完 B → 任一 C 路徑（C1 / C2 / C3）→ D，所有 screen 都能渲染 + 切換流暢
    - 4 頁 C2 / 4 頁 C3 / 4 動作 tab D 都跑得通
    - 載入 4 個 baseline 模板按鈕都 work
    - 進 chat 真的 fetch Edge Function 拿到回覆 + 顯示
    - 「升級 AI 版」按鈕真的 fetch Edge Function（用特殊 prompt）拿到 4 句摘要 + 5 條策略 + 覆蓋 D 頁
    - localStorage 持久化驗證（reload villain 還在）
    - `npx tsc -b --noEmit` EXIT=0
  - **部署**：執行者寫完 push wip → 大腦 merge → Vercel dev 自動部署 HTML → 用戶內測（前提：T-085 Edge Function 已部署）
  - **工時估算**：12-18 hr（比純 mockup 多 6-8 hr，因為要接 Edge Function + AI 升級按鈕邏輯）
  - **相關 task**：T-085（既有 villain-v2-test.html 不動，先共存；新流程驗 OK 後可決定取代）

</details>

<!-- T-086 → In Review 2026-04-22（士林電腦執行者完成於 wip/T086-gtow-signing-flow；待用戶跑 test-gtow-flow.mjs E2E 驗證 + 設 Supabase Secret + 重部署 exploit-coach-gtow 到測試 Supabase） -->

<details>
<summary>📦 T-086 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-086** | Product 內測 / 工程 | **exploit-coach-gtow ECDSA P-256 signing + token refresh flow（救 T-082）** `(派工 2026-04-22 → 任一執行者，跟 T-085 並行)`
  - 建議 branch：`wip/T086-gtow-signing-flow`
  - **目的**：T-082 既有 Edge Function `exploit-coach-gtow/index.ts` 缺 ECDSA signing + token refresh flow，導致用 access token 打 spot-solution 時可能撞 GTOW 簽名驗證 → access token 過期沒法 refresh → 整個 GTOW 整合廢。本 task 補完這部分，讓 T-082 內測真的能跑起來
  - **必讀**：[[gtow-api-reverse-eng]]（執行者 + 大腦研究 ai-poker-wizard repo 後的完整理解）
  - **參考實作**：a00012025/ai-poker-wizard repo
    - `scripts/gto_signing.py` — ECDSA P-256 簽名邏輯（Python `cryptography` library）
    - `scripts/gto_token.py` — refresh token flow + token cache
    - `chrome-extension/background.js` — 抓 `localStorage.user_refresh`（我們可以複用既有 T-084 grabber）
  - **核心理解（不要再走錯路）**：
    - GTOW 用 ECDSA P-256 簽名，但**只有 token refresh endpoint 要簽名**，spot-solution 等 data endpoint 只要 Bearer + origin
    - 對方繞 non-extractable 私鑰的方法：**自己生 keypair**，第一次 refresh 時把 publicKey 註冊給 server，之後就用自己的 private key 簽
    - 對應到我們：Server-side 自生 keypair → 持久化在 Supabase（或 Secret）→ 每次 refresh 用同一把 keypair 簽
  - **scope（嚴格 fork 模式 — 改既有 T-082 fork 內，不再 fork）**：
    1. **Deno 版 `gto_signing.ts`**（新檔 `supabase/functions/exploit-coach-gtow/gto_signing.ts`，照抄 Python `gto_signing.py` 用 Web Crypto API）：
       - `generateKeypair()`: 用 `crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign'])` 生 keypair，`exportKey('jwk', ...)` 拿 JWK
       - `signRefreshRequest({ method, path, body, refreshToken, keypairJWK, origin, userAgent, appUid, buildVersion })`：
         - 構造 pipe-delimited payload（method|path|timestamp|body|origin|user-agent|app-uid|build-version，照對方順序）
         - 用 `crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, payload)` 簽 → 拿 raw 64 bytes (r||s)
         - 組 `google-anal-id` header（dot-separated: signature.publicKey.timestamp.version.headersBase64）
       - `_syncServerTime()`：lazy fetch GTOW server time 確保 timestamp 同步
       - 注意 Web Crypto API 的 ECDSA signature 默認 raw 格式（不是 DER），跟對方 Python `cryptography` 預設 DER 不一樣 — **需驗證簽名格式**（可能要轉換）
    2. **Refresh token flow**（`refreshAccessToken(refreshToken, keypairJWK)`）：
       - POST `/v1/token/refresh/` 帶 google-anal-id header + body `{ refresh: refreshToken }`
       - 解析 response 拿 `access_token` (短命 JWT)
       - decode JWT exp 算過期時間
    3. **Token cache（Supabase）**：
       - 新 migration `supabase/migrations/<date>_gtow_tokens.sql`：`gtow_tokens` 表 (id PK, refresh_token, access_token, access_token_exp, keypair_jwk, updated_at)
       - 簡化：MVP 只支援 1 row（singleton config，不做 multi-user）
       - 或退而求其次：keypair + refresh_token 放 Edge Function Secrets（`GTOW_REFRESH_TOKEN`、`GTOW_KEYPAIR_JWK`），access_token cache 放 in-memory（每次 cold start 重 refresh 一次，可接受）
    4. **整合進 `exploit-coach-gtow/index.ts`**：
       - `retrieveSolverNode` 之前加 `await ensureFreshAccessToken()`：
         - 從 cache 讀 access_token + exp
         - 如果過期（or < 5min remaining）→ 跑 refresh flow
         - 拿到 access_token 後，覆蓋現有 hardcoded `GTO_WIZARD_TOKEN` 用法
       - 原本 `GTO_WIZARD_TOKEN` secret **改名/廢除** → 改用 `GTOW_REFRESH_TOKEN` + `GTOW_KEYPAIR_JWK`
    5. **驗證**：
       - 寫 `scripts/dev-tools/test-gtow-flow.mjs`（Node script，import @supabase/supabase-js + Web Crypto polyfill）
       - 跑：本地驗 keypair 生成 → 簽 mock refresh request → POST GTOW server → 拿 access_token → 用 access_token 打 spot-solution → 確認 200 回 GTO 答案
       - 全 pass 才 push wip
  - **out of scope**：
    - ❌ 不做 multi-user 支援（singleton config，內測用）
    - ❌ 不做 token 失效自動通知（人工監控）
    - ❌ 不做 Chrome extension 自動更新 refresh_token（用戶手動更新 Secret 即可）
    - ❌ 不改原版 `exploit-coach`（純改 fork 內）
    - ❌ 不部署到正式 Supabase（永遠不要）
  - **完成條件**：
    - test script 端到端 pass：自生 keypair → refresh → spot-solution 200 → 拿到 GTO 答案
    - `exploit-coach-gtow` Edge Function 整合 fresh access token flow
    - tsc EXIT=0
    - 重新部署 `exploit-coach-gtow` 到測試 Supabase（用戶手貼） + 內測 URL 跑通
  - **工時估算**：12-22 hr（4-8 hr signing + 4-6 hr refresh flow + 2-4 hr 整合 + 2-4 hr test + debug）
  - **依賴**：
    - 用戶要先用 T-084 grabber 抓 `user_refresh`（執行者已驗 T-084 抓得到，這個是 valid refresh token）
    - 用戶設 Supabase Secret `GTOW_REFRESH_TOKEN`
  - **風險**：
    - GTOW 改簽名邏輯就壞 — 維護成本（若 GTOW 改架構，重新研究 ai-poker-wizard 看他們怎麼 patch）
    - Web Crypto API ECDSA raw format vs Python DER format 可能要轉換（如果 server 拒絕，先 debug 這個）
  - **執行者交付摘要**（2026-04-22 士林）：
    - 新 `supabase/functions/exploit-coach-gtow/gto_signing.ts`（Deno Web Crypto；generateKeypair / signRefreshRequest / refreshAccessToken / ensureFreshAccessToken + module-scope cache + server time sync + `GTOW_KEYPAIR_JWK` 持久化機制）
    - 改 `supabase/functions/exploit-coach-gtow/index.ts`：移除 `GTO_WIZARD_TOKEN`，改用 `GTOW_REFRESH_TOKEN`；`retrieveSolverNode` 前 `await ensureFreshAccessToken(...)` 拿 access token → 傳進 `callGTOWSpotSolution(params, accessToken)`
    - 新 `scripts/dev-tools/test-gtow-flow.mjs`（Node 18+，E2E 驗證：generateKeypair → refresh → spot-solution 200）+ README 段落 + `.gitignore` 加 `.gtow-refresh.local.txt`
    - **ECDSA raw format**：Web Crypto ECDSA sign 已輸出 raw r||s（跟 Python `_sign_raw_b64` 手動轉的同格式），**不需轉 DER**（已寫 comment 標註）
    - `npx tsc -b --noEmit` EXIT=0；main 專案無影響（Edge Function 不在 tsconfig include）
    - **未做**：Supabase `gtow_tokens` 表 migration（走 Secret-based MVP，cold start 重 refresh 一次，scope 允許）
    - **等用戶做**：① 從瀏覽器 `localStorage.user_refresh` 取 token；② 跑 test-gtow-flow.mjs 驗 E2E；③ 設 Supabase Secret `GTOW_REFRESH_TOKEN`（+ 可選 `GTOW_KEYPAIR_JWK`）；④ 手貼 Edge Function 到測試 Supabase Dashboard

</details>

<!-- T-083 → In Review 2026-04-22（家裡 wip1 執行者完成；wip/T083-villain-profile-v2-mvp；tsc EXIT=0；preview 端到端驗證 pass；⚠ 違反 fork 獨立原則改了原版正式入口檔，partial revert 後保留 lib，重派 T-085 做 fork 版） -->

<details>
<summary>📦 T-083 原任務描述（已 In Review，見下方）</summary>

- [ ] **T-083** | Product | **villain profile v2：21 range grid 系統 MVP（數字比例輸入 + design v2 補完）** `(派工 2026-04-22 → 家裡 wip1 執行者)`
  - 建議 branch：`wip/T083-villain-profile-v2-mvp`
  - **目的**：把現有「7 種抽象 villain type」升級成「21 個具體 range grid」（4 位置 group × 6 動作，前位砍 3 個邏輯不存在的）。先做最小 MVP 跑通端到端，後續 phase 再加問卷升級 / 13×13 grid 拉 UI / pokerdinosaur 16,750 baseline 升級
  - **必讀設計文件**：[[villain-profile-design]]（架構、schema、21 grid 定義、baseline 套用邏輯、LLM summarizer 全在這；v1 草案，需執行者邊做邊補完）
  - **scope（嚴格遵守 MVP，不擴張）**：
    1. **Design v2 補完**（implement 前先寫，產出進 wiki design doc 第 9 段所列）：
       - 21 grid 完整 % 選項清單（依 design 4.2 範例 + 對齊各位置合理區間）
       - 完整 169 hand index array（HAND_INDEX_ORDER）
       - baseline 套用函式偽碼 → 真實 implementation 細節
       - summarizer v1 完整規則（偏鬆/緊閾值、代表手抽取邏輯、輸出格式範本）
       - **9 個典型 villain template / 完整題目用語 / Edge case 處理 → 留 phase 2，MVP 不做**
    2. **Schema + localStorage**（key: `exploit-coach-villains-v2`）
       - `VillainProfile` interface 21 個 range（EP/MP/LP/BL × 6 動作，前位只 3 個）
       - 直接清光舊 v1 `exploit-coach-villains-v1`（用戶決議：不 migration）
    3. **數字比例輸入 UI**（前端 `public/exploit-coach-mockup-v3.html` 或新檔）
       - 21 個 grid 各一題選擇題，每題 6-8 個 % 離散選項
       - 流程：建立對手 → 答 21 題 → 命名 → 存
       - **不做 13×13 grid 拉 UI**（phase 2）
       - **不做問卷模式**（v1 7 題版可繼續用、或暫時 disable）
    4. **baseline 套用函式**
       - 從 `src/lib/gto/gtoData_cash_6max_100bb.ts` 26 個手寫 ranges 抽 baseline
       - `findBaselineRange(position, action, targetPct)` → 回傳 169-element grid (0/1)
       - 給定每個 grid 的 % → 套對應 baseline 填 hand
    5. **LLM summarizer v1**
       - `summarizeVillainProfile(profile, gtoBaseline)` → 21 行人話 summary
       - 每行格式：「位置 動作: X% (GTO Y%, 偏鬆/緊 Z%)」
       - **不做整體畫像段**（phase 2）
    6. **Edge Function 改造**（`supabase/functions/exploit-coach/index.ts`）
       - 接收新 field `ctx.villain_profile`（取代 `villain_type / villain_label`）
       - 用 summarizer 結果取代現有 VILLAIN_LABELS 段落
       - 保留 narrative mode 不動（沒 villain context）
    7. **整合到既有流程**
       - S1 對手卡片改顯示新版 v2 villain（名字 + 整體 stats summary）
       - 選對手 → 進 chat → 把 villain_profile 整包送 Edge Function
  - **out of scope（明確排除）**：
    - ❌ 13×13 hand grid 拉 UI（最複雜的 30+ hr，留 phase 2）
    - ❌ 問卷模式升級
    - ❌ pokerdinosaur 16,750 baseline 升級（先用手寫 26 個）
    - ❌ 9 個典型 villain template 預設庫
    - ❌ 跨裝置同步 Supabase
    - ❌ 對話中動態更新 villain
    - ❌ summarizer「整體玩家畫像」段
    - ❌ villain 編輯模式（先做新建，編輯 phase 2）
  - **完成條件**：
    - design doc v2 補完段落寫入 `memory/wiki/villain-profile-design.md`
    - 用「數字比例」建立 1 個對手 → 21 grid 全填好（檢查 localStorage）
    - 進 chat 問同一場景 → 對比「舊 villain_type='lag'」vs「新 villain_profile 21 range」回答差異
    - AI 回答中能看到「後位 35% open（偏緊 -14%）」這種具體 grounding
    - `npx tsc -b --noEmit` EXIT=0
    - 內測 URL：`https://poker-goal-dev.vercel.app/exploit-coach-mockup-v3.html`
  - **部署**：執行者寫完 → 大腦 produce Edge Function 整檔貼碼指令（用戶手貼測試 Supabase Dashboard）→ 內測驗證 → task 結案
  - **工時估算**：30-38 hr（4-5 工作天；含 design v2 補完 3.5-6 hr + MVP 26-32 hr）
  - **相關 task**：
    - T-082（exploit-coach GTOW 內測） — 已 merge，T-083 完成後的 villain_profile 也可以拿去 T-082 內測對比
    - 之前 villain 系統相關：T-070（v1 villain localStorage persist）/ T-073（laozhang → standard）

</details>

### 📦 T-083 完成摘要（2026-04-22 In Review）

**Branch**：`wip/T083-villain-profile-v2-mvp`（家裡 wip1 執行者）

**Commits**（5 個）：
1. `77e05c2` docs: villain profile v2 design lock (§11)
2. `0719afc` feat: villainProfile lib (types/ranges/storage/baseline/summarizer/builder)
3. `2dbb2a6` fix: baseline marker parser — handle 3b/4b/mr:N_3b/_4b
4. `1cf19e9` feat: v2 villain 21-range flow in exploit-coach mockup
5. `63de804` feat: exploit-coach Edge Function accept villain_profile_summary

**交付物**：
- `memory/wiki/villain-profile-design.md` §11 v2 MVP 鎖定規格（% 選項、hand index、baseline algo、summarizer rules、file map、legacy clean）
- `src/lib/villainProfile/` — TS lib（types / ranges / storage / baseline / summarizer / builder / index）
- `public/exploit-coach-villain-lib.js` — 同邏輯 vanilla JS port（mockup 用），含 12 baseline ranges DB subset
- `public/exploit-coach-mockup-v3.html` — sv2-intro / sv2-q（動態渲染 21 題）/ sv2-name 3 screens + startV2Flow 等函式
- `supabase/functions/exploit-coach/index.ts` — CoachContext 加 `villain_profile_summary` / `villain_name`，buildSystemPrompt 優先用 v2 summary

**完成條件檢查**：
- [x] design doc v2 補完（§11）
- [x] 數字比例建 1 個對手 → 21 grid 全填好（preview 驗證 LS_KEY_V2）
- [x] AI ctx 看得到「前位 open: 12%（GTO 22.5%, 緊 -10%, 少開 87s/86s/76s）」具體 grounding
- [x] `npx tsc -b --noEmit` EXIT=0
- [ ] 內測 URL：待用戶貼 Edge Function 到測試 Supabase + 確認 dev 部署

**未做（留給大腦 / 用戶）**：
- `src/lib/villainProfile/` TS lib 雖寫好但目前**只被 node sanity script 用到**，mockup 用 vanilla JS 副本。未來若 React app 要整合可直接 import。
- Edge Function **未部署**（需大腦 produce 貼碼指令給用戶手貼到測試 Supabase `btiqmckyjyswzrarmfxa`）
- **未動** `supabase/functions/exploit-coach-gtow/index.ts`（遵照用戶指示，T-082 內測版保持 baseline 對照）

**踩坑記錄**：
- 原 marker parser 只抓 `r` / `mr:N`，抓不到 `3b` / `4b` / `mr:N_3b` / `mr:N_4b` → MP_3BET 等 baseline 顯示 ~0.3% nonsense。改為 action-specific BaselineFilter union（open / call_vs_open / 3bet / call_vs_3bet / 4bet），每種 filter 有明確 marker 匹配規則。
- 原實作用 hand-class count / 169 算 %，但實際 GTO 語義是 combo weight %（pair=6, suited=4, offsuit=12，total 1326）。改成 combo-weighted 後數字合理（EP_RAISE baseline 從 34.3% 降到 22.5%）。

<!-- T-082 → ⚠ Blocked 2026-04-22（執行者反爬分析發現 GTOW 用 ECDSA P-256 簽名，但研究 ai-poker-wizard 完整 code 後確認可行：對方自生 keypair 註冊 server 繞過原本瀏覽器 keypair；只有 token refresh endpoint 要簽名，spot-solution 用 Bearer 即可；T-082 既有 Edge Function 缺 ECDSA signing + refresh flow → 派 T-086 補；詳見 [[gtow-api-reverse-eng]]）-->

<details>
<summary>📦 T-082 原任務描述（已 In Review，見下方）</summary>

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

</details>

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

- [?] **T-089** | Product 內測 / Bugfix | **villain-v2-test + gtow-test standalone auth patch（抄 T-088）**
  - branch: `wip/T089-standalone-auth-fix`（from `origin/dev@187e381`）
  - 機器：家裡 wip1 worktree
  - 改動：2 檔（純 auth patch 照抄 T-088）
    - `public/exploit-coach-gtow-test.html`
    - `public/exploit-coach-villain-v2-test.html`
  - **Patch 內容**（三段，對齊 T-088 在 villain-v2-flow.html 的實作）：
    1. 新 `IS_STANDALONE = (window === window.parent)` 全域旗標
    2. supabase client 初始化改 `persistSession: IS_STANDALONE, autoRefreshToken: IS_STANDALONE`（iframe 仍關掉避免跟 parent 搶 rotating refresh_token；standalone 開啟讓 SDK 自己管 session）
    3. 新 `getFreshAccessTokenStandalone()`：用 `supabaseClient.auth.getSession()` 讀 LS session（過期 30s 門檻），過期則 `refreshSession()`
    4. `getFreshAccessToken()` 頂部加 `if (IS_STANDALONE) return await getFreshAccessTokenStandalone();`，iframe 路徑原封不動
  - **fork 獨立驗證**：原版 `mockup-v3.html` 未動 / `villain-v2-flow.html` 未動（T-088 已修） / 任何 Edge Function / `villain-lib.js` / React app 全 0 modification ✓
  - **驗證**：
    - `npx tsc -b --noEmit` EXIT=0 ✓
    - `git status` 只顯示 2 個目標 HTML + task-board.md ✓
  - **大腦接手待做**：
    1. merge wip → dev → Vercel dev 自動部署
    2. 用戶驗收：主站登入後開兩個內測 URL 問教練，應拿到 AI 回覆（不再「需要先登入」）
       - `/exploit-coach-gtow-test.html` → T-082 內測通關
       - `/exploit-coach-villain-v2-test.html` → T-085 補完
    3. 不部署正式機
  - **已知限制**：三份 HTML 各持一份 auth patch 副本（scope 禁抽 lib）；未來可合併 `exploit-coach-standalone-auth.js` 共用 lib

- [?] **T-088** | Product 內測 / Polish + Bugfix | **villain-v2-flow polish + 登入 bug 修（5 issue 全包）**
  - branch: `wip/T088-villain-v2-flow-polish-bugfix`（from `origin/dev@717c4c1`）
  - 機器：家裡 wip1 worktree
  - 改動：**單檔** `public/exploit-coach-villain-v2-flow.html`（+144 / -34）；其他檔 0 改動 ✓
  - **5 個 issue 修法**：
    1. **C2 模板高亮**（Issue 1）：
       - `sfC2State` 加 `activeTemplate` 欄位；`loadTemplate(name)` 設 activeTemplate；`sfC2Pick` 手動改 % 後用 `matchesTemplate()` 檢查 — 不再對齊模板 → 清 activeTemplate
       - 新 `renderTemplateToolbar(targetId, onclickBuilder, activeName)` 共用 helper：active 按鈕綠底白字 + ✓ 前綴
       - C2 HTML 區塊的 hardcode toolbar 改為 `<div id="sf-c2-tmpl-bar">`，renderC2 每次重繪
    2. **C3 模板擴充 + 改名**（Issue 2）：
       - 原「載入 baseline」按鈕去除，新增 `<div id="sf-c3-tmpl-bar">` 渲染同一 `renderTemplateToolbar`
       - toolbar prefix 文字：**「載入指定範圍：」**（含 GTO / LAG 鬆凶 / TAG 緊凶 / Nit 超緊 4 按鈕）
       - 新 `sfC3LoadTemplate(name)`：該位置 6 動作 grid 全部用 `findBaselineRange(rk, TEMPLATES[name]()[rk])` 套上；設 `activeTemplates[pos]` 高亮
       - reuse T-087 的 TEMPLATES 函式（villain-lib.js 沒有這 4 個，是 flow 頁自己的；scope 說「T-083 留下」應是口誤）
    3. **C3 動作互斥**（Issue 3）：
       - 新 `MUTEX_PAIRS` 常數：`CALL↔3BET` / `CALL_3BET↔4BET`（RAISE / CALL_4BET 無 peer）
       - 新 `mutexSiblingKey(pos, act)`：查該位置是否有 peer grid，存在則回 sibling rangeKey
       - `renderC3` 每格渲染時：若 sibling grid 該格=1 且 current grid 該格=0 → 加 `.blocked` class + `title` tooltip「已在 XX 選擇，點此切換到 YY」
       - CSS `.hand-cell.blocked` 深灰 + `::after` 顯示 ✕ 角標（pair / suited / offsuit 變體各自對應）
       - `sfC3Paint` 互斥切換邏輯：start/drag 遇到 sibling=1 且 curr=0 → 從 sibling 移除 + 加入 current；互斥切換後 `sfC3PaintVal=1`（避免拖拉把剛切過來的再抹掉）
       - 跨位置不互斥（`mutexSiblingKey` 只查同 pos）
    4. **命名頁顏色 bug**（Issue 4）：
       - `sfPickColor(c)` 在切換色 + renderNameScreen 之前，先讀 input.value 捕捉進 `sfNamePending.name`，避免 re-render 時用舊空值覆寫 input
    5. **登入 bug**（Issue 5，核心根因）：
       - **根因**：flow 頁是 **standalone HTML**（直接開 dev URL，非 React app iframe），但既有 auth flow 只有 iframe 路徑：`readTokenFromStorage()` 要能讀到 parent 寫入的 LS token，`askParentRefresh()` 需要 `window.parent` 存在。standalone 時 `window === window.parent` → askParentRefresh 直接 resolve null → fetch 沒 token → UI 顯示「需要先登入」
       - **修法**：
         - 新 `IS_STANDALONE = (window === window.parent)` 全域旗標
         - supabase client 初始化時 standalone 模式改開 `persistSession: true, autoRefreshToken: true`（iframe 仍關掉，避免跟 parent 搶 rotating refresh_token）
         - 新 `getFreshAccessTokenStandalone()`：用 `supabase.auth.getSession()` 讀 session（SDK 自動 + 同 LS key 同 project，共享 parent 主站登入寫入的 token）；過期時 `supabase.auth.refreshSession()`
         - `getFreshAccessToken()` 頂部加 `if (IS_STANDALONE) return await getFreshAccessTokenStandalone();`，iframe 路徑保持原樣
       - **使用流程**：
         1. 用戶先在主站 `poker-goal-dev.vercel.app/` 登入（寫入 `sb-<ref>-auth-token` 到 localStorage）
         2. 開 `/exploit-coach-villain-v2-flow.html` 內測 URL（同 domain，LS 共享）
         3. standalone supabase client `getSession()` 讀到 token → AI / chat 正常
       - **對照 T-085 villain-v2-test.html**：同樣 bug（未改），但用戶實際多用 test 頁是從 React app iframe 進 → 沒暴露；flow 頁多半直接開 URL 才踩到
  - **驗證**：
    - `npx tsc -b --noEmit` EXIT=0 ✓
    - `git status` 只顯示 `public/exploit-coach-villain-v2-flow.html` + `memory/wiki/task-board.md` ✓
  - **Fork 獨立驗證**：原版 `mockup-v3.html` / `villain-v2-test.html` / 任何 Edge Function / `villain-lib.js` / React app 全 0 modification ✓
  - **大腦接手待做**：
    1. merge wip → dev → Vercel dev 自動部署
    2. 用戶驗收 5 點：
       - C2 切換 GTO/LAG/TAG/Nit 看到按鈕高亮 ✓
       - C2 手動改 % 後高亮消失 ✓
       - C3 同樣 4 個模板按鈕 + 「載入指定範圍」label
       - C3 切 4BET，該位置 CALL_3BET 已選的 hand 變灰 + ✕ 角標；點灰格 → 從 CALL_3BET 移除、4BET 加
       - 命名頁打字 → 選顏色 → 暱稱字串保留
       - 登入後開內測 URL → 點「請教練分析」→ 拿到 AI 回覆，不再「需要先登入」
    3. 若 villain-v2-test 也要同樣修登入 bug → 可另開 follow-up
  - **已知限制**：
    - matchesTemplate 用 `===` 嚴格比 21 key；若模板函式產出有浮點誤差會 false-negative（目前全 integer ok）
    - standalone 模式 supabase SDK `persistSession: true` 會寫入 LS；若同一 browser 之前用 iframe 模式寫入，LS 值格式可能微有差異（modern v2 SDK 向下兼容，實測無 issue）
    - mutex 遇到 `editProfileFromD` 後 `sfC3State.activeTemplates = {}` 所有位置都沒 active template → user 點載入會重設整個 6 動作 grid（含 user 編輯的 → 破壞），這是預期行為（用戶明確按「載入」才會發生）

- [?] **T-087** | Product 內測 | **villain v2 新流程 production 版（B/C1/C2/C3/D fork 版）**
  - branch: `wip/T087-villain-v2-flow`（from `origin/dev@f221115`）
  - 機器：家裡 wip1 worktree
  - 改動（**1 新檔，0 改原檔**，嚴格 fork 獨立）：
    - 新 `public/exploit-coach-villain-v2-flow.html`（fork 自 `exploit-coach-villain-v2-test.html`）
    - 單檔 ~2800 行，內含完整 B/C1/C2/C3/命名/D 六個 screen 的 HTML + JS flow
  - **fork 獨立驗證**：`git status` 只顯示單一新檔；原版 `mockup-v3.html` / `villain-v2-test.html` / `exploit-coach*` Edge Functions / `exploit-coach-villain-lib.js` / `src/lib/villainProfile/` 全 0 modification
  - **畫面/功能實作**：
    - **B 選擇頁** `#sf-b`：3 個 flow-card（快速問答 / 設定比例 / 詳細範圍），icon + 說明 + 預估時間
    - **C1 快速問答** `#sf-c1`：7 題 hardcode quiz（依 design doc §3.2 骨架：前位 open / 中位 open / 後位 open / SB open / 3-bet 頻率 / face 3-bet / face 4-bet），每題 3-4 個語義化選項；progress bar + 上一題/下一題；`sfC1Next()` 收斂成 21 個 percentChoices（snapToOption 對齊 PERCENT_OPTIONS），CALL 三 key 用 q3 後位 open 寬度 `deriveCallFromC1` 推導
    - **C2 設定比例** `#sf-c2`：4 頁（EP 3 row / MP/LP/BL 6 row），每 row 顯示動作名 + GTO baseline + 偏離度 badge（標準/鬆/緊）+ 6 個 % chip 選項（PERCENT_OPTIONS）；頂部「載入模板」4 按鈕（GTO/LAG/TAG/Nit）
    - **C3 詳細範圍** `#sf-c3`：4 頁 × 6 動作 tab × 13×13 hand grid；初始預填 baseline；點擊 toggle 0/1；按住拖拉批次（onmousedown + onmouseenter）；右上角即時顯示當前 % + 偏離度；「載入 baseline」/「清空」按鈕
    - **命名 screen** `#sf-name`：名稱輸入 + 顏色選擇（8 色）+ summary 預覽（即時呼叫 `VP.summarizeVillainProfile`）
    - **D 用戶檔案頁** `#sf-d`：header + 風格摘要（`computeStyleSummary` 靜態規則：LAG / Nit / TAG / 被動 / 標準）+ 21 range 4×6 table（鬆/緊著色）+ 動作 tab 切換 4 位置 mini grid + AI 剝削策略（`computeStaticStrategy` 靜態 5 條 or AI 覆蓋）+ 「升級 AI 版（免費）」/「編輯範圍」/「開始分析」按鈕
  - **AI 升級按鈕**（task 核心要求）：`upgradeAIStrategy()` 呼叫 `exploit-coach-villain-v2` Edge Function，messages[0] 為「給 4 句風格摘要 + 5 條深度剝削策略」prompt，context 帶 `villain_profile_summary` + `villain_name` + `_t087_ai_upgrade: true` flag；回覆用 `**深度剝削策略**` 標題切兩段塞 aiSummary/aiStrategy；updateFlowVillain 覆蓋持久化
  - **編輯流程**：D「編輯範圍」塞現 grids 進 sfC3State → 進 C3；`sfC3Next` wrap（sfEditMode flag），編輯完 Last Next 覆蓋 working profile + 回 D（aiSummary/aiStrategy 設 null 強制重新升級）
  - **storage**：
    - `LS_VILLAINS_KEY = 'exploit-coach-villain-v2-flow-villains'`（自前 `loadFlowVillains` / `saveFlowVillains` / `appendFlowVillain` / `updateFlowVillain`，不用 lib 的 `LS_KEY_V2`，與 T-085 LS 完全隔離）
    - `LS_CONVO_KEY = 'exploit-coach-villain-v2-flow-conversations'`
  - **共用 lib（不改）**：`VP.RANGE_KEYS` / `VP.PERCENT_OPTIONS` / `VP.POSITION_LABEL` / `VP.ACTION_LABEL` / `VP.findBaselineRange` / `VP.baselinePctFor` / `VP.buildVillainProfile` / `VP.summarizeVillainProfile` / `VP.clearLegacyV1`
  - **chat flow**：D「開始分析」→ `enterChatFromD()` 設 `sv2CurrentProfile = working`（buildCoachContext 會送 `villain_profile_summary` + `villain_name` 給 Edge Function）→ go('s2')
  - 驗證：`npx tsc -b --noEmit` EXIT=0 ✓
  - **大腦接手待做**：
    1. merge wip → dev → Vercel dev 自動部署 HTML
    2. **依賴**：`exploit-coach-villain-v2` Edge Function（T-085）必須已部署到測試 Supabase（用戶應已貼完）— 若尚未貼，本頁所有 chat + AI 升級都會 401/404
    3. 用戶內測 URL: `https://poker-goal-dev.vercel.app/exploit-coach-villain-v2-flow.html`
    4. 驗收條件：B→C1/C2/C3 三路徑都跑通 / 4 模板按鈕 OK / 命名 save / D 風格摘要 + 4×6 表 + mini grid tab / AI 升級按鈕真 fetch / 編輯範圍 → 回 D 更新 / reload villain 還在 / 原版 mockup-v3.html / villain-v2-test.html 都沒變化
    5. **不部署到正式 Supabase**
  - **已知限制 / 設計決策**：
    - C3 touch drag 只支援 tap（沒做 touchmove + elementFromPoint），桌面 mouse drag 完整支援
    - LAG / TAG / Nit 模板用簡單偏移規則產生（非真實 villain 統計），dev 用 good-enough
    - AI prompt 切 parser 用 `**深度剝削策略**` 標題；若 LLM 不照格式，會全塞 aiSummary、aiStrategy 空
    - 編輯範圍後 aiSummary/aiStrategy 設 null 強制重新升級，避免 stale
    - MVP 免費（代碼註解標 `TODO: production 上線時改 5 點，需 service role key 過 RLS spend_points`）

- [?] **T-085** | Product 內測 | **villain profile v2 fork 版（獨立 mockup + Edge Function）**
  - branch: `wip/T085-villain-v2-fork`（from `origin/dev@80a13ce`）
  - 機器：家裡 wip1 worktree
  - 改動（2 新檔，**0 改原檔**，嚴格遵守 fork 獨立原則）：
    - 新 `supabase/functions/exploit-coach-villain-v2/index.ts`（fork 自 exploit-coach；18 行 T-083 diff 照抄：CoachContext 加 `villain_profile_summary` + `villain_name`，buildSystemPrompt 優先 v2 summary else fallback v1 `villain_type`，log context 加 `_backend: 'villain-v2'`）
    - 新 `public/exploit-coach-villain-v2-test.html`（fork 自 mockup-v3；照抄 T-083 所有 UI diff + 內測橫幅 + namespace 改動）
  - **Fork 獨立驗證**：`git status` 確認 `supabase/functions/exploit-coach/index.ts` + `public/exploit-coach-mockup-v3.html` 完全沒動（兩檔均非 modified）
  - **HTML fork 細節**（13 diff 塊）：
    - title：「剝削教練 v3 — Mockup」→「剝削教練 — villain v2 內測版」
    - 引入 `<script src="./exploit-coach-villain-lib.js"></script>`
    - `<body>` 後加紫色內測橫幅「⚠ 內測版（villain v2 21 range）」
    - S1 老張 hardcoded card → 空 placeholder（`#opp-empty`）
    - S1「+ 建立新對手」按鈕 `newOpp()` → `startV2Flow()`
    - 插入 3 個 screen：`sv2-intro` / `sv2-q`（21 題進度）/ `sv2-name`（命名 + 顏色 + summary preview）
    - `LS_VILLAINS_KEY` → `exploit-coach-villain-v2-villains`
    - `LS_CONVO_KEY` → `exploit-coach-villain-v2-conversations`
    - fetch endpoint `/exploit-coach` → `/exploit-coach-villain-v2`
    - `buildCoachContext` 優先 `sv2CurrentProfile` 送 `villain_profile_summary` + `villain_name`，legacy v1 fallback 保留
    - 加 `sv2*` 流程函式（state / begin / render / pick / back / next / name / color / save / select / renderV2Villains）
    - init 區 `renderSavedVillains()` → `VP.clearLegacyV1()` + `renderV2Villains()`
  - **共用 lib**：`src/lib/villainProfile/` + `public/exploit-coach-villain-lib.js` reuse，**lib code 完全不動**
  - 驗證：`npx tsc -b --noEmit` EXIT=0 ✓
  - **已知 LS 微妙點（記錄，非 bug）**：lib 內部 `LS_KEY_V2 = 'exploit-coach-villains-v2'` 沒改（scope 禁改 lib）。當前沒有其他頁使用 VP lib（T-083 revert 後原版不引入），fork 獨佔。未來若原版引入 VP lib，與 fork 會共用此 LS key — 屆時大腦決定策略。
  - **大腦接手待做**：
    1. 產 Edge Function 整檔貼碼指令 → 用戶手貼測試 Supabase Dashboard Create new `exploit-coach-villain-v2` → Deploy（Secrets 照抄 `ANTHROPIC_API_KEY`，無新增）
    2. Vercel dev 自動部署 HTML → 內測 URL: `https://poker-goal-dev.vercel.app/exploit-coach-villain-v2-test.html`
    3. 驗：走完 21 題 → save → chat 看到「後位 35% open（偏緊 -14%）」grounding
    4. 回驗原版 `/exploit-coach-mockup-v3.html` 仍是老張 + 舊 quiz（T-083 partial revert 還原的狀態，fork 無污染）
    5. **不部署到正式 Supabase**

- [?] **T-082** | Product 內測 | **exploit-coach 內測版：retrieval 換 GTO Wizard API**
  - branch: `wip/T082-exploit-coach-gtow-test`（from `origin/dev@f958aab`）
  - 機器：家裡 wip1 worktree
  - 改動（2 新檔，0 改原檔）：
    - 新 `supabase/functions/exploit-coach-gtow/index.ts`（fork 自 exploit-coach；只換 `retrieveSolverNode` 為 GTOW API call；保留 prompt / TERMINOLOGY_RULES / Claude / auth / log 原封不動）
    - 新 `public/exploit-coach-gtow-test.html`（fork 自 mockup-v3；5 處 diff：title、內測橫幅、LS_VILLAINS_KEY namespace、LS_CONVO_KEY namespace、fetch endpoint `/exploit-coach` → `/exploit-coach-gtow`）
  - **GTOW 整合細節**（參考 ai-poker-wizard `scripts/gto_api.py`）：
    - Endpoint: `GET https://api.gtowizard.com/v4/solutions/spot-solution/`
    - Auth: `Authorization: Bearer <GTO_WIZARD_TOKEN>` + `origin: https://app.gtowizard.com`
    - Params: `gametype` / `depth` / `stacks` / `preflop_actions` / `board` / `flop_actions`
    - Slug → gametype: `6max_100bb_*` → `Cash6mGeneral_6mNL100R2`; `mtt_*` / `9max_*` / `hu_*` → `MTTGeneral`
    - Depth: nearest from GTOW available list + `.125` (MTT) / `.0` (cash)
    - Preflop 合成：依 scenario_slug 的 `<opener>_open_<caller>_call` 或 `<opener>_open_<3bettor>_3b` 展開 `F-F-F-F-R2.5-F-C` 序列
    - Path → flop_actions: `CHECK`→`X` / `CALL`→`C` / `FOLD`→`F` / `BET_<n>`→`B<n>` / `ALLIN`→`RAI`
    - 204/403 → 視為 miss → `nodeSummary=null` → Claude 自己答（不崩）
    - console.log GTOW raw response (truncated 3000 chars) 供 debug
  - **不寫 DB / 不 cache GTOW 回傳**（ToS 保護）；`coach_queries` log 保留，context 內加 `_backend: 'gtow'` 標記
  - 驗證：`npx tsc -b --noEmit` EXIT=0 ✓
  - **大腦接手待做**：
    1. 設測試 Supabase Secret `GTO_WIZARD_TOKEN`（用戶操作，token 不貼對話）
    2. 產 Edge Function 整檔貼碼指令 → 用戶手貼測試 Supabase Dashboard → Functions → `exploit-coach-gtow` (Create new) → Deploy
    3. Vercel dev 會自動部署新 HTML（`public/` 靜態檔）→ 內測 URL: `https://poker-goal-dev.vercel.app/exploit-coach-gtow-test.html`
    4. 驗：用戶問 5 題同 A/B，肉眼比回答差異
    5. **不部署到正式 Supabase**
  - **已知限制（v1 預期）**：
    - Preflop raise size 用標準值（MTT R2.2 / Cash R2.5 / 3bet R6.5/R8.0）；若 GTOW 期待別的 size 可能 204 — v2 可加 `next_actions` probe 找最近 legal
    - Postflop combo-level signature hands 沒做（1326-array index 較複雜；範圍平均頻率仍正確）
    - Preflop 169-array hand order 用標準 pair-first → suited → offsuit（若 GTOW 用不同 order，key-hand 對應會錯，但 aggregate freq 不受影響）
    - HU slug 用 9-max positions 近似；`hu_*_3bp/4bp` 先用保守預設 size

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
