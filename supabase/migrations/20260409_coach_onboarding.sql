ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS coach_onboarding_done BOOLEAN DEFAULT false;
