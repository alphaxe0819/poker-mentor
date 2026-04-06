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
