
CREATE TABLE public.company_opening_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL UNIQUE,
  amount numeric NOT NULL DEFAULT 0,
  notes text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_opening_balances TO authenticated;
GRANT ALL ON public.company_opening_balances TO service_role;

ALTER TABLE public.company_opening_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read opening balances"
  ON public.company_opening_balances FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "admin insert opening balances"
  ON public.company_opening_balances FOR INSERT
  TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin update opening balances"
  ON public.company_opening_balances FOR UPDATE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin delete opening balances"
  ON public.company_opening_balances FOR DELETE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
