
-- Sequences for invoice numbers
CREATE SEQUENCE IF NOT EXISTS public.shop_purchase_number_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS public.shop_sale_number_seq START 1000;

-- Purchases table
CREATE TABLE IF NOT EXISTS public.shop_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number integer NOT NULL DEFAULT nextval('public.shop_purchase_number_seq'),
  supplier_name text NOT NULL,
  supplier_mobile text,
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  notes text,
  attachment_url text,
  status text NOT NULL DEFAULT 'completed', -- completed | cancelled
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shop_purchases admin all" ON public.shop_purchases FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));

CREATE POLICY "shop_purchases staff read" ON public.shop_purchases FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'staff'::app_role) OR has_role(auth.uid(),'accountant'::app_role));

CREATE TRIGGER shop_purchases_updated BEFORE UPDATE ON public.shop_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sales table
CREATE TABLE IF NOT EXISTS public.shop_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number integer NOT NULL DEFAULT nextval('public.shop_sale_number_seq'),
  customer_name text NOT NULL,
  customer_mobile text,
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  notes text,
  status text NOT NULL DEFAULT 'completed', -- completed | cancelled
  order_id uuid,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shop_sales admin all" ON public.shop_sales FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));

CREATE POLICY "shop_sales staff read" ON public.shop_sales FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'staff'::app_role) OR has_role(auth.uid(),'accountant'::app_role));

CREATE TRIGGER shop_sales_updated BEFORE UPDATE ON public.shop_sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Stock adjustment trigger for purchases
CREATE OR REPLACE FUNCTION public.apply_shop_purchase_stock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE item jsonb; pid uuid; q numeric;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) + q, purchase_price = COALESCE(NULLIF((item->>'price')::numeric,0), purchase_price) WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Cancel: reverse stock
    IF OLD.status = 'completed' AND NEW.status = 'cancelled' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'completed' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) + q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'completed' THEN
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
END $$;

CREATE TRIGGER shop_purchase_stock AFTER INSERT OR UPDATE OR DELETE ON public.shop_purchases
  FOR EACH ROW EXECUTE FUNCTION public.apply_shop_purchase_stock();

-- Stock adjustment trigger for sales
CREATE OR REPLACE FUNCTION public.apply_shop_sale_stock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE item jsonb; pid uuid; q numeric;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'completed' AND NEW.status = 'cancelled' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) + q WHERE id = pid;
        END IF;
      END LOOP;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'completed' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'completed' THEN
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
END $$;

CREATE TRIGGER shop_sale_stock AFTER INSERT OR UPDATE OR DELETE ON public.shop_sales
  FOR EACH ROW EXECUTE FUNCTION public.apply_shop_sale_stock();
