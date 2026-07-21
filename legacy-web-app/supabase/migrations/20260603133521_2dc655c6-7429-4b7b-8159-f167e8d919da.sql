CREATE OR REPLACE FUNCTION public.cleanup_entity_history(_days integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;

  IF _days IS NULL OR _days <= 0 THEN
    DELETE FROM public.entity_history WHERE id IS NOT NULL;
  ELSE
    DELETE FROM public.entity_history
      WHERE id IS NOT NULL
        AND changed_at < now() - (_days || ' days')::interval;
  END IF;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$function$;