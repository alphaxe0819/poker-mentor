-- supabase/migrations/2026-04-11-tournament-tables.sql
-- v1.0 HU simulator: tournament_sessions + tournament_hands + retention cleanup
-- Run manually in Supabase Dashboard → SQL Editor before v1.0 release.

-- ── tournament_sessions ─────────────────────────
CREATE TABLE IF NOT EXISTS tournament_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scenario text NOT NULL,                -- 'hu' for v1.0
  stack_ratio text,                       -- '1:1', '1:2', '2:1', '1:5', '5:1'
  entry_cost int NOT NULL,
  start_stack_bb int NOT NULL,
  result text,                            -- 'win' | 'lose' | 'abandoned'
  total_hands int DEFAULT 0,
  violation_points int DEFAULT 0,
  analysis_points int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_tournament_sessions_user_created
  ON tournament_sessions(user_id, created_at DESC);

-- ── tournament_hands ────────────────────────────
CREATE TABLE IF NOT EXISTS tournament_hands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES tournament_sessions(id) ON DELETE CASCADE,
  hand_number int NOT NULL,
  hero_position text,
  hero_cards text,                        -- e.g. 'AsKh'
  villain_cards text,                     -- only filled on showdown
  board text,                             -- e.g. 'AsKh7d2c5s'
  action_sequence jsonb,                  -- [{street, actor, kind, amount}, ...]
  pot_total_bb int,
  hero_stack_before int,
  hero_stack_after int,
  hero_won boolean,
  gto_flags jsonb,                        -- [{street, actor, pass: true|false}]
  ai_analysis text,                       -- Claude Haiku output
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tournament_hands_session
  ON tournament_hands(session_id, hand_number);

-- ── RLS policies ────────────────────────────────
ALTER TABLE tournament_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_hands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON tournament_sessions;
CREATE POLICY "Users can view own sessions"
  ON tournament_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON tournament_sessions;
CREATE POLICY "Users can insert own sessions"
  ON tournament_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON tournament_sessions;
CREATE POLICY "Users can update own sessions"
  ON tournament_sessions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own hands" ON tournament_hands;
CREATE POLICY "Users can view own hands"
  ON tournament_hands FOR SELECT
  USING (
    session_id IN (SELECT id FROM tournament_sessions WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own hands" ON tournament_hands;
CREATE POLICY "Users can insert own hands"
  ON tournament_hands FOR INSERT
  WITH CHECK (
    session_id IN (SELECT id FROM tournament_sessions WHERE user_id = auth.uid())
  );

-- ── Retention cleanup RPC ───────────────────────
-- Free users (no active subscription): keep latest 1 session
-- Pro users (active pro_monthly or pro_yearly subscription): keep last 365 days
-- Future basic tier (not yet in production): if added, update this function
CREATE OR REPLACE FUNCTION cleanup_tournament_sessions(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_is_pro boolean;
BEGIN
  -- Check if user has an active pro subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p_user_id
      AND plan IN ('pro_monthly', 'pro_yearly')
      AND (
        status = 'active'
        OR (status = 'cancelled' AND current_period_end > now())
      )
  ) INTO v_is_pro;

  IF v_is_pro THEN
    -- PRO: keep last 365 days
    DELETE FROM tournament_sessions
    WHERE user_id = p_user_id
      AND created_at < now() - interval '365 days';
  ELSE
    -- FREE: keep only the latest 1 session
    DELETE FROM tournament_sessions
    WHERE user_id = p_user_id
      AND id NOT IN (
        SELECT id FROM tournament_sessions
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 1
      );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
