-- Prevent duplicate Activity Log entries: skip auto-logging trigger-created rows
-- (transactions created from shop/warehouse/employee triggers, and pos_payments
-- auto-created from sale saves). One user action = one log.
CREATE OR REPLACE FUNCTION public.log_entity_creation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    'employee_id','customer_id','invoice_number','total','kind','method','month','sku','barcode',
    'source','sale_id','supplier_name','customer_name','discount','tax'
  ];
  k text;
BEGIN
  -- Skip trigger-derived rows so we don't double-log a single user action
  IF TG_TABLE_NAME = 'transactions' AND (v_new->>'source') IS NOT NULL THEN
    RETURN NEW;
  END IF;
  IF TG_TABLE_NAME = 'pos_payments' AND (v_new->>'sale_id') IS NOT NULL THEN
    RETURN NEW;
  END IF;

  FOREACH k IN ARRAY v_fields LOOP
    IF v_new ? k AND (v_new->k) IS NOT NULL AND (v_new->>k) <> '' THEN
      v_snapshot := v_snapshot || jsonb_build_object(k, jsonb_build_object('from', null, 'to', v_new->k));
    END IF;
  END LOOP;
  INSERT INTO public.entity_history(entity_type, entity_id, action, changes, changed_by)
  VALUES (TG_TABLE_NAME, NEW.id, 'create', v_snapshot, v_user);
  RETURN NEW;
END $function$;