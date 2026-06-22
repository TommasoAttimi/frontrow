-- ============================================================
-- FrontRow — 0003_harden_set_updated_at.sql
-- Pin search_path on the trigger function (security advisor 0011).
-- ============================================================
create or replace function set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
