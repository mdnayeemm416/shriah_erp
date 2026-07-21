-- Allow anonymous storefront visitors to read visible, non-deleted products via the
-- shop_products_public view (which runs with security_invoker=true and therefore
-- requires the caller to have direct SELECT access on the underlying table, filtered by RLS).

GRANT SELECT ON public.shop_products TO anon;

CREATE POLICY "shop_products anon public read"
ON public.shop_products
FOR SELECT
TO anon
USING (is_visible = true AND COALESCE(is_deleted, false) = false);