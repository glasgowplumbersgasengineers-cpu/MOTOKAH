-- The app now reads the signed-in user's own user_roles row instead of calling
-- this SECURITY DEFINER helper via RPC. RLS policies can still call it.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;
