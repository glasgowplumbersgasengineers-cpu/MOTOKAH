-- Block Seller was previously localStorage-only (device-local, not a real safety
-- feature: didn't survive a cache clear, didn't sync across devices, didn't stop
-- the seller from messaging the user from elsewhere). This makes it real.
create table if not exists public.blocked_sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  seller_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, seller_key)
);

alter table public.blocked_sellers enable row level security;

create policy "Users read own blocked sellers"
  on public.blocked_sellers for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own blocked sellers"
  on public.blocked_sellers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users delete own blocked sellers"
  on public.blocked_sellers for delete
  to authenticated
  using (auth.uid() = user_id);
