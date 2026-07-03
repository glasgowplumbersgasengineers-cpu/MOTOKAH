create or replace function public.reject_unsafe_content_post()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  combined_text text;
begin
  new.pillar := nullif(trim(coalesce(new.pillar, '')), '');
  new.post_type := nullif(trim(coalesce(new.post_type, '')), '');
  combined_text := lower(coalesce(new.title, '') || E'\n' || coalesce(new.caption, '') || E'\n' || coalesce(new.caption_sw, ''));

  if coalesce(new.pillar, '') not in ('Listings', 'Dealer', 'Education', 'Brand', 'Promotion', 'Boats', 'Culture') then
    raise exception 'Unsafe Motokah content pillar: %', coalesce(new.pillar, '(blank)');
  end if;

  if coalesce(new.post_type, '') not in ('feed', 'carousel', 'story') then
    raise exception 'Unsafe Motokah content post_type: %', coalesce(new.post_type, '(blank)');
  end if;

  if combined_text !~* '(motokah|car|cars|vehicle|vehicles|dealer|dealers|showroom|listing|listings|toyota|nissan|subaru|mazda|honda|bmw|mercedes|boat|boats|marine)' then
    raise exception 'Unsafe Motokah content: missing marketplace relevance';
  end if;

  if combined_text ~* '(accident|crash|collision|death|dead|injury|injured|injuries|politic|election|government|minister|president|sponsorship|thunder|fuel price update|fuel prices?|petrol prices?|global oil|road rules|breaking|rss|(^|[^a-z])news([^a-z]|$))' then
    raise exception 'Unsafe Motokah content: generic news or off-brand wording is blocked';
  end if;

  return new;
end;
$$;

revoke all on function public.reject_unsafe_content_post() from public;
revoke all on function public.reject_unsafe_content_post() from anon;
revoke all on function public.reject_unsafe_content_post() from authenticated;

drop trigger if exists reject_unsafe_content_post_before_write on public.content_posts;
create trigger reject_unsafe_content_post_before_write
before insert or update of title, caption, caption_sw, pillar, post_type
on public.content_posts
for each row execute function public.reject_unsafe_content_post();

update public.content_posts
set status = 'rejected',
    updated_at = now()
where status in ('draft', 'pending', 'approved')
  and (
    coalesce(pillar, '') not in ('Listings', 'Dealer', 'Education', 'Brand', 'Promotion', 'Boats', 'Culture')
    or coalesce(post_type, '') not in ('feed', 'carousel', 'story')
    or lower(coalesce(title, '') || E'\n' || coalesce(caption, '') || E'\n' || coalesce(caption_sw, '')) !~* '(motokah|car|cars|vehicle|vehicles|dealer|dealers|showroom|listing|listings|toyota|nissan|subaru|mazda|honda|bmw|mercedes|boat|boats|marine)'
    or lower(coalesce(title, '') || E'\n' || coalesce(caption, '') || E'\n' || coalesce(caption_sw, '')) ~* '(accident|crash|collision|death|dead|injury|injured|injuries|politic|election|government|minister|president|sponsorship|thunder|fuel price update|fuel prices?|petrol prices?|global oil|road rules|breaking|rss|(^|[^a-z])news([^a-z]|$))'
  );
