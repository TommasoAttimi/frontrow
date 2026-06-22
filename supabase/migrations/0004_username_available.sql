-- ============================================================
-- FrontRow — 0004_username_available.sql
-- Case-insensitive username availability check that bypasses RLS
-- (so a username taken by a private profile still reads as unavailable).
-- ============================================================
create or replace function username_available(name citext) returns boolean
language sql security definer stable set search_path = public as $$
  select (name ~ '^[A-Za-z0-9_]{3,20}$')
     and not exists (select 1 from profiles where username = name);
$$;
