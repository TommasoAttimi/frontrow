-- ============================================================
-- FrontRow — 0005_grant_role_privileges.sql
-- Table-level privileges for the API roles. RLS policies still govern which
-- rows each user can see/modify; these grants govern table access itself.
-- (Supabase normally auto-grants these; tables created via MCP migrations did
-- not pick them up, causing "permission denied for table" before RLS runs.)
-- ============================================================
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant all on all tables in schema public to service_role;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

-- Ensure future tables/functions created in this schema inherit the same grants.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant all on tables to service_role;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant execute on functions to anon, authenticated, service_role;
