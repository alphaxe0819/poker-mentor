#!/bin/bash
# Session start reminder — 印出開工 SOP + 實際 git / dev-log 狀態。
# 輸出以 additionalContext 餵給 Claude，讓它看得到另一台最近 push + 本機 WIP。

# Worktree 模式偵測
cwd=$(basename "$PWD")

# 執行者 worktree：目錄名含 "-wip" 後綴（例：poker-mentor-wip1 / gto-poker-trainer-wip1）
if [[ "$cwd" == *-wip* ]]; then
  echo "🛠 執行者 worktree 模式（固定執行者角色）："
  echo "  1. 讀 memory/dev-log.md 最新 5 筆（下方已印）"
  echo "  2. 讀 memory/wiki/task-board.md Queue 區，看要接哪個 task-id"
  echo "  3. 開 wip branch：git checkout -b wip/T0xx-短描述 origin/dev"
  echo "  4. 做事、commit（不動 src/version.ts / memory/dev-log.md）"
  echo "  5. push wip branch，編輯 task-board 移到 In Review"
  echo "  6. idle 時切回 detached：git checkout --detach origin/dev"
  echo ""
  echo "  規則詳見 memory/wiki/two-machine-workflow.md"
  echo "  完成後告知大腦 session（主目錄 / 另一台大腦對話）整合"
  exit 0
fi

# 舊的 POKERNEW-brain worktree 向後相容（建議改用主目錄當大腦）
if [[ "$cwd" == POKERNEW-brain ]]; then
  echo "🧠 大腦 worktree 模式（legacy，建議搬回主目錄）："
  echo "  整合流程：fetch → merge --no-ff wip/T0xx → bump version + append dev-log → push dev → 刪 wip"
  exit 0
fi
if [[ "$cwd" == POKERNEW-* ]]; then
  echo "🛠 執行者 worktree（legacy POKERNEW-* 命名，建議改用 -wip 後綴）："
  echo "  git checkout -b wip/T0xx origin/dev 開工"
  exit 0
fi

BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
VERSION=$(grep -oE "v[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.]+)?" src/version.ts 2>/dev/null | head -1)

echo "⚠️ 開工 SOP（必執行，即使用戶第一句就是任務也要先跑完）："
echo "  1. 下方『遠端最近 5 筆 commit』= 各 session 今天做了什麼，掃一眼"
echo "  2. 下方『本機 WIP』= 上次沒 commit 的檔案"
echo "  3. 讀 memory/dev-log.md 最新 3 筆（下方已印）"
echo "  4. 讀 memory/wiki/task-board.md — 看 Queue / In Review 當前狀態"
echo "  5. 回報：分支 / 版本 / 近期改動"
echo "  6. 【必問】今天這個 session 的角色？"
echo "       🧠 大腦      — 整合 wip branch、merge 到 dev、bump 版本、部署測試機"
echo "       🛠 執行者    — 挑 task、開 wip branch 作業，不動 version / dev-log"
echo "       ⚡ 單機快修  — 直接在 dev 做+bump+push（確定無其他 session 在跑時）"
echo "  7. 根據角色提建議："
echo "       大腦   → 列 In Review 的 wip branches + 建議整合順序"
echo "       執行者 → 列 Queue 未指派 task + 問要接哪個 task-id"
echo "       單機   → 按現狀進行"
echo "  8. 等用戶指示要做什麼"
echo ""
echo "  完整規則見 memory/wiki/two-machine-workflow.md"
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
