import type { ConcertDetail } from './api/concerts'
import type { ConcertFormValues } from './schemas'
import type { TicketType } from '@/types/domain'

/** Maps a loaded concert (with lineup) back into form values for editing. */
export function concertToForm(detail: ConcertDetail): ConcertFormValues {
  const headlinerEntry = detail.lineup.find((l) => l.role === 'headliner')
  const supports = detail.lineup
    .filter((l) => l.role !== 'headliner')
    .sort((a, b) => a.billing_order - b.billing_order)
    .map((l) => ({
      artist: { id: l.artist.id, name: l.artist.name },
      role: l.role as 'support' | 'special_guest' | 'opener',
    }))

  return {
    type: detail.type,
    status: detail.status,
    date: detail.date,
    headliner: headlinerEntry
      ? { id: headlinerEntry.artist.id, name: headlinerEntry.artist.name }
      : detail.headliner
        ? { name: detail.headliner.name }
        : null,
    supports,
    venue: detail.venue_full
      ? {
          id: detail.venue_full.id,
          name: detail.venue_full.name,
          city: detail.venue_full.city,
          country: detail.venue_full.country,
          country_name: detail.venue_full.country_name,
        }
      : null,
    festival_name: detail.festival_name ?? '',
    tour_name: detail.tour_name ?? '',
    ticket_type: (detail.ticket_type as TicketType) ?? '',
    ticket_price_paid:
      detail.ticket_price_paid != null ? String(detail.ticket_price_paid) : '',
    ticket_currency: detail.ticket_currency ?? '',
    personal_note: detail.personal_note ?? '',
    is_accredited: !!detail.accred_type,
    accred_type: detail.accred_type ?? '',
    accred_client: detail.accred_client ?? '',
    accred_photo_pit: !!detail.accred_photo_pit,
    accred_first_3_songs: !!detail.accred_first_3_songs,
  }
}
