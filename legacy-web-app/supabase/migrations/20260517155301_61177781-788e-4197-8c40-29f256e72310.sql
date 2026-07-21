
-- Link transactions to source records (e.g., warehouse ledger)
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS source_ref_id uuid;

CREATE INDEX IF NOT EXISTS idx_transactions_source_ref
  ON public.transactions (source, source_ref_id);

-- Function: sync a warehouse_ledger row into the cash transactions table
CREATE OR REPLACE FUNCTION public.sync_warehouse_to_transactions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_txn_type public.txn_type;
  v_amount numeric := 0;
  v_should_sync boolean := false;
BEGIN
  -- On DELETE: remove linked txn
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM public.transactions
      WHERE source = 'warehouse' AND source_ref_id = OLD.id;
    RETURN OLD;
  END IF;

  -- Determine txn type and cash amount based on entry type + payment status
  IF NEW.entry_type = 'warehouse_sale' THEN
    v_txn_type := 'cash_in';
    IF NEW.payment_status = 'cash' THEN
      v_amount := NEW.amount;
      v_should_sync := true;
    ELSIF NEW.payment_status = 'partial' THEN
      v_amount := NEW.paid_amount;
      v_should_sync := v_amount > 0;
    END IF;
  ELSIF NEW.entry_type = 'warehouse_purchase' THEN
    v_txn_type := 'purchase';
    IF NEW.payment_status = 'cash' THEN
      v_amount := NEW.amount;
      v_should_sync := true;
    ELSIF NEW.payment_status = 'partial' THEN
      v_amount := NEW.paid_amount;
      v_should_sync := v_amount > 0;
    END IF;
  ELSIF NEW.entry_type = 'payment_received' THEN
    v_txn_type := 'cash_in';
    v_amount := NEW.amount;
    v_should_sync := v_amount > 0;
  ELSIF NEW.entry_type = 'supplier_payment' THEN
    v_txn_type := 'cash_out';
    v_amount := NEW.amount;
    v_should_sync := v_amount > 0;
  ELSE
    v_should_sync := false;
  END IF;

  -- Remove any existing linked txn (handles updates that flip status to credit)
  DELETE FROM public.transactions
    WHERE source = 'warehouse' AND source_ref_id = NEW.id;

  IF v_should_sync THEN
    INSERT INTO public.transactions (
      type, amount, payment_method, txn_date, notes,
      attachment_url, created_by, source, source_ref_id, category
    ) VALUES (
      v_txn_type,
      v_amount,
      'cash',
      NEW.txn_date,
      COALESCE('Warehouse: ' || NEW.party_name ||
        CASE WHEN NEW.notes IS NOT NULL THEN ' — ' || NEW.notes ELSE '' END, NEW.party_name),
      NEW.attachment_url,
      NEW.created_by,
      'warehouse',
      NEW.id,
      'Warehouse Ledger'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_warehouse_to_transactions ON public.warehouse_ledger;
CREATE TRIGGER trg_sync_warehouse_to_transactions
AFTER INSERT OR UPDATE OR DELETE ON public.warehouse_ledger
FOR EACH ROW EXECUTE FUNCTION public.sync_warehouse_to_transactions();
