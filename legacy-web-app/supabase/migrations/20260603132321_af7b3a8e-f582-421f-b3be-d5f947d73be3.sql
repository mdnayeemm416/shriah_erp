-- Recycle Bin auto-cleanup RPC: hard-deletes soft-deleted rows older than N days
-- across every soft-deletable table. Admin-only, same security pattern as restore_record.

CREATE OR REPLACE FUNCTION public.cleanup_recycle_bin(_days integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tables text[] := ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops',
    'employees','employee_entries',
    'shop_sales','shop_purchases','shop_orders','shop_products','pos_customers'
  ];
  v_table text;
  v_total integer := 0;
  v_count integer;
  v_cutoff timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;

  IF _days IS NULL OR _days <= 0 THEN
    -- "Empty Recycle Bin" — purge everything currently soft-deleted
    FOREACH v_table IN ARRAY v_tables LOOP
      EXECUTE format(
        'DELETE FROM public.%I WHERE is_deleted = true',
        v_table
      );
      GET DIAGNOSTICS v_count = ROW_COUNT;
      v_total := v_total + v_count;
    END LOOP;
  ELSE
    v_cutoff := now() - (_days || ' days')::interval;
    FOREACH v_table IN ARRAY v_tables LOOP
      EXECUTE format(
        'DELETE FROM public.%I WHERE is_deleted = true AND deleted_at IS NOT NULL AND deleted_at < $1',
        v_table
      ) USING v_cutoff;
      GET DIAGNOSTICS v_count = ROW_COUNT;
      v_total := v_total + v_count;
    END LOOP;
  END IF;

  RETURN v_total;
END;
$$;