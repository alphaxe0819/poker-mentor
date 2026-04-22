#!/bin/bash
# Session sync — 開工時自動拿遠端最新。容忍本機 WIP（auto-stash → pull → pop）。
# 失敗不中斷 session，讓 Claude 看到結果再處理。

set +e

# Auto-detect git repo subdirectory if cwd is not a git repo.
# 場景：士林電腦 cwd = C:\Users\User\POKERNEW，但 git repo 在 poker-mentor/ 子目錄。
# 注意：cd 只影響此 hook process，Claude 後續操作仍需自己 cd。
if [[ -z $(git rev-parse --show-toplevel 2>/dev/null) ]]; then
  for sub in poker-mentor gto-poker-trainer gto-poker-trainer-wip1; do
    if [[ -d "$sub/.git" || -f "$sub/.git" ]]; then
      cd "$sub"
      echo "[session-sync] cwd 非 git repo，自動切到 $sub/（Claude 後續操作仍要自己 cd $sub）"
      break
    fi
  done
fi

BRANCH=$(git branch --show-current 2>/dev/null)
if [[ -z "$BRANCH" ]]; then
  echo "[session-sync] 非 git repo 或無分支，跳過 sync"
  exit 0
fi

# Claude Code Sandbox / Isolation worktree：branch 在 origin 沒對應，只 fetch 不 pull
if [[ "$PWD" == */.claude/worktrees/* ]] || [[ "$BRANCH" == claude/* ]]; then
  echo "[session-sync] Sandbox / isolation worktree（branch: $BRANCH）→ 只 fetch，不 pull"
  git fetch --all 2>&1 | tail -3
  echo "[session-sync] 若要當執行者，手動：git checkout -b wip/T0xx origin/dev"
  exit 0
fi

echo "[session-sync] fetch..."
git fetch --all 2>&1 | tail -5

# 比較本地 vs origin/<branch>
AHEAD=$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || echo 0)
BEHIND=$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo 0)
echo "[session-sync] 分支 $BRANCH：本地 +$AHEAD / 落後 -$BEHIND"

# wip/* branch：額外比對 dev 是否已更新（避免在老 wip 上看不到 dev 新進度）
if [[ "$BRANCH" =~ ^wip/ ]]; then
  DEV_AHEAD=$(git rev-list --count "HEAD..origin/dev" 2>/dev/null || echo 0)
  if [[ "$DEV_AHEAD" -gt 0 ]]; then
    echo "[session-sync] ⚠ origin/dev 比當前 wip 新 $DEV_AHEAD commits — wip branch 上的 task-board / dev-log 不是最新"
    echo "[session-sync]   → 看最新狀態：git checkout dev && git pull"
    echo "[session-sync]   → 接新 task：git checkout --detach origin/dev && git checkout -b wip/T0xx-..."
  fi
fi

# 有 WIP 嗎？（tracked + untracked 分開看）
TRACKED_DIRTY=$(git diff --name-only 2>/dev/null | wc -l)
STAGED_DIRTY=$(git diff --cached --name-only 2>/dev/null | wc -l)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)

if [[ "$BEHIND" -eq 0 ]]; then
  echo "[session-sync] 已是最新，免 pull"
else
  if [[ "$TRACKED_DIRTY" -gt 0 || "$STAGED_DIRTY" -gt 0 ]]; then
    echo "[session-sync] 偵測 tracked WIP → auto-stash → pull → pop"
    STASH_MSG="auto-stash by session-sync $(date +%Y%m%d-%H%M%S)"
    git stash push -u -m "$STASH_MSG" 2>&1 | tail -3
    git pull --ff-only origin "$BRANCH" 2>&1 | tail -5
    PULL_EXIT=$?
    if [[ $PULL_EXIT -ne 0 ]]; then
      echo "[session-sync] ⚠ pull 失敗，stash 保留（名稱：$STASH_MSG）"
      echo "[session-sync]   → 手動：git stash list; git stash apply stash@{0}"
    else
      git stash pop 2>&1 | tail -5
      POP_EXIT=$?
      if [[ $POP_EXIT -ne 0 ]]; then
        echo "[session-sync] ⚠ stash pop 衝突 — 解決後再 git stash drop"
      fi
    fi
  else
    git pull --ff-only origin "$BRANCH" 2>&1 | tail -5
  fi
fi
