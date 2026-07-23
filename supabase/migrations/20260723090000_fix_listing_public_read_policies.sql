-- Fix launch-time public listing reads after has_role execute was revoked from
-- anon/authenticated. Older policies referenced has_role inside public listing
-- SELECT paths, which makes PostgREST return 401 before fallback data loads.

drop policy if exists "Anyone can view approved listings" on public.listings;
drop policy if exists "Anyone can read approved listings" on public.listings;
drop policy if exists "Authenticated users can create listings" on public.listings;
drop policy if exists "Authenticated users can insert their own listings" on public.listings;
drop policy if exists "Owners can update own listings" on public.listings;
drop policy if exists "Users can update their own listings" on public.listings;
drop policy if exists "Owners can delete own listings" on public.listings;
drop policy if exists "Users can delete their own listings" on public.listings;

create policy "Anyone can read approved listings"
on public.listings
for select
to anon, authenticated
using (status = 'approved');

create policy "Authenticated users can insert their own listings"
on public.listings
for insert
to authenticated
with check (seller_id = auth.uid());

create policy "Users can update their own listings"
on public.listings
for update
to authenticated
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "Users can delete their own listings"
on public.listings
for delete
to authenticated
using (seller_id = auth.uid());

drop policy if exists "Anyone can view listing images" on public.listing_images;
drop policy if exists "Anyone can read listing images" on public.listing_images;
drop policy if exists "Owners can insert listing images" on public.listing_images;
drop policy if exists "Owners can update listing images" on public.listing_images;
drop policy if exists "Owners can delete listing images" on public.listing_images;

create policy "Anyone can read listing images"
on public.listing_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.status = 'approved'
  )
);

create policy "Owners can insert listing images"
on public.listing_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

create policy "Owners can update listing images"
on public.listing_images
for update
to authenticated
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

create policy "Owners can delete listing images"
on public.listing_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);
