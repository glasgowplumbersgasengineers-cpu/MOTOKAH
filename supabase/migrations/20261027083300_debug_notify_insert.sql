create or replace function public.debug_try_notify(target_user uuid)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  result text;
begin
  insert into public.notifications (user_id, type, title, body)
  values (target_user, 'debug', 'debug', 'debug insert via function');
  return 'ok';
exception when others then
  return sqlstate || ': ' || sqlerrm;
end;
$$;

grant execute on function public.debug_try_notify(uuid) to authenticated, anon;

create or replace function public.debug_grants()
returns table(grantee text, insert_priv boolean, rls_enabled boolean, rls_forced boolean)
language sql
security definer
set search_path = public
as $$
  select
    'authenticated',
    has_table_privilege('authenticated', 'public.notifications', 'INSERT'),
    relrowsecurity,
    relforcerowsecurity
  from pg_class
  where oid = 'public.notifications'::regclass;
$$;

grant execute on function public.debug_grants() to authenticated, anon;
