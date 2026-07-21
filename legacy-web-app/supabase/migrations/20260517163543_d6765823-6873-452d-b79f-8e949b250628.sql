
-- Shop entries table
create table public.shop_entries (
  id uuid primary key default gen_random_uuid(),
  txn_date date not null default current_date,
  shop_id uuid not null references public.shops(id) on delete restrict,
  cashier_id uuid references public.cashiers(id) on delete set null,
  entry_type text not null check (entry_type in ('sale','purchase','withdraw')),
  pos_sale numeric not null default 0,
  cash_sale numeric not null default 0,
  bank_sale numeric not null default 0,
  credit_sale numeric not null default 0,
  difference numeric not null default 0,
  purchase_amount numeric not null default 0,
  withdraw_amount numeric not null default 0,
  notes text,
  attachment_url text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index shop_entries_shop_date_idx on public.shop_entries(shop_id, txn_date desc);
create index shop_entries_cashier_idx on public.shop_entries(cashier_id);

alter table public.shop_entries enable row level security;

create policy "auth read shop_entries" on public.shop_entries
  for select to authenticated using (true);
create policy "auth insert shop_entries" on public.shop_entries
  for insert to authenticated with check (auth.uid() = created_by);
create policy "auth update shop_entries" on public.shop_entries
  for update to authenticated
  using ((auth.uid() = created_by) or has_role(auth.uid(), 'admin'::app_role));
create policy "auth delete shop_entries" on public.shop_entries
  for delete to authenticated
  using ((auth.uid() = created_by) or has_role(auth.uid(), 'admin'::app_role));

-- Sync trigger: shop entries → transactions
create or replace function public.sync_shop_to_transactions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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

  -- Remove any existing linked txns for this entry (handles updates)
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
    if coalesce(NEW.cash_sale,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id, cashier)
      values ('cash_in', NEW.cash_sale, 'cash', NEW.txn_date, v_prefix || ' (Cash Sale)',
        NEW.attachment_url, NEW.created_by, 'shop', NEW.id, 'Shop Sale', NEW.shop_id, v_cashier_name);
    end if;
    if coalesce(NEW.bank_sale,0) > 0 then
      insert into public.transactions (type, amount, payment_method, txn_date, notes,
        attachment_url, created_by, source, source_ref_id, category, shop_id, cashier)
      values ('cash_in', NEW.bank_sale, 'bank', NEW.txn_date, v_prefix || ' (Bank Sale)',
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
$$;

create trigger trg_sync_shop_to_transactions
  after insert or update or delete on public.shop_entries
  for each row execute function public.sync_shop_to_transactions();
