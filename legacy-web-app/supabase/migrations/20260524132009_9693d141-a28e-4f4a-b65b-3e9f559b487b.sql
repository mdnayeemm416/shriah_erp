
-- Allow service/migration contexts (auth.uid() IS NULL) to manage deletion flags;
-- user-driven flips still require admin role.
CREATE OR REPLACE FUNCTION public.enforce_admin_soft_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF COALESCE(OLD.is_deleted,false) IS DISTINCT FROM COALESCE(NEW.is_deleted,false) THEN
    IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can delete or restore records';
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- 1) Soft-delete columns
ALTER TABLE public.shop_sales      ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
                                   ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
                                   ADD COLUMN IF NOT EXISTS deleted_by uuid;
ALTER TABLE public.shop_purchases  ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
                                   ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
                                   ADD COLUMN IF NOT EXISTS deleted_by uuid;
ALTER TABLE public.shop_orders     ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
                                   ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
                                   ADD COLUMN IF NOT EXISTS deleted_by uuid;
ALTER TABLE public.shop_products   ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
                                   ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
                                   ADD COLUMN IF NOT EXISTS deleted_by uuid;
ALTER TABLE public.pos_customers   ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
                                   ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
                                   ADD COLUMN IF NOT EXISTS deleted_by uuid;

-- 2) Whitelist
CREATE OR REPLACE FUNCTION public.is_soft_deletable_table(_table_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT _table_name = ANY (ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops',
    'employees','employee_entries',
    'shop_sales','shop_purchases','shop_orders','shop_products','pos_customers'
  ]);
$$;

-- 3) Backfill BEFORE attaching the admin-guard trigger
UPDATE public.shop_sales     SET is_deleted = true, deleted_at = COALESCE(deleted_at, now())
  WHERE status = 'cancelled' AND COALESCE(is_deleted,false) = false;
UPDATE public.shop_purchases SET is_deleted = true, deleted_at = COALESCE(deleted_at, now())
  WHERE status = 'cancelled' AND COALESCE(is_deleted,false) = false;

-- 4) Admin guard triggers
DROP TRIGGER IF EXISTS enforce_admin_soft_delete_shop_sales      ON public.shop_sales;
DROP TRIGGER IF EXISTS enforce_admin_soft_delete_shop_purchases  ON public.shop_purchases;
DROP TRIGGER IF EXISTS enforce_admin_soft_delete_shop_orders     ON public.shop_orders;
DROP TRIGGER IF EXISTS enforce_admin_soft_delete_shop_products   ON public.shop_products;
DROP TRIGGER IF EXISTS enforce_admin_soft_delete_pos_customers   ON public.pos_customers;
CREATE TRIGGER enforce_admin_soft_delete_shop_sales      BEFORE UPDATE ON public.shop_sales      FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();
CREATE TRIGGER enforce_admin_soft_delete_shop_purchases  BEFORE UPDATE ON public.shop_purchases  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();
CREATE TRIGGER enforce_admin_soft_delete_shop_orders     BEFORE UPDATE ON public.shop_orders     FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();
CREATE TRIGGER enforce_admin_soft_delete_shop_products   BEFORE UPDATE ON public.shop_products   FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();
CREATE TRIGGER enforce_admin_soft_delete_pos_customers   BEFORE UPDATE ON public.pos_customers   FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();

-- 5) Stock reversal logic now treats (status=completed AND is_deleted=false) as active
CREATE OR REPLACE FUNCTION public.apply_shop_sale_stock()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $func$
DECLARE
  item jsonb; pid uuid; q numeric;
  old_active boolean;
  new_active boolean;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' AND COALESCE(NEW.is_deleted,false) = false THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    old_active := (OLD.status = 'completed' AND COALESCE(OLD.is_deleted,false) = false);
    new_active := (NEW.status = 'completed' AND COALESCE(NEW.is_deleted,false) = false);
    IF old_active AND NOT new_active THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) + q WHERE id = pid;
        END IF;
      END LOOP;
    ELSIF NOT old_active AND new_active THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'completed' AND COALESCE(OLD.is_deleted,false) = false THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) + q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $func$;

CREATE OR REPLACE FUNCTION public.apply_shop_purchase_stock()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $func$
DECLARE
  item jsonb; pid uuid; q numeric;
  old_active boolean;
  new_active boolean;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' AND COALESCE(NEW.is_deleted,false) = false THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products
             SET stock = COALESCE(stock,0) + q,
                 purchase_price = COALESCE(NULLIF((item->>'price')::numeric,0), purchase_price)
           WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    old_active := (OLD.status = 'completed' AND COALESCE(OLD.is_deleted,false) = false);
    new_active := (NEW.status = 'completed' AND COALESCE(NEW.is_deleted,false) = false);
    IF old_active AND NOT new_active THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    ELSIF NOT old_active AND new_active THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) + q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'completed' AND COALESCE(OLD.is_deleted,false) = false THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $func$;

-- 6) Auto-payment logger skips deleted sales
CREATE OR REPLACE FUNCTION public.pos_log_sale_payment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL
     AND COALESCE(NEW.paid_amount,0) > 0
     AND COALESCE(NEW.status,'completed') <> 'cancelled'
     AND COALESCE(NEW.is_deleted,false) = false THEN
    INSERT INTO public.pos_payments
      (customer_id, amount, method, txn_date, sale_id, kind, notes, created_by)
    VALUES
      (NEW.customer_id, NEW.paid_amount,
       COALESCE(NEW.payment_method,'cash'),
       NEW.txn_date, NEW.id, 'sale_partial',
       'Auto: payment received with sale #' || NEW.invoice_number,
       NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

-- 7) Indexes for fast active queries
CREATE INDEX IF NOT EXISTS idx_shop_sales_active     ON public.shop_sales     (created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_shop_purchases_active ON public.shop_purchases (created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_shop_orders_active    ON public.shop_orders    (created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_shop_products_active  ON public.shop_products  (sort_order)      WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_pos_customers_active  ON public.pos_customers  (name)            WHERE is_deleted = false;
