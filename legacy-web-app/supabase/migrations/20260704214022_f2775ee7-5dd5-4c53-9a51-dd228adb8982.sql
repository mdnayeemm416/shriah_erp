CREATE OR REPLACE FUNCTION public.prevent_customer_history_soft_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF COALESCE(OLD.is_deleted, false) = false
     AND COALESCE(NEW.is_deleted, false) = true THEN
    IF EXISTS (SELECT 1 FROM public.shop_sales s WHERE s.customer_id = OLD.id)
       OR EXISTS (SELECT 1 FROM public.pos_payments p WHERE p.customer_id = OLD.id)
       OR EXISTS (SELECT 1 FROM public.sales_returns r WHERE r.customer_id = OLD.id) THEN
      RAISE EXCEPTION 'Cannot delete customer with existing ledger history';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_customer_history_soft_delete ON public.pos_customers;

CREATE TRIGGER trg_prevent_customer_history_soft_delete
BEFORE UPDATE OF is_deleted ON public.pos_customers
FOR EACH ROW
EXECUTE FUNCTION public.prevent_customer_history_soft_delete();