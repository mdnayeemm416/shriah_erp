
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  txn_type TEXT NOT NULL CHECK (txn_type IN ('cash_in','cash_out')),
  icon TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, txn_type)
);

CREATE TABLE public.sub_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, name)
);

CREATE INDEX idx_subcat_category ON public.sub_categories(category_id);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update categories" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(),'admin'));
CREATE POLICY "auth delete categories" ON public.categories FOR DELETE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(),'admin'));

CREATE POLICY "auth read subcat" ON public.sub_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert subcat" ON public.sub_categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update subcat" ON public.sub_categories FOR UPDATE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(),'admin'));
CREATE POLICY "auth delete subcat" ON public.sub_categories FOR DELETE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(),'admin'));

-- Seed common defaults
INSERT INTO public.categories (name, txn_type, icon) VALUES
  ('Shop Collection','cash_in','Store'),
  ('Bank Withdraw','cash_in','Landmark'),
  ('Customer Payment','cash_in','HandCoins'),
  ('Other Income','cash_in','PlusCircle'),
  ('Shop Expense','cash_out','Receipt'),
  ('Warehouse Purchase','cash_out','Package'),
  ('Supervisor Payment','cash_out','UserCog'),
  ('Personal Expense','cash_out','User'),
  ('Expense','cash_out','Wallet'),
  ('Other Expense','cash_out','MinusCircle')
ON CONFLICT DO NOTHING;
