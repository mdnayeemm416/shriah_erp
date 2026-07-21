
CREATE TYPE public.overview_entry_type AS ENUM ('income', 'cost');

CREATE TABLE public.overview_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type public.overview_entry_type NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  attachment_url text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid
);

CREATE INDEX overview_entries_date_idx ON public.overview_entries(txn_date DESC) WHERE is_deleted = false;
CREATE INDEX overview_entries_type_idx ON public.overview_entries(entry_type) WHERE is_deleted = false;

ALTER TABLE public.overview_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view overview entries"
  ON public.overview_entries FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert own overview entries"
  ON public.overview_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owner or admin can update overview entries"
  ON public.overview_entries FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owner or admin can delete overview entries"
  ON public.overview_entries FOR DELETE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_overview_entries_updated_at
  BEFORE UPDATE ON public.overview_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_ai_scans_updated_at();
