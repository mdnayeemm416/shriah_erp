ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales_delivery';

CREATE OR REPLACE FUNCTION public.has_sales_delivery_role(_user uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user AND role::text = 'sales_delivery')
    AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user AND role::text IN ('admin','super_admin'));
$$;

CREATE OR REPLACE FUNCTION public.enforce_sales_delivery_limits()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _u uuid := auth.uid();
BEGIN
  IF _u IS NULL OR NOT public.has_sales_delivery_role(_u) THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  IF TG_TABLE_NAME = 'shop_entries' THEN
    IF COALESCE(NEW.entry_type, OLD.entry_type) = 'withdraw' THEN
      RAISE EXCEPTION 'Sales & Delivery role cannot manage withdraw entries';
    END IF;
  END IF;
  IF TG_OP IN ('UPDATE','DELETE') THEN
    IF OLD.txn_date < CURRENT_DATE THEN
      RAISE EXCEPTION 'Sales & Delivery role cannot modify transactions older than today';
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_sd_limit_shop_sales ON public.shop_sales;
CREATE TRIGGER trg_sd_limit_shop_sales
  BEFORE INSERT OR UPDATE OR DELETE ON public.shop_sales
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_delivery_limits();

DROP TRIGGER IF EXISTS trg_sd_limit_shop_purchases ON public.shop_purchases;
CREATE TRIGGER trg_sd_limit_shop_purchases
  BEFORE INSERT OR UPDATE OR DELETE ON public.shop_purchases
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_delivery_limits();

DROP TRIGGER IF EXISTS trg_sd_limit_pos_payments ON public.pos_payments;
CREATE TRIGGER trg_sd_limit_pos_payments
  BEFORE INSERT OR UPDATE OR DELETE ON public.pos_payments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_delivery_limits();

DROP TRIGGER IF EXISTS trg_sd_limit_shop_entries ON public.shop_entries;
CREATE TRIGGER trg_sd_limit_shop_entries
  BEFORE INSERT OR UPDATE OR DELETE ON public.shop_entries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_delivery_limits();