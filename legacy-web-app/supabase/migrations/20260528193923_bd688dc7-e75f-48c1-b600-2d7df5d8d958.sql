-- Grant table-level privileges so PostgREST/RLS policies can apply.
-- Without these, anon/authenticated requests fail before RLS evaluation.
GRANT SELECT, INSERT ON public.shop_orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_orders TO authenticated;
GRANT ALL ON public.shop_orders TO service_role;

-- Tighten the public insert policy: require non-empty items array and positive total.
DROP POLICY IF EXISTS "shop_orders public insert" ON public.shop_orders;
CREATE POLICY "shop_orders public insert"
ON public.shop_orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(customer_name)) BETWEEN 1 AND 100
  AND length(trim(customer_mobile)) BETWEEN 4 AND 20
  AND jsonb_typeof(items) = 'array'
  AND jsonb_array_length(items) >= 1
  AND total > 0
  AND COALESCE(is_deleted, false) = false
);