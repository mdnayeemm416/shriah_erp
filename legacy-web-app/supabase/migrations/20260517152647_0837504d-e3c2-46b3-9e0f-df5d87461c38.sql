-- Extend app_settings with opening balances
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS opening_stock_value numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS opening_cash_received numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS opening_due_receivable numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS opening_supplier_payable numeric NOT NULL DEFAULT 0;

-- Parties table
DO $$ BEGIN
  CREATE TYPE public.party_type AS ENUM ('customer','supplier','mixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  party_type public.party_type NOT NULL DEFAULT 'customer',
  phone text,
  address text,
  opening_due numeric NOT NULL DEFAULT 0,
  opening_advance numeric NOT NULL DEFAULT 0,
  opening_payable numeric NOT NULL DEFAULT 0,
  opening_notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read parties" ON public.parties;
CREATE POLICY "auth read parties" ON public.parties FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth insert parties" ON public.parties;
CREATE POLICY "auth insert parties" ON public.parties FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "auth update parties" ON public.parties;
CREATE POLICY "auth update parties" ON public.parties FOR UPDATE TO authenticated USING ((auth.uid() = created_by) OR has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "auth delete parties" ON public.parties;
CREATE POLICY "auth delete parties" ON public.parties FOR DELETE TO authenticated USING ((auth.uid() = created_by) OR has_role(auth.uid(),'admin'));

CREATE INDEX IF NOT EXISTS idx_parties_name ON public.parties (lower(name));

-- Link warehouse_ledger to a party
ALTER TABLE public.warehouse_ledger
  ADD COLUMN IF NOT EXISTS party_id uuid REFERENCES public.parties(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_wh_ledger_party_id ON public.warehouse_ledger (party_id);
