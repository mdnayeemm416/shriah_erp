
-- Per-event subscription flags on each recipient. NULL/missing key => subscribed.
ALTER TABLE public.notification_recipients
  ADD COLUMN IF NOT EXISTS event_flags jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Extend email log to capture audit context (backward compatible: order_id kept nullable).
ALTER TABLE public.notification_email_log
  ADD COLUMN IF NOT EXISTS event_type text,
  ADD COLUMN IF NOT EXISTS module text,
  ADD COLUMN IF NOT EXISTS action text,
  ADD COLUMN IF NOT EXISTS record_id text,
  ADD COLUMN IF NOT EXISTS payload jsonb;

CREATE INDEX IF NOT EXISTS idx_notif_email_log_module ON public.notification_email_log (module, sent_at DESC);
