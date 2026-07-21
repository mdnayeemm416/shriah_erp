
-- Add company-level opening balance to app_settings
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS opening_company_balance numeric NOT NULL DEFAULT 0;

-- Overview categories (Income / Cost) managed by admins
CREATE TABLE IF NOT EXISTS public.overview_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  entry_type public.overview_entry_type NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.overview_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view overview categories"
  ON public.overview_categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert overview categories"
  ON public.overview_categories FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owner or admin can update overview categories"
  ON public.overview_categories FOR UPDATE TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owner or admin can delete overview categories"
  ON public.overview_categories FOR DELETE TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));
