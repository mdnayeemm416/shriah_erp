
-- Add username and mobile to profiles for flexible login
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS mobile text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique
  ON public.profiles (lower(username)) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_unique
  ON public.profiles (mobile) WHERE mobile IS NOT NULL;

-- Public lookup function: resolves a username/email/mobile to the account's email
-- so the login form can sign in via signInWithPassword regardless of which
-- identifier the user typed. Returns NULL when no match.
CREATE OR REPLACE FUNCTION public.find_login_email(_identifier text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles
  WHERE _identifier IS NOT NULL AND length(trim(_identifier)) > 0
    AND (
      lower(email) = lower(trim(_identifier))
      OR lower(username) = lower(trim(_identifier))
      OR mobile = trim(_identifier)
      OR regexp_replace(coalesce(mobile,''), '\D', '', 'g')
         = regexp_replace(trim(_identifier), '\D', '', 'g')
    )
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.find_login_email(text) TO anon, authenticated;
