-- Fix two bugs found while live-testing chat with a real user (Sunny, 2026-10-27):
--
-- 1. notifications had RLS enabled with SELECT/UPDATE policies only, no INSERT policy.
--    Every createNotification() call for another user (new message, listing approved,
--    dealer application) was silently failing with 403 -- notifications were never
--    actually delivered to anyone.
--
-- 2. messages/conversations were never added to the supabase_realtime publication, so
--    the postgres_changes subscription in Messages.tsx never fired. A sender's own
--    message vanished from the UI after sending (text box cleared, nothing appeared)
--    until they left and reopened the conversation -- looked exactly like the chat
--    being "stuck".

create policy "Authenticated users can create notifications"
on public.notifications
for insert
to authenticated
with check (auth.uid() is not null);

alter table public.messages replica identity full;
alter table public.conversations replica identity full;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
