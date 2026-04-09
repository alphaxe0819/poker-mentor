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
