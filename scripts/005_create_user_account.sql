-- Create account for colonel
-- Email: contact.kerventzweb@gmail.com
-- Password: kerventz2005 (will be hashed by Supabase Auth)

-- This script creates a user account manually
-- Note: In production, passwords should be hashed with bcrypt
-- For now, we'll use Supabase Auth to create the account properly

-- Insert into auth.users (Supabase Auth table)
-- This requires admin access to Supabase dashboard
-- Go to Authentication > Users > Add User

-- Alternatively, use this SQL to insert directly:
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  'contact.kerventzweb@gmail.com',
  crypt('kerventz2005', gen_salt('bf')), -- bcrypt hash
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"colonel","phone":"+50946086682"}',
  false,
  'authenticated'
);

-- Then insert into public.users table
INSERT INTO public.users (
  id,
  email,
  full_name,
  phone,
  role,
  balance,
  status,
  created_at
)
SELECT 
  id,
  'contact.kerventzweb@gmail.com',
  'colonel',
  '+50946086682',
  'client',
  0.00,
  'active',
  now()
FROM auth.users
WHERE email = 'contact.kerventzweb@gmail.com';
