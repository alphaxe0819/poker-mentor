-- =========================================================
-- 20260424-gto-solutions-v2.sql
-- Schema v2 統一 GTO 資料表（B 方向重整，2026-04-23 用戶拍板 D1-D5）
--
-- 比照 GTO Wizard 設計：flat by path + jsonb hand frequencies
-- 取代（未來 DROP）：gto_postflop / solver_postflop_6max / solver_postflop_mtt
--
-- 本 migration 只建新表，不動舊表（2 週 fallback 期間舊表保留）。
-- seed-batches / batch-worker / retrieval 改造在 T-097 / T-098。
--
-- 部署（Supabase SQL Editor）：
--   1. 先貼本檔到測試 Supabase (btiqmckyjyswzrarmfxa) → Run
--   2. 驗證查詢（見檔尾）確認表 + constraint + policy + index 全部建立
--   3. 正式 Supabase 部署等 T-099（D4 條件：測試 2K+ rows + 用戶授權）
--
-- Idempotent：所有 statement 重跑不爆（IF NOT EXISTS / DO block）
-- =========================================================

-- 1. 主表 gto_solutions
CREATE TABLE IF NOT EXISTS gto_solutions (
  -- === 場景鍵 ===
  gametype         text NOT NULL,
  -- snake_case 命名：'cash_6max_100bb' / 'mtt_9max_40bb' / 'hu_25bb_srp' 等
  depth_bb         numeric NOT NULL,
  -- 起始籌碼深度（bb）

  -- === 路徑鍵（對齊 GTOW API params）===
  preflop_actions  text NOT NULL,
  -- 翻前序列，GTOW 編碼：F=fold / C=call / R<size>=raise to X bb
  -- 例 9-max：'F-F-F-F-R2.2-F-C'（BTN open 2.2bb + BB call）
  -- 例 HU：'R2.0-C'

  board            text NOT NULL DEFAULT '',
  -- flop 3 張連寫：'Ks8d2c'；preflop spot 為 ''

  flop_actions     text NOT NULL DEFAULT '',
  -- 翻牌後序列，GTOW 編碼：X=check / B<pct>=bet x% pot / C=call / R<pct>=raise / F=fold / RAI=all-in
  -- 例：'X-B33-C'（OOP check, IP bet 33%, OOP call）

  turn_card        text NOT NULL DEFAULT '',
  turn_actions     text NOT NULL DEFAULT '',
  river_card       text NOT NULL DEFAULT '',
  river_actions    text NOT NULL DEFAULT '',

  -- === 節點內容（D1-A：含 EV）===
  node_data        jsonb NOT NULL,
  -- 結構：
  -- {
  --   "hands": {
  --     "AKs": [{"action": "b33", "freq": 0.60, "ev": 2.45}, ...],
  --     ...169 entries
  --   },
  --   "aggregated": {"bet_freq": 0.45, "check_freq": 0.55, ...},
  --   "node_type": "oop_decision"
  -- }

  -- === Metadata ===
  source           text NOT NULL DEFAULT 'self_solver',
  -- 'self_solver' / 'gtow_api' / 'test_data'
  solver_config    jsonb,
  -- 例：{"exploitability": 0.34, "iterations": 151, "solver_version": "texas_0.2.0"}
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

-- 2. CHECK constraint（DO block idempotent）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_gto_solutions_source') THEN
    ALTER TABLE gto_solutions ADD CONSTRAINT chk_gto_solutions_source
      CHECK (source IN ('self_solver', 'gtow_api', 'test_data'));
  END IF;
END $$;

-- 3. 常用 query 加速
CREATE INDEX IF NOT EXISTS idx_gto_solutions_by_scenario
  ON gto_solutions (gametype, depth_bb, board);

CREATE INDEX IF NOT EXISTS idx_gto_solutions_source
  ON gto_solutions (source);

-- 4. RLS：authenticated 可讀，寫入走 service_role（pipeline scripts）bypass RLS
ALTER TABLE gto_solutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users can read gto_solutions" ON gto_solutions;
CREATE POLICY "authenticated users can read gto_solutions"
  ON gto_solutions FOR SELECT
  TO authenticated
  USING (true);

-- =========================================================
-- 部署後驗證查詢（分開貼到 SQL Editor 單獨 Run）：
--
--   -- (a) 表建起來
--   SELECT tablename FROM pg_tables WHERE tablename = 'gto_solutions';
--   -- 預期：1 row
--
--   -- (b) Constraint 建起來
--   SELECT conname FROM pg_constraint WHERE conrelid = 'gto_solutions'::regclass;
--   -- 預期：≥2 row（PK + chk_gto_solutions_source）
--
--   -- (c) Policy 建起來
--   SELECT policyname FROM pg_policies WHERE tablename = 'gto_solutions';
--   -- 預期：1 row（authenticated users can read gto_solutions）
--
--   -- (d) Index 建起來
--   SELECT indexname FROM pg_indexes WHERE tablename = 'gto_solutions';
--   -- 預期：3 row（PK + idx_gto_solutions_by_scenario + idx_gto_solutions_source）
--
--   -- (e) smoke test insert（測試 schema 可用，用完 DELETE）
--   INSERT INTO gto_solutions (
--     gametype, depth_bb, preflop_actions, board, flop_actions,
--     node_data, source
--   ) VALUES (
--     'hu_25bb_srp', 25, 'R2.0-C', 'Ks8d2c', 'X',
--     '{"hands": {"AKs": [{"action": "b33", "freq": 0.6, "ev": 2.45}]}}'::jsonb,
--     'test_data'
--   );
--   SELECT gametype, board, flop_actions, node_data->'hands'->'AKs'
--     FROM gto_solutions WHERE source = 'test_data';
--   DELETE FROM gto_solutions WHERE source = 'test_data';
--
-- 全通過 → T-095 Done，派 T-096/T-097（extract + batch-worker 改造）
-- =========================================================
