CREATE OR REPLACE FUNCTION public.sync_shop_to_transactions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_shop_name text;
  v_cashier_name text;
  v_prefix text;
begin
  if (TG_OP = 'DELETE') then
    delete from public.transactions
      where source = 'shop' and source_ref_id = OLD.id;
    return OLD;
  end if;

  -- Remove any existing linked txns for this entry (handles updates, prevents duplicates)
  delete from public.transactions
    where source = 'shop' and source_ref_id = NEW.id;

  select name into v_shop_name from public.shops where id = NEW.shop_id;
  if NEW.cashier_id is not null then
    select name into v_cashier_name from public.cashiers where id = NEW.cashier_id;
  end if;

  v_prefix := 'Shop: ' || coalesce(v_shop_name,'') ||
              case when v_cashier_name is not null then ' / ' || v_cashier_name else '' end ||
              case when NEW.notes is not null and NEW.notes <> '' then ' — ' || NEW.notes else '' end;

  if NEW.entry_type = 'sale' then
    -- Only Cash Sale syncs to main Transactions (POS/Bank/Credit/Plus-Minus stay in Shop only)
    if coalesce(NEW.cash_sale,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id, cashier)
      values ('cash_in', NEW.cash_sale, 'cash', NEW.txn_date, v_prefix || ' (Cash Sale)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Sale', NEW.shop_id, v_cashier_name);
    end if;
  elsif NEW.entry_type = 'purchase' then
    if coalesce(NEW.purchase_amount,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      values ('purchase', NEW.purchase_amount, 'cash', NEW.txn_date, v_prefix || ' (Purchase)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Purchase', NEW.shop_id);
    end if;
  elsif NEW.entry_type = 'withdraw' then
    if coalesce(NEW.withdraw_amount,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id)
      values ('bank_withdraw', NEW.withdraw_amount, 'cash', NEW.txn_date, v_prefix || ' (Bank Withdraw)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Bank Withdraw', NEW.shop_id);
    end if;
  end if;

  return NEW;
end;
$function$;

-- Clean up previously-synced Bank Sale transactions from shop entries
DELETE FROM public.transactions t
USING public.shop_entries s
WHERE t.source = 'shop'
  AND t.source_ref_id = s.id
  AND s.entry_type = 'sale'
  AND t.payment_method = 'bank';