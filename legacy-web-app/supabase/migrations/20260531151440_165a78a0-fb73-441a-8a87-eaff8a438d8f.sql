CREATE TABLE IF NOT EXISTS public.notification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'android',
  device_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (token)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_tokens TO authenticated;
GRANT ALL ON public.notification_tokens TO service_role;

ALTER TABLE public.notification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tokens"
  ON public.notification_tokens FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own tokens"
  ON public.notification_tokens FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own tokens"
  ON public.notification_tokens FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users delete own tokens"
  ON public.notification_tokens FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins view all tokens"
  ON public.notification_tokens FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_notification_tokens_user ON public.notification_tokens(user_id);

CREATE TRIGGER notification_tokens_updated_at
  BEFORE UPDATE ON public.notification_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();