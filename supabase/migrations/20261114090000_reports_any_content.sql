-- Reports could only target a row in public.listings (uuid FK), so dealer-sourced listings and
-- chat users could not be reported at all. Allow a report to describe any content instead.
alter table public.reports alter column listing_id drop not null;
alter table public.reports
  add column if not exists listing_ref text,
  add column if not exists reported_user_id uuid references auth.users(id) on delete set null,
  add column if not exists context text;
alter table public.reports drop constraint if exists reports_has_target;
alter table public.reports add constraint reports_has_target
  check (listing_id is not null or listing_ref is not null or reported_user_id is not null);
