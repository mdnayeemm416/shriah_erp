
-- Allow Sales & Delivery role to create sales, purchases, and payments (no delete; updates of old rows are blocked by enforce_sales_delivery_limits trigger).

CREATE POLICY "shop_sales sales_delivery insert"
ON public.shop_sales FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "shop_sales sales_delivery select"
ON public.shop_sales FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "shop_sales sales_delivery update"
ON public.shop_sales FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'sales_delivery'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "shop_purchases sales_delivery insert"
ON public.shop_purchases FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "shop_purchases sales_delivery select"
ON public.shop_purchases FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "shop_purchases sales_delivery update"
ON public.shop_purchases FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'sales_delivery'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "pos_payments sales_delivery insert"
ON public.pos_payments FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));

CREATE POLICY "pos_payments sales_delivery update"
ON public.pos_payments FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'sales_delivery'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'sales_delivery'::public.app_role));
