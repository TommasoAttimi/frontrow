import type { ArtistRole } from '@/types/domain'
import type { ArtistRef, VenueRef } from './schemas'
import type { ConcertDetail } from './api/concerts'

export interface PerfDraft {
  key: string
  artist: ArtistRef | null
  role: ArtistRole
  attended: boolean
  start_time: string
  end_time: string
}

export interface StageDraft {
  key: string
  stage_name: string
  performances: PerfDraft[]
}

export interface DayDraft {
  key: string
  date: string
  stages: StageDraft[]
}

export interface FestivalDraft {
  festival_name: string
  status: 'attended' | 'planned' | 'wishlist'
  venue: VenueRef | null
  days: DayDraft[]
}

const key = () => crypto.randomUUID()

export const newPerf = (artist: ArtistRef): PerfDraft => ({
  key: key(),
  artist,
  role: 'headliner',
  attended: true,
  start_time: '',
  end_time: '',
})

export const newStage = (): StageDraft => ({
  key: key(),
  stage_name: '',
  performances: [],
})

export const newDay = (date: string): DayDraft => ({
  key: key(),
  date,
  stages: [newStage()],
})

export function emptyFestivalDraft(date: string): FestivalDraft {
  return {
    festival_name: '',
    status: 'attended',
    venue: null,
    days: [newDay(date)],
  }
}

/** Build an editable draft from a loaded festival concert. */
export function festivalToDraft(detail: ConcertDetail): FestivalDraft {
  const days = [...detail.festival_days]
    .sort((a, b) => a.day_order - b.day_order)
    .map((d) => ({
      key: d.id,
      date: d.date,
      stages: [...d.stages]
        .sort((a, b) => a.stage_order - b.stage_order)
        .map((s) => ({
          key: s.id,
          stage_name: s.stage_name,
          performances: [...s.performances]
            .sort((a, b) => a.perf_order - b.perf_order)
            .map((p) => ({
              key: p.id,
              artist: { id: p.artist.id, name: p.artist.name },
              role: p.role,
              attended: p.attended,
              start_time: p.start_time ?? '',
              end_time: p.end_time ?? '',
            })),
        })),
    }))

  return {
    festival_name: detail.festival_name ?? '',
    status: detail.status,
    venue: detail.venue_full
      ? {
          id: detail.venue_full.id,
          name: detail.venue_full.name,
          city: detail.venue_full.city,
          country: detail.venue_full.country,
          country_name: detail.venue_full.country_name,
        }
      : null,
    days: days.length > 0 ? days : [newDay(detail.date)],
  }
}
