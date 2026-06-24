import { useMutation, useQueryClient } from '@tanstack/react-query'
import { findOrCreateArtist, findOrCreateVenue } from '../api/catalog'
import { saveFestival, type FestivalPayload } from '../api/concerts'
import { todayISO } from '@/lib/utils/dates'
import type { FestivalDraft } from '../festival'

async function buildFestivalPayload(draft: FestivalDraft): Promise<FestivalPayload> {
  const venue_id = draft.venue
    ? draft.venue.id ??
      (
        await findOrCreateVenue({
          name: draft.venue.name,
          city: draft.venue.city as string,
          country: draft.venue.country as string,
          country_name: draft.venue.country_name as string,
        })
      ).id
    : null

  const days: FestivalPayload['days'] = []
  for (const d of draft.days) {
    const stages: FestivalPayload['days'][number]['stages'] = []
    for (const s of d.stages) {
      const performances: FestivalPayload['days'][number]['stages'][number]['performances'] = []
      for (const p of s.performances) {
        if (!p.artist) continue
        const artist_id = p.artist.id ?? (await findOrCreateArtist(p.artist.name)).id
        performances.push({
          artist_id,
          role: p.role,
          attended: p.attended,
          start_time: p.start_time || null,
          end_time: p.end_time || null,
        })
      }
      stages.push({ stage_name: s.stage_name.trim() || 'Main Stage', performances })
    }
    days.push({ date: d.date, stages })
  }

  const date =
    draft.days
      .map((d) => d.date)
      .filter(Boolean)
      .sort()[0] ?? todayISO()

  return {
    festival_name: draft.festival_name.trim(),
    venue_id,
    date,
    status: draft.status,
    days,
  }
}

export function useSaveFestival(concertId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (draft: FestivalDraft) => {
      const payload = await buildFestivalPayload(draft)
      return saveFestival(concertId ?? null, payload)
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['concerts'] })
      queryClient.invalidateQueries({ queryKey: ['concert', id] })
    },
  })
}
