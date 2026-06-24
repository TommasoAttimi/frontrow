-- ============================================================
-- FrontRow — 0008_save_festival.sql
-- Atomically create (concertId null) or replace a festival's full
-- day -> stage -> performance hierarchy in one transaction. Artist/venue refs
-- must already be resolved to ids by the client. SECURITY INVOKER so RLS
-- applies (owner only).
--
-- Payload shape:
-- {
--   "festival_name": text, "venue_id": uuid|null, "date": date,
--   "status": concert_status,
--   "days": [ { "date": date,
--     "stages": [ { "stage_name": text,
--       "performances": [ { "artist_id": uuid, "role": artist_role,
--                           "attended": bool, "start_time": time|null,
--                           "end_time": time|null } ] } ] } ]
-- }
-- ============================================================
create or replace function save_festival(p_concert_id uuid, p_payload jsonb)
returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  v_concert_id uuid;
  v_day jsonb; v_stage jsonb; v_perf jsonb;
  v_day_id uuid; v_stage_id uuid;
  d_order int := 0; s_order int := 0; p_order int := 0;
begin
  if p_concert_id is null then
    insert into concerts (user_id, type, status, date, venue_id, festival_name)
    values (
      auth.uid(), 'festival',
      coalesce((p_payload->>'status')::concert_status, 'attended'),
      (p_payload->>'date')::date,
      nullif(p_payload->>'venue_id', '')::uuid,
      p_payload->>'festival_name'
    )
    returning id into v_concert_id;
  else
    v_concert_id := p_concert_id;
    update concerts set
      status        = coalesce((p_payload->>'status')::concert_status, status),
      date          = (p_payload->>'date')::date,
      venue_id      = nullif(p_payload->>'venue_id', '')::uuid,
      festival_name = p_payload->>'festival_name'
    where id = v_concert_id and user_id = auth.uid();
    -- replace hierarchy (cascades to stages + performances)
    delete from festival_days where concert_id = v_concert_id;
  end if;

  for v_day in select * from jsonb_array_elements(coalesce(p_payload->'days', '[]'::jsonb)) loop
    insert into festival_days (concert_id, date, day_order)
    values (v_concert_id, (v_day->>'date')::date, d_order)
    returning id into v_day_id;
    d_order := d_order + 1;
    s_order := 0;

    for v_stage in select * from jsonb_array_elements(coalesce(v_day->'stages', '[]'::jsonb)) loop
      insert into festival_stages (concert_id, day_id, stage_name, stage_order)
      values (v_concert_id, v_day_id, v_stage->>'stage_name', s_order)
      returning id into v_stage_id;
      s_order := s_order + 1;
      p_order := 0;

      for v_perf in select * from jsonb_array_elements(coalesce(v_stage->'performances', '[]'::jsonb)) loop
        insert into performances
          (concert_id, stage_id, artist_id, role, start_time, end_time, attended, perf_order)
        values (
          v_concert_id, v_stage_id,
          (v_perf->>'artist_id')::uuid,
          coalesce((v_perf->>'role')::artist_role, 'headliner'),
          nullif(v_perf->>'start_time', '')::time,
          nullif(v_perf->>'end_time', '')::time,
          coalesce((v_perf->>'attended')::boolean, true),
          p_order
        );
        p_order := p_order + 1;
      end loop;
    end loop;
  end loop;

  return v_concert_id;
end; $$;

grant execute on function save_festival(uuid, jsonb) to authenticated, service_role;
