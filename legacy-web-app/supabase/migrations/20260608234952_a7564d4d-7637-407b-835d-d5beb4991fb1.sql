
CREATE OR REPLACE FUNCTION public.log_entity_creation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_new jsonb := to_jsonb(NEW);
  v_snapshot jsonb := '{}'::jsonb;
  v_fields text[] := ARRAY[
    'amount','type','entry_type','category','subcategory','txn_date','payment_method',
    'cashier','cashier_id','shop_id','name','phone','address','party_name','party_type',
    'party_id','cash_sale','pos_sale','bank_sale','credit_sale','difference',
    'purchase_amount','withdraw_amount','expense_amount','payment_status','paid_amount',
    'remaining_due','product_name','quantity','purchase_price','status','notes',
    'employee_id','customer_id','invoice_number','total','kind','method','month','sku','barcode'
  ];
  k text;
BEGIN
  FOREACH k IN ARRAY v_fields LOOP
    IF v_new ? k AND (v_new->k) IS NOT NULL AND (v_new->>k) <> '' THEN
      v_snapshot := v_snapshot || jsonb_build_object(k, jsonb_build_object('from', null, 'to', v_new->k));
    END IF;
  END LOOP;
  INSERT INTO public.entity_history(entity_type, entity_id, action, changes, changed_by)
  VALUES (TG_TABLE_NAME, NEW.id, 'create', v_snapshot, v_user);
  RETURN NEW;
END $$;

DO $$
DECLARE t text;
  tables text[] := ARRAY[
    'transactions','shop_entries','shop_sales','shop_purchases','shop_products',
    'warehouse_ledger','employee_entries','pos_payments','company_transactions',
    'daily_closings','monthly_closings'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_log_create_%I ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER trg_log_create_%I AFTER INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.log_entity_creation()', t, t);
  END LOOP;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.entity_history;
