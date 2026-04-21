---
name: GTO Pipeline 環境 Setup
description: `scripts/gto-pipeline/` 子目錄的 .env + node_modules setup 流程（setup-env.ps1 不涵蓋）
type: reference
updated: 2026-04-21
---

# GTO Pipeline 環境 Setup

`scripts/gto-pipeline/` 底下的 batch-worker / convert-to-db / test-retrieval 等 script
使用一個**獨立**於 repo root 的 `.env` + `package.json`，跟 Vite 用的 root `.env` 不是同一回事。

> **⚠ 常踩的坑**：`scripts/setup-env.ps1` 只處理 root `.env` + root `npm install`，
> **不**涵蓋 `scripts/gto-pipeline/`。每台新電腦要跑 GTO pipeline 前需另外 setup。

---

## 兩個 `.env` 的差異

| 檔案 | 誰用 | 內容 | 能進 repo | source |
|---|---|---|---|---|
| `<repo>/.env` | Vite (前端 build) | `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / 付款 key | ❌（.gitignore） | `scripts/setup-env.ps1` 硬編（都是 public 值） |
| `<repo>/scripts/gto-pipeline/.env` | `batch-worker.mjs` 等 pipeline scripts | `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | ❌（.gitignore） | **用戶從 Supabase Dashboard 手貼**（service_role 是 secret，不能硬編進 public repo） |

---

## 新電腦 / `.env` 遺失時的 setup 流程

### Step 1：建 `scripts/gto-pipeline/.env`

到 Supabase Dashboard → 測試 project `btiqmckyjyswzrarmfxa` → Settings → API →
找 **`service_role` secret** 欄（點 `Reveal` 才會顯示）→ 複製 key。

然後在本機手動建檔（**不要**把 key 貼進 Claude 對話，secret 進對話 log 有外洩風險）：

檔案：`scripts/gto-pipeline/.env`

```
SUPABASE_URL=https://btiqmckyjyswzrarmfxa.supabase.co
SUPABASE_SERVICE_KEY=eyJ...你的 service_role key
```

### Step 2：`npm install`

```bash
cd scripts/gto-pipeline
npm install
```

裝的是 `@supabase/supabase-js` 單一 dep（`package.json` 定義，13 packages 總計，0 vulns）。

### Step 3：驗證

```bash
node batch-worker.mjs --machine <機器名> --max 1 --dry-run
```

預期：claim 1 個 pending batch → 印出 scenario + flop → dry-run 自動還原 row → exit 0。
若 exit 1 且看到 `Missing SUPABASE_URL or SUPABASE_SERVICE_KEY` = `.env` 沒建或格式錯。

---

## 為何 service_role 不能硬編

- Repo 是 **public GitHub**（`alphaxe0819/poker-mentor`）
- `service_role` key 可 **bypass RLS**，拿到就能任意 INSERT/UPDATE/DELETE DB
- 進 repo = 任何人都能毀 DB
- 相較之下 `anon` key 受 RLS 保護，可以硬編（`scripts/setup-env.ps1` 就硬編了 anon key）

---

## 為何 batch-worker 必須走 service_role（不能改用 anon）

`gto_postflop` + `gto_batch_progress` 的 RLS policy（見 `supabase/migrations/20260416-gto-postflop.sql`）
**只對 `authenticated` 開 SELECT**，沒對 `anon` 開 INSERT/UPDATE：

```sql
CREATE POLICY "authenticated users can read gto_postflop"
  ON gto_postflop FOR SELECT TO authenticated USING (true);
```

batch-worker 要 UPSERT（INSERT ... ON CONFLICT DO UPDATE）+ UPDATE status，
anon 完全沒權限，只能走 `service_role` bypass RLS。

這跟 `solver_postflop_mtt` 設計**不同** — 那個是 T-063 刻意開給 anon + authenticated 的
（對齊 `solver_postflop_6max`），讓 pipeline scripts 能直接用 anon 跑 Tier A retrieval 驗證。
詳見 [[supabase-edge-function-gotchas]] 坑 4（RLS 設計差異）。

---

## Claude session 被派到本 task 時的動作原則

如果用戶派「執行者接 T-045」「跑 batch-worker」等 GTO pipeline task，**第一件事**：

1. `ls scripts/gto-pipeline/.env` 檢查
2. `ls scripts/gto-pipeline/node_modules/@supabase/supabase-js` 檢查
3. 兩者皆缺 → 直接引用本頁告訴用戶「按本頁 Step 1-2 做 setup」，**不要**給 A/B/C 選項繞圈
4. 不要建議用戶把 service_role 貼進對話（對話會進 log）

歷史踩坑：2026-04-21 家裡電腦跑 T-045 時，Claude 先給 3 個選項，再問能否貼 key 到對話 —
用戶挫折。根因是 T-043 setup 時 Claude 沒更新 `setup-env.ps1` 也沒寫 wiki，下個 session
沒 context 只能瞎問。本頁就是修這個 gap。

---

## 未來 TODO（非立即）

- 擴充 `setup-env.ps1` 加一段 **檢測** `scripts/gto-pipeline/.env` 存在性，缺就印清楚的
  Step 1-2 指令（不自動建檔，因為 service_role 要人工從 Dashboard 複製）
- 考慮改 `batch-worker.mjs` 支援 Supabase CLI secret manager（`supabase secrets get`），
  但需用戶跑過 `supabase login`，增加 setup 步驟，目前 trade-off 不划算

---

## 相關連結

- [[supabase-edge-function-gotchas]] — Edge Function 部署坑（跟本頁同一個 Supabase RLS 體系）
- [[two-machine-workflow]] — 多機 / 多 session 協作規則
- [[task-board]] — GTO pipeline 相關 task（T-042 / T-043 / T-045 / T-046 等）
