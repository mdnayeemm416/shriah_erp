
ALTER TABLE public.pos_customers
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS credit_limit numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS customer_type text NOT NULL DEFAULT 'regular';
