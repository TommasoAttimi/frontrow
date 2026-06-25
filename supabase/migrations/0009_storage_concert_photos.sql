-- ============================================================
-- FrontRow — 0009_storage_concert_photos.sql
-- Public Storage bucket for concert photos & ticket scans. Reads are public
-- (bucket is public); writes/deletes are restricted to each user's own
-- {uid}/... folder via storage.objects RLS.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('concert-photos', 'concert-photos', true)
on conflict (id) do nothing;

create policy "concert_photos_read" on storage.objects for select
  using (bucket_id = 'concert-photos');

create policy "concert_photos_insert" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'concert-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "concert_photos_update" on storage.objects for update to authenticated
  using (
    bucket_id = 'concert-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "concert_photos_delete" on storage.objects for delete to authenticated
  using (
    bucket_id = 'concert-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
