
CREATE TABLE public.employee_expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

GRANT SELECT ON public.employee_expense_categories TO authenticated;
GRANT ALL ON public.employee_expense_categories TO service_role;

ALTER TABLE public.employee_expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated can read categories"
  ON public.employee_expense_categories FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins manage categories - insert"
  ON public.employee_expense_categories FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins manage categories - update"
  ON public.employee_expense_categories FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins manage categories - delete"
  ON public.employee_expense_categories FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE TRIGGER trg_eec_updated_at BEFORE UPDATE ON public.employee_expense_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.employee_expense_categories (name, sort_order) VALUES
  ('Fuel', 10), ('Spare Parts', 20), ('AC Parts', 30), ('Fridge Parts', 40),
  ('Parking', 50), ('Toll', 60), ('Delivery', 70), ('Other', 999);
