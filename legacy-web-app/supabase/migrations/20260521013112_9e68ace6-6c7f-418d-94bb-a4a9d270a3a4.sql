CREATE TRIGGER trg_log_daily_closings_changes
AFTER UPDATE ON public.daily_closings
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();