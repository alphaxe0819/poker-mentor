-- =============================================
-- GTO Poker Trainer — Supabase 資料表初始化
-- 貼到 Supabase SQL Editor 執行
-- =============================================

-- 用戶資料表
create table profiles (
  id uuid references auth.users primary key,
  email text,
  name text,
  is_coach boolean default false,
  created_at timestamptz default now()
);

-- 教練代碼表
create table coach_codes (
  code text primary key,
  used_by uuid references profiles(id),
  used_at timestamptz,
  created_at timestamptz default now()
);

-- 訓練記錄表
create table training_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  position text,
  hand text,
  action_taken text,
  correct_action text,
  is_correct boolean,
  stack_bb integer,
  coach_id text,
  created_at timestamptz default now()
);

-- RLS 政策
alter table profiles enable row level security;
alter table training_records enable row level security;
alter table coach_codes enable row level security;

create policy "users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "users can read own records"
  on training_records for select using (auth.uid() = user_id);
create policy "users can insert own records"
  on training_records for insert with check (auth.uid() = user_id);

create policy "anyone can read coach codes"
  on coach_codes for select using (true);
create policy "anyone can update coach codes"
  on coach_codes for update using (true);
-- =============================================
-- 同步點數和課程進度到 Supabase
-- 貼到 Supabase SQL Editor 執行
-- =============================================

-- 1. profiles 新增欄位
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_done boolean DEFAULT false;

-- 2. 課程進度表
CREATE TABLE IF NOT EXISTS course_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  course_id text NOT NULL,
  completed integer DEFAULT 0,
  correct integer DEFAULT 0,
  total integer DEFAULT 0,
  unlocked boolean DEFAULT false,
  last_played_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 3. RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own course progress"
  ON course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own course progress"
  ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own course progress"
  ON course_progress FOR UPDATE USING (auth.uid() = user_id);
-- =============================================
-- Lemon Squeezy 訂閱整合 — 新增訂閱欄位
-- 貼到 Supabase SQL Editor 執行
-- =============================================

-- 1. profiles 新增付費相關欄位
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_plays_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_plays_date date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS player_type text DEFAULT 'tournament';

-- 2. 訂閱記錄表
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL UNIQUE,

  -- Lemon Squeezy 識別資訊
  ls_subscription_id text UNIQUE,          -- Lemon Squeezy subscription ID
  ls_customer_id text,                      -- Lemon Squeezy customer ID
  ls_variant_id text,                       -- 方案 variant ID
  ls_product_id text,                       -- 產品 ID

  -- 訂閱狀態
  status text NOT NULL DEFAULT 'inactive',  -- active, cancelled, expired, paused, past_due, inactive
  plan text DEFAULT 'free',                 -- free, pro_monthly, pro_yearly

  -- 時間
  current_period_start timestamptz,
  current_period_end timestamptz,           -- 訂閱到期時間
  cancel_at timestamptz,                    -- 預定取消時間（取消但仍在有效期內）
  trial_ends_at timestamptz,

  -- 付款
  card_brand text,                          -- visa, mastercard 等
  card_last_four text,                      -- 卡號後四碼

  -- Lemon Squeezy URLs
  update_payment_url text,                  -- 更新付款方式連結
  customer_portal_url text,                 -- 客戶自助入口連結

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Webhook 用 service_role key 寫入，不需要 insert/update policy for auth users
-- 但需要讓 service_role 可以操作（service_role 預設 bypass RLS）

-- 4. 建立索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ls_subscription_id ON subscriptions(ls_subscription_id);

-- 5. answer_records 表（如果還沒建立）
CREATE TABLE IF NOT EXISTS answer_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  db_key text,
  hand text,
  chosen_action text,
  gto_action text,
  is_correct boolean,
  stack_bb integer,
  hero_pos text,
  scenario_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE answer_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users can read own answer_records"
    ON answer_records FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "users can insert own answer_records"
    ON answer_records FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 6. share_results 表（如果還沒建立）
CREATE TABLE IF NOT EXISTS share_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  user_name text,
  total integer,
  correct integer,
  score integer,
  accuracy integer,
  streak integer,
  stack_bb integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE share_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "anyone can read share_results"
    ON share_results FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "users can insert own share_results"
    ON share_results FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 7. 分析相關欄位
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS analysis_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS analysis_daily_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS analysis_last_date text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS analysis_last_answered integer DEFAULT 0;
-- =============================================
-- 序號兌換系統 — promo_redemptions 表 + profiles 新增欄位
-- 貼到 Supabase SQL Editor 執行
-- =============================================

-- 1. profiles 新增 promo 到期欄位
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS promo_expires_at timestamptz;

-- 2. 序號兌換記錄表
CREATE TABLE IF NOT EXISTS promo_redemptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  code text NOT NULL,
  redeemed_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (user_id, code)
);

-- 3. RLS
ALTER TABLE promo_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own promo_redemptions"
  ON promo_redemptions FOR SELECT USING (auth.uid() = user_id);

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_user_id ON promo_redemptions(user_id);
-- Add poker MBTI quiz result columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS quiz_style TEXT,
  ADD COLUMN IF NOT EXISTS quiz_level TEXT,
  ADD COLUMN IF NOT EXISTS quiz_dimensions JSONB;
-- Anonymous quiz feedback (no auth required)
CREATE TABLE IF NOT EXISTS quiz_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  quiz_style TEXT NOT NULL,
  quiz_level TEXT NOT NULL,
  accuracy_rating TEXT NOT NULL,
  improve_area TEXT NOT NULL,
  gto_correct INTEGER NOT NULL
);

-- Allow anonymous inserts
ALTER TABLE quiz_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert quiz feedback"
  ON quiz_feedback FOR INSERT
  WITH CHECK (true);
-- Point transaction history
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user
  ON point_transactions(user_id, created_at DESC);

-- RLS: users can read own transactions
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions"
  ON point_transactions FOR SELECT USING (auth.uid() = user_id);

-- Atomic add points
CREATE OR REPLACE FUNCTION add_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL
) RETURNS TABLE(new_balance INTEGER) AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT points INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;
  v_balance := COALESCE(v_balance, 0) + p_amount;
  UPDATE profiles SET points = v_balance WHERE id = p_user_id;
  INSERT INTO point_transactions (user_id, amount, balance_after, type, description, reference_id)
  VALUES (p_user_id, p_amount, v_balance, p_type, p_description, p_reference_id);
  RETURN QUERY SELECT v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic spend points
CREATE OR REPLACE FUNCTION spend_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT
) RETURNS TABLE(success BOOLEAN, new_balance INTEGER) AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT points INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;
  v_balance := COALESCE(v_balance, 0);
  IF v_balance < p_amount THEN
    RETURN QUERY SELECT false, v_balance;
    RETURN;
  END IF;
  v_balance := v_balance - p_amount;
  UPDATE profiles SET points = v_balance WHERE id = p_user_id;
  INSERT INTO point_transactions (user_id, amount, balance_after, type, description)
  VALUES (p_user_id, -p_amount, v_balance, p_type, p_description);
  RETURN QUERY SELECT true, v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Daily login & streak tracking
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_login_date TEXT,
  ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0;

-- Milestone tracking (array of claimed milestone thresholds)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS claimed_milestones INTEGER[] DEFAULT '{}';

-- Referral system
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS coach_onboarding_done BOOLEAN DEFAULT false;
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
-- Free users (no active paid subscription): keep latest 1 session
-- Basic users (basic_monthly / basic_yearly plans): keep latest 30 sessions
-- Pro users (pro_monthly / pro_yearly plans): keep last 365 days
-- Subscription is considered active if status='active' OR
--   (status='cancelled' AND current_period_end > now())
CREATE OR REPLACE FUNCTION cleanup_tournament_sessions(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_is_pro boolean;
  v_is_basic boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p_user_id
      AND plan IN ('pro_monthly', 'pro_yearly')
      AND (
        status = 'active'
        OR (status = 'cancelled' AND current_period_end > now())
      )
  ) INTO v_is_pro;

  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p_user_id
      AND plan IN ('basic_monthly', 'basic_yearly')
      AND (
        status = 'active'
        OR (status = 'cancelled' AND current_period_end > now())
      )
  ) INTO v_is_basic;

  IF v_is_pro THEN
    -- PRO: keep last 365 days
    DELETE FROM tournament_sessions
    WHERE user_id = p_user_id
      AND created_at < now() - interval '365 days';
  ELSIF v_is_basic THEN
    -- BASIC: keep latest 30 sessions
    DELETE FROM tournament_sessions
    WHERE user_id = p_user_id
      AND id NOT IN (
        SELECT id FROM tournament_sessions
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 30
      );
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
