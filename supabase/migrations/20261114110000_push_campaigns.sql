-- Opt-in marketing pushes (Apple guideline 4.5.4: promotional pushes need explicit opt-in).
alter table public.device_tokens
  add column if not exists marketing_opt_in boolean not null default false,
  add column if not exists language text not null default 'en',
  add column if not exists country text;

create table if not exists public.push_campaigns (
  id uuid primary key default gen_random_uuid(),
  scheduled_at timestamptz not null,
  language text not null check (language in ('en', 'sw')),
  country text,               -- null = every country
  title text not null check (char_length(title) <= 60),
  body text not null check (char_length(body) <= 180),
  link text not null default '/',
  status text not null default 'draft' check (status in ('draft', 'approved', 'sending', 'sent', 'cancelled')),
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  sent_at timestamptz,
  sent_count integer,
  created_at timestamptz not null default now()
);

alter table public.push_campaigns enable row level security;

create policy "Admins manage push campaigns"
  on public.push_campaigns for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create index if not exists idx_push_campaigns_due on public.push_campaigns (status, scheduled_at);
