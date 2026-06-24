-- ============================================================
-- FrontRow — 0007_dedupe_catalog.sql
-- Merge duplicate artists/venues, enforce case-insensitive uniqueness, and add
-- atomic find-or-create RPCs so search-or-create can't spawn duplicate rows.
-- ============================================================

-- ---------- Merge duplicate artists ----------
create temp table artist_merge on commit drop as
select a.id as dup_id, k.keep_id
from artists a
join (
  select lower(name) as key, (array_agg(id order by created_at, id))[1] as keep_id
  from artists group by lower(name)
) k on lower(a.name) = k.key
where a.id <> k.keep_id;

-- avoid PK collisions in junction tables before repointing
delete from concert_artists ca using artist_merge m
where ca.artist_id = m.dup_id
  and exists (select 1 from concert_artists x
              where x.concert_id = ca.concert_id and x.artist_id = m.keep_id);
delete from wishlist_artists wa using artist_merge m
where wa.artist_id = m.dup_id
  and exists (select 1 from wishlist_artists x
              where x.user_id = wa.user_id and x.artist_id = m.keep_id);

update concerts        c  set headliner_id = m.keep_id from artist_merge m where c.headliner_id = m.dup_id;
update concert_artists ca set artist_id    = m.keep_id from artist_merge m where ca.artist_id   = m.dup_id;
update performances    p  set artist_id    = m.keep_id from artist_merge m where p.artist_id    = m.dup_id;
update tours           t  set artist_id    = m.keep_id from artist_merge m where t.artist_id    = m.dup_id;
update wishlist_artists wa set artist_id   = m.keep_id from artist_merge m where wa.artist_id   = m.dup_id;
delete from artists where id in (select dup_id from artist_merge);

-- ---------- Merge duplicate venues ----------
create temp table venue_merge on commit drop as
select v.id as dup_id, k.keep_id
from venues v
join (
  select lower(name) as n, lower(city) as c, country,
         (array_agg(id order by created_at, id))[1] as keep_id
  from venues group by lower(name), lower(city), country
) k on lower(v.name) = k.n and lower(v.city) = k.c and v.country = k.country
where v.id <> k.keep_id;

update concerts c set venue_id = m.keep_id from venue_merge m where c.venue_id = m.dup_id;
delete from venues where id in (select dup_id from venue_merge);

-- ---------- Case-insensitive uniqueness ----------
create unique index if not exists artists_name_lower_uniq on artists (lower(name));
create unique index if not exists venues_name_city_country_uniq on venues (lower(name), lower(city), country);

-- ---------- Atomic find-or-create ----------
create or replace function find_or_create_artist(p_name text)
returns artists language plpgsql security invoker set search_path = public as $$
declare v_name text := nullif(trim(p_name), ''); result artists;
begin
  if v_name is null then raise exception 'artist name required'; end if;
  select * into result from artists where lower(name) = lower(v_name) limit 1;
  if found then return result; end if;
  insert into artists (name) values (v_name)
    on conflict (lower(name)) do nothing
    returning * into result;
  if result.id is null then
    select * into result from artists where lower(name) = lower(v_name) limit 1;
  end if;
  return result;
end; $$;

create or replace function find_or_create_venue(
  p_name text, p_city text, p_country text, p_country_name text
) returns venues language plpgsql security invoker set search_path = public as $$
declare v_name text := nullif(trim(p_name), ''); result venues;
begin
  if v_name is null then raise exception 'venue name required'; end if;
  select * into result from venues
    where lower(name) = lower(v_name)
      and lower(city) = lower(coalesce(p_city, ''))
      and country = p_country
    limit 1;
  if found then return result; end if;
  insert into venues (name, city, country, country_name)
    values (v_name, p_city, p_country, p_country_name)
    on conflict (lower(name), lower(city), country) do nothing
    returning * into result;
  if result.id is null then
    select * into result from venues
      where lower(name) = lower(v_name)
        and lower(city) = lower(coalesce(p_city, ''))
        and country = p_country
      limit 1;
  end if;
  return result;
end; $$;

grant execute on function find_or_create_artist(text) to authenticated, service_role;
grant execute on function find_or_create_venue(text, text, text, text) to authenticated, service_role;
