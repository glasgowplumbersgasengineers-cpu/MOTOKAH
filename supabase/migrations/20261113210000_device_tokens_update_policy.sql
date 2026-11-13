create policy "Users can update their own device tokens"
  on public.device_tokens for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
