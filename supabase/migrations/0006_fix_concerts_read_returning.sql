-- ============================================================
-- FrontRow — 0006_fix_concerts_read_returning.sql
-- can_read_concert() is STABLE, so during INSERT ... RETURNING it evaluates
-- against a pre-insert snapshot and cannot see the just-inserted row — which
-- made PostgREST's `insert().select()` fail with an RLS error even though the
-- WITH CHECK passed. Inline the owner check (evaluated directly on the new row)
-- so owners can always read their rows, including the RETURNING representation.
-- ============================================================
drop policy concerts_read on concerts;

create policy concerts_read on concerts for select using (
  user_id = auth.uid()
  or (
    status = 'attended'
    and exists (select 1 from profiles p where p.id = concerts.user_id and p.is_public)
  )
  or exists (
    select 1 from concert_buddies b
    where b.concert_id = concerts.id
      and b.tagged_user_id = auth.uid()
      and b.status = 'confirmed'
  )
);
