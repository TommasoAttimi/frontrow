import { Link } from 'react-router-dom'
import { formatConcertDate } from '@/lib/utils/dates'
import type { ConcertListItem } from '../api/concerts'

export function ConcertCard({ concert }: { concert: ConcertListItem }) {
  const title =
    concert.type === 'festival' && concert.festival_name
      ? concert.festival_name
      : (concert.headliner?.name ?? 'Untitled show')
  const sub = concert.venue
    ? [concert.venue.name, concert.venue.city].filter(Boolean).join(' · ')
    : '—'

  return (
    <Link
      to={`/show/${concert.id}`}
      className="block rounded-2xl border border-border bg-card p-4 transition active:scale-[0.99] hover:border-border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-bold text-fg">{title}</p>
          <p className="truncate font-body text-sm text-fg-subtle">{sub}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-body text-xs text-fg-faint">
            {formatConcertDate(concert.date)}
          </span>
          {concert.status !== 'attended' && (
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-body text-[10px] uppercase tracking-wide text-fg-subtle">
              {concert.status}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
