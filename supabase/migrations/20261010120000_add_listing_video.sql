alter table public.listings
add column if not exists video_url text;

comment on column public.listings.video_url is 'Optional public URL for a seller-uploaded vehicle video.';
