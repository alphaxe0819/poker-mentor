#!/bin/bash
# Session start reminder — 印出開工 SOP + 實際 git / dev-log 狀態。
# 輸出以 additionalContext 餵給 Claude，讓它看得到另一台最近 push + 本機 WIP。

# Worktree 模式偵測
cwd=$(basename "$PWD")

# Claude Code Sandbox / Isolation 模式（桌面版或 `/plan` 類 slash command 自動建）
# 路徑包含 .claude/worktrees/ → branch 命名 claude/<adjective>-<name>-<hash>
# 這種 session 不在我們 workflow 體系內，要教它怎麼加入
if [[ "$PWD" == */.claude/worktrees/* ]]; then
  SANDBOX_BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
  echo "⚠️ Claude Code Sandbox / Isolation 偵測到"
  echo "   目前 branch: $SANDBOX_BRANCH（隔離 worktree，remote 尚未建立）"
  echo ""
  echo "📍 你的 session 可能是：brainstorm / plan / 實驗（這時照常做即可）"
  echo ""
  echo "🛠 若要當「正規執行者」push 到 origin 給大腦 review，跑以下 4 步："
  echo ""
  echo "   git fetch --all"
  echo "   git checkout -b wip/T0xx-短描述 origin/dev   # 從最新 dev 切，不用 merge sandbox branch"
  echo "   # 做事、commit（不動 src/version.ts 和 memory/dev-log.md）"
  echo "   git push -u origin wip/T0xx-短描述"
  echo ""
  echo "📋 要接什麼 task：讀 memory/wiki/task-board.md"
  echo "   完整 briefing 都在 task-board，不用大腦另外給。"
  echo "   找標 \`(派工 2026-04-20)\` 且狀態 Queue 的 task。"
  echo ""
  echo "✅ 完成後：更新 task-board 移到 In Review，回報 commit hash 給大腦"
  echo ""
  echo "── 遠端 origin/dev 最近 5 筆 commit（你的參考起點） ──"
  git fetch origin dev 2>&1 | tail -2
  git log origin/dev --pretty=format:"%h %ad %s" --date=short -5 2>/dev/null
  echo ""
  exit 0
fi

# 執行者 worktree：目錄名含 "-wip" 後綴（例：poker-mentor-wip1 / gto-poker-trainer-wip1）
if [[ "$cwd" == *-wip* ]]; then
  echo "🛠 執行者 worktree 模式（固定執行者角色）："
  echo "  1. 讀 memory/dev-log.md 最新 5 筆（下方已印）"
  echo "  2. 讀 memory/wiki/task-board.md Queue 區，看要接哪個 task-id"
  echo "  3. 開 wip branch：git checkout -b wip/T0xx-短描述 origin/dev"
  echo "     ⚠ 必須帶 \`origin/dev\` base！省略會從當前 HEAD 切出 →"
  echo "       commits 疊到上個 wip branch（T-011 踩坑實例：solver 跑 16 分鐘才發現）"
  echo "  4. 做事、commit（不動 src/version.ts / memory/dev-log.md）"
  echo "  5. push wip branch，編輯 task-board 移到 In Review"
  echo "  6. idle 時切回 detached：git checkout --detach origin/dev"
  echo ""
  echo "  規則詳見 memory/wiki/two-machine-workflow.md"
  echo "  完成後告知大腦 session（主目錄 / 另一台大腦對話）整合"

  # ── HEAD 隔離檢查：若 wip1 worktree 留在某個 wip branch 而非 detached，警告 ──
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
  if [[ -n "$CURRENT_BRANCH" ]]; then
    echo ""
    echo "⚠️ 當前 HEAD 在 branch: $CURRENT_BRANCH（不是 detached）"
    echo "   上一個 task 可能沒切回 detached。若要開新 wip，請先："
    echo "     git checkout --detach origin/dev"
    echo "   否則 git checkout -b wip/T0xx 會從 $CURRENT_BRANCH 切出，"
    echo "   commits 會疊到上個 wip branch（T-011 踩坑實例）"
    echo ""
    echo "   繼續當前 task 則忽略此警告"
  fi
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
