-- Create RPC function to update user balance safely
CREATE OR REPLACE FUNCTION update_user_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET balance = balance + amount
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if balance would go negative
  IF (SELECT balance FROM public.users WHERE id = user_id) < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
