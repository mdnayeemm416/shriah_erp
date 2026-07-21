
CREATE OR REPLACE FUNCTION public.apply_shop_purchase_stock()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    -- Reverse old items if previously active
    IF old_active THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        pid := NULLIF(item->>'product_id','')::uuid;
        q := COALESCE((item->>'qty')::numeric, 0);
        IF pid IS NOT NULL AND q > 0 THEN
          UPDATE public.shop_products SET stock = COALESCE(stock,0) - q WHERE id = pid;
        END IF;
      END LOOP;
    END IF;
    -- Apply new items if currently active
    IF new_active THEN
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
END $function$;
