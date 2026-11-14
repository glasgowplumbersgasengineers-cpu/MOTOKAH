-- Push notifications now deliver notification rows to lock screens, so who may create a
-- notification for whom matters. Previously any signed-in user could insert one for anyone.
drop policy if exists "Authenticated users can create notifications" on public.notifications;

create policy "Users can create allowed notifications"
on public.notifications for insert
to authenticated
with check (
  auth.uid() = user_id
  or public.has_role(auth.uid(), 'admin')
  or (
    type = 'new_message'
    and exists (
      select 1 from public.conversations c
      where (c.participant1_id = auth.uid() and c.participant2_id = notifications.user_id)
         or (c.participant2_id = auth.uid() and c.participant1_id = notifications.user_id)
    )
  )
);

-- send-push delivers each notification at most once.
alter table public.notifications add column if not exists pushed_at timestamptz;
