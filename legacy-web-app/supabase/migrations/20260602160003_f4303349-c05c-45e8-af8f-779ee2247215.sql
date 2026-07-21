
CREATE TABLE public.company_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  txn_type text NOT NULL CHECK (txn_type IN ('income','expense')),
  category text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  notes text,
  attachment_url text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,
  deleted_by uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_transactions TO authenticated;
GRANT ALL ON public.company_transactions TO service_role;

ALTER TABLE public.company_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read company_transactions"
  ON public.company_transactions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "auth insert company_transactions"
  ON public.company_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "auth update company_transactions"
  ON public.company_transactions FOR UPDATE TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin delete company_transactions"
  ON public.company_transactions FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_company_transactions_date ON public.company_transactions(txn_date) WHERE is_deleted = false;
