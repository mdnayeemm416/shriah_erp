CREATE TABLE public.notification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL,
  role text,
  platform text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (token)
);

CREATE INDEX idx_notification_tokens_user ON public.notification_tokens(user_id);
CREATE INDEX idx_notification_tokens_role ON public.notification_tokens(role);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_tokens TO authenticated;
GRANT ALL ON public.notification_tokens TO service_role;

ALTER TABLE public.notification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tokens"
  ON public.notification_tokens FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_notification_tokens_updated
  BEFORE UPDATE ON public.notification_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
