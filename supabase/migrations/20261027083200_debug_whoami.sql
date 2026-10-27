create or replace function public.debug_whoami()
returns table(uid uuid, role text)
language sql
security invoker
set search_path = public
as $$
  select auth.uid(), auth.role();
$$;

grant execute on function public.debug_whoami() to authenticated, anon;
