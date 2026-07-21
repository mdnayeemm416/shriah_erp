CREATE TABLE public.cashiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cashiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read cashiers" ON public.cashiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert cashiers" ON public.cashiers FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update cashiers" ON public.cashiers FOR UPDATE TO authenticated USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "auth delete cashiers" ON public.cashiers FOR DELETE TO authenticated USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_cashiers_shop ON public.cashiers(shop_id);

ALTER TABLE public.transactions ADD COLUMN cashier TEXT;