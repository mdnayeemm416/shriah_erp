
CREATE TABLE IF NOT EXISTS public.daily_closings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  closing_date date NOT NULL,
  opening_cash numeric NOT NULL DEFAULT 0,
  cash_sale numeric NOT NULL DEFAULT 0,
  withdraw numeric NOT NULL DEFAULT 0,
  purchase numeric NOT NULL DEFAULT 0,
  expense numeric NOT NULL DEFAULT 0,
  expected_cash numeric NOT NULL DEFAULT 0,
  counted_cash numeric NOT NULL DEFAULT 0,
  difference numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'matched',
  notes text,
  holders jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid
);

CREATE UNIQUE INDEX IF NOT EXISTS daily_closings_date_unique
  ON public.daily_closings (closing_date) WHERE is_deleted = false;

ALTER TABLE public.daily_closings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read daily_closings"
  ON public.daily_closings FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth insert daily_closings"
  ON public.daily_closings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "auth update daily_closings"
  ON public.daily_closings FOR UPDATE TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin delete daily_closings"
  ON public.daily_closings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
