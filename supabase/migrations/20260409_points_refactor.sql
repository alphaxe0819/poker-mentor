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
