
-- ===== 1. Admin-only DELETE on all business tables =====
DO $$ DECLARE t text; BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'ai_scans','cashiers','categories','parties','shop_entries',
    'sub_categories','transactions','warehouse_items','warehouse_ledger'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "auth delete %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users delete own scans" ON public.%I', t);
    EXECUTE format($f$CREATE POLICY "admin delete %s" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'))$f$, t, t);
  END LOOP;
END $$;

-- ===== 2. Prevent non-admin from toggling is_deleted (soft delete / restore) =====
CREATE OR REPLACE FUNCTION public.enforce_admin_soft_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF COALESCE(OLD.is_deleted,false) IS DISTINCT FROM COALESCE(NEW.is_deleted,false) THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can delete or restore records';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DO $$ DECLARE t text; BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'ai_scans','cashiers','categories','parties','shop_entries','shops',
    'sub_categories','transactions','warehouse_items','warehouse_ledger'
  ]) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_enforce_admin_soft_delete ON public.%I', t);
    EXECUTE format('CREATE TRIGGER trg_enforce_admin_soft_delete BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete()', t);
  END LOOP;
END $$;

-- Update soft_delete_record / restore_record to require admin
CREATE OR REPLACE FUNCTION public.soft_delete_record(_table_name text, _record_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  IF NOT public.is_soft_deletable_table(_table_name) THEN RAISE EXCEPTION 'Table not soft deletable: %', _table_name; END IF;
  EXECUTE format('UPDATE public.%I SET is_deleted=true, deleted_at=now(), deleted_by=$1 WHERE id=$2 AND is_deleted=false', _table_name) USING auth.uid(), _record_id;
END $$;

CREATE OR REPLACE FUNCTION public.restore_record(_table_name text, _record_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  IF NOT public.is_soft_deletable_table(_table_name) THEN RAISE EXCEPTION 'Table not restorable: %', _table_name; END IF;
  EXECUTE format('UPDATE public.%I SET is_deleted=false, deleted_at=null, deleted_by=null WHERE id=$1 AND is_deleted=true', _table_name) USING _record_id;
END $$;

-- ===== 3. Profiles: only self or admin can read =====
DROP POLICY IF EXISTS "auth read profiles" ON public.profiles;
CREATE POLICY "self or admin read profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));

-- ===== 4. User roles: only self or admin can read =====
DROP POLICY IF EXISTS "auth read roles" ON public.user_roles;
CREATE POLICY "self or admin read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ===== 5. Private attachments bucket + storage RLS =====
UPDATE storage.buckets SET public = false WHERE id = 'attachments';

DROP POLICY IF EXISTS "Public read attachments" ON storage.objects;
DROP POLICY IF EXISTS "auth read attachments" ON storage.objects;
DROP POLICY IF EXISTS "auth upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "auth update own attachments" ON storage.objects;
DROP POLICY IF EXISTS "admin delete attachments" ON storage.objects;

CREATE POLICY "auth read attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'attachments');

CREATE POLICY "auth upload attachments" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'attachments' AND auth.uid() = owner);

CREATE POLICY "auth update own attachments" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'attachments' AND (auth.uid() = owner OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "admin delete attachments" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND public.has_role(auth.uid(),'admin'));
