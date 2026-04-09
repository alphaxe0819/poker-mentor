-- Add poker MBTI quiz result columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS quiz_style TEXT,
  ADD COLUMN IF NOT EXISTS quiz_level TEXT,
  ADD COLUMN IF NOT EXISTS quiz_dimensions JSONB;
