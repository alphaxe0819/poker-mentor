# Dev Log — 操作記錄

> 每次 commit 自動更新，記錄做了什麼。跟著 Git 同步到所有電腦。
> 最新的記錄在最上面。

---

## 2026-04-21 [flow] T-011 整合完成：C3 E2E 小樣本
- 執行者：Sandbox session（`wip/T011-c3-e2e` @ `f861b6a` / `50d85fb`，base 4d6a0e2）
- 大腦：這台主目錄
- merge clean（純 .mjs 改動，tsc 不在範圍）
- 改動（17 檔 / +474 / -4）：
  - `scripts/gto-pipeline/scenarios.mjs`：MTT override `mtt_40bb_srp_btn_open_bb_call`
  - `scripts/gto-pipeline/convert-to-db.mjs`：擴吃 `ALL_FORMATS`
  - `scripts/gto-pipeline/test-retrieval.mjs`：加 MTT tier A 測試
  - 13 個 `mtt_40bb_srp_btn_open_bb_call_*.txt` inputs
- 實跑驗證（E2E 全通）：
  - ✅ Solver fast 16:28，exploitability 3.22%
  - ✅ DB upsert：`mtt_40bb_srp_btn_open_bb_call + As7d2c` → `solver_postflop_6max`（82 MB → 31.5 KB tree）
  - ✅ Tier A retrieval 命中（BB CHECK 79.7% / BET 50% pot 20.3%）
- 骨架決策（大腦 review）：
  - 暫借 `solver_postflop_6max`（T-012 migration 時用 `WHERE scenario_slug LIKE 'mtt_%'` 搬）
  - range 用 HU_40BB_RANGES 近似（非真實 MTT range，pd→range converter 另開 task）
- 踩坑：執行者 feat commit 先誤落 `wip/T056-skipexisting-dual-naming`（wip1 worktree 被 T-056 完成後沒切 detached，T-011 執行者接手時 HEAD 還在 wip/T056），跑 solver 16:28 期間沒察覺，事後 cherry-pick 救回 wip/T011
  - 啟示：**執行者開工前必做 `git worktree list` 確認 HEAD**
  - 可考慮寫進 wiki 或 session-start-reminder（未來 task T-062 / T-063）
- 純 flow 改動（scripts/ 不影響 Vercel build），無 version bump
- wip/T011 待刪

## 2026-04-21 [flow] T-056 整合完成：batch-run.ps1 雙命名 skip
- 執行者：Sandbox session（`wip/T056-skipexisting-dual-naming` @ `01421bb` / `28b9d75`）
- 大腦：這台主目錄
- merge clean
- 改動：單檔 `scripts/gto-pipeline/batch-run.ps1` 第 127-139 行（+8/-3）
  - `-SkipExisting` else branch 同時 Test-Path 新命名 `gtoData_<base>.ts` + 舊 `gtoData_<prefix>_flop_<slug>.ts`
  - skip 訊息附 matched filename（除錯友好）
- 驗證雙層：
  - ✅ 執行者 fixture 4-case（舊存新無 / 新舊都有 / 新存舊無 / 皆無）全通過
  - ✅ 大腦補跑 real batch dry-run：HU 25bb SRP 前 7 個 SKIP 都正確印 matched filename
- 防範目標達成：T-020 churn（SkipExisting 對舊命名誤判）從此不會再發生
- ⚠ 副產物發現：HU 25bb SRP 30 個 input 中 9 個**無對應 .ts**（pipeline state gap），非 T-056 scope，若將來需要可開 T-061 補齊
- 純 flow 改動（scripts/，不影響 Vercel build），無 version bump
- wip/T056 待刪

## 2026-04-20 [flow] T-060 完成：T-058 Edge Function 實機部署 + 3 條驗收全 pass ✅
- 用戶照 `docs/supabase-migrations/20260420-T058-zh-tw-terminology-deploy.md` 部署到測試 Supabase
- 3 條實機驗收結果：
  - ✅ 壓制（QQ vs AK）— AI 回「壓制」不是「過度」
  - ✅ bluff catcher — AI 回「抓詐唬牌」或保留英文，不是「詐唬捕手」
  - ✅ 大陸用語 — 翻後場景無「蝨子」「踢子」等
- 影響：繁中 poker 術語 grounding 正式上線測試 Supabase
- T-058 升級：從「code merged」→「真正 Done（含部署 + 驗收）」
- 純 flow 改動（doc 已先 merge），無 version bump
- 整條鏈路：T-055 場景 grounding → T-058 術語 grounding → T-059 deploy guide → T-060 實機驗收，全部完成

## 2026-04-20 [flow] T-059 整合完成：T-058 deploy guide
- 執行者：Sandbox session（`wip/T059-T058-deploy-guide` @ `716b802` / `e7501b5`）
- 大腦：這台主目錄
- merge clean，tsc EXIT=0
- 產出：`docs/supabase-migrations/20260420-T058-zh-tw-terminology-deploy.md`
  - 42 行，含：前置 / 部署步驟 7 步 / 3 條實機驗收 / 失敗回報格式 / 全 pass 後動作
- 純 doc 改動，不 bump version
- 拆分 follow-up：T-060（用戶實機部署 + 3 條驗收）進 Queue
  - T-059（guide 產出）與 T-060（實機驗收）分開，避免 task-board 狀態混亂
- wip/T059 待刪

## 2026-04-20 [flow] T-057 整合完成：gto-pipeline-conventions wiki
- 執行者：Sandbox session（`wip/T057-gto-pipeline-conventions` @ `6d944fc` / `75ecb05`）
- 大腦：這台主目錄 session
- merge commit `XXXXXXX` — no conflict
- 產出：
  - `memory/wiki/gto-pipeline-conventions.md`（42 行）：檔名規範 `gtoData_<gameType>_<stack>_<pottype>_<slug>.ts`（無 `flop_` 前綴）+ Export 名 `<GAMETYPE>_<STACK>_<POTTYPE>_<SLUG>`（無 `FLOP_` 中綴）+ T-021/T-023 遺留清單
  - `memory/index.md` Development 區加 `[[gto-pipeline-conventions]]` 連結
- 驗證：tsc EXIT=0
- 純 flow 改動（memory/wiki + memory/index.md），**不 bump version**（符合新規則）
- wip/T057 待刪
- 副產物（為本次整合發現）：session-start-reminder.sh 加 Sandbox 偵測 → `245fd5b`，未來 sandbox 新對話自動看到 bootstrap 指引

## 2026-04-20 [flow] task-board 清理：T-058 移 Done + 開 T-059 follow-up
- 身邊大腦 merge T-058 到 dev.37 但 task-board 忘了移 Done
- 這台大腦接手清理：
  - task-board T-058 In Review → Done（附 Edge Function 未部署註記）
  - 新 T-059 進 Queue：Edge Function 部署 + 實機驗收（3 條：壓制 / 抓詐唬牌 / 不用大陸用語）
- `origin/wip/T020-hu40bb-srp-fill` 也是殘留 cache，`git fetch --prune` 清掉
- 純 flow 改動，不 bump version

## 2026-04-20 v0.8.1-dev.37 [dev]
- T-058 正式整合（wip/T058-zh-tw-terminology → dev）
- 改動：單檔 `supabase/functions/exploit-coach/index.ts:170-204`（+31/-1）
- 內容：`buildSystemPrompt` 接在 T-055 grounding 之後新增「繁中 poker 術語校準」段
  - 5 LLM 高風險詞 ❌ 黑名單：dominate / cooler / bluff catcher / polarized / merged
  - 21 保留英文清單：c-bet / 3-bet / 4-bet / GTO / MDF / ICM / SRP / 位置縮寫 / TAG / LAG / nit / maniac 等
  - 12 推薦譯法：bluff / equity / pot odds / implied odds / fold equity / blocker / squeeze / donk / float / set / trips / calling station
  - 3 使用規則：保留英文 / 表外英文+解釋 / 避免大陸用語
- Prompt 增加 ~700 token（派單預估 500-800 範圍內）
- 驗證：tsc EXIT=0
- ⚠ Edge Function 部署需用戶手動貼整檔到測試 Supabase (btiqmckyjyswzrarmfxa)
- 實機驗收 3 條：(1) QQ vs AK/AA/KK 用「壓制」非「過度」；(2) bluff catcher 用「抓詐唬牌」非「詐唬捕手」；(3) 不蹦大陸用語
- 產品改動（supabase/）→ 測試機 curl 驗證 Vite build（Edge Function 不影響 Vite，走過場）
- wip/T058-zh-tw-terminology 待刪

## 2026-04-20 [flow] T-058 前置：繁中 poker 術語 wiki 完成
- T-055 實機驗證 OK 但 Claude Haiku 把 `dominate` 翻「過度」(不通)、其他 LLM 高風險詞也易直翻
- 大腦派 research agent 收集 70+ 詞繁中術語表（交叉比對 8 個台灣撲克站：Taiwan Rounders / pokerdomain / sixpoker666 / Andy Poker / Monsterstack）
- 新 wiki `memory/wiki/poker-terminology-zh-tw.md`：完整術語表 + 使用規則 + LLM 高風險詞標粗體（dominate / cooler / bluff catcher / polarized / merged）
- `memory/index.md` 加連結
- T-058 進 Queue 派執行者：把 wiki 精華塞 exploit-coach `buildSystemPrompt`
- 純 flow 改動，不 bump version

## 2026-04-20 v0.8.1-dev.36 [dev]
- T-020 正式整合（wip/T020-hu40bb-srp-fill → dev）
- 執行者：另一台電腦（Stage 1 `6119d74` + Stage 2 `9545e7c` + In Review `5e3c7ee`）
- 大腦：review + merge（這台 `-brain` worktree）
- 產出（25 files, +1718/-348）：
  - HU 40bb SRP 補齊到 21 flops = 13 base + 8 extras（peer parity HU 25bb）
  - 8 新 extras `gtoData_hu_40bb_srp_{5s5c5d/6d5h4c/8s5h2c/8s7s5d/9s7s3s/Ah2d2c/Ah5c2d/Ah8h3c}.ts`
  - 10 base 從 `_flop_<slug>` rename 為 `_<slug>`（去 FLOP_ 中綴）
  - 3 base（7s7d2h/9d5c2h/9h8d7c）solver 新版覆蓋（104→151 行）
  - `gtoData_hu_postflop_index.ts` map 13→21 entries
  - `scripts/gto-pipeline/boards.mjs` 加 `BOARDS_HU_EXTRAS` + `BOARDS_HU`
  - `scripts/gto-pipeline/generate-input-v2.mjs` 加 `--boards hu` 支援
- 驗證：tsc EXIT=0
- **踩坑（執行者抓到）**：`batch-run.ps1 -SkipExisting` 只 check 新命名，舊命名會誤判「未產」→ 全部 base 意外重跑，差點燒 3 hr。執行者及時 kill
- 衍生 task：
  - **T-056**（Pipeline）：batch-run.ps1 -SkipExisting 改雙命名偵測（15 min，防再踩）
  - **T-057**（大腦）：wiki gto-pipeline-conventions.md 明文命名規範
  - T-021 / T-023 做 HU 3bp / 深度擴充時順便 rename HU 25bb/13bb SRP 舊 `_flop_` 命名
- 執行者原建議 T-044 / T-045 編號與今日已用的衝突（T-044=migration plpgsql、T-045=真跑 batch），大腦改為 T-056 / T-057
- 產品改動（src/lib/gto/ TypeScript data）→ 測試機 curl 驗證 Vite build
- wip/T020-hu40bb-srp-fill 待刪

## 2026-04-20 v0.8.1-dev.35 [dev]
- T-055 正式整合（wip/T055-coach-context-continuity → dev）
- 改動：單檔 `supabase/functions/exploit-coach/index.ts:159-200`（+10/-4 行）
- `buildSystemPrompt` base prompt 加「本輪場景 grounding」段：flop/對手/位置整輪沿用、假設手牌以假設為準但場景不變、每次必提場景、不公式化
- `villain_type` / `hero_hand` / `hero_pos` 段加「【本輪場景】/【本輪實際手牌】/本輪實況不變」前綴
- 驗證：tsc EXIT=0
- ⚠ Edge Function 改動 Vercel build 不自動部署 — 要用戶手動貼整檔到測試 Supabase (btiqmckyjyswzrarmfxa) Dashboard Edge Functions → exploit-coach → Via Editor（大腦產貼碼指令給用戶）
- 實機驗收待：用戶追問「如果拿 QQ 呢」→ AI 會明確提及本輪場景（flop/對手類型/位置）+ 結合 QQ 玩法，不只講翻前範圍
- 若修法 A 還不夠，執行者建議疊 B（前端 callCoach 強制注入場景提醒到 userMsg）→ 開 T-056
- 產品改動（supabase/）→ 跑測試機 curl 驗證 Vite build（Edge Function 不影響 Vite，但走規則）
- wip/T055-coach-context-continuity 待刪

## 2026-04-20 [flow] T-055 新 bug：連續對話沒帶本輪 context
- 實機測試 T-054 成功後發現：用戶追問「如果拿 QQ 呢」→ AI 回覆看起來公式化、沒結合本輪的牌面/對手 context
- 疑似 `public/exploit-coach-mockup-v3.html` 的 `callCoach` 後續對話只送 chatHistory 沒帶場景 context，或 buildCoachContext() 第二輪 state 變了
- 進 task-board Queue 派執行者深查

## 2026-04-20 [flow] T-054 wiki 記錄 + 401/AI bug 完修
- exploit-coach 「登入已過期」+「抱歉，暫時無法回答」雙 bug 完全修好 ✅
- **根因 1（平台級 gap）**：測試 Supabase project `btiqmckyjyswzrarmfxa` 啟用 Asymmetric JWT Keys (ES256)，但 `supabase-edge-runtime-1.73.8` gateway 只支援 HS256 → user token 直接被擋，function code 根本沒跑
- **修法 1**：測試 project 每個需 auth 的 Edge Function（ai-coach / analyze-weakness / exploit-coach / redeem-promo）關 **Verify JWT** — function 自己用 `supabase.auth.getUser()` 打 Auth API 驗
- **根因 2**：新建測試 Supabase 的 Secrets 只有內建 4 把，`ANTHROPIC_API_KEY` 沒帶過來 → Claude fetch 401 → 兜底文字「抱歉，暫時無法回答」
- **修法 2**：Secrets 頁加 `ANTHROPIC_API_KEY`
- 完整 wiki：`memory/wiki/supabase-edge-function-gotchas.md`（3 個坑 + 診斷捷徑 + 新 project secret checklist）
- index.md 加連結
- 副產物 TODO：Edge Function code 應加 `response.ok` check + log Claude error body（記在 wiki 坑 3）
- 併收 T-052（Vercel env 核對 RC1 由 T-053 parent-env log 自動排除）
- 純 flow 改動，不 bump version
- 正式 Supabase `qaiwsocjwkjrmyzawabt` 若也啟用 ES256 會同樣壞，待用戶授權

## 2026-04-20 v0.8.1-dev.34 [dev]
- T-053 完成（大腦單機快修）：自動化診斷 log，避開用戶需手動跑 console 命令/無 Mac Web Inspector 的限制
- 用戶首次實機 log 已拿到：tokenHead `eyJhbGciOiJFUzI1NiIs`（ES256 asymmetric JWT）、supabaseUrl 測試 project、origin match，但 `[parent-refresh] replied` 缺失 → parent refreshSession 3s timeout
- 缺的關鍵欄位：token payload (iss/aud/role/exp) + parent VITE_SUPABASE_URL 實際值
- 改動：
  - `public/exploit-coach-mockup-v3.html`（callCoach `[first]` log）— 新增 JWT decode，自動印 `payload_iss / payload_aud / payload_role / payload_ref / payload_exp_date / payload_expired / payload_full`，不需用戶手動 `atob(token.split('.')[1])`
  - `src/tabs/ExploitCoachTab.tsx`（useEffect 頂部）— 新增 `[parent-env]` log 印 `VITE_SUPABASE_URL / project_ref / mismatch`（自動化 T-052 的 Vercel env 核對）
- 完成條件：tsc EXIT=0（本機未跑，執行者已驗）；實機 console 打開就看得到新 log，不用任何手動指令
- 下一輪實機測試：用戶只要開 Chrome DevTools Console 觸發 bug，把 `[parent-env]` + `[exploit-coach-401][first]` 貼回即可判根因
- 產品改動（src/ + public/）→ 跑測試機 curl 驗證

## 2026-04-20 v0.8.1-dev.33 [dev]
- T-051 正式整合（wip/T051-exploit-coach-401-diag → dev）
- 背景：2026-04-20 實機（iPhone Safari WiFi+4G 都壞）在 AI 分析顯示「登入已過期」= `exploit-coach-mockup-v3.html:1574`
- 改動（A+B+C）：
  - **A** `public/exploit-coach-mockup-v3.html:1459-1473` — `readTokenFromStorage` fuzzy match → exact `localStorage.getItem('sb-btiqmckyjyswzrarmfxa-auth-token')`，對齊 line 1454 的 storageKey；避免 localStorage 殘留多個 `sb-*-auth-token` 時抓錯 project
  - **B** `public/exploit-coach-mockup-v3.html:1568-1587` — `callCoach` 加 3 個 console.error：`[exploit-coach-401][first]` / `[refresh]` / `[retry-failed]`，含 status / tokenHead / tokenTail / SUPABASE_URL / sameAsOld 欄位
  - **C** `src/tabs/ExploitCoachTab.tsx:14-39` — `onMessage` handler 加 5 個 log path：got request / origin blocked / no targetWindow / refresh threw / replied
- 驗證：tsc EXIT=0
- ⚠ **bug 可能未解** — T-051 主要是「修 fuzzy match + 加診斷 log」，root cause 待用戶實機跑一遍把 Safari Inspector log 貼回才能判：RC1 env mismatch / RC2 fuzzy match / RC3 refresh 失敗
- 併行：T-052（用戶手動核對 Vercel dev env var）
- 產品改動（src/ + public/）→ 跑測試機 curl 驗證 Vite build
- wip/T051-exploit-coach-401-diag 待刪

## 2026-04-20 v0.8.1-dev.32 [dev]
- T-043 正式整合（wip/T043-batch-worker-setup → dev）
- 執行者：這台主目錄；大腦：這台 `-brain` worktree
- 產出：
  - `scripts/gto-pipeline/package.json` + `package-lock.json`（`npm install @supabase/supabase-js`，13 packages, 0 vulns）
  - `.env` + `node_modules/` 確認 root `.gitignore` 子目錄覆蓋（不入 commit）
- 驗證：
  - `node seed-batches.mjs` → **390 turn batches** 落測試 Supabase（13 BOARDS × 平均 10 turnCards × 3 STACK_RATIOS，預設不含 river）
  - `node batch-worker.mjs --machine TEST-DRY --dry-run --max 2` → claim RPC 領到 `turn | 7s7d2h+3c | 13bb`，dry-run skip solver 且自動還原 row
  - tsc EXIT=0
- 派單 vs 實際差異（大腦記錄，下次派單注意）：
  - schema 合法 status 為 `pending/claimed/uploading/done/failed`（不是 `processing`）
  - `--dry-run` 已實作 skip solver + 自動還原（不需手動 reset SQL）
  - seed 量 390（STACK_RATIOS=3），不是派單預估的 156
- 衍生：T-045（真跑 1 個 batch）+ T-046（river seed 估算）進 Queue
- 純 pipeline 工具改動（`scripts/gto-pipeline/` 子目錄 package.json，不影響 Vercel build）= 開發流程，不跑測試機驗證
- wip/T043-batch-worker-setup 待刪

## 2026-04-20 v0.8.1-dev.31 [dev]
- T-044 完成（大腦單機快修）：修 migration 檔對齊正式機部署流程
- 檔案改動：
  - `supabase/migrations/20260416-gto-postflop.sql` — 去掉 plpgsql function，只保留 tables + RLS + CHECK；constraint 改用 DO block 包（避免重複 ADD 報錯）；policy 改 `DROP ... IF EXISTS` 後 `CREATE`（idempotent）
  - `supabase/migrations/20260416b-gto-postflop-function.sql`（新）— `claim_gto_batch` 改 `LANGUAGE sql` 純 UPDATE...RETURNING 一句（語意同舊 plpgsql 版，但不會觸發 Supabase SQL Editor 的 `$$...INTO v_id...$$` 解析 bug）
- 為何拆兩檔：T-042 踩坑 — 整包混合 DDL + plpgsql 在 SQL Editor 解析失敗會 rollback 連帶搞死 tables。拆兩檔各自獨立 transaction
- 測試 Supabase 現況：已部署（T-042 執行者手動貼過 pure SQL 版），本次 migration 檔對齊後續正式機部署
- task-board：T-044 移 Done
- 屬 supabase/ 改動 → 推 dev 後跑測試機 curl 驗證（但 Vercel build 不受影響，migration 檔純文字）

## 2026-04-20 v0.8.1-dev.30 [dev]
- T-042 正式整合（wip/T042-deploy-gto-migration → dev）
- 執行者：這台主目錄 wip branch；大腦：這台 `-brain` worktree
- 動作：gto_postflop + gto_batch_progress 兩 table + RLS + RPC `claim_gto_batch` 部署到測試 Supabase (btiqmckyjyswzrarmfxa)
- 驗證：`information_schema.tables` 回 2 row，`SELECT claim_gto_batch('DESKTOP-TEST')` 回空 row（pending 為空）
- **踩坑**：原 plpgsql function `RETURNING ... INTO v_id` 在 Supabase SQL Editor 報 `42P01: relation "v_id" does not exist`，即使 `$func$` 具名 dollar quote 都擋不住
- **暫解**：測試 Supabase 手動改用 `LANGUAGE sql` 純 UPDATE...RETURNING 版（語意相同，一句解決）
- **衍生 T-044**（大腦 task）：把 migration 檔 `supabase/migrations/20260416-gto-postflop.sql` 的 function 替換成 SQL 版，對齊正式機部署流程
- T-043（batch-worker 首次實跑）阻塞已解 → Ready
- task-board：T-042 → Done，T-043 標 Ready，新增 T-044
- 純 task-board 改動（無 `src/` / `supabase/` / `public/`），不需測試機驗證
- wip/T042-deploy-gto-migration 待刪

## 2026-04-20 v0.8.1-dev.29 [dev]
- T-010 正式整合（wip/T010-c2-scenarios → dev）
- merge --no-ff，task-board conflict 手動解（HEAD 保留 In Progress 標記 → 改為 Done 標記）
- 產出（3 檔）：
  - `scripts/gto-pipeline/parse-pd-table-name.mjs`（新 +376 行，prefix-based token scanner；VS 抽取 "BB VS MP"→ hero=BB villain=MP；所有 unknown 附 reason 不 silently drop；含 CLI 診斷模式）
  - `scripts/gto-pipeline/__tests__/parse-pd-table-name.test.mjs`（新 +220 行，57 tests 全通過）
  - `scripts/gto-pipeline/scenarios.mjs`（+223 行，MTT Phase 4 新增）
    - `MTT_SCENARIOS` 54 個 catalog 場景（6 depths × SRP 7 matchup + 3BP 3 matchup）
    - `enumerateMTTFromPD(pdRangesDir)` async scanner 把 pd table.name 對應到 catalog，unknown/unmatched 進 buckets
    - mtt 進 ALL_FORMATS（不破壞 HU/6max/9max）
- 驗證：57/57 tests pass，tsc EXIT=0
- 下游：pd hand map → TexasSolver range 字串轉換屬 T-011（C3）
- task-board T-010 → Done
- wip/T010-c2-scenarios 待刪

## 2026-04-20 [flow] 大腦 dispatch 三 task + 大腦 worktree 規則確立
- 大腦分派 T-010 / T-020 / T-042 三個獨立 task（task-board 移到 In Progress）
- T-020 執行者 red-flag 抓到 scope 數字錯：「25 flops」是 6-max 早期規劃殘留
  - 修正為 21 unique flops（peer parity HU 25bb SRP）
  - 8 extras：5s5c5d / 6d5h4c / 8s5h2c / 8s7s5d / 9s7s3s / Ah2d2c / Ah5c2d / Ah8h3c
  - 不動 BOARDS 主常數，加 `BOARDS_HU` 常數
  - 連帶 T-021 / T-023 後續同樣對齊 21
- **新規則：大腦必須開 `-brain` worktree on dev**
  - 教訓：T-042 執行者直接 checkout wip 而沒開 worktree → 主目錄 branch 被切走
  - 後果：大腦的 task-board commit 誤落到 wip/T042（用 `git push wip:dev` rename 救回）
  - 寫入 `memory/wiki/two-machine-workflow.md`
- 這台 worktree 現況：`poker-mentor` (wip/T042) + `poker-mentor-wip1` (wip/T010) + `poker-mentor-brain` (dev)
- 純 flow 改動，不 bump 版本


- 另一台（身邊機器）按新架構完成 setup：
  - 主目錄 `POKERNEW/poker-mentor` = dev（大腦或三角色）
  - 新 worktree `POKERNEW/poker-mentor-wip1` = detached HEAD（執行者專用）
- 清掉 2 個過時 worktree：`POKERNEW-hu-sim` / `POKERNEW-ui-v2`（確認 0 獨有 commits）
- 清掉 3 個 local 殘留 branches：
  - `feature/exploit-lab`（dev.24 已確認無獨有 commits）
  - `wip/T033-gto-postflop-v2-wip`（已 merge + remote 已刪）
  - `wip/T050-exploit-coach-bugs-v2`（已 merge + remote 已刪）
- `git fetch --prune` 同步 5 個 stale remote tracking refs
- 兩台電腦最終狀態：
  - 本地 branches 只剩 `dev` + `main`
  - remote 只剩 `origin/dev` + `origin/main`
  - 完全對齊 origin/dev @ `a1c7015`（含 dev.28）
- 明天開工任一台 session 會直接走新三角色 SOP / worktree 自動 SOP

## 2026-04-20 [flow] Worktree 命名簡化：`-wip*` 統一後綴
- 原 `POKERNEW-brain` / `POKERNEW-*` 太複雜，改為簡單規則：
  - 主目錄 = 單對話通用 / 多對話時當大腦
  - `-wip*` 後綴 = 執行者 worktree
  - 不用時 detached HEAD
- session-start-reminder 新偵測：cwd basename 含 `-wip` → 固定執行者 SOP
- two-machine-workflow.md 簡化並行章節
- 舊 POKERNEW-* 保留向後相容

## 2026-04-20 v0.8.1-dev.28 [dev]
- T-050 正式整合（wip/T050-exploit-coach-bugs-v2 → dev）
- merge --no-ff，tsc EXIT=0
- Bug 0: public/exploit-coach-mockup-v3.html 加 `proceedFromS3()` guard
- Bug 1: `#card-picker` DOM 移到 body 層級 + CSS `position:fixed; z-index:1000`（hero/vill 共用）
- Bug 2: `ExploitCoachTab.tsx` postMessage 改用 `e.origin` 判斷 + await 前 capture `contentWindow`
- Bug 2 caveat：實機 iOS Safari + 4G 未驗證，修法基於最佳猜測；部署後請實機回驗
- task-board T-050 → Done
- wip/T050-exploit-coach-bugs-v2 待刪

## 2026-04-20 [flow] 多 session 並行支援：POKERNEW-brain worktree
- 用戶要在另一台開 2 個 Claude Code 對話（大腦 + 執行者）
- 單 repo 多對話會 git 打架 → 用 git worktree 分目錄
- 新規則：`POKERNEW-brain` 目錄名被 session-start-reminder 識別為大腦模式
- 其他 `POKERNEW-*` 走執行者 worktree 模式
- wiki `two-machine-workflow.md` 加多 session 並行章節
- 指令：`git worktree add ../POKERNEW-brain dev`

## 2026-04-20 [flow] 大腦規劃：T-050 新 bug + 分工列表
- 使用者實機驗證發現 3 個 exploit-coach bug：
  - Bug 0: Hero 手牌空白仍能按「下一步」
  - Bug 1: S5b 對手手牌「我知道」→ 點卡槽 picker 沒顯示
  - Bug 2: AI 分析顯示「連線錯誤：Load failed」
- task-board 加 T-050（Product 線，建議 `wip/T050-exploit-coach-bugs-v2`）
- 附詳細成因推測 + debug 步驟給執行者
- 分工：
  - 這台（桌機，等下切執行者）：solver 擴充（T-042 → T-043 → T-020~T-023）
  - 另一台：T-050（3 個 bug 修復）
- 本次純 flow 改動（task-board + dev-log），不 bump version（新規則：只有 wip merge 才 bump）

## 2026-04-20 v0.8.1-dev.27 [dev]
- T-033 正式整合（wip/T033-gto-postflop-v2-wip → dev）
- merge --no-ff：2 commits 進 dev（c64d2eb 保留 + b673b0b async fix）
- 採納 12 檔：7 個原 wip 檔 + 5 個 call-site async 化（botAI.ts / HeadsUpMatchScreen{,V2}.tsx / 2 test）
- 新增能力：
  - DB-driven turn/river GTO lookup（gto_postflop table + client prefetch cache）
  - 跨平台雙機協調解算（gto_batch_progress + claim_gto_batch RPC）
  - PostflopRole 擴充到 turn/river
  - bot decision chain 全 async（可查 DB）
- tsc EXIT=0，merge clean
- follow-up 動作（另一條 task，不在本 commit）：
  - 部署 migration 到測試 Supabase（btiqmckyjyswzrarmfxa）
  - 設定 SUPABASE_SERVICE_KEY secret（batch-worker 需要）
  - seed-batches + batch-worker 實跑驗證
- task-board T-033 → Done
- wip/T033-gto-postflop-v2-wip 待刪

## 2026-04-20 v0.8.1-dev.26 [dev]
- 大腦 review T-033（`wip/T033-gto-postflop-v2-wip` @ c64d2eb）
- 結論：7 檔全部有價值，採納方向確定（migration / DB reader / worker / boards 擴充 / PostflopRole 擴充）
- Merge 嘗試：失敗 tsc `TS2345` — `getHUPostflopAction` 變 async，但 `src/lib/hu/botAI.ts` call-site 未 async 化
- 動作：revert merge，dev 回到 `212c097` (dev.25)；tsc 重新 EXIT=0
- T-033 移 In Progress (blocked)：等執行者補 botAI.ts async 化再次 push
- 已在 task-board 附詳細 block 原因 + 補修指引（範圍 / 連帶影響 / 完成條件）

## 2026-04-20 v0.8.1-dev.25 [dev]
- 大腦判斷：另一台回報的 stash 不是垃圾，是 GTO postflop v2 WIP
- dev 確認缺失：`src/lib/gto/getGTOPostflopFromDB.ts`（DB 讀取端）
- dev 確認缺失：`supabase/migrations/20260416-gto-postflop.sql`（正式 migration）
- 另一台將把 stash push 成 `wip/T033-gto-postflop-v2-wip` 等大腦 review
- task-board 加 T-033 到 In Progress

## 2026-04-20 v0.8.1-dev.24 [dev]
- 大腦整合：清理 3 個過時 feature branches
- 調查結果：`feature/exploit-lab` / `feature/hu-simulator-v1` / `feature/ui-v2` 全部 `git log dev..` 顯示 **0 獨有 commits**
- 另一台報告的「04-16 WIP」實際上已在 dev（dev.8-dev.11 批次）
- 動作：三個 remote branch 全刪
- 另一台 Claude 下一步指令（已給使用者）：
  1. `git status --short` 確認本機 WIP
  2. 若有 WIP → `git stash push -u -m "..."`（丟棄用）
  3. `git checkout dev && git pull --ff-only origin dev`
  4. 拿到 dev.24 + 新三角色 SOP
- T-031 task 完成（task-board 已更新）

## 2026-04-20 v0.8.1-dev.23 [dev]
- 雙角色 workflow 升級：大腦 / 執行者 / 單機快修
- `memory/wiki/two-machine-workflow.md` 全面重寫（wip branch + 大腦整合模型）
- 開工 SOP 第 6 步改問三角色（見 session-start-reminder.sh + CLAUDE.md）
- task-board 加 In Review 欄位 + 每 task 建議 wip branch 名
- CLAUDE.md 分支策略：wip/<task-id>-<短描述> 取代 feature/*；執行者不動 version.ts / dev-log
- （規則過渡）本次仍按舊規則遞增版號，未來執行者 commit 不動版號，只在大腦 merge 時 bump

## 2026-04-20 v0.8.1-dev.22 [dev]
- 中央大腦 task-board 建立
- 新 `memory/wiki/task-board.md`：Queue / In Progress / Done 三區看板
- Queue 列 14 個 task（桌機 Pipeline 8 項、行動機 Product 3 項、大腦 2 項）
- Done 紀錄 5 個今天已完成（converter C0-C1.5、exploit-coach bug 修、跨機 sync、settings 整頓、roadmap）
- session-start-reminder.sh 加第 5 步「讀 task-board 看指派給本機的 task」
- memory/index.md 加入 task-board 連結

## 2026-04-20 v0.8.1-dev.21 [dev]
- 跨機共工自動化
- 新 `scripts/session-sync.sh`：auto-stash → pull → pop（容 WIP 不再擋開工）
- 改 `scripts/session-start-reminder.sh`：印遠端 5 筆 commit + 本地 diff + WIP 清單 + dev-log 前 3 筆
- `.claude/settings.json` SessionStart hook 改呼叫 session-sync.sh
- 新 wiki `memory/wiki/two-machine-workflow.md`：一分支/硬紀律/腳本包容 + 角色偏好 + 衝突解法
- `memory/index.md` 加入 two-machine-workflow 連結
- 目的：解決今天另一台 feature/exploit-lab 孤島 + WIP 擋 pull 的痛點

## 2026-04-20 v0.8.1-dev.20 [dev]
- C1.5 完成：labelToBucket 改 prefix-based token scanner
- 新增 `"All in"` / `"all-in"` normalize 成 `allin`
- RAISE prefix 擴充：openjam, openshove, shove, squeeze, push
- CALL prefix 擴充：flat（含 flatcall）, broke, defend
- 加 `DEPTH_BB` 規則 skip `20bb/25bb` 等非動作 label
- 10 個 pd project 全轉：7 個零 unknown；3 個剩少量是 pd 資料品質缺陷（Course depth-as-label、Final Table 字面 Unknown）

## 2026-04-20 v0.8.1-dev.19 [dev]
- 方案 1 Converter 線 C0 + C1 完成
- 新 `scripts/gto-pipeline/inspect-pd.mjs`：pd JSON schema 探查工具
- 新 `scripts/gto-pipeline/pd-to-range.mjs`：pd `_ranges.json` + `action_id_map.json` → per-table hand map JSON
- Live MTT Ben Adjusted 測試 OK（1149 tables 全映射，7 個乾淨 label）
- Course / ICM 系列需要 C1.5 處理複合 label（現行走 unknown bucket）
- roadmap 更新 C0/C1 狀態為 ✅ + 附映射規則備忘

## 2026-04-20 v0.8.1-dev.18 [dev]
- 新增 `memory/wiki/range-collection-roadmap.md`：三線分批進度表（scraping / converter / solver）
- 方案 1（converter 串接）拆成 C0-C4 phase；MTT postflop（P5）依賴 C4
- `memory/index.md` 加入 roadmap 連結
- 跨機器協作指引：檔案邊界 + 預期衝突點（version.ts / dev-log.md）

## 2026-04-20 v0.8.1-dev.17 [dev]
- 範圍收集成果提交（pokerdinosaur scraping + HU 13bb/25bb GTO data）
- 新 `scripts/gto-pipeline/scrape-pokerdinosaur.js` + `scripts/upload-pd-data.js`
- 新 70+ 個 `src/lib/gto/gtoData_hu_{13bb,25bb}_{srp,3bp}_*.ts`（TexasSolver 本機產出，尚未接 gtoData_index）
- 新 200+ 個 `scripts/gto-pipeline/inputs/6max_100bb_{srp,3bp}_*.txt`
- 新 `supabase/migrations/_all_migrations_staging.sql`（測試 Supabase schema 統一匯出）
- 新 `memory/project_pokerdinosaur_scraping.md`（wiki 頁）
- 新 `package.json` 依賴：`sharp@^0.34.5`（scrape-pokerdinosaur 用）
- 整頓 `.claude/settings*.json`：共用 permission 搬到 shared `settings.json`；本機路徑/PID/Downloads 操作留 `settings.local.json` 並 gitignore
- `.gitignore` 加入 `RYE Rangeviewer 2021/`（604 MB 外部資料夾）、`tmp_log.txt`

## 2026-04-20 v0.8.1-dev.16 [dev]
- Exploit Coach mockup 5 個 bug 修復
- Bug 1：Call 動作加金額（actDo 記 owe，actLabel 顯示 call X）
- Bug 2：任一方 all-in 且本街結算完 → 直接進 s5 攤牌；按鈕文字改「All-in → 攤牌」
- Bug 3：raise size input 加 inputmode=decimal + onfocus scrollIntoView（避開 iOS 鍵盤擠壓）
- Bug 4：新增 S5b「對手手牌」步驟（知道/不知道）；picker target 擴充 'v0/v1'；context 帶 villain_hand；Edge Function buildSystemPrompt 支援對手牌
- Bug 5：iframe 不再自己 autoRefresh/persistSession，改以 localStorage 讀 parent session；過期透過 postMessage 請 parent refresh（修兩個 supabase client 搶 rotating refresh_token）

## 2026-04-19 v0.8.1-dev.15 [dev]
- 重寫下注輪 action engine（engState 狀態機 + wrap-around）
- Bug 14: 籌碼放圓圈內、圓圈 34→44px、UTG+1→U+1, UTG+2→U+2
- Bug 15: 動作未完成時「繼續」按鈕灰色+禁止
- Bug 16+17: re-raise 後已 call 者重新加入動作佇列；Raise 金額驗證 + min-raise
- Bug 18: 無注時 Call 按鈕變 Check；有注時才顯示 Call + 金額
- Bug 19: 翻後下注改用 BB 實數（之前是 pot %）
- Bug 20: streetNext 阻擋未完成的街；手牌只剩 1 人自動進確認頁

## 2026-04-19 v0.8.1-dev.14 [dev]
- Exploit Coach mockup 11 個 bug 修復
- Bug 3：S2 手牌設定 sticky 下一步按鈕
- Bug 4+10：選牌器全局排除已用牌（hero + board 共用 usedCards）
- Bug 5+6+7+8：座位顯示籌碼/盲注（SB 0.5, BB 1）、動作扣減、中央底池累計
- Bug 11+12：翻後街未選完公牌不開始動作佇列，選完自動啟動
- Bug 13：接入 supabase-js client 自動 refresh token + 401 retry
- ExploitCoachTab 改 100dvh 避免 iOS Safari chrome 擠掉底部
- .bot-nav 全部改 position:sticky bottom:0

## 2026-04-19 v0.8.1-dev.13 [dev]
- 教練 Tab 改為 Exploit Coach v3 mockup（iframe 嵌入）
- 原 CoachScreen（free-form 聊天）下線，import 移除避免 TS6133
- BottomNav 保留，用戶點教練 tab → 看到完整 12 畫面剝削教練流程

## 2026-04-19 v0.8.1-dev.12 [dev]
- mockup v3 接真 Claude：`startAI` / `aiQ` / `aiSend` 改呼叫 `exploit-coach` Edge Function
- 加 `callCoach` / `buildCoachContext` / `getSupabaseSession` 輔助
- Context 包：heroPos / heroCards / flop / villain_type / scenario_slug（從 tableSize=6 + preflop action 推導）
- 保留整個 mockup 視覺設計不變

## 2026-04-19 v0.8.1-dev.11 [dev]
- Phase 2 解算擴充：5→13 flops 全覆蓋（加 9d5c2h/KsQd4h/Td8h4c/Js9c3h/9h8d7c/Qd7s2c/Jc7d2h/KcKd5h）
- 全批次 306.9 分鐘（5.1 小時）— 2 個 BB 防守 flops segfault，retry 成功
- DB **325/325 rows**（25 scenarios × 13 flops），全 25 個場景完整覆蓋
- 新 `mark-solved-from-db.mjs`：從 DB 拉已解清單建 marker file，讓 -SkipExisting 能跨清檔續跑
- BOARDS_FAST 改為全 BOARDS（13）以支援全紋理覆蓋

## 2026-04-19 v0.8.1-dev.10 [dev]
- 6-max 100bb postflop solver batch **全部解完**：125 flops（25 場景 × 5 代表性 texture）
- Fast mode 實測單 flop 平均 1.4 分（最慢 6.2 分 BTN vs SB 3BP，最快 8s）
- 總解算時間 178.6 分鐘（2.98 小時），比原估 8-12h 快 3 倍
- `solver_postflop_6max` 入庫 127 rows（含 pilot 額外 2 筆）
- 清理 5.7 GB 中間 JSON 檔

## 2026-04-19 v0.8.1-dev.9 [dev]
- Pilot 解算驗證通過（3 flops × UTG vs HJ SRP，57.5 分鐘）
- 修 IP/OOP swap bug（opener 不一定是 IP，依 post-flop 位置判斷）
- 3 筆 6-max solver tree 入 DB，retrieval 三層 tier 全端到端通
- 新 `CoachChatDialog` 組件 + ExploitLabPage 加「問剝削教練」入口
- `test-retrieval.mjs` 本地驗證 Tier A/B/C + 節點導航

## 2026-04-19 v0.8.1-dev.8 [dev]
- 建 6-max 100bb solver pipeline 基礎：25 場景（15 SRP + 10 3BP）+ 325 input 檔
- `cash_6max_ranges.mjs` 從 `gtoData_cash_6max_100bb.ts` 抽取 TexasSolver-compat range 字串；修 SRP IP/OOP 依 post-flop 位置判斷（原本誤把 opener 當 IP）
- 新 `convert-to-db.mjs` + `ingest-all-to-db.mjs`：solver JSON 138MB → 壓縮樹 36KB → 入 `solver_postflop_6max`
- `batch-run.ps1` 加 `-Limit` / `-Filter` / `-NoConvert`
- Villain profiles 4→10（加 traits + postflopLeak）
- 新 Edge Function `exploit-coach`：RAG 流程（retrieve → build prompt → Claude Haiku → log to coach_queries）
- 新 `postflopRetrieval.ts` + `coachClient.ts`：client 側檢索 + call Edge Function
- Auto-memory feedback：能自己跑就自己跑（feedback_execute_self.md / claude-execute-self.md）

## 2026-04-17 v0.8.1-dev.7 [dev]
- 重構 GTO pipeline 架構：scenarios.mjs 支援 HU / 6-max Cash / 9-max Tournament 三種格式
- 校正 HU ranges（RYE 資料比對）：40BB SRP IP 79→148, OOP 63→119；3BP/4BP 同步修正
- 標準化 bet sizing profiles（GTO Wizard 標準：SRP deep/medium, 3BP, 4BP）
- 新增 extract-hu-ranges.mjs 範圍提取腳本 + batch-solve.sh 批次解算腳本
- 重新生成 180 input 檔（6 場景 × 30 boards），Phase 1a 解算中

## 2026-04-17 v0.8.1-dev.6 [dev]
- 整合 wiki 系統到現有 workflow：CLAUDE.md 全面更新
- 新增「收工 SOP」區段：收工前跑 `/compound` 提取對話副產品
- 修正所有 auto-memory 引用 → `memory/wiki/*.md` 路徑
- 更新 session-start-reminder.sh：讀 index.md + 顯示 wiki skills
- 更新 reference_architecture.md：memory/ 目錄結構反映 wiki 子目錄
- 修正 CLAUDE.md 開工 SOP 步驟編號（去除重複步驟 5）

## 2026-04-17 v0.8.1-dev.5 [dev]
- 建立雙 Vault 知識管理系統（Karpathy Second Brain 概念）
- 個人 Vault：`~/Desktop/second-brain/`（Obsidian，已 git init + 首次錄入 Karpathy 文章）
- 專案 Vault：`memory/` 重構為 Obsidian 相容格式（8 檔遷移到 wiki/ + index.md + log.md）
- 新增 4 個 user-level skills：`/wiki-ingest`、`/wiki-healthcheck`、`/compound`、`/rescue-bookmarks`
- 更新 CLAUDE.md 開工 SOP + 分級查詢規則、建立 user-level CLAUDE.md

## 2026-04-16 v0.8.1-dev.4 [feature/exploit-lab]
- 新增 `docs/exploit-coach-mockup.html`：剝削教練完整流程 mockup（12 畫面）
- 流程一：選對手（預設 4 種 + 已儲存 + 新建問卷 6 題 + 雷達圖摘要）
- 流程二：AI 教練對話介面（4 選項：手牌問答/特殊牌面/隨機訓練/弱點報告）
- 流程三：牌桌卡片嵌入對話中，動作按鈕 + GTO vs 剝削對照
- 定義 10 種對手個性模型（standard/nit/weak_tight/fit_or_fold/CS/sticky/trapper/lag/maniac/tag）
- 問卷分類決策樹：5 題選擇 + 1 題自由描述 → 自動歸類為 10 種之一

## 2026-04-16 v0.8.1-dev.3 [feature/exploit-lab]
- 新增「剝削實驗室」獨立頁面（/exploit）— 董事長會議需求 Phase 0
- 新增 `src/lib/exploit/villainProfiles.ts`：4 種對手 profile（標準/緊弱/跟注站/激進）
- 新增 `src/lib/exploit/exploitEngine.ts`：剝削調整引擎，基於 GTO baseline + 對手弱點產出調整建議
- 新增 `src/pages/ExploitLabPage.tsx`：場景設定 + 手牌選擇 + 四欄對照面板
- 修改 `src/lib/explanations.ts`：export categorize() + HandCategory 供 exploit engine 使用
- 修改 `src/main.tsx`：加入 /exploit 路由

## 2026-04-16 v0.8.1-dev.2 [dev]
- 新增 SessionStart 第二個 hook：啟動時自動印出「開工 SOP 提醒」注入 Claude context
- 新增 `scripts/session-start-reminder.sh`：印出 SOP 5 步（讀 dev-log / 讀 MEMORY / 回報狀態 / 問角色 / 等指示）
- worktree 子目錄（POKERNEW-*）自動跳過第 4 步角色問題
- 整合 memory：刪除 project_roadmap.md + project_mtt_hu_simulator.md，更新 dev_workflow_hu_simulator.md 分支狀態，精簡 MEMORY.md 索引 10→8 項

## 2026-04-15 v0.8.1-dev.29 [dev]
- HoleCards 改為 V2 牌面格式：數字上方大字 + 花色下方小字，移除兩個角落花色符號
- 手牌結束結算改為 felt 內部浮動小 chip（absolute top:62%），不再整條橫幅占版面高度
- action bar 手牌結束時顯示「👁 回饋 Ns」+「▶▶ 下一手」兩個按鈕，不須開回饋就能換手
- 寫入 V2 UI 設計規則 memory (project_ui_v2_rules.md)

## 2026-04-15 v0.8.1-dev.28 [dev]
- HU V2：修復 6+1 個介面問題
- 動作 BAR 換成 BetSizingBarV2（單排），移除 PreflopActionBar / PostflopActionBar
- 固定 action bar 高度（68px spacer）防止畫面忽上忽下
- 手牌結算改為 felt 下方橫幅，不再疊在 PokerFeltV2 上
- isCorrect 改用 isPreflopViolation flags 判斷（非固定 true）
- feedbackExpanded 可折疊；onViewRange 串接 RangeGrid overlay
- PokerFeltV2 中央牌面：rank 19px 上方 + suit 11px 下方，改善可讀性

## 2026-04-15 v0.8.1-dev.27 [feature/hu-simulator-v1]
- HeadsUpMatchScreenV2：以 TrainTabV2 V2 版面為基礎完整重建 JSX
- 修正：`position: fixed; inset: 0` 全屏容器，解決 action bar 在 iOS 被蓋住問題
- 修正：felt 容器改為 `flex-1 relative min-h-0`，解決 PokerFeltV2 無高度（GG blob）問題
- 修正：heroPosition 統一使用 `'BTN/SB'` 而非 `'BTN'`，seatInfo key 對應正確
- 修正：community cards 改由 PokerFeltV2 `boardCards` prop 渲染（取代獨立 CommunityCards）
- 新增：ActionHistoryBarTop 顯示 HU 動作序列、showExitConfirm modal

## 2026-04-15 v0.8.1-dev.26 [dev]
- HU V2 UI 收尾完成：FeedbackSheetV2 overlay（10s 倒數）+ AI 書籤系統
- 新建 HeadsUpReviewScreenV2：結果 banner + AI 書籤橫向捲動 + 手牌列表（展開動作序列）
- App.tsx 接線 FEATURE_FLAGS.UI_V2 → HeadsUpReviewScreenV2
- 所有街別 GTO 評分顯示 pending（資料建構中）

## 2026-04-15 v0.8.1-dev.22 [feature/hu-simulator-v1]
- HeadsUpMatchScreenV2：以 10 秒倒數 + setInterval 取代舊的 setTimeout 2500ms 換牌邏輯
- 新增 `feedbackReady` / `feedbackOpen` / `feedbackCountdown` / `aiBookmarkedHands` state
- 新增 `clearCountdown()` / `dealNextHand()` helper function
- 新增浮動「👁 回饋」按鈕（fixed bottom-24 right-4），顯示剩餘秒數
- Props `onMatchComplete` 加入第三參數 `aiBookmarks: number[]`；App.tsx handler 同步更新

## 2026-04-15 v0.8.1-dev.21 [feature/hu-simulator-v1]
- 新增 `computeHandFeedback` 純函式到 HeadsUpMatchScreenV2.tsx（exported）
- 新增 `HUHandFeedback` interface（tip / actions / streets / isCorrect / explanation）
- 新增 `import type { ActionFreq, StreetScore }` from FeedbackSheetV2
- 新增 `import type { HandState }` from types
- 建立 `src/__tests__/hu/computeHandFeedback.test.ts`，6 項測試全通過

## 2026-04-15 v0.8.1-dev.20 [dev]
- HU 修：POSITION_MAP[2] 從 ['BTN', 'BB'] 改回 ['BTN/SB', 'BB']
  - 加 infoKey lookup `BTN/SB → SB`，讓 engine 寫的 SB seatInfo 找得到
  - heroPosition='SB' 時自動 map 到 'BTN/SB' 找 slot
  - 修好 HU BTN 不顯示 0.5 SB 盲注 + 加注 chip 的 bug
- 籌碼位置雙係數：水平 0.30（左右側座位拉近）/ 垂直 0.18（上下座位仍跳過蓋牌）

## 2026-04-15 v0.8.1-dev.19 [dev]
- 接上「查看範圍」按鈕：feedback sheet 點擊後彈出 RangeGrid overlay（覆蓋 felt，點背景關閉）
- 下注 chip offset 0.3 → 0.22，再往座位拉回（top/bottom 座位 chip 距離明顯縮小）

## 2026-04-15 v0.8.1-dev.18 [dev]
- 下注 chip offset 0.4 → 0.3，往座位拉回一些（仍跳過蓋牌區不被擋）

## 2026-04-15 v0.8.1-dev.17 [dev] — UI v2 第二輪用戶回饋
- 座位圓內文字往下偏（paddingTop: 14）— 蓋牌不再壓到 UTG / SB 等位置名
- 移除 hero 手牌下方的「A2s 同花」label
- Hero 手牌 marginTop -24 → -8，視覺上略低於 BTN 座位（但 action bar 位置不變）

## 2026-04-15 v0.8.1-dev.16 [dev] — Claude Code powerup：Skill + Agent + CLAUDE.md 補強
- CLAUDE.md：移除寫死的 Desktop 路徑（多機開發路徑不一致），改「本機路徑依各機器而定」
- CLAUDE.md：新增「產品核心規則」章節，精簡版座位順序 + UI v2 規則，完整版仍在 auto-memory
- 新增 Skill `.claude/skills/preflight-main/SKILL.md`：push main 守門員，11 步檢查（tsc/版號/CHANGELOG/dev-log/授權）
- 新增 Agent `.claude/agents/poker-rules-reviewer.md`：唯讀審查員，檢查 engine/PokerFelt 是否違反德州規則或座位順序
- 用法：輸入 `/preflight-main` 跑檢查、改 engine 後請 Claude 用 poker-rules-reviewer 審查

## 2026-04-15 v0.8.1-dev.15 [dev] — UI v2 第一輪用戶回饋修正
- TrainTabV2 改 `position: fixed; inset: 0; z: 50` 全螢幕，蓋住父層的「練習/課程」sub-tab + BottomNav
- PokerFeltV2 z-index 重排：輪廓線(0) → 座位圓(2) → 蓋牌(4)；座位圓改實心深色底（不透明），輪廓線不再穿透
- 下注 chip offset 0.2 → 0.4，往桌心多偏，跳過蓋牌區避免重疊
- BetSizingBarV2 雙排合併單排，所有按鈕同一 flex line，節省垂直空間
- 預期：訓練時整片牌桌全螢幕、座位/蓋牌/籌碼層級正確、按鈕一排到底

## 2026-04-15 v0.8.1-dev.14 [dev]
- UI_V2 flag resolution 改為自動判斷：staging（poker-goal-dev）預設 V2、正式機預設 V1
- 新增 `?ui=v1` / `?ui=v2` query param 強制覆蓋（方便 staging 退回舊版對照）
- 不用再貼 localStorage 指令，打開 staging 網址就直接看到新 UI

## 2026-04-15 v0.8.1-dev.13 [feature/ui-v2 → dev]
- UI v2：膠囊牌桌 + 四色卡 + 頂部 action bar + 底部 drag sheet + 街別評分 chips + AI 教練 CTA
- 新增元件：`src/components/v2/{PokerFeltV2, ActionHistoryBarTop, BetSizingBarV2, FeedbackSheetV2, HeadsUpMatchScreenV2}.tsx`
- 新增 `src/tabs/TrainTabV2.tsx`（engine 不變，只改 UI layer）
- 新增 `src/lib/featureFlags.ts` + `UI_V2` flag（localStorage 驅動）
- App.tsx 依 flag 切換 V1 / V2；HU 同樣支援
- 新增 `/v2-demo` 路由與 V2DemoPage（A/B/C 靜態場景 + D 實機 TrainTabV2）
- 更新 `docs/ui-v2-mockup.html`（完整設計定稿：9-max、6-max、HU 三場景）
- 更新 memory：`project_ui_v2_rules.md` 規則檔、`project_seat_order.md` 座位順序
- 修 .env BOM（之前 Vite 認不得 VITE_SUPABASE_URL）
- Merged 上游 HU branch 的 CLAUDE.md 規則升級（SessionStart hook、自動部署授權、測試機驗證流程）

## 2026-04-15 v0.8.1-dev.12 [feature/hu-simulator-v1]
- CLAUDE.md 新增「推送到測試機後的必做驗證」：dev push 後 Claude 自動 curl 驗證 Vite build 產出正常
- 驗證用 curl 而非 WebFetch（WebFetch 會把 HTML 總結掉，抓不到 script tags）

## 2026-04-15 v0.8.1-dev.11 [feature/hu-simulator-v1]
- CLAUDE.md 新增「自動部署授權（測試環境）」：Claude 可主動 merge→dev+push、主動產出測試 Supabase 貼碼，不需每次問
- 原「Feature Branch 保護規則」改名為「正式環境保護規則」，範圍收緊到 main + 正式 Supabase
- 「標準流程」4 步都標註授權層級（自動 / 需授權）
- CoachScreen 死碼清理：insufficientPoints 提示在 COST=0 時改顯示「目前免費體驗中」
- dev_workflow_hu_simulator.md 同步：上線步驟 8 標【自動】、步驟 10 標【需授權】

## 2026-04-14 v0.8.1-dev.10 [feature/hu-simulator-v1]
- CLAUDE.md「開工 SOP」措辭改強制：Claude 必須主動執行，不准問用戶
- 加禁止行為清單：不准問「要跑嗎」、不准跳過讀記憶檔

## 2026-04-14 v0.8.1-dev.9 [feature/hu-simulator-v1]
- 新增 SessionStart hook（.claude/settings.json）：每次開 session 自動 git fetch --all + pull 當前 branch
- 不用手動貼指令，Claude Code 啟動時就會自動同步雲端

## 2026-04-14 v0.8.1-dev.8 [feature/hu-simulator-v1]
- CLAUDE.md 新增「開工 SOP」：git pull --all + 讀 dev-log + 讀 MEMORY.md + 回報狀態

## 2026-04-14 v0.8.1-dev.7 [feature/hu-simulator-v1]
- setup-env 腳本加入 git identity 自動檢查（step 0），新電腦不用手動設
- HU 入口接上：entryCost 從 `src/lib/hu/config.ts` 常數驅動，還原 spendPoints 扣點
- 種子用戶體驗期：所有收費點改 0（HU 入場、AI 教練、弱點分析、課程解鎖、HU 違規金、Edge Function analyze-hu-hand）
- UI 文案動態化：cost=0 時顯示「免費體驗」
- CLAUDE.md 新增「Edge Function / DB Migration 部署順序」規則：強制先測試環境 → 驗證 → 再正式
- 測試環境 Edge Function analyze-hu-hand 已 deploy 到 btiqmckyjyswzrarmfxa

## 2026-04-14 v0.8.1-dev.6 [feature/hu-simulator-v1]
- 修 setup-env.ps1/sh：移除 emoji，改用純 ASCII（PowerShell 編碼問題）

## 2026-04-14 v0.8.1-dev.5 [feature/hu-simulator-v1]
- 刪除 .env.example（避免 Claude session 誤用）
- setup-env 腳本升級：合併 npm install + TypeScript 檢查，一鍵完成
- CLAUDE.md SOP 簡化為單一腳本執行

## 2026-04-14 v0.8.1-dev.4 [feature/hu-simulator-v1]
- CLAUDE.md 新增「新電腦設定 SOP」：明確指定跑 setup-env 腳本，不要用 .env.example
- 修正問題：新電腦 Claude session 沒跑 setup-env、不知道 staging 環境已存在

## 2026-04-14 v0.8.1-dev.3 [feature/hu-simulator-v1]
- 新增 memory/dev-log.md：跨機操作記錄，跟 Git 同步
- CLAUDE.md 加入操作記錄規則：每次 commit 必須更新 dev-log
- 新 session 開始時先讀 dev-log 了解最近開發脈絡

## 2026-04-14 v0.8.1-dev.2 [feature/hu-simulator-v1]
- 新增 setup-env 腳本（ps1 + sh），新電腦自動產生 .env
- 更新流程圖：新電腦 SOP 改為自動化

## 2026-04-14 v0.8.1-dev.1 [feature/hu-simulator-v1]
- 新增版號規則：每次 commit 遞增 dev 版號並在對話中回報
- 版號格式 vX.Y.Z-dev.N

## 2026-04-14 v0.8.0 [feature/hu-simulator-v1]
- 建立雲端開發流程圖 docs/two-machine-workflow.html (v3)
- 建立 dev branch 並 push 到 GitHub
- 建立測試環境：Supabase staging (btiqmckyjyswzrarmfxa) + Vercel poker-goal-dev
- 測試 Supabase 跑完所有 DB migration + 部署 5 個 Edge Functions
- 更新 CLAUDE.md：feature → dev → main 分支策略 + 雙環境部署
- 新增 docs/poker-goal-architecture.html + poker-goal-mindmap.html
