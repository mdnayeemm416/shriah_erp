
CREATE TRIGGER trg_month_lock_company_transactions
  BEFORE UPDATE OR DELETE ON public.company_transactions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_month_lock();
