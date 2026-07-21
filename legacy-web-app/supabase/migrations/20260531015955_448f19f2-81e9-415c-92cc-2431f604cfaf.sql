
CREATE TABLE public.entry_warning_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT,
  shop_id UUID,
  shop_name TEXT,
  transaction_type TEXT NOT NULL,
  warning_type TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  existing_entry_id UUID,
  new_entry_id UUID,
  txn_date DATE,
  cashier_id UUID,
  amount NUMERIC,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.entry_warning_log TO authenticated;
GRANT ALL ON public.entry_warning_log TO service_role;

ALTER TABLE public.entry_warning_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth insert own warning log"
ON public.entry_warning_log
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "auth read warning log"
ON public.entry_warning_log
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE INDEX idx_entry_warning_log_created_at ON public.entry_warning_log(created_at DESC);
CREATE INDEX idx_entry_warning_log_user ON public.entry_warning_log(user_id);
