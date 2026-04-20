#!/bin/bash
# Session sync — 開工時自動拿遠端最新。容忍本機 WIP（auto-stash → pull → pop）。
# 失敗不中斷 session，讓 Claude 看到結果再處理。

set +e
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
