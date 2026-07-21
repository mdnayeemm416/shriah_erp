-- Monthly Snapshot System (lightweight, read-only)
-- Stores one summarized row per month. Does NOT touch any existing tables.

CREATE TABLE public.monthly_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month DATE NOT NULL,                 -- always the first day of the snapshot month, e.g. 2026-05-01
  label TEXT NOT NULL,                 -- "May 2026"
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
                                       -- { company:{...}, shops:[...], wholesale:{...}, employees:{...}, suppliers:{...} }
  is_hard_close BOOLEAN NOT NULL DEFAULT false,  -- reserved for future "Hard Monthly Closing"
  notes TEXT,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT monthly_snapshots_month_unique UNIQUE (month)
);

CREATE INDEX idx_monthly_snapshots_month ON public.monthly_snapshots (month DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_snapshots TO authenticated;
GRANT ALL ON public.monthly_snapshots TO service_role;

ALTER TABLE public.monthly_snapshots ENABLE ROW LEVEL SECURITY;

-- Any signed-in user can view snapshots (read-only for non-admins).
CREATE POLICY "monthly_snapshots read auth"
  ON public.monthly_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create snapshots.
CREATE POLICY "monthly_snapshots admin insert"
  ON public.monthly_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND created_by = auth.uid());

-- Only admins can update (e.g. notes / future hard-close flag).
CREATE POLICY "monthly_snapshots admin update"
  ON public.monthly_snapshots
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete.
CREATE POLICY "monthly_snapshots admin delete"
  ON public.monthly_snapshots
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
