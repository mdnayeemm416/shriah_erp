
-- Helper: can the user access this shop?
CREATE OR REPLACE FUNCTION public.user_can_access_shop(_user uuid, _shop_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    _user IS NOT NULL AND (
      -- Admins and managers bypass scoping
      public.has_role(_user, 'admin'::public.app_role)
      OR public.has_role(_user, 'manager'::public.app_role)
      -- Rows with no shop (warehouse-wide) are visible to all
      OR _shop_id IS NULL
      -- Otherwise must be in user_shop_access
      OR EXISTS (
        SELECT 1 FROM public.user_shop_access usa
        WHERE usa.user_id = _user AND usa.shop_id = _shop_id
      )
    )
$$;

-- shop_entries
DROP POLICY IF EXISTS "auth read shop_entries" ON public.shop_entries;
DROP POLICY IF EXISTS "auth insert shop_entries" ON public.shop_entries;
DROP POLICY IF EXISTS "auth update shop_entries" ON public.shop_entries;
CREATE POLICY "scoped read shop_entries" ON public.shop_entries FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped insert shop_entries" ON public.shop_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped update shop_entries" ON public.shop_entries FOR UPDATE TO authenticated
  USING (((auth.uid() = created_by) OR has_role(auth.uid(),'admin'::app_role)) AND public.user_can_access_shop(auth.uid(), shop_id));

-- cashiers
DROP POLICY IF EXISTS "auth read cashiers" ON public.cashiers;
DROP POLICY IF EXISTS "auth insert cashiers" ON public.cashiers;
DROP POLICY IF EXISTS "auth update cashiers" ON public.cashiers;
CREATE POLICY "scoped read cashiers" ON public.cashiers FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped insert cashiers" ON public.cashiers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped update cashiers" ON public.cashiers FOR UPDATE TO authenticated
  USING (((auth.uid() = created_by) OR has_role(auth.uid(),'admin'::app_role)) AND public.user_can_access_shop(auth.uid(), shop_id));

-- employees
DROP POLICY IF EXISTS "auth read employees" ON public.employees;
DROP POLICY IF EXISTS "auth insert employees" ON public.employees;
DROP POLICY IF EXISTS "auth update employees" ON public.employees;
CREATE POLICY "scoped read employees" ON public.employees FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped insert employees" ON public.employees FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped update employees" ON public.employees FOR UPDATE TO authenticated
  USING (((auth.uid() = created_by) OR has_role(auth.uid(),'admin'::app_role)) AND public.user_can_access_shop(auth.uid(), shop_id));

-- transactions
DROP POLICY IF EXISTS "auth read txn" ON public.transactions;
DROP POLICY IF EXISTS "auth write txn" ON public.transactions;
DROP POLICY IF EXISTS "auth update txn" ON public.transactions;
DROP POLICY IF EXISTS "auth delete txn" ON public.transactions;
CREATE POLICY "scoped read txn" ON public.transactions FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped insert txn" ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped update txn" ON public.transactions FOR UPDATE TO authenticated
  USING (((auth.uid() = created_by) OR has_role(auth.uid(),'admin'::app_role)) AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "scoped delete txn" ON public.transactions FOR DELETE TO authenticated
  USING (((auth.uid() = created_by) OR has_role(auth.uid(),'admin'::app_role)) AND public.user_can_access_shop(auth.uid(), shop_id));

-- cash_flow_cash_in
DROP POLICY IF EXISTS "cf_cashin_select" ON public.cash_flow_cash_in;
DROP POLICY IF EXISTS "cf_cashin_insert" ON public.cash_flow_cash_in;
DROP POLICY IF EXISTS "cf_cashin_update" ON public.cash_flow_cash_in;
CREATE POLICY "cf_cashin_select" ON public.cash_flow_cash_in FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "cf_cashin_insert" ON public.cash_flow_cash_in FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND (NOT cf_is_locked(shop_id, day_date)) AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "cf_cashin_update" ON public.cash_flow_cash_in FOR UPDATE TO authenticated
  USING (((auth.uid() = created_by) OR has_role(auth.uid(),'admin'::app_role))
         AND ((NOT cf_is_locked(shop_id, day_date)) OR has_role(auth.uid(),'admin'::app_role))
         AND public.user_can_access_shop(auth.uid(), shop_id));

-- cash_flow_purchases
DROP POLICY IF EXISTS "cf_purchase_select" ON public.cash_flow_purchases;
DROP POLICY IF EXISTS "cf_purchase_insert" ON public.cash_flow_purchases;
DROP POLICY IF EXISTS "cf_purchase_update" ON public.cash_flow_purchases;
CREATE POLICY "cf_purchase_select" ON public.cash_flow_purchases FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "cf_purchase_insert" ON public.cash_flow_purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND (NOT cf_is_locked(shop_id, day_date)) AND public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "cf_purchase_update" ON public.cash_flow_purchases FOR UPDATE TO authenticated
  USING (((NOT cf_is_locked(shop_id, day_date)) OR has_role(auth.uid(),'admin'::app_role))
         AND ((auth.uid() = created_by) OR cf_can_verify(auth.uid()))
         AND public.user_can_access_shop(auth.uid(), shop_id));

-- cash_handovers
DROP POLICY IF EXISTS "handovers_select" ON public.cash_handovers;
CREATE POLICY "handovers_select" ON public.cash_handovers FOR SELECT TO authenticated
  USING (
    public.user_can_access_shop(auth.uid(), shop_id)
    AND (
      auth.uid() = from_user OR auth.uid() = to_user
      OR has_role(auth.uid(),'admin'::app_role)
      OR has_role(auth.uid(),'manager'::app_role)
      OR has_role(auth.uid(),'accountant'::app_role)
    )
  );

-- cash_returns
DROP POLICY IF EXISTS "returns_select" ON public.cash_returns;
CREATE POLICY "returns_select" ON public.cash_returns FOR SELECT TO authenticated
  USING (
    public.user_can_access_shop(auth.uid(), shop_id)
    AND (
      auth.uid() = from_user OR auth.uid() = to_user
      OR has_role(auth.uid(),'admin'::app_role)
      OR has_role(auth.uid(),'manager'::app_role)
      OR has_role(auth.uid(),'accountant'::app_role)
    )
  );

-- shops: non-admins see only assigned shops
DROP POLICY IF EXISTS "auth read shops" ON public.shops;
CREATE POLICY "scoped read shops" ON public.shops FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), id));
