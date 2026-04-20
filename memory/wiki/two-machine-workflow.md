---
name: Two-Machine Workflow
description: 兩台電腦共用 dev 分支的開工 / 收工 SOP + 自動化機制 + 衝突解法
type: project
updated: 2026-04-20
---

## 核心原則

**一分支、硬紀律、腳本包容**

- 兩台都在 `dev`，不開 `feature/*`（避免孤島，2026-04-14 / 2026-04-20 都發生過）
- `main` 仍需用戶明確授權才 push
- 每一個 session 打開 = 自動 sync；收工 = 當日必 push

---

## 自動化機制（SessionStart hook）

每次 Claude Code 打開，hook 依序跑：

### 1. `scripts/session-sync.sh` — 容 WIP 的 pull
- `git fetch --all`
- 有 tracked/staged 改動 → `git stash push -u` → `git pull --ff-only` → `git stash pop`
- 沒 WIP → 直接 `git pull --ff-only`
- 任何環節失敗不中斷 session，Claude 會看到輸出後跟用戶確認

### 2. `scripts/session-start-reminder.sh` — 印出實況
Claude 啟動後立刻看到：
- 遠端 `origin/dev` 最近 5 筆 commit（另一台今天做了什麼）
- 本地 vs 遠端差異（+N / -N commits）
- 分支 + 版本
- 本機 WIP 清單
- `memory/dev-log.md` 最新 3 筆

**這樣打開第一秒就知道差異，不用問、不用查。**

---

## 角色偏好（軟規則，不強制）

| 機器 | 偏好領域 | 檔案範圍 |
|---|---|---|
| A 桌機 | **Pipeline** | `scripts/gto-pipeline/` / `src/lib/gto/gtoData_*` / `memory/wiki/range-*` |
| B 行動機 | **Product** | `public/exploit-coach-*` / `src/components/` / `src/tabs/` / `src/lib/exploit/` / `supabase/functions/` |
| 共用 | **Memory / Docs** | `memory/dev-log.md` / `src/version.ts` / `CLAUDE.md` / `memory/wiki/*` |

- 越界 OK（另一台沒開時這台可以全包）
- 同日同檔兩邊都要動 → 先告知對方（或隔天 pull 後再改）
- 角色只是啟動時的「建議」，不是強制牆

---

## 預期衝突 + 自動解法

### `src/version.ts`
兩台都遞增版號，衝突 100% 會發生。
- **解法**：取較大數字（`max(dev.N, dev.M)` + 1）
- 不要回退

### `memory/dev-log.md`
兩台都在檔頭 `---` 下追加區塊。
- **解法**：兩邊區塊並存，按時間排序（新的在上）
- Git 3-way merge 多半自動解；手動解時兩段都保留

### `memory/wiki/*.md`（roadmap / workflow）
通常只一台維護，但可能重疊。
- **解法**：停下問人

### `package.json` / `package-lock.json`
任一台加依賴都會動。
- **解法**：停下，確認雙方是否都需要這個依賴；需要則取聯集 + `npm install` 重建 lock

---

## 開工 SOP（兩台通用）

Claude 打開後自動做（按 `session-start-reminder.sh`）：

1. 看遠端最近 5 筆 commit（認知對方活動）
2. 看本機 WIP（認知自己未完事）
3. 讀 `memory/dev-log.md` 近期 3 筆
4. 回報：分支 / 版本 / 近期改動 / 角色建議
5. 【必問】這個 Tab 角色？(Pipeline / Product / 自由)
6. 等用戶指示

---

## 收工 SOP（兩台通用）

用戶喊「收工」→ Claude 跑 CLAUDE.md 的收工流程：

1. `/compound` 提取對話副產品進 wiki
2. 所有改動 commit（含版號遞增 + dev-log 追加）
3. **`git push` 到 remote**（當日必 push，不留孤島）
4. 產品改動才跑測試機驗證（curl dev Vercel）

---

## 孤島預防清單

觸發「另一台拿不到」的典型情境：

| 情境 | 後果 | 防禦 |
|---|---|---|
| WIP 沒 commit 就關機 | 另一台完全看不到 | 收工 SOP 強制 commit；session-sync 會提示 WIP |
| commit 沒 push 就關機 | 另一台 pull 拿不到 | 收工 SOP 強制 push |
| 在 `feature/*` 分支工作 | push 上去但另一台在 dev 看不到 | 不開 feature branch；硬性規則 |
| 本地 `.env` 改了沒同步 | 另一台 session 跑錯 config | `.env` 永遠本機，不進 repo；改動要口頭告知對方 |

---

## 故障排查

**開工後發現「本地落後 -N」但 pull 不動**
→ session-sync 已嘗試 auto-stash；看 terminal 輸出確認 stash 狀態：
```
git stash list
git stash apply stash@{0}
```

**開工後發現自己在 feature 分支**
→ 今天另一台遇到的 `feature/exploit-lab` 案例。處理：
1. `git add <wip 檔>` → `git commit -m "wip: ..."` → `git push origin <branch>`（先保留）
2. `git checkout dev` → `git pull --ff-only origin dev`
3. 之後再決定 feature 分支要不要 merge / cherry-pick / 丟棄

**src/version.ts 版號衝突**
→ 取兩邊較大數字 +1，重新 commit。dev-log 把兩邊區塊都保留。

---

## 相關連結

- [[range-collection-roadmap]] — 目前 Pipeline 線的分批進度
- [[no-unauthorized-push]] — main 分支保護規則
- [[deploy-scope]] — 產品 vs 開發流程改動的驗證差異
