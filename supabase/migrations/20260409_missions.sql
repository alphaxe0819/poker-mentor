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
