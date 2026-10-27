-- Remove the diagnostic functions added while tracing the notifications RLS issue
-- (20261027083100-083300). Not needed in the live schema.
drop function if exists public.debug_list_policies(text);
drop function if exists public.debug_whoami();
drop function if exists public.debug_try_notify(uuid);
drop function if exists public.debug_grants();
