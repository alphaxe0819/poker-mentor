---
title: 部署範圍判斷規則
aliases: [deploy scope, 產品 vs 開發流程]
tags: [feedback, workflow, deployment]
created: 2026-04-17
updated: 2026-04-17
sources: []
---

# 部署範圍判斷規則

區分兩種改動的部署範圍，避免對非產品改動跑測試機驗證流程。

## Why

2026-04-17 wiki 系統建好後，Claude 問「要 push 到 dev 嗎？」暗示要跑測試機驗證流程，但這些只是 markdown/skill/config 改動，跟前端產品無關，不需要 Vercel 部署驗證。

## 產品改動（需要測試機驗證）

- `src/` 裡的 .ts/.tsx/.css 檔案
- `supabase/` 裡的 Edge Function / migration
- `public/` 裡的靜態資源
- `package.json` 的依賴變更

→ push dev 後跑「推送到測試機後的必做驗證」流程

## 開發流程改動（只需 push 同步）

- `CLAUDE.md`、`.claude/skills/`、`scripts/session-start*.sh`
- `memory/` 裡的 wiki/index/log/dev-log
- `docs/superpowers/specs/`、`docs/*.html`（mockup）
- `.claude/settings*.json`

→ 直接 `git push origin dev` 同步到雲端，不跑 curl / Vercel 驗證

## 相關連結

- [[deployment-state]] — 基礎設施狀態
- [[no-unauthorized-push]] — 正式機保護規則
