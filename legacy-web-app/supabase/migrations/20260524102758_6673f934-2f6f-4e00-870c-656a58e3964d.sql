
-- History table for opening stock changes
CREATE TABLE public.pos_opening_stock_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_value numeric NOT NULL DEFAULT 0,
  new_value numeric NOT NULL DEFAULT 0,
  note text,
  changed_by uuid DEFAULT auth.uid(),
  changed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pos_opening_stock_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opening_stock_history admin write"
  ON public.pos_opening_stock_history
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));

CREATE POLICY "opening_stock_history read"
  ON public.pos_opening_stock_history
  FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_pos_opening_stock_history_changed_at
  ON public.pos_opening_stock_history (changed_at DESC);
