-- Repair soft delete, restore, linked transaction sync, and edit history triggers

-- 1) Ensure soft-delete metadata and active indexes exist on all recycle-bin tables
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops'
  ]) LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false', t);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS deleted_at timestamptz', t);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS deleted_by uuid', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I (is_deleted) WHERE is_deleted = false', t || '_active_idx', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I (deleted_at DESC) WHERE is_deleted = true', t || '_trash_idx', t);
  END LOOP;
END $$;

-- 2) Table allowlist used by secure RPC helpers
CREATE OR REPLACE FUNCTION public.is_soft_deletable_table(_table_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT _table_name = ANY (ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops'
  ]);
$$;

-- 3) Robust soft-delete RPC: records current user and works even when old imported rows have null created_by
CREATE OR REPLACE FUNCTION public.soft_delete_record(_table_name text, _record_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT public.is_soft_deletable_table(_table_name) THEN
    RAISE EXCEPTION 'Table is not soft deletable: %', _table_name;
  END IF;

  EXECUTE format(
    'UPDATE public.%I SET is_deleted = true, deleted_at = now(), deleted_by = $1 WHERE id = $2 AND is_deleted = false',
    _table_name
  ) USING auth.uid(), _record_id;
END;
$$;

-- 4) Restore RPC: clears recycle metadata. Linked records are recreated by sync triggers when applicable.
CREATE OR REPLACE FUNCTION public.restore_record(_table_name text, _record_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT public.is_soft_deletable_table(_table_name) THEN
    RAISE EXCEPTION 'Table is not restorable: %', _table_name;
  END IF;

  EXECUTE format(
    'UPDATE public.%I SET is_deleted = false, deleted_at = null, deleted_by = null WHERE id = $1 AND is_deleted = true',
    _table_name
  ) USING _record_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_record(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_record(text, uuid) TO authenticated;

-- 5) Linked transaction sync: hard-remove generated linked rows from active transactions, recreate on restore/update
CREATE OR REPLACE FUNCTION public.sync_shop_to_transactions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_shop_name text;
  v_cashier_name text;
  v_prefix text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.transactions WHERE source = 'shop' AND source_ref_id = OLD.id;
    RETURN OLD;
  END IF;

  DELETE FROM public.transactions WHERE source = 'shop' AND source_ref_id = NEW.id;

  IF COALESCE(NEW.is_deleted, false) THEN
    RETURN NEW;
  END IF;

  SELECT name INTO v_shop_name FROM public.shops WHERE id = NEW.shop_id;
  IF NEW.cashier_id IS NOT NULL THEN
    SELECT name INTO v_cashier_name FROM public.cashiers WHERE id = NEW.cashier_id;
  END IF;

  v_prefix := 'Shop: ' || COALESCE(v_shop_name,'') ||
              CASE WHEN v_cashier_name IS NOT NULL THEN ' / ' || v_cashier_name ELSE '' END ||
              CASE WHEN NEW.notes IS NOT NULL AND NEW.notes <> '' THEN ' — ' || NEW.notes ELSE '' END;

  IF NEW.entry_type = 'sale' THEN
    IF COALESCE(NEW.cash_sale,0) > 0 THEN
      INSERT INTO public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id, cashier)
      VALUES ('cash_in', NEW.cash_sale, 'cash', NEW.txn_date, v_prefix || ' (Cash Sale)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Sale', NEW.shop_id, v_cashier_name);
    END IF;
  ELSIF NEW.entry_type = 'purchase' THEN
    IF COALESCE(NEW.purchase_amount,0) > 0 THEN
      INSERT INTO public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      VALUES ('purchase', NEW.purchase_amount, 'cash', NEW.txn_date, v_prefix || ' (Purchase)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Purchase', NEW.shop_id);
    END IF;
  ELSIF NEW.entry_type = 'withdraw' THEN
    IF COALESCE(NEW.withdraw_amount,0) > 0 THEN
      INSERT INTO public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      VALUES ('bank_withdraw', NEW.withdraw_amount, 'cash', NEW.txn_date, v_prefix || ' (Bank Withdraw)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Bank Withdraw', NEW.shop_id);
    END IF;
  ELSIF NEW.entry_type = 'expense' THEN
    IF COALESCE(NEW.expense_amount,0) > 0 THEN
      INSERT INTO public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      VALUES ('cash_out', NEW.expense_amount, 'cash', NEW.txn_date, v_prefix || ' (Created from Shop Expense)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Expense', NEW.shop_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_warehouse_to_transactions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_txn_type public.txn_type;
  v_amount numeric := 0;
  v_should_sync boolean := false;
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.transactions WHERE source = 'warehouse' AND source_ref_id = OLD.id;
    RETURN OLD;
  END IF;

  DELETE FROM public.transactions WHERE source = 'warehouse' AND source_ref_id = NEW.id;

  IF COALESCE(NEW.is_deleted, false) THEN
    RETURN NEW;
  END IF;

  IF NEW.entry_type = 'warehouse_sale' THEN
    v_txn_type := 'cash_in';
    IF NEW.payment_status = 'cash' THEN
      v_amount := NEW.amount; v_should_sync := true;
    ELSIF NEW.payment_status = 'partial' THEN
      v_amount := NEW.paid_amount; v_should_sync := v_amount > 0;
    END IF;
  ELSIF NEW.entry_type = 'warehouse_purchase' THEN
    v_txn_type := 'purchase';
    IF NEW.payment_status = 'cash' THEN
      v_amount := NEW.amount; v_should_sync := true;
    ELSIF NEW.payment_status = 'partial' THEN
      v_amount := NEW.paid_amount; v_should_sync := v_amount > 0;
    END IF;
  ELSIF NEW.entry_type = 'payment_received' THEN
    v_txn_type := 'cash_in'; v_amount := NEW.amount; v_should_sync := v_amount > 0;
  ELSIF NEW.entry_type = 'supplier_payment' THEN
    v_txn_type := 'cash_out'; v_amount := NEW.amount; v_should_sync := v_amount > 0;
  ELSE
    v_should_sync := false;
  END IF;

  IF v_should_sync THEN
    INSERT INTO public.transactions (
      type, amount, payment_method, txn_date, notes,
      attachment_url, created_by, source, source_ref_id, category
    ) VALUES (
      v_txn_type, v_amount, 'cash', NEW.txn_date,
      COALESCE('Warehouse: ' || NEW.party_name ||
        CASE WHEN NEW.notes IS NOT NULL THEN ' — ' || NEW.notes ELSE '' END, NEW.party_name),
      NEW.attachment_url, NEW.created_by, 'warehouse', NEW.id, 'Warehouse Ledger'
    );
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_sync_shop_to_txn ON public.shop_entries;
CREATE TRIGGER trg_sync_shop_to_txn
AFTER INSERT OR UPDATE OR DELETE ON public.shop_entries
FOR EACH ROW EXECUTE FUNCTION public.sync_shop_to_transactions();

DROP TRIGGER IF EXISTS trg_sync_wh_to_txn ON public.warehouse_ledger;
CREATE TRIGGER trg_sync_wh_to_txn
AFTER INSERT OR UPDATE OR DELETE ON public.warehouse_ledger
FOR EACH ROW EXECUTE FUNCTION public.sync_warehouse_to_transactions();

-- 6) Edit history table/function/triggers
CREATE TABLE IF NOT EXISTS public.entity_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS entity_history_entity_idx
  ON public.entity_history (entity_type, entity_id, changed_at DESC);

ALTER TABLE public.entity_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read entity_history" ON public.entity_history;
CREATE POLICY "auth read entity_history" ON public.entity_history
  FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.log_entity_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_changes jsonb := '{}'::jsonb;
  v_action text := 'update';
  k text;
  v_old jsonb;
  v_new jsonb;
  v_user uuid := auth.uid();
BEGIN
  v_old := to_jsonb(OLD);
  v_new := to_jsonb(NEW);

  IF (v_old ? 'is_deleted') AND (v_new ? 'is_deleted')
     AND (v_old->>'is_deleted') IS DISTINCT FROM (v_new->>'is_deleted') THEN
    v_action := CASE WHEN (v_new->>'is_deleted')::boolean THEN 'soft_delete' ELSE 'restore' END;
  END IF;

  FOR k IN SELECT jsonb_object_keys(v_new) LOOP
    IF k IN ('updated_at','created_at','deleted_at','deleted_by') THEN
      CONTINUE;
    END IF;
    IF (v_old->k) IS DISTINCT FROM (v_new->k) THEN
      v_changes := v_changes || jsonb_build_object(k, jsonb_build_object('from', v_old->k, 'to', v_new->k));
    END IF;
  END LOOP;

  IF v_changes = '{}'::jsonb AND v_action = 'update' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.entity_history (entity_type, entity_id, action, changes, changed_by)
  VALUES (TG_TABLE_NAME, NEW.id, v_action, v_changes, v_user);
  RETURN NEW;
END;
$$;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops'
  ]) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_log_%I ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER trg_log_%I AFTER UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes()', t, t);
  END LOOP;
END $$;