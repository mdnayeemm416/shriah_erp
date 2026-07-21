
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','manager','staff');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Shops
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  opening_cash NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Transactions
CREATE TYPE public.txn_type AS ENUM ('cash_in','cash_out','bank_withdraw','purchase','expense','supervisor_payment','adjustment');
CREATE TYPE public.pay_method AS ENUM ('cash','bank','card','other');

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type txn_type NOT NULL,
  shop_id UUID REFERENCES public.shops ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  payment_method pay_method NOT NULL DEFAULT 'cash',
  notes TEXT,
  attachment_url TEXT,
  txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_txn_date ON public.transactions(txn_date DESC);
CREATE INDEX idx_txn_shop ON public.transactions(shop_id);

-- Warehouse
CREATE TABLE public.warehouse_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  quantity NUMERIC(14,2) NOT NULL DEFAULT 0,
  purchase_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.warehouse_items ENABLE ROW LEVEL SECURITY;

-- Settings (currency)
CREATE TABLE public.app_settings (
  id INT PRIMARY KEY DEFAULT 1,
  currency TEXT NOT NULL DEFAULT 'SAR',
  CHECK (id = 1)
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.app_settings (id, currency) VALUES (1,'SAR');

-- RLS policies: any authenticated user can read; authenticated can write
CREATE POLICY "auth read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "self update profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "self insert profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "auth read roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "auth read shops" ON public.shops FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write shops" ON public.shops FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update shops" ON public.shops FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin delete shops" ON public.shops FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "auth read txn" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write txn" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update txn" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "auth delete txn" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "auth read wh" ON public.warehouse_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write wh" ON public.warehouse_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update wh" ON public.warehouse_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete wh" ON public.warehouse_items FOR DELETE TO authenticated USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "auth read settings" ON public.app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin update settings" ON public.app_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Auto profile on signup, first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.email);
  SELECT count(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'staff');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments','attachments', true);
CREATE POLICY "auth upload attachments" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'attachments');
CREATE POLICY "public read attachments" ON storage.objects FOR SELECT USING (bucket_id = 'attachments');
CREATE POLICY "auth delete own attachments" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND owner = auth.uid());
