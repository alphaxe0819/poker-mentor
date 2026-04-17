#!/bin/bash
# Session start reminder — 每次 Claude Code session 啟動時印出開工 SOP
# 這個訊息會以 additionalContext 形式餵給 Claude，強制它先跑 SOP 再接任務

# 若工作目錄是 worktree 子目錄（POKERNEW-*），只顯示精簡版（跳過角色問題）
cwd=$(basename "$PWD")
if [[ "$cwd" == POKERNEW-* ]]; then
  echo "⚠️ 開工 SOP（worktree 模式，獨立 branch）："
  echo "  1. 讀 memory/dev-log.md 了解最近開發"
  echo "  2. 讀 memory/index.md 取得專案知識庫索引"
  echo "  3. 回報：分支 / 版本 / 最近改動 / 未完成事項"
  echo "  4. 等用戶指示要做什麼"
  exit 0
fi

echo "⚠️ 開工 SOP（必執行，不要問要不要跑，即使用戶第一句就是任務也要先跑完）："
echo "  1. 讀 memory/dev-log.md 了解最近開發"
echo "  2. 讀 memory/index.md 取得專案知識庫索引（分級查詢）"
echo "  3. 回報：分支 / 版本 / 最近改動 / 未完成事項"
echo "  4. 【必問】這個 Tab 角色？(UI / Frontend / Backend / 自由)"
echo "  5. 等用戶指示要做什麼"
echo ""
echo "  範圍提示：UI=src/components + css / Frontend=src/pages+tabs+lib / Backend=supabase + scripts / 自由=無限制"
echo "  Wiki skills：/wiki-ingest（錄入）/ /rescue-bookmarks（收藏）/ /compound（收工）/ /wiki-healthcheck（健檢）"
