---
name: Database 架構總覽
description: Supabase 兩環境 + 各 table 設計意圖 + 資料流 + 已知問題 + migration 檔索引；任何 session 讀一次就能理解 DB 全貌
type: reference
updated: 2026-04-23
---

> **這份文件的角色**：`deployment-state.md` 是「部署清單」，本檔是「設計說明」。看 table 做什麼 / 為什麼這樣設計 / 哪裡不一致，讀本檔；看某 table 是否已部署到哪個環境，讀 `deployment-state.md`。

---

## 🏢 兩套 Supabase 環境（完全獨立）

| 環境 | URL Ref | 用途 | Vercel 綁定 |
|---|---|---|---|
| 測試 | `btiqmckyjyswzrarmfxa` | 開發 + 內測玩家 | poker-goal-dev.vercel.app |
| 正式 | `qaiwsocjwkjrmyzawabt` | 真實付費玩家 | poker-goal.vercel.app |

**基本規則**：schema 改動（新表 / 加欄位 / 改 RLS）必須**先部署測試**驗證，**再部署正式**（用戶授權）。Edge Function 同理。

---

## 📦 Table 分類（按業務功能）

### A. 產品核心（穩定，兩環境同步）

| Table | 做什麼 | 誰寫 | 誰讀 |
|---|---|---|---|
| `profiles` | 用戶資料（帳號、顯示名稱、meta）| auth trigger | 前端 / Edge Function |
| `point_transactions` | 每筆點數收支（atomic）| `add_points` / `spend_points` RPC | 前端顯示餘額 |
| `subscriptions` | 訂閱 tier 狀態 | `lemon-webhook` / `redeem-promo` | 前端權限判斷 |
| `answer_records` | 每題答題結果 | 前端訓練 tab | 統計 / 教練 onboarding |
| `coach_ratings` | AI 教練評價 | 前端 thumbs up/down | 品質監控 |
| `missions` | 任務系統（每日 / 週 / 特殊）| 前端觸發 | 前端顯示 |
| `coach_onboarding` | 新手教練流程狀態 | 前端 | 前端 |
| `coach_queries` | exploit-coach 每次問答 log | `exploit-coach` Edge Function | 分析 / debug |

### B. HU 模擬器（2026-04-11 加）

| Table | 做什麼 |
|---|---|
| `tournament_sessions` | 一場 HU 賽事的 session（開始時間、對手類型、結果）|
| `tournament_hands` | 該 session 每一手牌（決策 / 結果）|

兩表有 `cleanup_tournament_sessions` RPC 定期清舊資料，按訂閱 tier 保留天數。

### C. GTO Postflop 資料（2026-04-16 + 2026-04-21 新做，**有兩套 schema 並存**）

| Table | schema 風格 | 裝什麼 | 粒度 |
|---|---|---|---|
| `gto_postflop` | **關聯式 flat rows** | Turn / River 街的 GTO 解 | 每手牌一 row（~600 rows/batch）|
| `solver_postflop_6max` | **Document（jsonb tree）** | Flop 街的 GTO 解（6-max cash）| 每個 flop 一 row（整棵 tree 塞 jsonb）|
| `solver_postflop_mtt` | 同上，仿 6max | Flop 街的 GTO 解（MTT）| 同上 |
| `gto_batch_progress` | 協調表 | 哪些 batch 待跑 / 誰在跑 / 誰跑完 | 每 batch 一 row |

> 兩套 schema 並存的**歷史**：`solver_postflop_6max` 是早期做 flop street retrieval 用，schema 是「一個 flop 一坨 jsonb tree」；後來 T-033 做 turn/river 時覺得 jsonb tree 查 hand-level 太慢，改成 flat rows 一個 hand 一 row 的 `gto_postflop`。從此兩套共存，分街使用。

---

## 🔀 GTO Postflop 兩套 schema 對照（核心混亂點）

| 面向 | `gto_postflop`（新，T-033）| `solver_postflop_6max/mtt`（舊，T-011 起）|
|---|---|---|
| 街 | turn / river | flop |
| Primary Key | `(board, turn, river, street, stack, role, hand_class)` 7 欄 | `(scenario_slug, flop)` 2 欄 |
| 每 row 代表 | 一個 hand_class × 一個 role 的決策 | 整棵 solver tree（整局面）|
| 每 row 大小 | 小（~100 bytes）| 大（jsonb tree ~32 KB）|
| Query 模式 | 點查（role + hand 直接 lookup）| 先抓整 tree 再在前端 walk |
| 寫入方 | `batch-worker.mjs`（Pipeline）| `batch-worker.mjs`（Pipeline）|
| 讀取方 | `getGTOPostflopFromDB.ts` + `getHUPostflopAction.ts` | `postflopRetrieval.ts`（exploit-coach）|
| 場景分類 | 用 `stack_label`（13bb/25bb/40bb）| 用 `scenario_slug` prefix（`mtt_*` / 其他 6max）|
| 6max vs MTT 怎分 | **混在同表**（靠 stack_label）| **分兩個表**（6max / mtt）|
| RLS | 只 authenticated SELECT | anon + authenticated SELECT/INSERT/UPDATE |
| Migration 檔 | ✅ 存在 | ⚠ **`solver_postflop_6max` 沒 migration 檔**（歷史遺留，手動建）|

### 重點矛盾
- **命名**：`gto_postflop` 聽起來像通用，實際只含 turn/river；`solver_postflop_*` 反而是 flop 專用 → 新人誤解率 100%
- **6max/MTT 切割不一致**：gto_postflop 混一桌，solver_postflop_* 分兩桌
- **RLS 不一致**：gto_postflop 嚴（寫入只走 service role），solver_postflop_* 鬆（anon 能直寫）
- **前端 lib 兩套 retrieval 邏輯**：`getGTOPostflopFromDB.ts`（flat）+ `postflopRetrieval.ts`（jsonb tree）

---

## 🔧 RPC（儲存過程）

| RPC | 做什麼 | 測試 | 正式 |
|---|---|---|---|
| `add_points(user, delta)` | 原子加點（防重複）| ✅ | ✅ |
| `spend_points(user, cost)` | 原子扣點 + 餘額檢查 | ✅ | ✅ |
| `cleanup_tournament_sessions()` | 按訂閱保留天數清舊 HU session | ✅ | ✅ |
| `claim_gto_batch(machine_id)` | Pipeline 領下一個 pending batch（FIFO）| ✅ | ❌ 未部署 |

### claim_gto_batch 已知限制
**只接 `p_machine_id text`，不接 stack filter**。T-091 phased 策略需要「指定領 13bb 的 batch」→ 需加 `p_stack_filter text DEFAULT NULL` 參數（T-093 待派）。

---

## 📊 目前資料量（測試環境，2026-04-23 盤點）

| Table | rows | 意義 |
|---|---|---|
| `gto_postflop` | **594** | T-045 跑進來的 1 個 turn batch（25bb `7s7d2h+3c`）|
| `gto_batch_progress` | **390 pending + 1 done** | turn 街 seed 完，**river 尚未 seed**（3120 row 待進）|
| `solver_postflop_6max` | 少量 | T-011 E2E 測試 + 之後累積 |
| `solver_postflop_mtt` | **1** | T-063 verify（`mtt_40bb_srp_btn_open_bb_call + As7d2c`）|
| `coach_queries` | 持續累積 | 內測玩家每次問 AI 教練都一 row |
| 產品核心表 | 持續累積 | 隨用戶互動成長 |

**觀察**：
- GTO 資料櫃**幾乎空**（594 rows + 1 MTT row），離「實戰可用」（~2M rows）遠
- 正式環境 GTO 資料櫃**完全沒建**（4 個表都 ❌）
- T-092 若改 schema，現有 594 rows 重跑成本低（還沒大量資料）→ **重整時機絕佳**

---

## 🚨 已知設計問題（混亂來源）

| # | 問題 | 嚴重度 | 可行修法 |
|---|---|---|---|
| 1 | 命名不一致（gto_ vs solver_）| 中 | 統一為 `gto_postflop_flop_6max` / `gto_postflop_turn_river` 等語義明確名稱 |
| 2 | Flop 用 jsonb tree / Turn-River 用 flat rows，兩套 retrieval 邏輯 | 高 | 統一改用 flat rows（trade-off：丟 solver tree 結構資訊；但 T-045 實測 dedup 3.2x 本來就丟了）|
| 3 | `solver_postflop_6max` 沒 migration 檔 | 中 | 補一個 `dump-schema-6max.sql` 從現有 DB 反推 CREATE TABLE |
| 4 | 6max vs MTT 切割邏輯不一致（flat 表混一桌，jsonb 表分兩桌）| 中 | 決定一套路線（推薦分兩桌，避免將來 9max/HU 又混進來）|
| 5 | `gto_postflop` role 分桶漏資訊（T-045 dedup 3.2x ratio）| **高** | T-092 根因解：role 納入 path（例 `btn_facing_bet_mid_after_flop_check`）|
| 6 | RLS 規則不一致 | 低 | 統一走 service_role bypass（pipeline）+ authenticated SELECT（前端）|
| 7 | 14 個 migration 檔無 summary index | 低 | 本檔附錄的「Migration 索引」解決 |

**T-092 + 本次重整的關係**：痛點 5 的修法（role 納入 path）跟痛點 1/2/4 的重整邏輯其實是**同一件事**——把兩套 schema 合一、重新命名、重新設計 role 邏輯——可以一起做。

---

## 📜 Migration 檔索引（14 檔時序）

| 檔名 | 日期 | 做什麼 |
|---|---|---|
| `20260330_init.sql` | 2026-03-30 | 初始 schema（profiles / point_transactions / subscriptions）|
| `20260406_sync_points_courses.sql` | 2026-04-06 | 點數系統同步 courses 欄位 |
| `20260407_subscriptions.sql` | 2026-04-07 | subscriptions 增強 |
| `20260408_promo_redemptions.sql` | 2026-04-08 | 序號兌換 |
| `20260409_add_quiz_columns.sql` | 2026-04-09 | 答題 quiz 欄位 |
| `20260409_add_quiz_feedback.sql` | 2026-04-09 | quiz 意見回饋 |
| `20260409_coach_onboarding.sql` | 2026-04-09 | 新手教練流程 |
| `20260409_missions.sql` | 2026-04-09 | 任務系統 |
| `20260409_points_refactor.sql` | 2026-04-09 | 點數系統 refactor |
| `2026-04-11-tournament-tables.sql` | 2026-04-11 | HU 模擬器 tables（[[hu-simulator]]）|
| `20260416-gto-postflop.sql` | 2026-04-16 | `gto_postflop` + `gto_batch_progress` + RLS（T-033/T-042）|
| `20260416b-gto-postflop-function.sql` | 2026-04-16 | `claim_gto_batch` RPC |
| `20260421-solver-postflop-mtt.sql` | 2026-04-21 | `solver_postflop_mtt` + T-011 row 搬家（T-012/T-063）|
| `_all_migrations_staging.sql` | — | 匯總檔（暫存，非部署用）|

**無 migration 檔的表**：`solver_postflop_6max`（手動建或更早遺留）

---

## 🔄 資料流圖（文字版）

### GTO Pipeline 寫入流

```
[scenarios.mjs 定義場景]
         ↓
[seed-batches.mjs]  ──→  gto_batch_progress（390 turn + 3120 river pending）
                           ↓
[batch-worker.mjs]  ←──  claim_gto_batch RPC（領 1 個 pending）
         ↓
[TexasSolver 算] → JSON → parse → **dedup（T-045 新加）**
                                      ↓
         ┌────────────────────────────┴─────────────────────────┐
         ↓（turn/river）                               ↓（flop）
    gto_postflop                               solver_postflop_6max / _mtt
    （flat rows）                               （jsonb tree）
         ↓                                            ↓
[getGTOPostflopFromDB.ts]                    [postflopRetrieval.ts]
 getHUPostflopAction.ts                       （exploit-coach）
         ↓                                            ↓
      前端訓練                                   AI 教練 grounding
```

### exploit-coach 查詢流

```
前端發問 → exploit-coach Edge Function
              ↓
         [postflopRetrieval.ts 查 solver_postflop_6max/_mtt 取 flop tree]
              ↓
         [若命中：拿 GTO 策略當 grounding 給 Claude]
              ↓
         Claude 生成教練回答 → 前端
              ↓
         coach_queries log 寫入
```

---

## 🗓 部署同步狀態（測試 vs 正式）

詳見 [[deployment-state]] — 關鍵不同步項：

| 項目 | 測試 | 正式 | 備註 |
|---|---|---|---|
| GTO 資料櫃（4 個表 + RPC）| ✅ | ❌ | 正式一個都沒建 |
| `exploit-coach-gtow` Edge Function | ✅ | ❌ | T-082 內測用 |
| `exploit-coach-villain-v2` Edge Function | ✅ | ❌ | T-085 內測用 |
| `GTO_WIZARD_TOKEN` secret | ✅ | ❌ | T-082 相關 |

---

## 🧹 重整建議（C 完成後繼續 B 的方向）

本檔解決痛點 **1（設計混亂）/ 3（資料稀）/ 4（migration 無總覽）/ 6（T-092 根因）** 的**可見性問題**（讓大家知道現在長怎樣）。

**B 階段（DB 本身重整，等用戶再拍板）可能動作**：

1. **統一兩套 schema**（痛點 2/5 合解）
   - 方向 A：全改 jsonb tree（統一走 solver_postflop_* 模式）
   - 方向 B：全改 flat rows（統一走 gto_postflop 模式 + T-092 role 修）
   - 方向 C：維持兩套，但重新命名讓意圖清楚
2. **補 solver_postflop_6max 的 migration 檔**（痛點 3）
3. **RLS 統一**（痛點 6）：service_role 寫入，authenticated 讀
4. **正式 Supabase 部署**（當測試資料累積到實戰可用 2M rows 級）
5. **T-092 schema 改動**（role 納入 path，解 3.2x dedup 損失）

> 因為 GTO 資料櫃目前只 594 rows，**現在重整幾乎零成本**。等累積到 2M rows 再改 schema 就很痛。

---

## 📎 相關連結

- [[deployment-state]] — 純部署清單（本檔的執行面向）
- [[task-board]] — T-091 / T-092 / T-093 pipeline 待辦
- [[gtow-api-reverse-eng]] — GTOW API 整合（T-082 相關）
- [[gto-wizard-pricing-analysis]] — 「買資料 vs 自產」替代方案
- [[range-collection-roadmap]] — range 收集進度
- [[supabase-edge-function-gotchas]] — Edge Function 部署坑（ES256 / Secrets）
- [[gto-pipeline-conventions]] — solver 產出 / 檔名 export 命名規範
