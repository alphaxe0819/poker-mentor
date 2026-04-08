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
