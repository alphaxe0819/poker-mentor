-- =========================================================
-- Turn/River GTO Postflop Data + Batch Progress Tracking
-- =========================================================
-- 儲存 TexasSolver 解算的 turn/river GTO 策略資料。
-- 前端透過 PostgREST 直接查詢（不走 Edge Function）。
-- gto_batch_progress 讓兩台電腦平行解算不重複。
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

-- CHECK constraints
ALTER TABLE gto_postflop ADD CONSTRAINT chk_gto_street
  CHECK (street IN ('turn', 'river'));
ALTER TABLE gto_postflop ADD CONSTRAINT chk_gto_stack
  CHECK (stack_label IN ('13bb', '25bb', '40bb'));

-- RLS：所有登入用戶可讀，寫入走 service_role（bypass RLS）
ALTER TABLE gto_postflop ENABLE ROW LEVEL SECURITY;

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

ALTER TABLE gto_batch_progress ADD CONSTRAINT chk_batch_status
  CHECK (status IN ('pending', 'claimed', 'uploading', 'done', 'failed'));

ALTER TABLE gto_batch_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can read gto_batch_progress"
  ON gto_batch_progress FOR SELECT
  TO authenticated
  USING (true);

-- 3. 領取任務的 RPC（原子性，防兩台搶同一個）
CREATE OR REPLACE FUNCTION claim_gto_batch(p_machine_id text)
RETURNS TABLE (
  id           integer,
  board_key    text,
  turn_card    text,
  river_card   text,
  street       text,
  stack_label  text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id integer;
BEGIN
  -- 原子性領取：FOR UPDATE SKIP LOCKED 防止兩台搶同一個
  UPDATE gto_batch_progress bp
  SET status = 'claimed',
      machine_id = p_machine_id,
      claimed_at = now()
  WHERE bp.id = (
    SELECT bp2.id
    FROM gto_batch_progress bp2
    WHERE bp2.status = 'pending'
    ORDER BY
      bp2.street ASC,         -- turn 先跑完再跑 river
      bp2.board_key,
      bp2.turn_card,
      bp2.river_card,
      bp2.stack_label
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING bp.id INTO v_id;

  IF v_id IS NULL THEN
    RETURN;  -- 沒有待領取的任務
  END IF;

  RETURN QUERY
    SELECT bp.id, bp.board_key, bp.turn_card, bp.river_card, bp.street, bp.stack_label
    FROM gto_batch_progress bp
    WHERE bp.id = v_id;
END;
$$;
