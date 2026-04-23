---
name: 部署狀態
description: Supabase / Vercel 部署現況清單，避免跨對話重複設定或漏設；table/RPC 的「設計意圖」說明見 [[database-architecture]]
type: deployment
aliases: [deployment-state, 部署狀態, infrastructure]
tags: [deployment, supabase, vercel, infrastructure]
updated: 2026-04-23
---

> 這份文件的角色：**部署清單**（現在哪個表/函式部署在哪個環境）。看 table 做什麼用 / 為什麼這樣設計 / 哪裡不一致 → 讀 [[database-architecture]]。

# 部署狀態

## Supabase Edge Functions

| Function Name | 測試 | 正式 | 用途 |
|---|---|---|---|
| `ai-coach` | ✅ | ✅ | AI 教練（Claude Haiku，5 點/則）|
| `analyze-weakness` | ✅ | ✅ | 弱點分析 |
| `lemon-webhook` | ✅ | ✅ | LemonSqueezy 付費 webhook |
| `redeem-promo` | ✅ | ✅ | 序號兌換 |
| `analyze-hu-hand` | ✅ | ✅ | HU 手牌 AI 分析（Claude Haiku，3 點/手）— [[hu-simulator]] |
| `exploit-coach` | ✅ | ✅ | 原版剝削教練（T-058 繁中 grounding） |
| `exploit-coach-villain-v2` | ✅（T-085）| ❌ 未部署 | villain v2 內測版 |
| `exploit-coach-gtow` | ✅（T-082）| ❌ 未部署 | GTOW API 內測版 |

> ⚠ 新 Edge Function 部署必須手動關 `Verify JWT`（ES256 project 預設開會擋 token）— 見 [[supabase-edge-function-gotchas]]

## Supabase Secrets（專案級，所有 Edge Functions 共用）

| Secret Name | 測試 | 正式 | 用途 |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | ✅ | Claude API 呼叫 |
| `GTO_WIZARD_TOKEN` | ✅（T-082） | ❌ 未設 | GTOW API bearer token（內測用）|
| `SUPABASE_URL` | 自動 | 自動 | 自動注入 |
| `SUPABASE_SERVICE_ROLE_KEY` | 自動 | 自動 | 自動注入（analyze-hu-hand 用）|
| `SUPABASE_ANON_KEY` | 自動 | 自動 | 自動注入（ai-coach 用）|

## Supabase DB Tables

| Table | 測試 | 正式 | Migration 檔 |
|---|---|---|---|
| `profiles` / `point_transactions` / `subscriptions` / `answer_records` / `coach_ratings` | ✅ | ✅ | `20260330_init.sql` 等初始 |
| `missions` / `coach_onboarding` / quiz 欄位 | ✅ | ✅ | 2026-04-09 系列 |
| `coach_queries` | ✅ | ✅ | 初始 |
| `tournament_sessions` / `tournament_hands` | ✅ | ✅ | `2026-04-11-tournament-tables.sql` |
| `gto_postflop` | ✅（T-042） | ❌ | `20260416-gto-postflop.sql` |
| `gto_batch_progress` | ✅（T-042） | ❌ | `20260416-gto-postflop.sql` |
| `solver_postflop_6max` | ✅（手動建） | ❌ | ⚠ **無 migration 檔** |
| `solver_postflop_mtt` | ✅（T-063） | ❌ | `20260421-solver-postflop-mtt.sql` |

> 設計意圖 / schema 對照 / 已知問題 → [[database-architecture]]

## Supabase RPC Functions

| Function | 測試 | 正式 | 簽名 |
|---|---|---|---|
| `add_points` | ✅ | ✅ | `(user_id, delta)` |
| `spend_points` | ✅ | ✅ | `(user_id, cost)` |
| `cleanup_tournament_sessions` | ✅ | ✅ | 無參數（2026-04-11 建立）|
| `claim_gto_batch` | ✅ | ❌ | `(p_machine_id text)` — 未接 stack filter（T-093 待加）|

## Vercel

- 正式網址：https://poker-goal.vercel.app/
- 部署方式：`git push origin main` 自動觸發（詳見 [[no-unauthorized-push]]）
- 無需額外環境變數（前端 env 在 `.env` + Vercel dashboard）

## 注意事項

- 新增 Edge Function 時**不需要**再設 `ANTHROPIC_API_KEY`（已有）
- 新增 DB table 時，migration SQL 寫在 `supabase/migrations/` 但**必須手動在 Supabase Dashboard → SQL Editor 執行**（沒有 Supabase CLI）
- Edge Function 部署用 **Via Editor**（沒有 CLI）
