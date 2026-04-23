---
name: Database Schema v2 規格書（B 方向重整）
description: 統一 GTO 資料櫃 schema 比照 GTO Wizard 設計模式；flat by path + jsonb hand frequencies；Draft 狀態等用戶拍板
type: proposal
status: draft
updated: 2026-04-23
---

> **這份文件的狀態**：草案，等用戶確認 5 個決策點後升級成 spec → migration → 實作。不要當成已定案。

---

## 0. 設計原則

1. **一張主表涵蓋全街**（flop / turn / river / preflop）— 不再按街分表
2. **比照 GTO Wizard API 編碼**（preflop_actions / board / flop_actions / turn_actions / river_actions）
3. **每個「spot」= 1 row**；spot 內 169 hands 頻率用 jsonb 壓縮
4. **多來源共存**（自家 solver / GTOW API pull / test data）
5. **零翻譯成本**：T-082 從 GTOW 拉的資料可直接塞進我們表

---

## 1. 主表：`gto_solutions`

```sql
CREATE TABLE gto_solutions (
  -- ========== 場景鍵 ==========
  gametype         text NOT NULL,
  -- 'cash_6max_100bb' / 'mtt_9max_40bb' / 'mtt_9max_25bb' / 'hu_25bb' / 'hu_13bb' 等
  depth_bb         numeric NOT NULL,
  -- 起始籌碼深度（冗餘於 gametype 命名，但利於 query planner + CHECK）
  
  -- ========== 路徑鍵（對齊 GTOW API params）==========
  preflop_actions  text NOT NULL,
  -- 翻前序列，GTOW 編碼：F=fold / C=call / R<size>=raise to X bb
  -- 例：'F-F-F-F-R2.2-F-C'（9-max，BTN open 2.2bb + BB call）
  -- 每個位置一個 token，順序 UTG→UTG1→UTG2→LJ→HJ→CO→BTN→SB→BB
  
  board            text NOT NULL DEFAULT '',
  -- flop 3 張，連寫：'Ks8d2c'。Preflop spot 為 ''
  
  flop_actions     text NOT NULL DEFAULT '',
  -- 翻牌後序列，GTOW 編碼：X=check / B<pct>=bet x% pot / C=call / R<pct>=raise / F=fold / RAI=all-in
  -- 例：'X-B33-C'（OOP check, IP bet 33%, OOP call）
  
  turn_card        text NOT NULL DEFAULT '',
  -- turn 1 張：'Ah'
  
  turn_actions     text NOT NULL DEFAULT '',
  -- 同 flop_actions 編碼
  
  river_card       text NOT NULL DEFAULT '',
  river_actions    text NOT NULL DEFAULT '',
  
  -- ========== 節點內容 ==========
  node_data        jsonb NOT NULL,
  -- 結構見下方 §3
  
  -- ========== Metadata ==========
  source           text NOT NULL DEFAULT 'self_solver',
  -- 'self_solver' / 'gtow_api' / 'test_data'
  solver_config    jsonb,
  -- {exploitability: 0.34, iterations: 151, solver_version: 'texas_0.2.0'}
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  
  PRIMARY KEY (
    gametype, depth_bb,
    preflop_actions, board,
    flop_actions, turn_card,
    turn_actions, river_card,
    river_actions
  )
);

-- 常用 query 加速
CREATE INDEX idx_gto_solutions_by_scenario
  ON gto_solutions (gametype, depth_bb, board);

CREATE INDEX idx_gto_solutions_source
  ON gto_solutions (source);

-- CHECK constraints
ALTER TABLE gto_solutions ADD CONSTRAINT chk_source
  CHECK (source IN ('self_solver', 'gtow_api', 'test_data'));

-- RLS（對齊最佳實務）
ALTER TABLE gto_solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can read gto_solutions"
  ON gto_solutions FOR SELECT TO authenticated USING (true);

-- 寫入只走 service_role（pipeline scripts 用 service key bypass RLS）
```

---

## 2. 輔助表

### `gto_batch_progress`（保留現狀並升級 PK）

Pipeline 多機協作用，結構基本同現狀，但 PK 對齊新 schema：

```sql
CREATE TABLE gto_batch_progress (
  id           serial PRIMARY KEY,
  gametype     text NOT NULL,
  depth_bb     numeric NOT NULL,
  preflop_actions text NOT NULL,
  board        text NOT NULL,
  turn_card    text NOT NULL DEFAULT '',
  river_card   text NOT NULL DEFAULT '',
  street       text NOT NULL,  -- 'flop' / 'turn' / 'river'
  
  status       text NOT NULL DEFAULT 'pending',
  machine_id   text,
  claimed_at   timestamptz,
  completed_at timestamptz,
  row_count    integer,
  error_msg    text,
  created_at   timestamptz DEFAULT now(),
  
  UNIQUE (gametype, depth_bb, preflop_actions, board, turn_card, river_card, street)
);
```

### `claim_gto_batch` RPC 升級

接 gametype / stack filter 參數：

```sql
CREATE OR REPLACE FUNCTION claim_gto_batch(
  p_machine_id     text,
  p_gametype_filter text DEFAULT NULL,
  p_depth_filter   numeric DEFAULT NULL
)
RETURNS TABLE (
  id integer, gametype text, depth_bb numeric,
  preflop_actions text, board text,
  turn_card text, river_card text, street text
)
LANGUAGE sql AS $$
  UPDATE gto_batch_progress
  SET status='claimed', machine_id=p_machine_id, claimed_at=now()
  WHERE id = (
    SELECT id FROM gto_batch_progress
    WHERE status='pending'
      AND (p_gametype_filter IS NULL OR gametype = p_gametype_filter)
      AND (p_depth_filter IS NULL OR depth_bb = p_depth_filter)
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 1
  )
  RETURNING id, gametype, depth_bb, preflop_actions, board,
            turn_card, river_card, street;
$$;
```

---

## 3. `node_data` jsonb 結構

```json
{
  "hands": {
    "AKs": [
      {"action": "b33", "freq": 0.60, "ev": 2.45},
      {"action": "x",   "freq": 0.40, "ev": 1.80}
    ],
    "AKo": [
      {"action": "b33", "freq": 0.50, "ev": 2.10},
      {"action": "x",   "freq": 0.50, "ev": 1.95}
    ],
    "...169 total entries": "..."
  },
  "aggregated": {
    "bet_freq": 0.45,
    "check_freq": 0.55,
    "fold_freq": 0.00
  },
  "node_type": "oop_decision"
}
```

**對齊 GTOW API 回傳格式**：T-082 拉到的 JSON 可以**幾乎零改動**塞進 `hands` 欄位。

---

## 4. Path Encoding 規則（對齊 GTOW）

### Preflop actions
```
F       = fold
C       = call
R<n>    = raise to n bb (e.g. R2.5 = raise to 2.5bb)
```

完整序列：每個位置一個 token，從 UTG 開始（9-max）或 BTN 開始（HU）。
- 9-max：`UTG-UTG1-UTG2-LJ-HJ-CO-BTN-SB-BB`
- 6-max：`UTG-HJ-CO-BTN-SB-BB`（前三欄不存在 → preflop_actions 從 UTG 起算）
- HU：`BTN-BB`

例：
- `F-F-F-F-R2.2-F-C`（9-max BTN open 2.2bb, SB fold, BB call）
- `F-F-F-R2.5-F-C`（6-max BTN open 2.5bb, SB fold, BB call）
- `R2.5-C`（HU BTN open 2.5bb, BB call）

### Flop / Turn / River actions
```
X        = check
B<pct>   = bet x% of pot (e.g. B33 = bet 33%)
C        = call
R<pct>   = raise to x% pot
F        = fold
RAI      = all-in (special case)
```

例：
- `X-B33-C`（OOP check, IP bet 33%, OOP call）
- `B50-R150-F`（OOP bet 50%, IP raise to 150%, OOP fold）
- `X-X`（都 check）

---

## 5. 命名規則（gametype）

格式：`{format}_{table_size}_{depth}[_{variant}]`

| 範例 | 意義 |
|---|---|
| `cash_6max_100bb` | 6-max cash，100bb 深度 |
| `cash_6max_200bb` | 6-max cash，200bb 深度 |
| `mtt_9max_40bb` | 9-max MTT，40bb 深度 |
| `mtt_9max_25bb` | 9-max MTT，25bb 深度 |
| `mtt_9max_13bb` | 9-max MTT，13bb 深度（push/fold 區）|
| `hu_100bb` | HU 現金 100bb |
| `hu_40bb` | HU MTT 40bb |
| `hu_25bb` | HU MTT 25bb |
| `mtt_9max_40bb_icm` | 含 ICM 變體（未來）|

**不用複合 scenario_slug**（舊 `mtt_40bb_srp_btn_open_bb_call` → 新 gametype=`mtt_9max_40bb` + preflop_actions=`F-F-F-F-R2.2-F-C`）。

---

## 6. Query 範例

### 6.1 查單手牌策略（最常見）

```sql
-- 6max cash 100bb，BTN open BB call，翻牌 Ks8d2c，BB check 後 BTN 決策
SELECT node_data->'hands'->'AKs' AS strategy
FROM gto_solutions
WHERE gametype = 'cash_6max_100bb'
  AND depth_bb = 100
  AND preflop_actions = 'F-F-F-R2.5-F-C'
  AND board = 'Ks8d2c'
  AND flop_actions = 'X';
```

回傳：`[{"action": "b33", "freq": 0.60}, {"action": "x", "freq": 0.40}]`

### 6.2 查整個 spot（AI 教練 grounding 用）

```sql
SELECT node_data
FROM gto_solutions
WHERE gametype = 'cash_6max_100bb' AND depth_bb = 100
  AND preflop_actions = 'F-F-F-R2.5-F-C'
  AND board = 'Ks8d2c' AND flop_actions = 'X';
```

前端拿整個 `node_data` 給 Claude 當 grounding。

### 6.3 Aggregated query（未來做 Flop 綜合報告用）

```sql
-- 某場景某 flop texture 的平均 bet_freq
SELECT AVG((node_data->'aggregated'->>'bet_freq')::numeric) AS avg_bet
FROM gto_solutions
WHERE gametype = 'cash_6max_100bb'
  AND flop_actions = '';  -- flop 第一動作節點
```

GTO Wizard 的 Aggregated Reports 靠這類 SQL 做。

---

## 7. Migration 策略

### 7.1 步驟

1. **建 `gto_solutions` 表**（新 migration `20260424-gto-solutions-v2.sql`）
2. **寫 extract script**：
   - `scripts/migrations/migrate-gto-postflop-to-v2.mjs`
     - 讀 `gto_postflop` 594 rows
     - 按 (board, turn, river, street, stack_label) group
     - 推算 preflop_actions（從 stack_label + scenario 硬編表）
     - 推算 flop_actions / turn_actions（從舊 role 欄位）
     - 組 node_data.hands jsonb（169 hands × action/freq）
     - Upsert 到 `gto_solutions`
   - `scripts/migrations/migrate-solver-postflop-to-v2.mjs`
     - 讀 `solver_postflop_6max` + `solver_postflop_mtt`
     - 從 jsonb tree extract 所有節點
     - 每節點轉成 gto_solutions 一 row（肥差）
     - 對齊 path encoding
3. **改 `batch-worker.mjs`**：
   - `pathToRole()` 改成 `pathToActionSeq()` 產出 `flop_actions` / `turn_actions` 字串
   - `uploadRows()` 改 upsert 到 `gto_solutions`（每 spot 一 row，hands 壓 jsonb）
4. **改 retrieval 兩個 lib**：
   - `getGTOPostflopFromDB.ts`：改查新表
   - `postflopRetrieval.ts`（exploit-coach）：改查新表
   - 兩者統一走同一個 helper `queryGtoSolution(gametype, depth, path_parts)`
5. **舊表留 2 週 fallback**：前端 retrieval 先查新表，miss 則 fallback 查舊表（log 紀錄）
6. **驗證**：
   - 測試環境跑 smoke test（教練 + 訓練模式隨機 spot）
   - exploit-coach retrieval hit rate > 95%
7. **舊表 DROP**（用戶授權後）

### 7.2 估工時

| 工作項 | 估時 | 風險 |
|---|---|---|
| migration SQL + 表建好 | 30 min | 低 |
| extract scripts（舊 → 新）| 3-4 hr | 中（路徑推算邏輯要對）|
| batch-worker 改造 | 2-3 hr | 中（要重新驗 dedup + T-045 測試 spot）|
| retrieval 兩個 lib 改造 | 2-3 hr | 中 |
| fallback 雙查邏輯 | 1 hr | 低 |
| smoke test + 修 bug | 2-4 hr | 高（實機驗證才知道哪裡對不齊）|
| 正式環境部署 | 30 min | 低（等用戶授權）|

**總計：約 10-15 hr = 2 天集中工作**（分派多個 session）。

### 7.3 資料量估算

新 schema 下：
- 一個 batch solver run → 產 5-15 個 spots（flop decision + turn decisions + river decisions）
- 3510 batches × 10 avg = ~35K rows in `gto_solutions`
- 每 row 約 5-8 KB（node_data jsonb 含 169 hands × few actions）
- 總大小 ~250-300 MB

對比舊 schema：
- `gto_postflop` 若全跑 ~2M rows（T-045 dedup 後估算）
- 總大小 ~200-400 MB

兩者差不多，但**新 schema row 數少 ~60x** → index 小、query plan 簡單、DB 維護輕鬆。

---

## 8. 與 GTO Wizard 零翻譯對接

T-082 / T-093 / T-076 採購方案的最大優勢：

```js
// 從 GTOW API 拉
const resp = await fetch('.../v4/solutions/spot-solution/?' + params)
// resp.hands = {"AKs": [{action, freq, ev}, ...], ...}

// 直接塞我們 DB（source='gtow_api'）
await supabase.from('gto_solutions').insert({
  gametype: mapGtowGametype(resp.gametype),
  depth_bb: resp.depth,
  preflop_actions: resp.preflop_actions,  // GTOW 已是 'F-F-F-F-R2.2-F-C'
  board: resp.board,
  flop_actions: resp.flop_actions,        // GTOW 已是 'X-B33-C'
  node_data: { hands: resp.hands, aggregated: resp.aggregated },
  source: 'gtow_api',
  solver_config: { gtow_version: resp.version }
})
```

**零轉換**：我們的 PK 欄位名 = GTOW API param 名。

---

## 9. 待拍板決策點（請用戶選）

### 🔴 D1：node_data 是否包含 EV/equity？
- **包含**（A）：多 ~30% jsonb 大小，但 AI 教練可講「這決策 EV +2.45bb」；學習功能更強
- **不包含**（B）：純 freq，更小更快；EV 由前端算（需要 equity calculator）
- **大腦推薦 A**：多花 30% 空間換產品深度，值得

### 🟡 D2：preflop spots 與 postflop 同表還是分表？
- **同表**（board='' 表示 preflop）：統一 query 邏輯
- **分表**（`gto_preflop` + `gto_postflop_v2`）：表更專注，但雙 query 邏輯
- **大腦推薦同表**：簡化最大化

### 🟡 D3：`solver_postflop_6max` / `solver_postflop_mtt` 舊表留多久？
- **立即 DROP**：極端，風險高
- **留 2 週 fallback**：穩妥，推薦
- **永久留作 backup**：浪費 DB 空間
- **大腦推薦 2 週 fallback**

### 🟢 D4：正式 Supabase 何時部署新表？
- **測試 2K+ rows 穩定後**（推薦）：確認 schema 可行才動正式
- **立即建空表**：正式玩家先享受 null 查詢
- **等 10K+ rows**：保守
- **大腦推薦「測試 2K+ rows 後」**：約 1 週後（多機 T-094 marathon 跑起來）

### 🟢 D5：gametype 命名細節
- `cash_6max_100bb` vs `cash6m100`（短）vs `cash-6max-100bb`（dash）
- **大腦推薦 snake_case 長名**（最可讀）

---

## 10. 接下來流程

1. **用戶拍板 D1-D5** → 本檔 status 改 `approved`
2. 大腦開正式 task：
   - **T-095** schema migration（建表 + RPC 升級）
   - **T-096** extract scripts（舊資料搬新表）
   - **T-097** batch-worker 改造
   - **T-098** retrieval lib 改造 + fallback
   - **T-099** 正式環境部署（等 D4 條件達成）
3. 每個 task 派給執行者（多 session 並行，獨立 branch）

---

## 11. 相關連結

- [[database-architecture]] — 當前 DB 架構總覽（為什麼要重整）
- [[gto-wizard-pricing-analysis]] — GTOW 定價 + schema 模式（為什麼比照他們）
- [[gtow-api-reverse-eng]] — T-082 GTOW API 整合
- [[task-board]] — T-045 / T-091 / T-092 現況
