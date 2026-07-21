CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.erp_user_credentials (
  user_id uuid PRIMARY KEY,
  password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.erp_user_credentials ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_erp_user_password(_user_id uuid, _password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User is required';
  END IF;
  IF _password IS NULL OR length(_password) < 1 OR length(_password) > 128 THEN
    RAISE EXCEPTION 'Password must be 1 to 128 characters';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  INSERT INTO public.erp_user_credentials (user_id, password_hash, updated_at, updated_by)
  VALUES (_user_id, crypt(_password, gen_salt('bf')), now(), auth.uid())
  ON CONFLICT (user_id) DO UPDATE
    SET password_hash = EXCLUDED.password_hash,
        updated_at = now(),
        updated_by = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_erp_login(_identifier text, _password text)
RETURNS TABLE(user_id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _identifier IS NULL OR length(trim(_identifier)) = 0 OR _password IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT p.id, p.email
  FROM public.profiles p
  JOIN public.erp_user_credentials c ON c.user_id = p.id
  WHERE COALESCE(p.is_disabled, false) = false
    AND (
      lower(p.email) = lower(trim(_identifier))
      OR lower(p.username) = lower(trim(_identifier))
      OR p.mobile = trim(_identifier)
      OR regexp_replace(coalesce(p.mobile,''), '\D', '', 'g') = regexp_replace(trim(_identifier), '\D', '', 'g')
    )
    AND c.password_hash = crypt(_password, c.password_hash)
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.bump_failed_login(_identifier text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  UPDATE public.profiles
    SET failed_login_count = COALESCE(failed_login_count,0) + 1,
        last_failed_at = now()
  WHERE _identifier IS NOT NULL AND length(trim(_identifier)) > 0
    AND (
      lower(email) = lower(trim(_identifier))
      OR lower(username) = lower(trim(_identifier))
      OR mobile = trim(_identifier)
      OR regexp_replace(coalesce(mobile,''), '\D', '', 'g') = regexp_replace(trim(_identifier), '\D', '', 'g')
    );
$$;