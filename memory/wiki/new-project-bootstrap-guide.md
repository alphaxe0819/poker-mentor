---
name: 新專案建立 Runbook
description: 從零建立新專案的完整步驟；用 Cloudflare Pages + Supabase + Vite+React+TS；包含決策點 / infra 建立 / 複製舊專案基礎 / 初始化前端 / 首次部署 / 開新 Claude session 第一個 prompt
type: runbook
status: ready
updated: 2026-04-23
---

> **這份 guide 的角色**：新專案建立 **step-by-step 操作手冊**。
> 舊專案（gto-poker-trainer）收尾後，用這份建新專案。總時間約 **2.5 小時**。

---

## 角色說明

- **👤 你**：操作 Dashboard、跑 bash 指令、貼 SQL
- **🤖 新 Claude**：新資料夾開啟 Claude Code 後的 session

---

## 環境預設

- Windows + Git Bash（對齊現有設定）
- node / npm / git 已安裝
- 有 GitHub / Supabase / Cloudflare 帳號（免費 tier）
- 瀏覽器可用

---

# Phase 0：預備決策（5-10 min，純想）

### A. 新專案名字
- 建議 kebab-case：`villain-coach` / `exploit-lab` / `poker-villain` / `read-opponent`
- 這個名字會用於：**GitHub repo / Supabase project / Cloudflare Pages project / 資料夾名**

### B. Domain
- **暫時不買**：用 Cloudflare 送的 `{project}.pages.dev`（MVP 階段夠用）
- **買新**：推 Cloudflare Registrar（價格透明、續約無回收費）
- **不用舊 poker-goal**：違背新專案精神

### C. Supabase project
- 建議兩個：`{project}-dev`（測試）+ `{project}-prod`（正式）
- 測試先建，正式等 MVP 完成再建
- 免費 tier（500 MB DB / 2 GB bandwidth）

### 決定好填這個表

```
專案名稱：___________________
GitHub repo 名：___________________
Domain：___________________（或 .pages.dev）
Supabase 測試 project：___________________
```

---

# Phase 1：建 infra（~45 min，全部 Dashboard 操作）

## 1.1 GitHub 新 repo

1. 開 https://github.com/new
2. Repository name：填你的專案名
3. **Private**（推薦）
4. **不要**勾：
   - ❌ Initialize with README
   - ❌ Add .gitignore
   - ❌ Choose a license
5. 建立完，記下 SSH URL：`git@github.com:你/villain-coach.git`

## 1.2 Supabase 新 project（先開測試）

1. 開 https://supabase.com/dashboard/new
2. Name：`villain-coach-dev`（替換你的名）
3. Database Password：產生強密碼 → **記到密碼管理器**
4. Region：選最近（Asia Northeast `ap-northeast-1` 東京，或 Singapore）
5. 免費 tier
6. 等 project 建好（~2 分鐘）
7. 進 Settings → API：
   - **Project URL** 記下（`https://xxxxx.supabase.co`）
   - **anon public key** 記下（`eyJhbGci...`）
   - **service_role key** 記下（**極敏感**，不要貼對話）

## 1.3 Cloudflare Pages（連 GitHub）

1. 開 https://dash.cloudflare.com → Workers & Pages
2. Create application → Pages → Connect to Git
3. Select repo：剛建的 villain-coach（首次要授權 Cloudflare access GitHub）
4. 設定：
   - Project name：villain-coach
   - Production branch：`main`
   - Framework preset：**Vite**（沒出現選 None）
   - Build command：`npm run build`
   - Build output directory：`dist`
   - 先不加 env vars（Phase 5 才加）
5. Save and Deploy（會 fail 因為 repo 還空，沒關係）
6. 記下部署 URL：`https://villain-coach.pages.dev`

---

# Phase 2：建本地資料夾 + 複製舊專案基礎（~30 min，bash 操作）

## 2.1 建資料夾 + git init

```bash
cd /c/Users/User/Desktop/
mkdir VILLAIN-COACH   # 用你的專案名（kebab or SCREAMING_SNAKE 都可）
cd VILLAIN-COACH
git init
git branch -M main
git remote add origin git@github.com:你/villain-coach.git
```

## 2.2 設 OLD 變數（方便複製）

```bash
OLD=/c/Users/User/Desktop/gto-poker-trainer
ls $OLD/CLAUDE.md  # 驗證路徑對（應該印出檔名）
```

## 2.3 複製 Claude Code 設定

```bash
# CLAUDE.md（先複製，新 Claude 幫你精簡）
cp $OLD/CLAUDE.md ./

# Claude Code 配置（hooks / skills / settings）
cp -r $OLD/.claude ./

# session-sync 腳本
mkdir -p scripts
cp $OLD/scripts/session-sync.sh ./scripts/
cp $OLD/scripts/session-start-reminder.sh ./scripts/
```

## 2.4 複製精選 wiki（只帶核心）

```bash
mkdir -p memory/wiki

# 核心 spec（新專案直接用）
cp $OLD/memory/wiki/product-vision-v2.md memory/wiki/
cp $OLD/memory/wiki/exploit-coach-closed-loop-design.md memory/wiki/
cp $OLD/memory/wiki/villain-profile-design.md memory/wiki/
cp $OLD/memory/wiki/database-schema-v2-spec.md memory/wiki/

# 參考（選配）
cp $OLD/memory/wiki/gto-wizard-pricing-analysis.md memory/wiki/
cp $OLD/memory/wiki/supabase-edge-function-gotchas.md memory/wiki/
cp $OLD/memory/wiki/new-project-bootstrap-guide.md memory/wiki/  # 這份 guide
```

## 2.5 複製 Schema v2 migration

```bash
mkdir -p supabase/migrations
cp $OLD/supabase/migrations/20260424-gto-solutions-v2.sql supabase/migrations/
cp $OLD/supabase/migrations/20260425-gto-batch-progress-v2.sql supabase/migrations/
```

## 2.6 （選配）複製 pipeline scripts

如果新專案要自產 GTO：

```bash
mkdir -p scripts/gto-pipeline
cp $OLD/scripts/gto-pipeline/batch-worker.mjs scripts/gto-pipeline/
cp $OLD/scripts/gto-pipeline/seed-batches.mjs scripts/gto-pipeline/
cp $OLD/scripts/gto-pipeline/scenarios.mjs scripts/gto-pipeline/
cp $OLD/scripts/gto-pipeline/boards.mjs scripts/gto-pipeline/

# encoder lib（T-096b 完成後才有）
cp -r $OLD/scripts/gto-pipeline/lib scripts/gto-pipeline/ 2>/dev/null || true
```

## 2.7 建基礎 memory 檔

**`memory/dev-log.md`**（空的）：

```markdown
# Dev Log — 操作記錄

> 每次 commit 同步更新，記錄做了什麼。跟著 Git 同步到所有電腦。
> 最新的記錄在最上面。

---
```

**`memory/index.md`**：

```markdown
# Knowledge Index

> 分級查詢入口。AI 先讀這個檔案，找到相關頁再讀具體內容。

## Product
- [[product-vision-v2]] — 產品願景（從舊專案帶來，新 Claude 會幫改版）
- [[exploit-coach-closed-loop-design]] — 閉環設計（approved 直接用）
- [[villain-profile-design]] — villain v2 profile 設計

## Development
- [[database-schema-v2-spec]] — Schema v2 規格
- [[supabase-edge-function-gotchas]] — Edge Function 部署坑

## Reference
- [[gto-wizard-pricing-analysis]] — 競品分析
- [[new-project-bootstrap-guide]] — 本專案如何建立（本 guide）
```

---

# Phase 3：初始化前端（~30 min，Claude 或你操作）

## 3.1 Vite + React + TypeScript

```bash
npm create vite@latest . -- --template react-ts
# 提示「Current directory is not empty」→ 選 Ignore files and continue
npm install
```

## 3.2 基礎套件

```bash
npm install @supabase/supabase-js react-router-dom
npm install -D @types/node tailwindcss@next postcss autoprefixer
npx tailwindcss init -p
```

## 3.3 設定 Tailwind

**`tailwind.config.js`**：
```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

**`src/index.css`** 最上面加：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3.4 Supabase client

**`src/lib/supabase.ts`**：
```typescript
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anon)
```

## 3.5 本地環境變數

**`.env.local`**：
```
VITE_SUPABASE_URL=https://你的dev.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...（你的 anon key）
```

## 3.6 SPA routing（Cloudflare 需要）

**`public/_redirects`**：
```
/* /index.html 200
```

## 3.7 版本檔

**`src/version.ts`**：
```typescript
export const VERSION = 'v0.1.0-dev.1'
export const APP_NAME = 'Villain Coach'  // 替換你的專案名
```

## 3.8 `.gitignore` 確認有：

```
node_modules/
dist/
.env.local
.env
```

## 3.9 本地驗證

```bash
npm run dev    # 應能在 localhost:5173 看到 Vite React 預設頁
npm run build  # 應該成功產 dist/
```

---

# Phase 4：部署 Supabase Schema（~15 min）

## 4.1 測試 Supabase 貼 2 個 migration

1. 登入 Supabase Dashboard → 選你的測試 project
2. 左側 SQL Editor → **+ New query**
3. 打開 `supabase/migrations/20260424-gto-solutions-v2.sql`，Ctrl+A Ctrl+C
4. 貼到 SQL Editor → **Run**
5. 再 **+ New query**：
6. 打開 `supabase/migrations/20260425-gto-batch-progress-v2.sql`，貼 → Run

## 4.2 驗證

在 SQL Editor 分開跑這幾條：

```sql
-- (a) 表
SELECT tablename FROM pg_tables WHERE tablename IN ('gto_solutions', 'gto_batch_progress');
-- 預期 2 rows
```

```sql
-- (b) RPC
SELECT proname FROM pg_proc WHERE proname = 'claim_gto_batch';
-- 預期 1 row
```

## 4.3 正式 Supabase 暫不部署（MVP 完成再建）

---

# Phase 5：首次部署（~15 min）

## 5.1 First commit + push

```bash
git add .
git commit -m "chore: 新專案初始化（Vite + React + TS + Supabase + Cloudflare Pages）"
git push -u origin main
```

## 5.2 Cloudflare Pages 設 env vars

1. Dashboard → Pages → villain-coach → Settings → Environment variables
2. **Production + Preview** 兩個都加：
   - `VITE_SUPABASE_URL` = 測試 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = 測試 Supabase anon key
3. Deployments → 最近一次 → **Retry deployment**（env var 才生效）

## 5.3 驗證部署

```bash
curl -s -o /tmp/pages.html -w "HTTP=%{http_code} SIZE=%{size_download}\n" https://villain-coach.pages.dev/
# 預期：HTTP=200
```

瀏覽器打開 `https://villain-coach.pages.dev` 應看到 Vite React 預設頁。

---

# Phase 6：開新 Claude Code session

## 6.1 啟動

Claude Code CLI 或桌面 app → 開啟 `C:\Users\User\Desktop\VILLAIN-COACH`

## 6.2 第一個 prompt（貼給新 Claude）

```
這是新專案 [villain-coach]。背景：

- 舊專案 poker-goal 收尾中，決定從零重建
- 用戶 0 / MRR 0（pre-launch）
- 核心願景：針對特定對手的剝削助手
- 前端 Vite + React + TS，部署在 Cloudflare Pages
- 後端 Supabase（auth + DB + Edge Function）
- 舊專案 wiki 已精選複製到 memory/wiki/

請按順序做：

1. 讀 CLAUDE.md（從舊專案帶來，需要精簡）
2. 讀 memory/index.md
3. 讀 memory/wiki/product-vision-v2.md
4. 讀 memory/wiki/exploit-coach-closed-loop-design.md
5. 讀 memory/wiki/database-schema-v2-spec.md

然後做兩件事：

A. 精簡 CLAUDE.md：
   - 砍掉：HU 模擬器 / 訓練模式 / 任務系統 / 多 Edge Function / poker-goal URL 相關規則
   - 保留：繁中、大腦 reactive-only、程式碼交付規則（小段貼大段給檔案路徑）、乾淨可複製 SQL 規則、版號規則、git workflow、測試正式環境保護
   - 更新：URL 改 villain-coach.pages.dev / Vercel → Cloudflare / 新 Supabase ref / 專案名
   - 把原「雙 Supabase 環境」規則保留（測試 ref + 正式 ref 未來會開第二個）

B. 根據 product-vision-v2，產新 memory/wiki/task-board.md：
   - 列 P0 前 5 個 task（Landing / Onboarding / Villain 管理 / 剝削互動 / Auth UX）
   - 每個 task 有明確 scope + 工時估 + 前置依賴

做完 commit push，然後等我 review 後派第一個 task。

注意：
- 不動 Supabase（已建好 schema，你只讀不寫）
- 測試環境用 {YOUR_SUPABASE_DEV_REF}（在 .env.local）
- 不要自己開新 Edge Function（P1 才需要）
```

---

# 驗證 checklist（完成所有 Phase 後確認）

- [ ] GitHub repo 建好 + 首 commit 推上去
- [ ] Supabase 測試 project 建好 + migration 部署
- [ ] Cloudflare Pages 連 GitHub + env vars 設好
- [ ] 本地 `npm run dev` + `npm run build` 都能跑
- [ ] `https://villain-coach.pages.dev` curl 回 HTTP 200
- [ ] 新 Claude Code session 開好 + 讀完基礎 wiki
- [ ] CLAUDE.md 精簡完（新 Claude 做）
- [ ] 新 task-board 有 5 個 P0 task（新 Claude 做）

---

# 時程預估

| Phase | 時間 | 誰做 |
|---|---|---|
| 0. 預備決策 | 5-10 min | 你（純想）|
| 1. 建 infra | 45 min | 你（Dashboard）|
| 2. 複製基礎 | 30 min | 你（bash）|
| 3. 初始化前端 | 30 min | 你（或 Claude）|
| 4. Supabase schema | 15 min | 你（Dashboard）|
| 5. 首次部署 | 15 min | 你 |
| 6. 開新 Claude session | 10 min | 你 |
| **總計** | **~2.5 hr** | |

半天就能讓新專案起跑。

---

# 跟舊專案共存

完成後：

| Session | cwd | 角色 |
|---|---|---|
| 舊專案（gto-poker-trainer） | `C:\Users\User\Desktop\gto-poker-trainer` | 📚 archive，ship v1.0 + monitor 後凍結 |
| 新專案（villain-coach） | `C:\Users\User\Desktop\VILLAIN-COACH` | 🚀 主要工作 session |

兩個完全獨立（不同 CLAUDE.md / 不同 memory / 不同 Supabase / 不同 Cloudflare）。

Claude Code 依你開啟的資料夾自動切換 context。

---

# 未來要做的（MVP 開發完後）

1. **建正式 Supabase project**（`villain-coach-prod`）
2. **貼 schema migration 到正式**
3. **Cloudflare Pages Production branch env vars** 切正式 Supabase（Preview 仍測試）
4. **買 custom domain**（可選）
5. **Launch**

這些等你 MVP scope 做完（Landing + Villain 管理 + 剝削 chat）再動。

---

# 相關連結

- [[product-vision-v2]] — 新專案願景
- [[exploit-coach-closed-loop-design]] — 核心閉環設計
- [[database-schema-v2-spec]] — Schema v2 規格
- [[villain-profile-design]] — villain profile v2 設計
