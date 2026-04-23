-- =========================================================
-- 20260425-gto-batch-progress-v2.sql
-- Schema v2：升級 gto_batch_progress + claim_gto_batch RPC 對齊 gto_solutions（T-095 建）
--
-- 舊表（20260416）用 board_key / stack_label 欄位，已無法對齊 schema v2 的
-- gametype / depth_bb / preflop_actions / board 鍵結構。
--
-- 此 migration：
--   1. DROP 舊 claim_gto_batch(text) RPC
--   2. DROP 舊 gto_batch_progress 表（pipeline 協調狀態，old data 可丟，反正要重 seed）
--   3. CREATE 新 gto_batch_progress 表對齊 v2 鍵
--   4. CREATE 新 claim_gto_batch(p_machine_id, p_gametype_filter, p_depth_filter) RPC
--
-- ⚠ 注意：不動 gto_postflop 資料表（T-098 retrieval fallback 需要 2 週）
-- ⚠ 注意：不動 gto_solutions 表（T-095 已建）
--
-- 部署（Supabase SQL Editor）：
--   1. 先貼本檔到測試 Supabase (btiqmckyjyswzrarmfxa) → Run
--   2. 貼檔尾驗證查詢逐條 Run，確認 1 table + 1 RPC + 1 policy + constraint 全部就位
--   3. 用戶回報驗證通過後，執行者重 seed（node seed-batches.mjs --include-river）
--   4. 正式 Supabase 部署等 T-099（D4 條件）
--
-- Idempotent：重跑不爆（DROP IF EXISTS + CREATE IF NOT EXISTS / CREATE OR REPLACE）
-- =========================================================

-- 1. DROP 舊 RPC（先 drop，否則下面 drop table 可能撞 dependency）
DROP FUNCTION IF EXISTS claim_gto_batch(text);

-- 2. DROP 舊 gto_batch_progress 表
--    原 390 pending + 1 done 可丟，schema v2 要重 seed
DROP TABLE IF EXISTS gto_batch_progress;

-- 3. 新 gto_batch_progress 表
CREATE TABLE gto_batch_progress (
  id              serial      PRIMARY KEY,

  -- === 場景鍵（對齊 gto_solutions）===
  gametype        text        NOT NULL,
  -- 例：'hu_25bb_srp' / 'hu_40bb_srp' / 'hu_13bb_srp' / 'cash_6max_100bb' / 'mtt_9max_40bb'
  depth_bb        numeric     NOT NULL,
  -- 起始籌碼深度（bb）
  preflop_actions text        NOT NULL,
  -- GTOW 編碼：例 HU 'R2.5-C'（BTN open 2.5bb, BB call）
  board           text        NOT NULL,
  -- flop 3 張連寫：'7s7d2h'
  turn_card       text        NOT NULL DEFAULT '',
  -- turn 1 張：'3c'
  river_card      text        NOT NULL DEFAULT '',
  -- river 1 張：'5h'（turn street 為 ''）
  street          text        NOT NULL,
  -- 'turn' / 'river'（未來擴充 'flop' / 'preflop'）

  -- === Pipeline 狀態 ===
  status          text        NOT NULL DEFAULT 'pending',
  machine_id      text,
  claimed_at      timestamptz,
  completed_at    timestamptz,
  row_count       integer,
  error_msg       text,
  created_at      timestamptz NOT NULL DEFAULT now(),

  -- 工作項目唯一鍵（對齊 v2 scenario 鍵）
  UNIQUE (gametype, depth_bb, preflop_actions, board, turn_card, river_card, street)
);

-- CHECK constraint：status 合法值
ALTER TABLE gto_batch_progress ADD CONSTRAINT chk_batch_status_v2
  CHECK (status IN ('pending', 'claimed', 'uploading', 'done', 'failed'));

-- CHECK constraint：street 合法值
ALTER TABLE gto_batch_progress ADD CONSTRAINT chk_batch_street_v2
  CHECK (street IN ('flop', 'turn', 'river', 'preflop'));

-- 4. RLS（pipeline 協調表，authenticated 可讀；寫入走 service_role bypass）
ALTER TABLE gto_batch_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users can read gto_batch_progress" ON gto_batch_progress;
CREATE POLICY "authenticated users can read gto_batch_progress"
  ON gto_batch_progress FOR SELECT
  TO authenticated
  USING (true);

-- 5. 常用 query 加速 index（filter by status + claimed machine）
CREATE INDEX IF NOT EXISTS idx_gto_batch_progress_status
  ON gto_batch_progress (status, created_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_gto_batch_progress_gametype
  ON gto_batch_progress (gametype, depth_bb);

-- 6. claim_gto_batch RPC v2（接 gametype / depth filter 參數）
CREATE OR REPLACE FUNCTION claim_gto_batch(
  p_machine_id      text,
  p_gametype_filter text    DEFAULT NULL,
  p_depth_filter    numeric DEFAULT NULL
)
RETURNS TABLE (
  id              integer,
  gametype        text,
  depth_bb        numeric,
  preflop_actions text,
  board           text,
  turn_card       text,
  river_card      text,
  street          text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE gto_batch_progress
  SET status     = 'claimed',
      machine_id = p_machine_id,
      claimed_at = now()
  WHERE gto_batch_progress.id = (
    SELECT bp.id
    FROM gto_batch_progress bp
    WHERE bp.status = 'pending'
      AND (p_gametype_filter IS NULL OR bp.gametype = p_gametype_filter)
      AND (p_depth_filter    IS NULL OR bp.depth_bb = p_depth_filter)
    ORDER BY
      bp.street ASC,        -- turn 先跑完再跑 river
      bp.gametype,
      bp.depth_bb,
      bp.board,
      bp.turn_card,
      bp.river_card
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING
    gto_batch_progress.id,
    gto_batch_progress.gametype,
    gto_batch_progress.depth_bb,
    gto_batch_progress.preflop_actions,
    gto_batch_progress.board,
    gto_batch_progress.turn_card,
    gto_batch_progress.river_card,
    gto_batch_progress.street;
$$;

-- =========================================================
-- 部署後驗證查詢（分開貼 SQL Editor，逐條 Run）
-- =========================================================
--
--   -- (a) 表建起來
--   SELECT tablename FROM pg_tables WHERE tablename = 'gto_batch_progress';
--   -- 預期：1 row
--
--   -- (b) Column 齊全（11 個欄位 + id）
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_name = 'gto_batch_progress'
--     ORDER BY ordinal_position;
--   -- 預期：id / gametype / depth_bb / preflop_actions / board / turn_card /
--   --       river_card / street / status / machine_id / claimed_at /
--   --       completed_at / row_count / error_msg / created_at
--
--   -- (c) Constraint 建起來（PK + UNIQUE + chk_batch_status_v2 + chk_batch_street_v2）
--   SELECT conname FROM pg_constraint
--     WHERE conrelid = 'gto_batch_progress'::regclass
--     ORDER BY conname;
--   -- 預期：≥4 row
--
--   -- (d) RLS policy 建起來
--   SELECT policyname FROM pg_policies WHERE tablename = 'gto_batch_progress';
--   -- 預期：1 row (authenticated users can read gto_batch_progress)
--
--   -- (e) RPC 建起來（新 signature 3 參數）
--   SELECT proname, pg_get_function_arguments(oid) AS args
--     FROM pg_proc WHERE proname = 'claim_gto_batch';
--   -- 預期：1 row，args 包含 p_machine_id text, p_gametype_filter text DEFAULT NULL,
--   --        p_depth_filter numeric DEFAULT NULL
--
--   -- (f) smoke test：insert 1 row + claim + rollback
--   --     確認 RPC 會在多種 filter 組合下正確 claim／跳過
--   INSERT INTO gto_batch_progress
--     (gametype, depth_bb, preflop_actions, board, turn_card, street, status)
--     VALUES ('hu_25bb_srp', 25, 'R2.5-C', '7s7d2h', '3c', 'turn', 'pending');
--
--   -- f1：無 filter claim（應領到）
--   SELECT * FROM claim_gto_batch('TEST-VERIFY');
--   -- 預期：1 row（status 被改為 'claimed'）
--
--   -- f2：再次 claim（應回空，無 pending）
--   SELECT * FROM claim_gto_batch('TEST-VERIFY');
--   -- 預期：0 row
--
--   -- f3：reset 回 pending
--   UPDATE gto_batch_progress SET status='pending', machine_id=NULL, claimed_at=NULL
--     WHERE machine_id='TEST-VERIFY';
--
--   -- f4：gametype filter 匹配（應領到）
--   SELECT * FROM claim_gto_batch('TEST-VERIFY', 'hu_25bb_srp', NULL);
--   -- 預期：1 row
--
--   -- f5：reset
--   UPDATE gto_batch_progress SET status='pending', machine_id=NULL, claimed_at=NULL
--     WHERE machine_id='TEST-VERIFY';
--
--   -- f6：gametype filter 不匹配（應回空）
--   SELECT * FROM claim_gto_batch('TEST-VERIFY', 'hu_40bb_srp', NULL);
--   -- 預期：0 row
--
--   -- f7：depth filter 匹配（應領到）
--   SELECT * FROM claim_gto_batch('TEST-VERIFY', NULL, 25);
--   -- 預期：1 row
--
--   -- cleanup smoke test data
--   DELETE FROM gto_batch_progress WHERE machine_id = 'TEST-VERIFY'
--     OR gametype = 'hu_25bb_srp' AND board = '7s7d2h' AND turn_card = '3c';
--
-- 全通過 → 執行者重 seed + 跑 1 個 batch 驗新 pipeline（T-097 驗證階段）
-- =========================================================
