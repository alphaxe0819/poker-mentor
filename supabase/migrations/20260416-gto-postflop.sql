-- =========================================================
-- Turn/River GTO Postflop Data + Batch Progress Tracking
-- Part A：tables + RLS（function 在 20260416b-gto-postflop-function.sql）
-- =========================================================
-- 儲存 TexasSolver 解算的 turn/river GTO 策略資料。
-- 前端透過 PostgREST 直接查詢（不走 Edge Function）。
-- gto_batch_progress 讓兩台電腦平行解算不重複。
--
-- 部署順序（Supabase SQL Editor）：
--   1. 先貼本檔（tables + RLS），Run → 確認 2 table + 2 policy 建立
--   2. 再貼 20260416b-gto-postflop-function.sql，Run → 確認 RPC 建立
--
-- 為何拆兩檔：SQL Editor 對整包混合 DDL + plpgsql 解析不穩，
-- 曾發生 function 解析失敗導致整個 transaction rollback、tables 也沒建起來。
-- 拆兩檔各自獨立 transaction，一段失敗另一段仍 OK。
-- =========================================================

-- 1. 核心資料表：gto_postflop
-- Composite PK 同時是 B-tree index，單筆 point lookup < 1ms
CREATE TABLE IF NOT EXISTS gto_postflop (
  board_key    text NOT NULL,            -- flop 牌面 e.g. 'As7d2c'
  turn_card    text NOT NULL,            -- turn 牌 e.g. 'Kh'（turn 街必填）
  river_card   text NOT NULL DEFAULT '', -- river 牌 e.g. '5c'（turn 街為 ''）
  street       text NOT NULL,            -- 'turn' / 'river'
  stack_label  text NOT NULL,            -- '13bb' / '25bb' / '40bb'
  role         text NOT NULL,            -- 'btn_bet' / 'bb_facing_bet_small' 等
  hand_class   text NOT NULL,            -- 'AA' / 'AKs' / 'AKo' 等 169 種
  action_code  text NOT NULL,            -- 'b33' / 'mix:b33@60,x' 等

  PRIMARY KEY (board_key, turn_card, river_card, street, stack_label, role, hand_class)
);

-- CHECK constraints（用 DO block 包起來避免重複 ADD 時報錯）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_gto_street') THEN
    ALTER TABLE gto_postflop ADD CONSTRAINT chk_gto_street
      CHECK (street IN ('turn', 'river'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_gto_stack') THEN
    ALTER TABLE gto_postflop ADD CONSTRAINT chk_gto_stack
      CHECK (stack_label IN ('13bb', '25bb', '40bb'));
  END IF;
END $$;

-- RLS：所有登入用戶可讀，寫入走 service_role（bypass RLS）
ALTER TABLE gto_postflop ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users can read gto_postflop" ON gto_postflop;
CREATE POLICY "authenticated users can read gto_postflop"
  ON gto_postflop FOR SELECT
  TO authenticated
  USING (true);

-- 2. 雙機工作協調表：gto_batch_progress
CREATE TABLE IF NOT EXISTS gto_batch_progress (
  id           serial      PRIMARY KEY,
  board_key    text        NOT NULL,
  turn_card    text        NOT NULL,
  river_card   text        NOT NULL DEFAULT '',
  street       text        NOT NULL,
  stack_label  text        NOT NULL,

  status       text        NOT NULL DEFAULT 'pending',
  machine_id   text,
  claimed_at   timestamptz,
  completed_at timestamptz,
  row_count    integer,
  error_msg    text,
  created_at   timestamptz DEFAULT now(),

  UNIQUE (board_key, turn_card, river_card, street, stack_label)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_batch_status') THEN
    ALTER TABLE gto_batch_progress ADD CONSTRAINT chk_batch_status
      CHECK (status IN ('pending', 'claimed', 'uploading', 'done', 'failed'));
  END IF;
END $$;

ALTER TABLE gto_batch_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users can read gto_batch_progress" ON gto_batch_progress;
CREATE POLICY "authenticated users can read gto_batch_progress"
  ON gto_batch_progress FOR SELECT
  TO authenticated
  USING (true);

-- 下一步：貼 20260416b-gto-postflop-function.sql 建立 claim_gto_batch RPC
