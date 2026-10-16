-- page_views was already referenced by src/hooks/usePageTracking.ts (wired into every
-- route change in App.tsx) and a later RLS-hardening migration
-- (20260702124208_constrain_page_view_inserts.sql), but the table itself never existed
-- on this project -- it was created ad-hoc on an earlier Supabase project that no
-- longer exists, and never captured in a migration. Every page load has been silently
-- failing to insert since. This creates it for real, then re-applies the same
-- validation policy the old migration intended.
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  page text not null,
  referrer text,
  user_agent text,
  country text,
  device_type text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_session_id_idx on public.page_views (session_id);

alter table public.page_views enable row level security;

create policy "Visitors can insert valid page views"
  on public.page_views for insert
  to anon, authenticated
  with check (
    session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and page like '/%'
    and length(page) between 1 and 2048
    and (referrer is null or length(referrer) <= 2048)
    and (user_agent is null or length(user_agent) <= 1024)
    and (device_type is null or device_type in ('mobile', 'tablet', 'desktop'))
    and (
      country is null
      or country in ('Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Nigeria')
    )
    and (user_id is null or user_id = auth.uid())
  );

create policy "Admins can read page views"
  on public.page_views for select
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role));

-- Funnel events: the actual thing that answers "how do we get more people to post/buy"
-- -- not just that someone looked at a page, but that they signed up, posted a
-- listing, or tried to contact a seller. One generic table so new event types don't
-- need a migration each time.
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_name text not null,
  page text,
  user_id uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

create policy "Visitors can insert valid analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (
    session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and length(event_name) between 1 and 100
    and (page is null or (page like '/%' and length(page) <= 2048))
    and (user_id is null or user_id = auth.uid())
  );

create policy "Admins can read analytics events"
  on public.analytics_events for select
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role));
