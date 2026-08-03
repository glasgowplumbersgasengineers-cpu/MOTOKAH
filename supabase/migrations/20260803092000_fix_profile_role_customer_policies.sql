-- Customer launch fix: after has_role execute was revoked from authenticated,
-- older profile/user_roles policies that still referenced has_role caused normal
-- profile reads/updates to fail with 403. Posting requires profile.phone, so
-- customers were blocked before listing submission.

drop policy if exists "Anyone can view profiles" on public.profiles;
drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Public can read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Users insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own roles" on public.user_roles;
drop policy if exists "Only admins can insert roles" on public.user_roles;
drop policy if exists "Only admins can update roles" on public.user_roles;
drop policy if exists "Only admins can delete roles" on public.user_roles;

create policy "Users can view own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);
