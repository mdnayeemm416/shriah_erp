REVOKE ALL ON FUNCTION public.set_erp_user_password(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.verify_erp_login(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_erp_user_password(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_erp_login(text, text) TO service_role;