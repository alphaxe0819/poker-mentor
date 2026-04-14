# Poker Goal — AI 工作規則

## 語言
- 一律使用繁體中文回應

## 程式碼交付
- SQL migration 程式碼直接貼在對話裡（不要只說「在檔案裡」）
- Edge Function 程式碼也直接貼在對話裡（用戶沒有 Supabase CLI，要手動貼到 Dashboard）
- 描述 bug/feature 直接分析修復，不要反覆確認
- 不要膨脹時間估算

## 使用者手動執行的程式碼：乾淨可複製規則（最重要）
**任何需要使用者複製貼到 Supabase SQL Editor / Edge Function Editor / Terminal 的程式碼塊，必須符合以下全部條件：**

1. **程式碼塊內 100% 只有可執行的內容**。第一行就是執行環境接受的語法：
   - SQL Editor → 第一行從 `CREATE`、`SELECT`、`ALTER`、`DROP`、`DO`、`INSERT`、`UPDATE`、`DELETE`、`GRANT`、`COMMENT`、`--`（SQL 註解）等**合法 SQL token** 開始
   - Edge Function → 第一行從 `import`、`//`、`/**` 等合法 TypeScript/Deno 開始
   - Bash / PowerShell → 第一行從 `cd`、`git`、`npm`、`#`、`powershell` 等合法 shell token 開始

2. **禁止在程式碼塊內放這些東西**（會讓使用者貼進去就報錯）：
   - ❌ 檔案路徑當第一行（例：`supabase/migrations/xxx.sql`）
   - ❌ 未註解掉的說明文字（例：`Run this in SQL Editor`）
   - ❌ Markdown 語法（例：`**注意**`）
   - ❌ 多個檔案混在同一個程式碼塊

3. **檔名 / 路徑 / 操作步驟必須寫在程式碼塊「外面」**，用純文字列出：
   ```
   檔案：supabase/migrations/2026-04-11-tournament-tables.sql
   執行位置：Supabase Dashboard → SQL Editor

   [然後才是程式碼塊]
   ```

4. **若檔案頭有檔名註解（例如 `-- supabase/migrations/xxx.sql`）**：
   - 建議**移除**該註解行後再貼進對話，避免使用者複製時意外遺漏 `--` 前綴
   - 或在程式碼塊前明確提醒：「注意：第一行是 SQL 註解，複製時連同 `--` 一起選取」

5. **一塊程式碼 = 一個執行目標**。如果一個任務要執行 3 個 SQL + 1 個 JS 腳本，要分成 4 個獨立程式碼塊，每塊都標明執行位置。

6. **驗證查詢要另外給一個程式碼塊**。執行完 migration 後，給一個 `SELECT ...` 讓使用者貼進去確認結果。

### 正確示範
> 執行位置：Supabase Dashboard → SQL Editor
>
> ```sql
> CREATE TABLE IF NOT EXISTS my_table (
>   id uuid PRIMARY KEY DEFAULT gen_random_uuid()
> );
> ```
>
> 驗證執行結果（也貼到 SQL Editor）：
>
> ```sql
> SELECT tablename FROM pg_tables WHERE tablename = 'my_table';
> ```

### 錯誤示範（絕對不要這樣寫）
> ```sql
> supabase/migrations/2026-04-11-foo.sql
> -- Run this in SQL Editor
> CREATE TABLE ...
> ```

### 為何這條規則存在
使用者於 2026-04-11 貼 migration 時，因為程式碼塊第一行是檔案路徑註解 `-- supabase/migrations/...`，複製過程中 `--` 被遺漏，導致 Supabase SQL Editor 收到純字串 `supabase/migrations/...` 引發 `syntax error at or near "supabase"`。這條規則防止此類誤會再次發生。

## 版號規則（每次 commit 必做）
- 每次 `git commit` 時，**必須同時遞增 `src/version.ts` 的 dev 版號**
- 格式：`vX.Y.Z-dev.N`，例如 `v0.8.1-dev.1` → `v0.8.1-dev.2` → `v0.8.1-dev.3`
- 正式上線時才移除 `-dev.N` 後綴，變成 `v0.8.1`
- **commit 完成後必須在對話中回報版號**，格式：`✅ 已 commit，版本 v0.8.1-dev.3`
- 這讓用戶可以核對網頁上顯示的版號是否與對話記錄一致

### 為何這條規則存在
多台電腦 + 多個 Claude session 同時開發，沒有版號就無法確認哪個環境跑的是哪個版本。版號是跨對話、跨機器的唯一識別。

## 操作記錄（每次 commit 必做）
- 每次 `git commit` 時，**必須同時更新 `memory/dev-log.md`**
- 在檔案最上方（`---` 分隔線下方）新增一條記錄
- 格式：`## YYYY-MM-DD vX.Y.Z-dev.N [branch-name]` + 2-5 條改動摘要
- 這讓任何電腦 `git pull` 後都能知道「上次在另一台做了什麼」
- **新 session 開始時，先讀 `memory/dev-log.md` 了解最近的開發脈絡**

## 新電腦設定 SOP（clone 後必做）
**如果用戶說「設定開發環境」或這是一台新 clone 的電腦，只需兩步：**
1. `powershell scripts/setup-env.ps1`（Windows）或 `bash scripts/setup-env.sh`（Mac/Linux）
   - 這個腳本會自動：產生 .env → npm install → TypeScript 檢查
   - **不要手動建立 .env，不要從其他地方複製 .env，腳本裡有完整的正確值**
   - **本專案沒有 `.env.example`（已刪除），不要嘗試尋找或建立它**
2. 讀 `memory/dev-log.md` 了解最近的開發脈絡，然後回報設定結果

### 為何這條規則存在
2026-04-14 新電腦 clone 後，Claude session 兩次都沒有跑 setup-env 腳本，而是自己建 .env.example 叫用戶手動填值。刪除 .env.example 並簡化 SOP 為單一腳本，消除歧義。

## Git 工作流程（雲端為中心）
- **每完成一組修復/功能就 commit**，不要累積大量未 commit 的改動
- **收工前一定 `git push`**，確保雲端有最新版本（多台電腦開發靠 Git 同步）
- **開工前一定 `git pull`**，確保拿到最新版本

### 分支策略（feature → dev → main）
- `feature/*` — 功能開發，任何電腦都在這裡工作
- `dev` — 測試環境分支，push 後 Vercel 自動部署到 `poker-goal-dev.vercel.app`
- `main` — 正式環境分支，push 後 Vercel 自動部署到 `poker-goal.vercel.app`

### 標準流程
1. 在 `feature/*` branch 上開發
2. 每完成一組邏輯完整的改動就 `git commit` + `git push`
3. 功能做完 → merge 到 `dev` → push → 測試環境自動部署
4. 測試通過 → merge `dev` 到 `main` → push → 正式環境自動部署

### 禁止事項
- **絕對不要**在有大量未 commit 改動時切換分支（`git checkout` 會丟棄未 commit 的修改）
- **絕對不要**跳過 `dev` 直接 merge feature 到 `main`
- 如果用戶說「不要上正式機」，意思是不要 push/merge 到 main，但**仍然應該在 feature branch 上 commit + push**

### 為何這條規則存在
2026-04-13 在 feature branch 上做了大量引擎修復（engine.ts、botAI.ts 等 33 個檔案）但未 commit。用戶切換到 main 再切回來，git checkout 丟棄了所有未 commit 的改動，導致一整天的工作丟失。

## Feature Branch 保護規則（防止未完成功能上線）
**這是跨對話安全規則。每個 Claude session 在執行任何 git merge / git push 前，必須遵守以下全部條件：**

1. **絕對禁止在沒有用戶明確指示的情況下執行以下操作**：
   - ❌ `git merge <feature-branch>` 到 main
   - ❌ `git checkout main && git merge ...`
   - ❌ `git push origin main`（當 main 包含來自 feature branch 的改動時）
   - ❌ `git push origin <feature-branch>:main`

2. **每次要 push 到 main 之前，必須先問用戶**：
   - 「我準備把 `<branch-name>` merge 到 main 並 push 到正式機，確認要執行嗎？」
   - **等待用戶在聊天中明確回覆「是」/「確認」/「push」後才執行**
   - 用戶說「commit」不等於允許 push — commit 和 push 是兩個不同的動作

3. **新 session 開始時，如果發現當前在 feature branch 上**：
   - 讀 `memory/dev_workflow_hu_simulator.md`（或對應的 workflow 記憶）了解該 branch 的開發狀態
   - **不要假設** feature branch 已經完成可以 merge
   - **不要假設** 用戶想部署到正式機
   - 先問用戶要做什麼

4. **「完成任務」不等於「部署上線」**：
   - 程式碼寫完 ≠ 可以 merge
   - 測試通過 ≠ 可以 merge
   - 只有用戶明確說「merge 到 main」或「push 到正式機」才能 merge/push
   - CLAUDE.md 的「推送到正式機前的必做事項」是在**用戶授權 push 之後**才執行的清單，不是觸發 push 的條件

5. **如果其他 session 的上下文提到「準備上線」「可以 ship」「merge」等字眼**：
   - 這些是該 session 的建議，不是跨 session 的授權
   - 新 session **必須重新取得用戶授權**

### 為何這條規則存在
2026-04-14 HU 模擬器在 `feature/hu-simulator-v1` branch 上開發，尚未完成 smoke test，入場費被臨時改為 0 點（測試用）。某個 Claude session 在未經用戶授權的情況下將 feature branch merge 到 main 並 push，導致：
- 未完成的 HU 功能（含已知 bug）直接上線到 poker-goal.vercel.app
- 入場費 0 點被部署到正式機，任何人都能免費使用
- 用戶在不知情的情況下暴露了測試中的功能給所有使用者

## 部署（雙環境）

### 測試環境（Staging）
- 測試網址：https://poker-goal-dev.vercel.app/（待建立）
- 測試 Supabase：`btiqmckyjyswzrarmfxa`
- 測試機部署 = `git push origin dev`（Vercel 自動部署）
- DB migration 先在測試 Supabase 跑過，確認沒問題再跑正式的

### 正式環境（Production）
- 正式網址：https://poker-goal.vercel.app/
- 正式機部署 = `git push origin main`（Vercel 自動部署）
- Edge Functions 透過 Supabase Dashboard → Edge Functions → Via Editor 手動部署
- DB migration 透過 Supabase Dashboard → SQL Editor 手動執行

### Edge Function / DB Migration 部署順序（強制）
**任何貼到 Supabase Dashboard 的 Edge Function 或 SQL migration，必須照下列順序執行：**

1. **先貼到測試 Supabase**（`btiqmckyjyswzrarmfxa`）→ Deploy
2. **在 `poker-goal-dev.vercel.app` 實際驗證功能正常**（跑一遍會呼叫該 Function / 用到該 migration 的流程）
3. **驗證全通過後，才貼到正式 Supabase**（`qaiwsocjwkjrmyzawabt`）→ Deploy

**禁止事項**：
- ❌ 禁止一次把程式碼同時給用戶貼兩邊（即使是「同一段」程式碼）
- ❌ 禁止跳過測試環境直接上正式
- ❌ 禁止在測試環境未驗證前就產出正式環境的貼碼步驟

**給用戶程式碼時的正確格式**：
一次只給**一個**環境的貼碼指令。貼完測試環境後，等用戶回報驗證結果（或明確說「測試通過」），再給正式環境的貼碼指令。

### 為何這條規則存在
2026-04-14 Claude session 在給 Edge Function 替換碼時，把測試環境和正式環境的貼碼步驟寫在同一則訊息，用戶一貼就會兩邊同時更新，失去「先測試再上線」的防護機制。這條規則確保部署節奏強制分兩步，讓 bug 有機會在測試環境被攔下。

## 推送到正式機前的必做事項（按順序）
1. 確認 `dev` 環境已測試通過
2. 更新 `src/version.ts` 版本號
3. 更新 `CHANGELOG.md` — 記錄這個版本的新功能、改動、修復
4. 更新 memory `MEMORY.md` — 如果有新的產品決策或功能狀態變更
5. 更新此檔案 `CLAUDE.md` — 如果有新的固定規則需要記住
6. `git checkout main && git merge dev && git push origin main`

## 推送後的必做驗證（自動執行，不需用戶提醒）
每次 `git push origin main` 後，**必須依序自動完成以下三步驟再回報**：

1. **TypeScript 編譯檢查**
   ```
   npx tsc -b --noEmit
   ```
   - exit code 0 = 通過，繼續
   - 有錯誤 = 立即修復，重新 push，再從步驟 1 開始

2. **線上內容驗證**（用 WebFetch 抓正式網址）
   - 若本次有改動 `deck.html`：抓 `https://poker-goal.vercel.app/deck.html?v=X`，確認關鍵新增內容存在
   - 若本次有改動 React app：抓 `https://poker-goal.vercel.app/`，確認頁面有正確的 `<script>` 引用（代表 Vite build 產出正常）
   - 驗證失敗 = 診斷原因，修復，重新 push

3. **回報結果 + 給版本連結**
   - 格式：`✅ TypeScript 零錯誤 ｜ ✅ 線上內容已確認 ｜ 👉 https://poker-goal.vercel.app/deck.html?v=X`
   - `?v=X` 每次部署遞增（v3 → v4 → v5…），用於繞過 CDN 快取

### 為何這條規則存在
2026-04-13 發生過：(1) 未使用的 import 導致 TS6133 build 失敗，Vercel 靜默沿用舊版本；(2) 用戶用無痕模式仍看到舊內容，CDN 快取未清除。自動驗證可在下一次對話前就發現並修復問題。

## 專案資訊
- 路徑：`C:\Users\User\Desktop\gto-poker-trainer`
- GitHub：`https://github.com/alphaxe0819/poker-mentor.git`
- Tech Stack：React 19 + TypeScript 5.9 + Vite 8 + Supabase + Vercel
- Supabase 正式 URL：`https://qaiwsocjwkjrmyzawabt.supabase.co`
- Supabase 測試 URL：`https://btiqmckyjyswzrarmfxa.supabase.co`
- 開發流程圖：`docs/two-machine-workflow.html`

## 目前產品狀態
- 免費用戶不限訓練次數
- 答題不加點數，點數只從任務和未來儲值取得
- AI 教練使用 Claude Haiku，5 點/則訊息
- 點數系統用 Supabase RPC 原子操作（add_points / spend_points）
