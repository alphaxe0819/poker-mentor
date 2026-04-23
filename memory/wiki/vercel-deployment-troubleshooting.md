---
name: Vercel Deployment Troubleshooting
description: Vercel 部署 webhook 斷線 / main branch silent drop 的繞過路徑 + CLI 工作流 + Redeploy 行為糾正
type: reference
updated: 2026-04-22
---

## 背景（2026-04-22 v0.8.5 ship 事件）

2026-04-21 士林 push `d022317 Release v0.8.5` + `6891c6c`（empty commit 想觸發 redeploy）到 `main`，**兩筆 webhook 都沒被 Vercel 處理**，正式機卡在 v0.8.3。

**關鍵觀察**：同一時間 `dev` branch push 13+ 筆 commit，webhook **全部正常** fire Preview build。所以不是 integration 整個斷，**只有 main 的那兩筆 silent drop**。

2026-04-22 用 CLI prebuilt + tgz 繞過，成功推上 `dpl_2mrSemknaAJz3Y6iZPJQxiF6vcJc`。

---

## 重要觀念糾正

### Vercel "Redeploy" 按鈕 ≠ 抓 git HEAD

**預設 Redeploy** = redeploy **same commit 的 same source files**。
- 從 `996d271 (v0.8.3)` 點 Redeploy → 永遠產出 v0.8.3，無論 git main HEAD 現在是什麼
- 新版 Dashboard 有個 "Use latest commit" 勾選框才會抓 HEAD，但不是預設

### 現代 Vercel 走 GitHub App，不走 repo-level webhook

- 去 `github.com/<user>/<repo>/settings/hooks` 看永遠是**空的**，這是正常
- 真正的 webhook 在 GitHub App level（user/org settings → Installed apps → Vercel）
- Vercel Hobby plan **看不到 webhook delivery log**，診斷能力有限

### 診斷 webhook 的正確入口

1. **Vercel Dashboard → Deployments** 頁最上面那筆 Production 的 commit hash 是什麼？
   - 跟 git main HEAD 一致 = webhook 正常
   - 落後 = webhook silent drop
2. **Vercel Dashboard → Settings → Git** 看 Connected Git Repository
   - Connected 顯示 repo 名 = integration OK
   - Disconnect 才是真的斷
3. **不要**去 GitHub repo Settings → Webhooks（一片空白是正常）

---

## 繞過方案（webhook silent drop 時）

### 路徑 A：Deploy Hook（最快，不吃 upload quota）

1. Vercel Dashboard → 專案 → Settings → Git → **Deploy Hooks** → Create
2. 填 `Hook Name` + `Git Branch Name` (通常 `main`)
3. 拿到 URL：`https://api.vercel.com/v1/integrations/deploy/prj_xxx/yyy`
4. `curl -X POST <URL>` → Vercel 會 git clone branch HEAD 重 build
5. **不消耗 upload quota**，是內部 API trigger

### 路徑 B：CLI prebuilt + archive（如果 Deploy Hook 沒建）

```bash
# 首次（一次就好）
npx vercel login                    # 互動，用 `!` 前綴在 Claude prompt 跑
npx vercel link --yes --project poker-goal

# 每次部署
npx vercel pull --yes --environment=production
npx vercel build --prod             # 本地 build → .vercel/output
npx vercel deploy --prebuilt --prod --archive=tgz
```

**為什麼需要 `--prebuilt` + `--archive=tgz`：**
- 純 `vercel --prod` 會散裝上傳 cwd 所有未 ignore 檔（1 file = 1 API request）
- 本 repo 全檔 1.1GB，即使 .gitignore 排了 TexasSolver 仍可能命中 **5000 req/24h Hobby quota**
- `--prebuilt` 只上傳 `.vercel/output`（約 567KB，幾百個小檔）
- 但幾百個檔還是可能爆 req 額度 → 加 `--archive=tgz` 打包成 1 個 tar.gz，**1 個 request 搞定**

⚠ 如果 quota 已爆需等 **24 小時** reset。

### 路徑 C：Deploy Hook + CLI 都不行

- 升 Vercel Pro（有 webhook delivery log）
- 或進 GitHub user settings → Installed apps → Vercel → Configure → Revoke 再重裝（但會斷所有 integration）

---

## CLI 工作流副作用

- `vercel link` 會**自動把 `.vercel` 加到 `.gitignore`**（本 repo 已 commit @ `77b8004`）
- 切 branch 前若 working tree 有 `.vercel/` 且 `.gitignore` 沒排，會擋 checkout → 先 commit gitignore 改動或 stash
- `vercel pull` 產出 `.vercel/.env.production.local` 含 production env（已 ignore）

---

## 可能的 webhook silent drop 根因（未 100% 證實）

- **連續 push dedupe**：release commit + 立即 empty commit 太近，Vercel 內部可能誤判 noop 把兩筆都丟
- **Hobby tier 靜默 drop**：build queue 短暫過載，不 retry、不通知
- **GitHub App token 對某個特定時刻 401**：intermittent，不 retry

---

## 驗收部署的 curl 指令

```bash
# 抓 HTML 確認 HTTP 200 + script hash
curl -s -o /tmp/prod-check.html -w "HTTP=%{http_code}\n" https://poker-goal.vercel.app/

# 從 HTML 抓 bundle 路徑，再抓 bundle 找 version 字串
# (VERSION 被 bundle 到 App.*.js，不是 index.*.js)
curl -sL https://poker-goal.vercel.app/assets/App.<hash>.js | grep -o 'v0\.[0-9]*\.[0-9]*'
```

HTML cache 通常 CDN 清 30-60s 會更新；用戶看到舊版大多是瀏覽器 cache，請用無痕視窗或 Ctrl+Shift+R。

---

## 相關

- [[deployment-state]] — Supabase / Vercel 基礎設施狀態
- [[deploy-scope]] — 產品 vs 開發流程改動分類
- [[two-machine-workflow]] — 多機開發 SOP
