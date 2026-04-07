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
