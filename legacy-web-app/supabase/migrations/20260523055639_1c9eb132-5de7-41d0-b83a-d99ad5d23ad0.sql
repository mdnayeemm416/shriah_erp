CREATE OR REPLACE FUNCTION public.find_login_email(_identifier text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT email FROM public.profiles
  WHERE _identifier IS NOT NULL AND length(trim(_identifier)) > 0
    AND COALESCE(is_disabled, false) = false
    AND (
      lower(email) = lower(trim(_identifier))
      OR lower(username) = lower(trim(_identifier))
      OR mobile = trim(_identifier)
      OR (
        length(regexp_replace(trim(_identifier), '\D', '', 'g')) > 0
        AND regexp_replace(coalesce(mobile,''), '\D', '', 'g') = regexp_replace(trim(_identifier), '\D', '', 'g')
      )
    )
  LIMIT 1;
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
      OR (
        length(regexp_replace(trim(_identifier), '\D', '', 'g')) > 0
        AND regexp_replace(coalesce(p.mobile,''), '\D', '', 'g') = regexp_replace(trim(_identifier), '\D', '', 'g')
      )
    )
    AND c.password_hash = extensions.crypt(_password, c.password_hash)
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
      OR (
        length(regexp_replace(trim(_identifier), '\D', '', 'g')) > 0
        AND regexp_replace(coalesce(mobile,''), '\D', '', 'g') = regexp_replace(trim(_identifier), '\D', '', 'g')
      )
    );
$$;

REVOKE ALL ON FUNCTION public.verify_erp_login(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_erp_login(text, text) TO service_role;