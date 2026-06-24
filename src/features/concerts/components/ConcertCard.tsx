import { Link } from 'react-router-dom'
import { parseISO, format } from 'date-fns'
import { AvatarTile } from '@/components/ui/AvatarTile'
import { Badge } from '@/components/ui/Badge'
import type { ConcertListItem } from '../api/concerts'

export function ConcertCard({ concert }: { concert: ConcertListItem }) {
  const isFestival = concert.type === 'festival'
  const title =
    isFestival && concert.festival_name
      ? concert.festival_name
      : (concert.headliner?.name ?? 'Untitled show')
  const sub = concert.venue
    ? [concert.venue.name, concert.venue.city].filter(Boolean).join(' · ')
    : '—'

  const d = parseISO(concert.date)
  const badges = (
    <div className="flex flex-col items-end gap-1">
      {concert.status === 'planned' && <Badge tone="green">Upcoming</Badge>}
      {concert.status === 'wishlist' && <Badge tone="neutral">Wishlist</Badge>}
      {isFestival && <Badge tone="orange">Festival</Badge>}
    </div>
  )
  const showBadges = isFestival || concert.status !== 'attended'

  return (
    <Link
      to={`/show/${concert.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] px-4 py-3.5 transition active:scale-[0.99] hover:border-border-accent"
    >
      <AvatarTile name={title} size={52} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-bold tracking-[-0.2px] text-fg">
          {title}
        </p>
        <p className="mt-0.5 truncate font-body text-xs text-fg-faint">{sub}</p>
      </div>
      {showBadges ? (
        badges
      ) : (
        <div className="shrink-0 text-right">
          <p className="font-body text-[11px] text-fg-disabled">{format(d, 'MMM d')}</p>
          <p className="mt-0.5 font-body text-[10px] text-[#3a3a50]">{format(d, 'yyyy')}</p>
        </div>
      )}
    </Link>
  )
}
