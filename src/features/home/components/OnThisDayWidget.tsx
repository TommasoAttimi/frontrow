import { Link } from 'react-router-dom'
import { parseISO } from 'date-fns'
import type { ConcertListItem } from '@/features/concerts/api/concerts'

export function OnThisDayWidget({ concerts }: { concerts: ConcertListItem[] }) {
  if (concerts.length === 0) return null

  const top = concerts[0]
  const yearsAgo = new Date().getFullYear() - parseISO(top.date).getFullYear()
  const title =
    top.type === 'festival' && top.festival_name
      ? top.festival_name
      : (top.headliner?.name ?? 'A show')

  return (
    <Link
      to="/on-this-day"
      className="block rounded-2xl border border-border-accent bg-orange-dim p-4 transition active:scale-[0.99]"
    >
      <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-orange">
        On this day
      </span>
      <p className="mt-1 font-display text-base font-bold text-fg">{title}</p>
      <p className="font-body text-sm text-fg-subtle">
        {yearsAgo === 0 ? 'Earlier today' : `${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago`}
        {top.venue ? ` · ${top.venue.name}` : ''}
      </p>
      {concerts.length > 1 && (
        <p className="mt-1 font-body text-xs text-fg-subtle">
          +{concerts.length - 1} more memory{concerts.length - 1 === 1 ? '' : 's'}
        </p>
      )}
    </Link>
  )
}
