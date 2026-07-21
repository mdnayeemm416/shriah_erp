
CREATE TABLE public.notification_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  label text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_recipients TO authenticated;
GRANT ALL ON public.notification_recipients TO service_role;

ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage notification recipients"
ON public.notification_recipients FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_notification_recipients_updated
BEFORE UPDATE ON public.notification_recipients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.notification_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid,
  recipient_email text NOT NULL,
  subject text,
  status text NOT NULL,
  error text,
  sent_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.notification_email_log TO authenticated;
GRANT ALL ON public.notification_email_log TO service_role;

ALTER TABLE public.notification_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view email log"
ON public.notification_email_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_notif_email_log_sent_at ON public.notification_email_log(sent_at DESC);
