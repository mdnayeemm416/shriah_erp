-- 1. Extend app_role enum with viewer
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- 2. Add is_disabled flag on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_disabled boolean NOT NULL DEFAULT false;

-- 3. Allow admins to insert/update profiles for any user
DROP POLICY IF EXISTS "admin manage profiles" ON public.profiles;
CREATE POLICY "admin manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. user_shop_access table
CREATE TABLE IF NOT EXISTS public.user_shop_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, shop_id)
);

ALTER TABLE public.user_shop_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "self or admin read user_shop_access" ON public.user_shop_access;
CREATE POLICY "self or admin read user_shop_access"
  ON public.user_shop_access
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admin manage user_shop_access" ON public.user_shop_access;
CREATE POLICY "admin manage user_shop_access"
  ON public.user_shop_access
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_user_shop_access_user ON public.user_shop_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shop_access_shop ON public.user_shop_access(shop_id);