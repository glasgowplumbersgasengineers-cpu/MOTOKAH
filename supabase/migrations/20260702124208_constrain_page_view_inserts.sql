drop policy if exists "Anyone can insert page views" on public.page_views;

create policy "Visitors can insert valid page views"
on public.page_views
for insert
with check (
  session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  and page like '/%'
  and length(page) between 1 and 2048
  and (referrer is null or length(referrer) <= 2048)
  and (user_agent is null or length(user_agent) <= 1024)
  and (device_type is null or device_type in ('mobile', 'tablet', 'desktop'))
  and (
    country is null
    or country in ('Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Nigeria')
  )
  and (
    user_id is null
    or user_id = auth.uid()
  )
);
