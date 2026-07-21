-- Shop type system
DO $$ BEGIN
  CREATE TYPE public.shop_type AS ENUM ('full_erp', 'simple_cash');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.shops
  ADD COLUMN IF NOT EXISTS shop_type public.shop_type NOT NULL DEFAULT 'full_erp';

-- Seed defaults for known shops
UPDATE public.shops SET shop_type = 'simple_cash'
  WHERE lower(name) IN ('aklas', 'khaled') AND shop_type <> 'simple_cash';

UPDATE public.shops SET shop_type = 'full_erp'
  WHERE lower(name) IN ('azzouz', 'nujum') AND shop_type <> 'full_erp';