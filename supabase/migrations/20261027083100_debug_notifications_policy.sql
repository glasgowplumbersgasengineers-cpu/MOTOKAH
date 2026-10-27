create or replace function public.debug_list_policies(tbl text)
returns table(policyname text, cmd text, roles text[], qual text, with_check text)
language sql
security definer
set search_path = public
as $$
  select policyname, cmd, roles, qual, with_check
  from pg_policies
  where schemaname = 'public' and tablename = tbl;
$$;

grant execute on function public.debug_list_policies(text) to authenticated, anon;
