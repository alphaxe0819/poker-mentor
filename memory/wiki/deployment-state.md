---
name: 部署狀態
description: Supabase / Vercel 部署相關的基礎設施狀態，避免跨對話重複設定或漏設
type: deployment
aliases: [deployment-state, 部署狀態, infrastructure]
tags: [deployment, supabase, vercel, infrastructure]
---

# 部署狀態

## Supabase Edge Functions（已部署）

| Function Name | 用途 | 部署日期 |
|---|---|---|
| `ai-coach` | AI 教練（Claude Haiku，5 點/則） | 早於 2026-04 |
| `analyze-weakness` | 弱點分析 | 早於 2026-04 |
| `lemon-webhook` | LemonSqueezy 付費 webhook | 早於 2026-04 |
| `redeem-promo` | 序號兌換 | 早於 2026-04 |
| `analyze-hu-hand` | HU 手牌 AI 分析（Claude Haiku，3 點/手），用於 [[hu-simulator]] | 2026-04-11 |

## Supabase Secrets（專案級，所有 Edge Functions 共用）

| Secret Name | 用途 | 狀態 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API 呼叫 | ✅ 已設定（ai-coach 部署時設好） |
| `SUPABASE_URL` | Supabase 自動注入 | ✅ 自動 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 自動注入（analyze-hu-hand 用） | ✅ 自動 |
| `SUPABASE_ANON_KEY` | Supabase 自動注入（ai-coach 用） | ✅ 自動 |

## Supabase DB Tables（需手動 migration）

| Table | 用途 | Migration 檔 | 狀態 |
|---|---|---|---|
| `profiles` | 用戶資料 | (初始設定) | ✅ 已存在 |
| `point_transactions` | 點數原子操作 | (初始設定) | ✅ 已存在 |
| `subscriptions` | 訂閱狀態 | (初始設定) | ✅ 已存在 |
| `answer_records` | 答題紀錄 | (初始設定) | ✅ 已存在 |
| `coach_ratings` | 教練評價 | (初始設定) | ✅ 已存在 |
| `tournament_sessions` | HU 賽事紀錄（[[hu-simulator]]） | `supabase/migrations/2026-04-11-tournament-tables.sql` | ✅ 2026-04-11 已執行 |
| `tournament_hands` | HU 每手牌紀錄（[[hu-simulator]]） | 同上 | ✅ 2026-04-11 已執行 |

## Supabase RPC Functions

| Function | 用途 | 狀態 |
|---|---|---|
| `add_points` | 原子加點數 | ✅ 已存在 |
| `spend_points` | 原子扣點數 | ✅ 已存在 |
| `cleanup_tournament_sessions` | 按訂閱階層清理 session 保留 | ✅ 2026-04-11 建立 |

## Vercel

- 正式網址：https://poker-goal.vercel.app/
- 部署方式：`git push origin main` 自動觸發（詳見 [[no-unauthorized-push]]）
- 無需額外環境變數（前端 env 在 `.env` + Vercel dashboard）

## 注意事項

- 新增 Edge Function 時**不需要**再設 `ANTHROPIC_API_KEY`（已有）
- 新增 DB table 時，migration SQL 寫在 `supabase/migrations/` 但**必須手動在 Supabase Dashboard → SQL Editor 執行**（沒有 Supabase CLI）
- Edge Function 部署用 **Via Editor**（沒有 CLI）
