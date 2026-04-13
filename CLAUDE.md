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

## Git 工作流程（防止改動丟失）
- **每完成一組修復/功能就 commit**，不要累積大量未 commit 的改動
- Feature branch 上的 commit 不會影響正式機（只有 `git push origin main` 才觸發 Vercel 部署）
- 建議流程：
  1. 在 feature branch 上開發（如 `feature/hu-simulator-v1`）
  2. 每完成一組邏輯完整的改動就 `git commit`
  3. 可選：`git push origin <feature-branch>` 備份到遠端（不觸發部署）
  4. 準備上線時再 merge 到 main
- **絕對不要**在有大量未 commit 改動時切換分支（`git checkout` 會丟棄未 commit 的修改）
- 如果用戶說「不要上正式機」，意思是不要 push 到 main，但**仍然應該在 feature branch 上 commit**

### 為何這條規則存在
2026-04-13 在 feature branch 上做了大量引擎修復（engine.ts、botAI.ts 等 33 個檔案）但未 commit。用戶切換到 main 再切回來，git checkout 丟棄了所有未 commit 的改動，導致一整天的工作丟失。

## 部署
- 正式網址：https://poker-goal.vercel.app/
- 正式機部署 = `git push origin main`（Vercel 自動部署）
- Edge Functions 透過 Supabase Dashboard → Edge Functions → Via Editor 手動部署
- DB migration 透過 Supabase Dashboard → SQL Editor 手動執行

## 推送到正式機前的必做事項（按順序）
1. 更新 `src/version.ts` 版本號
2. 更新 `CHANGELOG.md` — 記錄這個版本的新功能、改動、修復
3. 更新 memory `MEMORY.md` — 如果有新的產品決策或功能狀態變更
4. 更新此檔案 `CLAUDE.md` — 如果有新的固定規則需要記住
5. `git push origin main`

## 專案資訊
- 路徑：`C:\Users\User\Desktop\gto-poker-trainer`
- GitHub：`https://github.com/alphaxe0819/poker-mentor.git`
- Tech Stack：React 19 + TypeScript 5.9 + Vite 8 + Supabase + Vercel
- Supabase URL：`https://qaiwsocjwkjrmyzawabt.supabase.co`

## 目前產品狀態
- 免費用戶不限訓練次數
- 答題不加點數，點數只從任務和未來儲值取得
- AI 教練使用 Claude Haiku，5 點/則訊息
- 點數系統用 Supabase RPC 原子操作（add_points / spend_points）
