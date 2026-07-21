
-- 1) Soft delete columns
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
  END LOOP;
END $$;

-- 2) Update sync triggers to honor soft delete / restore
CREATE OR REPLACE FUNCTION public.sync_shop_to_transactions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_shop_name text;
  v_cashier_name text;
  v_prefix text;
begin
  if (TG_OP = 'DELETE') then
    delete from public.transactions where source = 'shop' and source_ref_id = OLD.id;
    return OLD;
  end if;

  -- Always clear existing linked txn first
  delete from public.transactions where source = 'shop' and source_ref_id = NEW.id;

  -- If soft-deleted, don't re-create
  if NEW.is_deleted then
    return NEW;
  end if;

  select name into v_shop_name from public.shops where id = NEW.shop_id;
  if NEW.cashier_id is not null then
    select name into v_cashier_name from public.cashiers where id = NEW.cashier_id;
  end if;

  v_prefix := 'Shop: ' || coalesce(v_shop_name,'') ||
              case when v_cashier_name is not null then ' / ' || v_cashier_name else '' end ||
              case when NEW.notes is not null and NEW.notes <> '' then ' — ' || NEW.notes else '' end;

  if NEW.entry_type = 'sale' then
    if coalesce(NEW.cash_sale,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id, cashier)
      values ('cash_in', NEW.cash_sale, 'cash', NEW.txn_date, v_prefix || ' (Cash Sale)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Sale', NEW.shop_id, v_cashier_name);
    end if;
  elsif NEW.entry_type = 'purchase' then
    if coalesce(NEW.purchase_amount,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      values ('purchase', NEW.purchase_amount, 'cash', NEW.txn_date, v_prefix || ' (Purchase)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Purchase', NEW.shop_id);
    end if;
  elsif NEW.entry_type = 'withdraw' then
    if coalesce(NEW.withdraw_amount,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      values ('bank_withdraw', NEW.withdraw_amount, 'cash', NEW.txn_date, v_prefix || ' (Bank Withdraw)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Bank Withdraw', NEW.shop_id);
    end if;
  elsif NEW.entry_type = 'expense' then
    if coalesce(NEW.expense_amount,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      values ('cash_out', NEW.expense_amount, 'cash', NEW.txn_date, v_prefix || ' (Created from Shop Expense)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Expense', NEW.shop_id);
    end if;
  end if;

  return NEW;
end;
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
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM public.transactions WHERE source = 'warehouse' AND source_ref_id = OLD.id;
    RETURN OLD;
  END IF;

  DELETE FROM public.transactions WHERE source = 'warehouse' AND source_ref_id = NEW.id;

  IF NEW.is_deleted THEN
    RETURN NEW;
  END IF;

  IF NEW.entry_type = 'warehouse_sale' THEN
    v_txn_type := 'cash_in';
    IF NEW.payment_status = 'cash' THEN v_amount := NEW.amount; v_should_sync := true;
    ELSIF NEW.payment_status = 'partial' THEN v_amount := NEW.paid_amount; v_should_sync := v_amount > 0;
    END IF;
  ELSIF NEW.entry_type = 'warehouse_purchase' THEN
    v_txn_type := 'purchase';
    IF NEW.payment_status = 'cash' THEN v_amount := NEW.amount; v_should_sync := true;
    ELSIF NEW.payment_status = 'partial' THEN v_amount := NEW.paid_amount; v_should_sync := v_amount > 0;
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

-- Make sure triggers actually exist (no-op if already)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_shop_to_txn') THEN
    CREATE TRIGGER trg_sync_shop_to_txn
    AFTER INSERT OR UPDATE OR DELETE ON public.shop_entries
    FOR EACH ROW EXECUTE FUNCTION public.sync_shop_to_transactions();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_wh_to_txn') THEN
    CREATE TRIGGER trg_sync_wh_to_txn
    AFTER INSERT OR UPDATE OR DELETE ON public.warehouse_ledger
    FOR EACH ROW EXECUTE FUNCTION public.sync_warehouse_to_transactions();
  END IF;
END $$;

-- 3) Edit history
CREATE TABLE IF NOT EXISTS public.entity_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,           -- 'update' | 'soft_delete' | 'restore'
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
-- No insert/update/delete policies → only triggers (SECURITY DEFINER) can write.

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

  -- Detect soft-delete / restore transitions
  IF (v_old ? 'is_deleted') AND (v_new ? 'is_deleted')
     AND (v_old->>'is_deleted') IS DISTINCT FROM (v_new->>'is_deleted') THEN
    v_action := CASE WHEN (v_new->>'is_deleted')::boolean THEN 'soft_delete' ELSE 'restore' END;
  END IF;

  FOR k IN SELECT jsonb_object_keys(v_new) LOOP
    IF k IN ('updated_at','created_at','deleted_at','deleted_by') THEN CONTINUE; END IF;
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
