
-- Add failed login tracking
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS failed_login_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_failed_at timestamptz;

-- Update find_login_email to exclude disabled accounts
CREATE OR REPLACE FUNCTION public.find_login_email(_identifier text)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT email FROM public.profiles
  WHERE _identifier IS NOT NULL AND length(trim(_identifier)) > 0
    AND COALESCE(is_disabled, false) = false
    AND (
      lower(email) = lower(trim(_identifier))
      OR lower(username) = lower(trim(_identifier))
      OR mobile = trim(_identifier)
      OR regexp_replace(coalesce(mobile,''), '\D', '', 'g')
         = regexp_replace(trim(_identifier), '\D', '', 'g')
    )
  LIMIT 1;
$$;

-- RPC to bump failed login count (callable by anon)
CREATE OR REPLACE FUNCTION public.bump_failed_login(_identifier text)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  UPDATE public.profiles
    SET failed_login_count = COALESCE(failed_login_count,0) + 1,
        last_failed_at = now()
  WHERE lower(email) = lower(trim(_identifier))
     OR lower(username) = lower(trim(_identifier))
     OR mobile = trim(_identifier);
$$;
GRANT EXECUTE ON FUNCTION public.bump_failed_login(text) TO anon, authenticated;

-- RPC to reset on success
CREATE OR REPLACE FUNCTION public.reset_failed_login()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  UPDATE public.profiles
    SET failed_login_count = 0, last_failed_at = NULL
  WHERE id = auth.uid();
$$;
GRANT EXECUTE ON FUNCTION public.reset_failed_login() TO authenticated;
