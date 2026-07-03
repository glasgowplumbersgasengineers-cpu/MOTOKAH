-- Harden launch-time admin content policies.
-- Public users may read published/planned content data, but only real admins can write it.
create table if not exists public.user_roles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

drop policy if exists "Users can view own roles" on public.user_roles;
drop policy if exists "Only admins can insert roles" on public.user_roles;
drop policy if exists "Only admins can update roles" on public.user_roles;
drop policy if exists "Only admins can delete roles" on public.user_roles;

create policy "Users can view own roles"
on public.user_roles
for select
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Only admins can insert roles"
on public.user_roles
for insert
with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Only admins can update roles"
on public.user_roles
for update
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Only admins can delete roles"
on public.user_roles
for delete
using (public.has_role(auth.uid(), 'admin'::public.app_role));

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = 'waleedmurtazamalil@gmail.com'
on conflict (user_id, role) do nothing;

drop policy if exists "content insert" on public.content_posts;
drop policy if exists "content update" on public.content_posts;
drop policy if exists "content delete" on public.content_posts;
drop policy if exists "Admins can insert content posts" on public.content_posts;
drop policy if exists "Admins can update content posts" on public.content_posts;
drop policy if exists "Admins can delete content posts" on public.content_posts;

create policy "Admins can insert content posts"
on public.content_posts
for insert
with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can update content posts"
on public.content_posts
for update
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can delete content posts"
on public.content_posts
for delete
using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- These are trigger-only SECURITY DEFINER functions; they should not be callable via RPC.
do $$
begin
  if to_regprocedure('public.on_listing_submitted()') is not null then
    revoke execute on function public.on_listing_submitted() from public, anon, authenticated;
  end if;
  if to_regprocedure('public.on_user_signup()') is not null then
    revoke execute on function public.on_user_signup() from public, anon, authenticated;
  end if;
end $$;

-- Public buckets still serve known public URLs; these broad SELECT policies allowed object listing.
drop policy if exists "Public read listing images" on storage.objects;
drop policy if exists "Public read showroom images" on storage.objects;
