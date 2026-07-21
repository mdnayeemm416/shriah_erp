
-- Owner report snapshots table
CREATE TABLE public.owner_report_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_label TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  storage_path TEXT NOT NULL,
  created_by UUID,
  created_by_name TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.owner_report_snapshots TO authenticated;
GRANT ALL ON public.owner_report_snapshots TO service_role;

ALTER TABLE public.owner_report_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view snapshots"
  ON public.owner_report_snapshots FOR SELECT TO authenticated
  USING (COALESCE(is_deleted,false) = false);

CREATE POLICY "Authenticated can create snapshots"
  ON public.owner_report_snapshots FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admin can soft delete snapshots"
  ON public.owner_report_snapshots FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_owner_report_snapshots_created_at ON public.owner_report_snapshots(created_at DESC);

-- Storage policies for owner-snapshots bucket (private)
CREATE POLICY "Authenticated can read owner snapshots"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'owner-snapshots');

CREATE POLICY "Authenticated can upload owner snapshots"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'owner-snapshots');

CREATE POLICY "Admins can delete owner snapshots"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'owner-snapshots' AND public.has_role(auth.uid(), 'admin'));
