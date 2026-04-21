---
title: Auto-Memory 路徑警告
aliases: [auto-memory path]
tags: [feedback, safety, workflow]
created: 2026-04-17
updated: 2026-04-17
sources: []
---

# Auto-Memory 路徑警告

Claude auto-memory 的 `~/.claude/projects/.../memory/` 和 git repo 的 `memory/` **可能是同一個目錄**（透過 symlink 或其他機制）。

## Why

2026-04-17 在搭建 wiki 系統時，以為 auto-memory 和 git repo 是獨立的兩個目錄，對 auto-memory 執行 `rm -rf wiki raw index.md log.md`，結果刪掉了 git repo 剛 commit 的檔案。靠 `git restore` 才救回來。

## How to apply

- **絕對不要**在 auto-memory 路徑下執行 `rm -rf` 或批量刪除
- 修改 auto-memory 的 MEMORY.md 用 Write tool（覆寫內容），不要刪其他檔案
- 新的知識記憶直接寫到 `memory/wiki/`（git repo），不碰 auto-memory 路徑
- 如果不確定兩個路徑是否指向同一個目錄，先用 `readlink` 或 `ls -la` 確認

## 相關連結

- [[deploy-scope]] — 部署範圍判斷規則
- [[no-unauthorized-push]] — 另一條安全規則
