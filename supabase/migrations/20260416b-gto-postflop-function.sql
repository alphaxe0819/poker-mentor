-- =========================================================
-- claim_gto_batch RPC — Part B（配 20260416-gto-postflop.sql 的 tables）
-- =========================================================
-- 領取一筆 pending 任務的原子性 RPC。
-- 兩台 worker 同時呼叫時，FOR UPDATE SKIP LOCKED 保證不重複領取。
--
-- 部署順序：
--   1. 先確認 20260416-gto-postflop.sql 已執行（gto_batch_progress 存在）
--   2. 貼本檔到 Supabase SQL Editor，Run
--   3. 驗證：SELECT claim_gto_batch('TEST') — 無 pending 時應回空 row set
--
-- 為何用 LANGUAGE sql 而非 plpgsql：
--   Supabase SQL Editor 對 `$$ ... RETURNING ... INTO v_id ... $$` 的解析
--   會在某些情況把 `INTO v_id` 當成頂層 SQL 切出來解析，然後炸
--   `42P01: relation "v_id" does not exist`（即使 `$func$` 具名 dollar
--   quote 也擋不住）。改 pure SQL + UPDATE...RETURNING 一句，不需要
--   DECLARE / INTO，語意完全相同，部署穩定。
-- =========================================================

CREATE OR REPLACE FUNCTION claim_gto_batch(p_machine_id text)
RETURNS TABLE (
  id           integer,
  board_key    text,
  turn_card    text,
  river_card   text,
  street       text,
  stack_label  text
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
    ORDER BY
      bp.street ASC,        -- turn 先跑完再跑 river
      bp.board_key,
      bp.turn_card,
      bp.river_card,
      bp.stack_label
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING
    gto_batch_progress.id,
    gto_batch_progress.board_key,
    gto_batch_progress.turn_card,
    gto_batch_progress.river_card,
    gto_batch_progress.street,
    gto_batch_progress.stack_label;
$$;

-- 部署後驗證：
--   SELECT claim_gto_batch('TEST-VERIFY');
--   → 若 gto_batch_progress 全為 pending，應回第一筆（並被標 claimed + machine_id='TEST-VERIFY'）
--   → 若無 pending row，回空 table
--   驗證完記得清理：
--   UPDATE gto_batch_progress SET status='pending', machine_id=NULL, claimed_at=NULL
--     WHERE machine_id='TEST-VERIFY';
