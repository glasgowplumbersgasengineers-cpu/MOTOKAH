-- Posting uses insert(...).select().single(), so the user must be allowed to
-- read their own newly-created pending row. Public visitors still only read
-- approved listings via the separate public policy.

drop policy if exists "Users can read their own listings" on public.listings;

create policy "Users can read their own listings"
on public.listings
for select
to authenticated
using (seller_id = auth.uid());

drop policy if exists "Users can read their own listing images" on public.listing_images;

create policy "Users can read their own listing images"
on public.listing_images
for select
to authenticated
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);
