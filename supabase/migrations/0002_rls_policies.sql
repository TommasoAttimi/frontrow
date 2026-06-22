-- ============================================================
-- FrontRow — 0002_rls_policies.sql
-- ============================================================

-- ---------- RLS helper functions ----------
create or replace function is_concert_owner(cid uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from concerts where id = cid and user_id = auth.uid());
$$;

create or replace function can_read_concert(cid uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from concerts c where c.id = cid and (
      c.user_id = auth.uid()
      or (c.status = 'attended'
          and exists (select 1 from profiles p where p.id = c.user_id and p.is_public))
      or exists (select 1 from concert_buddies b
                 where b.concert_id = c.id
                   and b.tagged_user_id = auth.uid()
                   and b.status = 'confirmed')
    )
  );
$$;

-- ---------- enable RLS ----------
alter table profiles          enable row level security;
alter table concerts          enable row level security;
alter table concert_artists   enable row level security;
alter table festival_days     enable row level security;
alter table festival_stages   enable row level security;
alter table performances      enable row level security;
alter table setlist_songs     enable row level security;
alter table concert_buddies   enable row level security;
alter table friendships       enable row level security;
alter table user_achievements enable row level security;
alter table wishlist_artists  enable row level security;
alter table notifications     enable row level security;
alter table push_subscriptions enable row level security;
alter table artists           enable row level security;
alter table venues            enable row level security;
alter table tours             enable row level security;
alter table achievements      enable row level security;

-- ---------- profiles ----------
create policy profiles_read on profiles for select
  using (id = auth.uid() or is_public = true);
create policy profiles_insert on profiles for insert
  with check (id = auth.uid());
create policy profiles_update on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------- shared catalogs ----------
create policy artists_read on artists for select using (auth.role() = 'authenticated');
create policy artists_insert on artists for insert with check (auth.role() = 'authenticated');
create policy venues_read on venues for select using (auth.role() = 'authenticated');
create policy venues_insert on venues for insert with check (auth.role() = 'authenticated');
create policy tours_read on tours for select using (auth.role() = 'authenticated');
create policy tours_insert on tours for insert with check (auth.role() = 'authenticated');
create policy achievements_read on achievements for select using (auth.role() = 'authenticated');

-- ---------- concerts ----------
create policy concerts_read on concerts for select using (can_read_concert(id));
create policy concerts_insert on concerts for insert with check (user_id = auth.uid());
create policy concerts_update on concerts for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy concerts_delete on concerts for delete using (user_id = auth.uid());

-- ---------- concert children ----------
create policy ca_read   on concert_artists for select using (can_read_concert(concert_id));
create policy ca_write  on concert_artists for all
  using (is_concert_owner(concert_id)) with check (is_concert_owner(concert_id));

create policy fd_read   on festival_days for select using (can_read_concert(concert_id));
create policy fd_write  on festival_days for all
  using (is_concert_owner(concert_id)) with check (is_concert_owner(concert_id));

create policy fs_read   on festival_stages for select using (can_read_concert(concert_id));
create policy fs_write  on festival_stages for all
  using (is_concert_owner(concert_id)) with check (is_concert_owner(concert_id));

create policy pf_read   on performances for select using (can_read_concert(concert_id));
create policy pf_write  on performances for all
  using (is_concert_owner(concert_id)) with check (is_concert_owner(concert_id));

create policy sl_read   on setlist_songs for select using (can_read_concert(concert_id));
create policy sl_write  on setlist_songs for all
  using (is_concert_owner(concert_id)) with check (is_concert_owner(concert_id));

-- ---------- concert buddies ----------
create policy buddies_read on concert_buddies for select
  using (owner_id = auth.uid() or tagged_user_id = auth.uid());
create policy buddies_insert on concert_buddies for insert
  with check (owner_id = auth.uid() and is_concert_owner(concert_id));
create policy buddies_owner_update on concert_buddies for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy buddies_tagged_update on concert_buddies for update
  using (tagged_user_id = auth.uid())
  with check (tagged_user_id = auth.uid());
create policy buddies_delete on concert_buddies for delete
  using (owner_id = auth.uid());

-- ---------- friendships ----------
create policy friend_read on friendships for select
  using (requester_id = auth.uid() or addressee_id = auth.uid());
create policy friend_insert on friendships for insert
  with check (requester_id = auth.uid());
create policy friend_update on friendships for update
  using (requester_id = auth.uid() or addressee_id = auth.uid())
  with check (requester_id = auth.uid() or addressee_id = auth.uid());
create policy friend_delete on friendships for delete
  using (requester_id = auth.uid() or addressee_id = auth.uid());

-- ---------- per-user owned rows ----------
create policy ua_rw on user_achievements for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy wl_rw on wishlist_artists for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notif_read on notifications for select using (user_id = auth.uid());
create policy notif_update on notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy push_rw on push_subscriptions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
