---
name: Multi-Session Workflow
description: 多 session / 多電腦協作 — 大腦 + 執行者雙角色模型，以 wip branch 隔離作業、大腦整合到 dev
type: project
updated: 2026-04-20
---

## 核心模型：雙角色 + wip branch + 大腦整合

```
執行者 A 在 wip/T010-c2 作業          執行者 B 在 wip/T030-verify 作業
        ↓                                     ↓
   push wip branch                        push wip branch
        ↓                                     ↓
        └──────────────┬──────────────────────┘
                       ↓
               大腦 session
                ↓ pull 各 wip branch
                ↓ review + merge --no-ff 到 dev
                ↓ 在 merge commit bump version + append dev-log
                ↓ push dev → Vercel 自動部署測試機
                ↓ 刪 wip branch
```

---

## 三種角色（開工 SOP 第一問）

### 🧠 大腦（Integrator）

**適用情境**：多個 wip branch 等整合、要部署測試機、要決定 merge 順序

**能做的事**：
- 看 task-board 的 `In Review` 欄位
- `git fetch --all` 拉最新 wip branches
- `git merge --no-ff wip/<branch>` 到 `dev`（保留 merge commit 標記整合點）
- **在 merge commit 或 follow-up commit 中**：bump `src/version.ts` + append `memory/dev-log.md`
- `git push origin dev` → 觸發 Vercel 測試機部署
- 刪已整合 wip branch：`git push origin --delete wip/...`
- 驗證部署（curl dev.vercel.app 確認 HTTP 200 + script hash）

**不該做**：
- 不直接在 dev 寫功能程式碼（有需求就開 wip branch 當執行者做完再自己整合）
- 不未經 review 就 merge（看 diff 再動）

---

### 🛠 執行者（Worker）

**適用情境**：挑 task 做，純作業，不要管整合 / 版號

**能做的事**：
- 從 task-board 的 `Queue` 挑 task（或大腦指派）
- `git checkout dev && git pull --ff-only`
- `git checkout -b wip/<task-id>-<短描述>`（例：`wip/T010-c2-scenarios`）
- **在 wip branch 自由 commit**（可多個 commit，不用每次 commit 就改 version.ts）
- `git push -u origin wip/<task-id>-<短描述>`
- task-board 從 Queue → In Progress → In Review（附 wip branch 名 + 最後 commit hash）

**不該做**：
- **不動** `src/version.ts`（交給大腦整合時 bump）
- **不動** `memory/dev-log.md`（交給大腦整合時 append）
- 不主動 merge 自己的 wip branch 到 dev（避免繞過 review）

---

### ⚡ 單機快修（Solo）

**適用情境**：當下確定沒其他 session / 對話在跑，想快速修一件事

**能做的事**：
- 不開 wip branch，直接在 dev 做
- commit 時自己 bump `src/version.ts` + append `memory/dev-log.md`
- `git push origin dev` → 觸發部署
- 驗證部署

**風險**：
- 若實際上有其他 session / 對話也在動，容易卡版號衝突
- 只在「確定單工」時用

---

## 🌳 多 Session 並行架構（統一命名）

**規則三條**：
1. **主目錄** = 單對話通用（三角色問句），多對話時當大腦
2. **`-wip*` 後綴目錄** = 執行者 worktree（自動執行者 SOP）
3. 不用時 `-wip` 目錄停在 detached HEAD

### 目錄配置

| 目錄 | Branch 狀態 | 用途 |
|---|---|---|
| `<repo>` 主目錄 | `dev` | 單對話 / 大腦 |
| `<repo>-wip1` | detached 或 `wip/T0xx-...` | 執行者 #1 |
| `<repo>-wip2` | detached 或 `wip/T0yy-...` | 執行者 #2（選配） |

### 建立 `-wip` worktree（一次指令）

```bash
# 假設 repo 名是 poker-mentor 或 gto-poker-trainer
cd <repo 主目錄>
git worktree add ../<repo-name>-wip1 --detach origin/dev

# 驗證
git worktree list
```

### 日常使用

| 情境 | 開哪個目錄的 Claude Code |
|---|---|
| 單對話切角色 | 主目錄 |
| 多對話：大腦 | 主目錄（永遠 dev） |
| 多對話：執行者 A | `-wip1` 目錄 |
| 多對話：執行者 B | `-wip2` 目錄 |

### 執行者 worktree 流程

```bash
cd <repo>-wip1

# 開工接 task
git fetch --all
git checkout -b wip/T0xx-短描述 origin/dev
# 做事、commit、push
git push -u origin wip/T0xx-短描述

# idle（交還給大腦）
git checkout --detach origin/dev
```

**重要**：執行者**不動** `src/version.ts` / `memory/dev-log.md`，這兩個檔大腦整合時才動。

### 舊命名（`POKERNEW-brain` / `POKERNEW-*`）

保留向後相容，但建議新配置改用 `-wip*` 後綴的簡潔模型。

## 🌳 分支命名規則

| 分支 | 命名 | 生命週期 | 動到哪些檔 |
|---|---|---|---|
| `dev` | 固定 | 永久 | 產品 + 整合後的 version / dev-log |
| `main` | 固定 | 永久 | 正式機（需明確授權） |
| `wip/<task-id>-<短描述>` | 例：`wip/T010-c2-scenarios` | **短命**（完成後刪） | 功能改動，**不動** version.ts / dev-log |
| `feature/<名>` | 舊例：`feature/exploit-lab` | ⚠ **避免**（易變孤島） | 只有明確需要長期隔離時才開 |

**wip branch 衛生守則**：
- 一個 task = 一個 wip branch
- 完成後大腦 merge + 刪 branch，不留殘屍
- 若超過 3 天未 merge，大腦要跟執行者確認是否要繼續或丟棄

---

## 任務代號系統

- 每個 task 在 `memory/wiki/task-board.md` 有唯一 id：`T-NNN`
- wip branch 名 = `wip/<task-id>-<短描述>`
- 大腦 merge 時的 commit message 引用 task id：`Merge wip/T010 c2-scenarios`
- dev-log 整合紀錄也引用 task id

這樣從 branch 名、commit、dev-log、task-board 四處都能交叉追蹤。

---

## 開工 SOP（SessionStart 第一問）

```
⚠️ 今天這個 session 的角色？
  🧠 大腦      — 整合 wip branch / merge 到 dev / bump 版本 / 部署測試機
  🛠 執行者    — 挑 task / 開 wip branch 作業 / 不動 version / dev-log
  ⚡ 單機快修  — 直接在 dev 做+bump+push（確定無其他 session 在跑時）
```

根據選擇，Claude 自動：
- **大腦** → 列 In Review 的 wip branches；建議整合順序
- **執行者** → 列 Queue 中未指派 task；問要接哪個 task-id
- **單機** → 照目前方式直接動工

---

## 版號 + dev-log 規則（新）

| 動作 | 誰 | 何時 | 動哪些檔 |
|---|---|---|---|
| commit 產品程式 | 執行者 | wip branch 上每個 commit | `src/` / `public/` / `supabase/` |
| bump `version.ts` | 大腦 | merge wip → dev 時 | `src/version.ts` +1 |
| append dev-log | 大腦 | merge wip → dev 時 | `memory/dev-log.md` append 檔尾 |
| 驗證部署 | 大腦 | push dev 後 | curl + 確認 HTTP 200 |

**關鍵**：版號 / dev-log 的改動**只發生在大腦整合時**，一次改好。兩台執行者各自 wip branch 永遠不會動到這兩檔 → 衝突不發生。

---

## 整合範例（大腦的典型一天）

```bash
git fetch --all

# 看看有哪些 wip 在等
git branch -r | grep wip/

# 依序整合
git checkout dev
git pull --ff-only origin dev

for branch in wip/T010-c2-scenarios wip/T030-verify-bugs; do
  echo "=== 整合 $branch ==="
  git log dev..origin/$branch --oneline
  git merge --no-ff origin/$branch -m "Merge $branch"
  # 解衝突（若有）
done

# bump + dev-log 一次到位
vi src/version.ts          # dev.22 → dev.23
vi memory/dev-log.md       # append 兩個 task 的說明
git add src/version.ts memory/dev-log.md
git commit -m "chore: integrate T-010 + T-030 (v0.8.1-dev.23)"

# push + 部署
git push origin dev
bash scripts/verify-dev-deploy.sh  # （可選，手動也可）

# 刪已整合 wip branch
git push origin --delete wip/T010-c2-scenarios
git push origin --delete wip/T030-verify-bugs
```

---

## 衝突情境（還剩哪些？）

| 情境 | 頻率 | 解法 |
|---|---|---|
| 兩個 wip branch 改同個功能檔 | 低 | 大腦 merge 時手動解，並告知執行者之後分工注意 |
| 兩個大腦同時整合 | 極低 | 後整合的 `git pull --rebase origin dev` 再推 |
| wip branch 跟 dev 分叉太久 | 中 | 大腦定期通知執行者 `git rebase origin/dev` 到最新 dev |

**版號 / dev-log 衝突 = 0**（兩檔只有大腦動）。

---

## 相關連結

- [[task-board]] — 任務看板（Queue / In Progress / In Review / Done）
- [[range-collection-roadmap]] — Pipeline 線三線分批進度
- [[no-unauthorized-push]] — main 分支保護（不變）
