
-- 1) Add memo_date column
ALTER TABLE public.shop_purchases
  ADD COLUMN IF NOT EXISTS memo_date date;

-- 2) Trigger to auto-register supplier in parties list
CREATE OR REPLACE FUNCTION public.shop_purchases_sync_supplier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
BEGIN
  v_name := NULLIF(trim(COALESCE(NEW.supplier_name, '')), '');
  IF v_name IS NULL THEN
    RETURN NEW;
  END IF;

  -- Skip if a matching supplier/mixed party already exists (case-insensitive)
  IF EXISTS (
    SELECT 1 FROM public.parties
     WHERE COALESCE(is_deleted, false) = false
       AND party_type IN ('supplier','mixed')
       AND lower(name) = lower(v_name)
  ) THEN
    -- Optionally fill missing phone on the existing party
    UPDATE public.parties
       SET phone = COALESCE(NULLIF(phone, ''), NEW.supplier_mobile)
     WHERE COALESCE(is_deleted, false) = false
       AND party_type IN ('supplier','mixed')
       AND lower(name) = lower(v_name)
       AND (phone IS NULL OR phone = '')
       AND NEW.supplier_mobile IS NOT NULL;
    RETURN NEW;
  END IF;

  INSERT INTO public.parties (name, party_type, phone, created_by)
  VALUES (v_name, 'supplier', NULLIF(trim(COALESCE(NEW.supplier_mobile,'')), ''), NEW.created_by);

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_shop_purchases_sync_supplier ON public.shop_purchases;
CREATE TRIGGER trg_shop_purchases_sync_supplier
AFTER INSERT OR UPDATE OF supplier_name, supplier_mobile ON public.shop_purchases
FOR EACH ROW
EXECUTE FUNCTION public.shop_purchases_sync_supplier();

-- 3) Backfill existing suppliers from historical purchases
INSERT INTO public.parties (name, party_type, phone)
SELECT DISTINCT ON (lower(trim(sp.supplier_name)))
       trim(sp.supplier_name),
       'supplier'::party_type,
       NULLIF(trim(COALESCE(sp.supplier_mobile,'')), '')
  FROM public.shop_purchases sp
 WHERE COALESCE(sp.is_deleted, false) = false
   AND NULLIF(trim(COALESCE(sp.supplier_name,'')), '') IS NOT NULL
   AND NOT EXISTS (
     SELECT 1 FROM public.parties p
      WHERE COALESCE(p.is_deleted,false) = false
        AND p.party_type IN ('supplier','mixed')
        AND lower(p.name) = lower(trim(sp.supplier_name))
   );
