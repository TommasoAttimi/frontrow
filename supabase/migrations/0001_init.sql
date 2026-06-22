-- ============================================================
-- FrontRow — 0001_init.sql  (schema)
-- ============================================================
create extension if not exists citext;

-- ---------- enums ----------
create type concert_type     as enum ('concert','festival');
create type concert_status   as enum ('attended','planned','wishlist');
create type ticket_type      as enum ('GA','Seated','VIP','Free','Press');
create type artist_role      as enum ('headliner','support','special_guest','opener');
create type press_type       as enum ('photo','video','press','all_access');
create type venue_type       as enum ('arena','club','festival_site','theatre','outdoor','other');
create type buddy_status     as enum ('pending','confirmed','declined');
create type friendship_status as enum ('pending','accepted','blocked');
create type achievement_rarity as enum ('common','uncommon','rare','legendary');

-- ---------- updated_at helper ----------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ============================================================
-- profiles  (1:1 with auth.users)
-- ============================================================
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     citext not null unique
                 check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  display_name text,
  avatar_url   text,
  bio          text,
  location     text,
  is_press     boolean not null default false,
  press_type   press_type,
  is_public    boolean not null default true,
  joined_at    timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ============================================================
-- shared catalogs: artists / venues / tours
-- ============================================================
create table artists (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  genres         text[] not null default '{}',
  origin_city    text,
  origin_country text,
  spotify_id     text,
  image_url      text,
  formed_year    int,
  bio            text,
  created_at     timestamptz not null default now()
);
create index idx_artists_name on artists using gin (to_tsvector('simple', name));

create table venues (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  city         text not null,
  country      char(2) not null,
  country_name text not null,
  lat          double precision,
  lng          double precision,
  capacity     int,
  type         venue_type,
  created_at   timestamptz not null default now()
);
create index idx_venues_country on venues(country);
create index idx_venues_name on venues using gin (to_tsvector('simple', name));

create table tours (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references artists(id) on delete cascade,
  name        text not null,
  start_date  date,
  end_date    date,
  total_shows int,
  created_at  timestamptz not null default now()
);
create index idx_tours_artist on tours(artist_id);

-- ============================================================
-- concerts
-- ============================================================
create table concerts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  type            concert_type not null default 'concert',
  headliner_id    uuid references artists(id),
  venue_id        uuid references venues(id),
  date            date not null,
  tour_name       text,
  tour_id         uuid references tours(id),
  festival_name   text,
  ticket_type     ticket_type,
  ticket_price    numeric(10,2),
  ticket_price_paid numeric(10,2),
  ticket_currency char(3),
  ticket_scan_url text,
  photos          text[] not null default '{}',
  setlist_fm_id   text,
  personal_note   text,
  status          concert_status not null default 'attended',
  accred_type            press_type,
  accred_client          text,
  accred_publication_url text,
  accred_photo_pit       boolean,
  accred_first_3_songs   boolean,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_concerts_user_date on concerts(user_id, date desc);
create index idx_concerts_headliner on concerts(headliner_id);
create index idx_concerts_venue on concerts(venue_id);
create index idx_concerts_tour on concerts(tour_id);
create trigger trg_concerts_updated before update on concerts
  for each row execute function set_updated_at();

create table concert_artists (
  concert_id    uuid not null references concerts(id) on delete cascade,
  artist_id     uuid not null references artists(id) on delete cascade,
  role          artist_role not null default 'headliner',
  billing_order int not null default 0,
  primary key (concert_id, artist_id)
);
create index idx_concert_artists_artist on concert_artists(artist_id);

-- ============================================================
-- festival hierarchy
-- ============================================================
create table festival_days (
  id         uuid primary key default gen_random_uuid(),
  concert_id uuid not null references concerts(id) on delete cascade,
  date       date not null,
  day_order  int not null default 0
);
create index idx_festival_days_concert on festival_days(concert_id);

create table festival_stages (
  id         uuid primary key default gen_random_uuid(),
  concert_id uuid not null references concerts(id) on delete cascade,
  day_id     uuid not null references festival_days(id) on delete cascade,
  stage_name text not null,
  stage_order int not null default 0
);
create index idx_festival_stages_day on festival_stages(day_id);

create table performances (
  id         uuid primary key default gen_random_uuid(),
  concert_id uuid not null references concerts(id) on delete cascade,
  stage_id   uuid not null references festival_stages(id) on delete cascade,
  artist_id  uuid not null references artists(id),
  role       artist_role not null default 'headliner',
  start_time time,
  end_time   time,
  attended   boolean not null default true,
  perf_order int not null default 0
);
create index idx_performances_stage on performances(stage_id);
create index idx_performances_artist on performances(artist_id);

-- ============================================================
-- setlists
-- ============================================================
create table setlist_songs (
  id             uuid primary key default gen_random_uuid(),
  concert_id     uuid not null references concerts(id) on delete cascade,
  performance_id uuid references performances(id) on delete cascade,
  position       int not null,
  title          text not null,
  is_encore      boolean not null default false,
  note           text
);
create index idx_setlist_concert on setlist_songs(concert_id);
create index idx_setlist_performance on setlist_songs(performance_id);

-- ============================================================
-- concert buddies
-- ============================================================
create table concert_buddies (
  id            uuid primary key default gen_random_uuid(),
  concert_id    uuid not null references concerts(id) on delete cascade,
  owner_id      uuid not null references profiles(id) on delete cascade,
  tagged_user_id uuid not null references profiles(id) on delete cascade,
  status        buddy_status not null default 'pending',
  linked_concert_id uuid references concerts(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (concert_id, tagged_user_id)
);
create index idx_buddies_tagged on concert_buddies(tagged_user_id, status);
create index idx_buddies_owner on concert_buddies(owner_id);

-- ============================================================
-- friendships
-- ============================================================
create table friendships (
  id          uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status      friendship_status not null default 'pending',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (requester_id <> addressee_id),
  unique (requester_id, addressee_id)
);
create index idx_friend_requester on friendships(requester_id, status);
create index idx_friend_addressee on friendships(addressee_id, status);

-- ============================================================
-- achievements
-- ============================================================
create table achievements (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text not null,
  rarity      achievement_rarity not null default 'common',
  criteria    jsonb not null default '{}'
);

create table user_achievements (
  user_id        uuid not null references profiles(id) on delete cascade,
  achievement_id uuid not null references achievements(id) on delete cascade,
  unlocked_at    timestamptz,
  progress       numeric(4,3) default 0,
  primary key (user_id, achievement_id)
);

-- ============================================================
-- wishlist
-- ============================================================
create table wishlist_artists (
  user_id    uuid not null references profiles(id) on delete cascade,
  artist_id  uuid not null references artists(id) on delete cascade,
  alerts_on  boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);

-- ============================================================
-- notifications + push
-- ============================================================
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  data       jsonb not null default '{}',
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id, created_at desc);

create table push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);
