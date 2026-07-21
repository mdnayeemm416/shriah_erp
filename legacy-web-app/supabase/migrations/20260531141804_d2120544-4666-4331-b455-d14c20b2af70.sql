
-- Attach edit-history triggers to POS / wholesale tables so every change is
-- written to public.entity_history (already populated by the existing
-- log_entity_changes() function).

DROP TRIGGER IF EXISTS trg_log_shop_sales ON public.shop_sales;
CREATE TRIGGER trg_log_shop_sales
AFTER UPDATE ON public.shop_sales
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

DROP TRIGGER IF EXISTS trg_log_shop_purchases ON public.shop_purchases;
CREATE TRIGGER trg_log_shop_purchases
AFTER UPDATE ON public.shop_purchases
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

DROP TRIGGER IF EXISTS trg_log_pos_payments ON public.pos_payments;
CREATE TRIGGER trg_log_pos_payments
AFTER UPDATE ON public.pos_payments
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

DROP TRIGGER IF EXISTS trg_log_pos_customers ON public.pos_customers;
CREATE TRIGGER trg_log_pos_customers
AFTER UPDATE ON public.pos_customers
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

DROP TRIGGER IF EXISTS trg_log_shop_products ON public.shop_products;
CREATE TRIGGER trg_log_shop_products
AFTER UPDATE ON public.shop_products
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

DROP TRIGGER IF EXISTS trg_log_shop_orders ON public.shop_orders;
CREATE TRIGGER trg_log_shop_orders
AFTER UPDATE ON public.shop_orders
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

-- Block any DELETE for sales_delivery on these tables. RLS already restricts
-- DELETE to admin/manager via the "* admin all" ALL policies, but this trigger
-- provides defense in depth and a clear error message.
CREATE OR REPLACE FUNCTION public.block_sales_delivery_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND public.has_sales_delivery_role(auth.uid()) THEN
    RAISE EXCEPTION 'Sales & Delivery role cannot delete records. Records can only be soft-deleted by an administrator.';
  END IF;
  RETURN OLD;
END $$;

DROP TRIGGER IF EXISTS trg_block_sd_delete_shop_sales ON public.shop_sales;
CREATE TRIGGER trg_block_sd_delete_shop_sales
BEFORE DELETE ON public.shop_sales
FOR EACH ROW EXECUTE FUNCTION public.block_sales_delivery_delete();

DROP TRIGGER IF EXISTS trg_block_sd_delete_shop_purchases ON public.shop_purchases;
CREATE TRIGGER trg_block_sd_delete_shop_purchases
BEFORE DELETE ON public.shop_purchases
FOR EACH ROW EXECUTE FUNCTION public.block_sales_delivery_delete();

DROP TRIGGER IF EXISTS trg_block_sd_delete_pos_payments ON public.pos_payments;
CREATE TRIGGER trg_block_sd_delete_pos_payments
BEFORE DELETE ON public.pos_payments
FOR EACH ROW EXECUTE FUNCTION public.block_sales_delivery_delete();

DROP TRIGGER IF EXISTS trg_block_sd_delete_pos_customers ON public.pos_customers;
CREATE TRIGGER trg_block_sd_delete_pos_customers
BEFORE DELETE ON public.pos_customers
FOR EACH ROW EXECUTE FUNCTION public.block_sales_delivery_delete();

DROP TRIGGER IF EXISTS trg_block_sd_delete_shop_products ON public.shop_products;
CREATE TRIGGER trg_block_sd_delete_shop_products
BEFORE DELETE ON public.shop_products
FOR EACH ROW EXECUTE FUNCTION public.block_sales_delivery_delete();

DROP TRIGGER IF EXISTS trg_block_sd_delete_shop_orders ON public.shop_orders;
CREATE TRIGGER trg_block_sd_delete_shop_orders
BEFORE DELETE ON public.shop_orders
FOR EACH ROW EXECUTE FUNCTION public.block_sales_delivery_delete();
