create table if not exists public.cash_in_hand_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  cash_in_hand numeric not null default 0,
  cash_in_app numeric not null default 0,
  difference numeric not null default 0,
  holders jsonb,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.cash_in_hand_snapshots enable row level security;

create policy "snapshots_select_auth" on public.cash_in_hand_snapshots
  for select to authenticated using (true);

create policy "snapshots_insert_own" on public.cash_in_hand_snapshots
  for insert to authenticated with check (auth.uid() = created_by);

create policy "snapshots_delete_admin" on public.cash_in_hand_snapshots
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create index if not exists idx_cash_snapshots_date
  on public.cash_in_hand_snapshots (snapshot_date desc);