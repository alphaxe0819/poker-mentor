#!/bin/bash
# Session start reminder — 印出開工 SOP + 實際 git / dev-log 狀態。
# 輸出以 additionalContext 餵給 Claude，讓它看得到另一台最近 push + 本機 WIP。

# Worktree 模式（POKERNEW-*）只顯示精簡版
cwd=$(basename "$PWD")
if [[ "$cwd" == POKERNEW-* ]]; then
  echo "⚠️ 開工 SOP（worktree 模式，獨立 branch）："
  echo "  1. 讀 memory/dev-log.md 了解最近開發"
  echo "  2. 讀 memory/index.md 取得專案知識庫索引"
  echo "  3. 回報：分支 / 版本 / 最近改動 / 未完成事項"
  echo "  4. 等用戶指示要做什麼"
  exit 0
fi

BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
VERSION=$(grep -oE "v[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.]+)?" src/version.ts 2>/dev/null | head -1)

echo "⚠️ 開工 SOP（必執行，即使用戶第一句就是任務也要先跑完）："
echo "  1. 下方『遠端最近 push』= 另一台電腦今天做了什麼，先掃一眼"
echo "  2. 下方『本機 WIP』= 這台待處理（可能上次沒 commit）"
echo "  3. 讀 memory/dev-log.md 近期內容（前 40 行即可）"
echo "  4. 回報：分支 / 版本 / 近期改動 / 角色建議"
echo "  5. 讀 memory/wiki/task-board.md — 看 Queue 有沒有指派給本機的 task"
echo "  6. 【必問】這個 Tab 角色？(Pipeline / Product / 自由)"
echo "  7. 等用戶指示要做什麼"
echo ""
echo "  角色範圍："
echo "    Pipeline = scripts/gto-pipeline/ + src/lib/gto/gtoData_* + memory/wiki/range-*"
echo "    Product  = public/exploit-coach-* + src/components/ + src/tabs/ + src/lib/exploit/ + supabase/functions/"
echo "    共用     = memory/dev-log.md + src/version.ts + CLAUDE.md（兩台都會動，按 SOP 解衝突）"
echo "  Wiki skills：/wiki-ingest /rescue-bookmarks /compound /wiki-healthcheck"
echo ""

# ── 實況 1：遠端最近 push（另一台的活動） ──
echo "── 遠端 origin/$BRANCH 最近 5 筆 commit ──"
git log "origin/$BRANCH" --pretty=format:"%h %ad %s" --date=short -5 2>/dev/null || echo "(無法讀取)"
echo ""
echo ""

# ── 實況 2：本地 vs 遠端差異 ──
AHEAD=$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || echo 0)
BEHIND=$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo 0)
echo "── 本地 vs origin/$BRANCH ──"
echo "  本地獨有 +$AHEAD commits；本地落後 -$BEHIND commits"
echo "  分支：$BRANCH  版本：${VERSION:-未知}"
if [[ "$BRANCH" != "dev" && "$BRANCH" != "main" ]]; then
  echo "  ⚠ 目前在非 dev/main 分支，確認是否該切回 dev（CLAUDE.md 規則：兩台只在 dev）"
fi
echo ""

# ── 實況 3：本機 WIP ──
WIP_LINES=$(git status --short 2>/dev/null | wc -l)
if [[ "$WIP_LINES" -gt 0 ]]; then
  echo "── 本機 WIP（$WIP_LINES 項）──"
  git status --short 2>/dev/null | head -20
  if [[ "$WIP_LINES" -gt 20 ]]; then
    echo "  ... (+$((WIP_LINES - 20)) 更多)"
  fi
  echo ""
  echo "  → 若 WIP 跟角色不符，先詢問用戶要保留 / 丟棄 / commit 到暫存分支"
else
  echo "── 本機 WIP：乾淨 ──"
fi
echo ""

# ── 實況 4：dev-log 頭條 ──
echo "── dev-log.md 最新 3 筆 ──"
awk '/^## 202[0-9]-[0-9]+-[0-9]+/{c++} c<=3{print} c>3{exit}' memory/dev-log.md 2>/dev/null | head -40 || echo "(無法讀取)"
