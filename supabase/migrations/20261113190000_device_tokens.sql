-- Device tokens for push notifications (APNs / FCM).
-- Each row maps a user to a device they've granted push permission on.

create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  platform text not null check (platform in ('ios', 'android', 'web')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);

alter table public.device_tokens enable row level security;

create policy "Users can read their own device tokens"
  on public.device_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert their own device tokens"
  on public.device_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own device tokens"
  on public.device_tokens for delete
  using (auth.uid() = user_id);

-- Index for the send-push function: look up all tokens for a given user.
create index if not exists idx_device_tokens_user_id on public.device_tokens(user_id);
