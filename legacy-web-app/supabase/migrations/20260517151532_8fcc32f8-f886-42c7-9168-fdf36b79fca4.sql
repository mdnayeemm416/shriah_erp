
-- Add opening warehouse balance to app_settings
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS opening_warehouse_balance numeric NOT NULL DEFAULT 0;

-- Warehouse ledger entry type enum
DO $$ BEGIN
  CREATE TYPE public.wh_entry_type AS ENUM (
    'warehouse_sale',
    'warehouse_purchase',
    'payment_received',
    'supplier_payment',
    'adjustment'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.wh_pay_status AS ENUM ('cash', 'credit', 'partial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.warehouse_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_name text NOT NULL,
  entry_type public.wh_entry_type NOT NULL,
  payment_status public.wh_pay_status NOT NULL DEFAULT 'cash',
  amount numeric NOT NULL DEFAULT 0,
  paid_amount numeric NOT NULL DEFAULT 0,
  remaining_due numeric NOT NULL DEFAULT 0,
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  attachment_url text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wh_ledger_date ON public.warehouse_ledger(txn_date DESC);
CREATE INDEX IF NOT EXISTS idx_wh_ledger_party ON public.warehouse_ledger(party_name);
CREATE INDEX IF NOT EXISTS idx_wh_ledger_type ON public.warehouse_ledger(entry_type);

ALTER TABLE public.warehouse_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read wh_ledger"
  ON public.warehouse_ledger FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "auth insert wh_ledger"
  ON public.warehouse_ledger FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "auth update wh_ledger"
  ON public.warehouse_ledger FOR UPDATE
  TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "auth delete wh_ledger"
  ON public.warehouse_ledger FOR DELETE
  TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));
