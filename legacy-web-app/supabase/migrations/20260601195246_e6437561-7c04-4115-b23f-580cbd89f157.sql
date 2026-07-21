CREATE TABLE public.profit_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  period_from DATE NOT NULL,
  period_to DATE NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('shop','company')),
  shop_id UUID,
  shop_name TEXT,
  cash_position NUMERIC NOT NULL DEFAULT 0,
  total_expense NUMERIC NOT NULL DEFAULT 0,
  net_profit NUMERIC NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.profit_snapshots TO authenticated;
GRANT ALL ON public.profit_snapshots TO service_role;

ALTER TABLE public.profit_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profit_snapshots read auth" ON public.profit_snapshots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profit_snapshots insert own" ON public.profit_snapshots
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "profit_snapshots admin delete" ON public.profit_snapshots
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR created_by = auth.uid());

CREATE INDEX idx_profit_snapshots_period ON public.profit_snapshots(period_from DESC);