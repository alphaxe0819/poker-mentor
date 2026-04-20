-- =========================================================
-- solver_postflop_mtt — MTT 專用 solver 樹儲存表（仿 solver_postflop_6max）
-- + 從 solver_postflop_6max 搬 T-011 暫借 mtt_% row 過來 + 清 6max 那幾筆
-- =========================================================
-- T-012：從 solver_postflop_6max（原 6-max cash 用）分家出 MTT 專用表。
--
-- T-011 E2E 期間，MTT row 暫借 solver_postflop_6max 入庫（scenario_slug 前綴 'mtt_'）；
-- 本 migration 建表後，一次做完「INSERT 搬家 + DELETE 原表」。
--
-- 部署（Supabase SQL Editor，單次貼整檔 Run）：
--   1. 建 solver_postflop_mtt table + CHECK + RLS + index
--   2. INSERT ... SELECT FROM solver_postflop_6max WHERE scenario_slug LIKE 'mtt_%'
--      (ON CONFLICT DO NOTHING — 重跑安全)
--   3. DELETE FROM solver_postflop_6max WHERE 有被搬成功（EXISTS 雙保險）
--
-- Idempotent：所有 statement 重跑不爆（IF NOT EXISTS / DO block / ON CONFLICT）
--
-- 與 6max schema 差異：
--   - 欄位對齊：scenario_slug / flop / ip_pos / oop_pos / pot_bb /
--     effective_stack_bb / tree / solver_config
--   - PK (scenario_slug, flop) — 支援 `Prefer: resolution=merge-duplicates` upsert
--   - 加 CHECK (scenario_slug LIKE 'mtt_%') — 防誤 insert 非 MTT 資料
--   - 加 created_at timestamptz DEFAULT now()
--   - 不加 updated_at trigger（避免 Supabase SQL Editor plpgsql 解析踩坑，T-042 教訓）
-- =========================================================

-- 1. 建 table
CREATE TABLE IF NOT EXISTS solver_postflop_mtt (
  scenario_slug      text        NOT NULL,
  flop               text        NOT NULL,
  ip_pos             text        NOT NULL,
  oop_pos            text        NOT NULL,
  pot_bb             numeric     NOT NULL,
  effective_stack_bb numeric     NOT NULL,
  tree               jsonb       NOT NULL,
  solver_config      jsonb,
  created_at         timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (scenario_slug, flop)
);

-- 2. CHECK constraint（DO block idempotent，不會重複 ADD 報錯）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_solver_mtt_scenario_prefix') THEN
    ALTER TABLE solver_postflop_mtt ADD CONSTRAINT chk_solver_mtt_scenario_prefix
      CHECK (scenario_slug LIKE 'mtt_%');
  END IF;
END $$;

-- 3. RLS：所有登入用戶可讀，寫入走 service_role（bypass RLS）
ALTER TABLE solver_postflop_mtt ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users can read solver_postflop_mtt" ON solver_postflop_mtt;
CREATE POLICY "authenticated users can read solver_postflop_mtt"
  ON solver_postflop_mtt FOR SELECT
  TO authenticated
  USING (true);

-- 4. Scenario lookup 加速（對齊 6max table 的常見 index；PK 已含 scenario_slug
--    第一欄，技術上冗餘，但保留以便未來 scenario-only filter 的 query plan 穩定）
CREATE INDEX IF NOT EXISTS idx_solver_postflop_mtt_scenario
  ON solver_postflop_mtt (scenario_slug);

-- 5. 從 solver_postflop_6max 搬 T-011 暫借 mtt_% row 過來
--    ON CONFLICT DO NOTHING：重跑時 mtt 若已有同 PK 則 skip（不覆蓋）
INSERT INTO solver_postflop_mtt
  (scenario_slug, flop, ip_pos, oop_pos, pot_bb, effective_stack_bb,
   tree, solver_config)
SELECT scenario_slug, flop, ip_pos, oop_pos, pot_bb, effective_stack_bb,
       tree, solver_config
FROM solver_postflop_6max
WHERE scenario_slug LIKE 'mtt_%'
ON CONFLICT (scenario_slug, flop) DO NOTHING;

-- 6. 清 6max 表裡已搬成功的 mtt_% row
--    EXISTS 雙保險：只刪「mtt 表已有對應 row」的，避免 INSERT 失敗時誤刪
DELETE FROM solver_postflop_6max AS s6
WHERE s6.scenario_slug LIKE 'mtt_%'
  AND EXISTS (
    SELECT 1 FROM solver_postflop_mtt AS smtt
    WHERE smtt.scenario_slug = s6.scenario_slug
      AND smtt.flop = s6.flop
  );

-- =========================================================
-- 部署後驗證查詢（分開貼到 SQL Editor 單獨 Run）：
--
--   -- (a) 表 + constraint + policy 建起來
--   SELECT tablename FROM pg_tables WHERE tablename = 'solver_postflop_mtt';
--   SELECT conname FROM pg_constraint WHERE conrelid = 'solver_postflop_mtt'::regclass;
--   SELECT policyname FROM pg_policies WHERE tablename = 'solver_postflop_mtt';
--
--   -- (b) T-011 那筆 row 已搬過來
--   SELECT scenario_slug, flop, ip_pos, oop_pos, pot_bb, effective_stack_bb
--   FROM solver_postflop_mtt
--   ORDER BY scenario_slug, flop;
--
--   -- (c) 6max 表已無 mtt_% 殘留
--   SELECT COUNT(*) FROM solver_postflop_6max WHERE scenario_slug LIKE 'mtt_%';
--
-- 預期：
--   (a) 1 row (solver_postflop_mtt) + ≥2 conname (PK + chk_solver_mtt_scenario_prefix)
--       + 1 policyname
--   (b) 1+ row，scenario_slug 開頭 'mtt_'（至少 T-011 的 mtt_40bb_srp_btn_open_bb_call）
--   (c) 0
-- =========================================================
