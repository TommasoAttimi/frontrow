import { useMemo, useState } from 'react'
import { ConcertCardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { useConcerts } from '../hooks/useConcerts'
import { ConcertCard } from '../components/ConcertCard'
import { groupConcertsByYear } from '../utils'
import type { ConcertListItem } from '../api/concerts'

type Filter = 'all' | 'concert' | 'festival' | 'upcoming' | 'wishlist'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'concert', label: 'Concerts' },
  { value: 'festival', label: 'Festivals' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'wishlist', label: 'Wishlist' },
]

function matches(c: ConcertListItem, f: Filter): boolean {
  switch (f) {
    case 'all':
      return true
    case 'concert':
      return c.type === 'concert'
    case 'festival':
      return c.type === 'festival'
    case 'upcoming':
      return c.status === 'planned'
    case 'wishlist':
      return c.status === 'wishlist'
  }
}

export function MyShows() {
  const { data: concerts, isLoading } = useConcerts()
  const [filter, setFilter] = useState<Filter>('all')

  const groups = useMemo(
    () => groupConcertsByYear((concerts ?? []).filter((c) => matches(c, filter))),
    [concerts, filter],
  )

  return (
    <div className="px-6 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[32px] font-extrabold tracking-[-0.6px] text-fg">
          My Shows
        </h1>
        <div className="flex items-center gap-2">
          <IconButton label="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="#f0eeeb" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="#f0eeeb" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </IconButton>
          <IconButton label="Filter">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 5h18l-7 8v6l-4-2v-4z"
                stroke="#f0eeeb"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        </div>
      </div>

      <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'h-9 shrink-0 rounded-[10px] px-4 font-body text-[13px] font-medium transition',
              filter === f.value
                ? 'bg-orange text-white'
                : 'border border-white/[0.08] bg-white/[0.05] text-fg-subtle',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-2.5">
          <ConcertCardSkeleton />
          <ConcertCardSkeleton />
          <ConcertCardSkeleton />
        </div>
      ) : groups.length > 0 ? (
        <div className="mt-6 space-y-7">
          {groups.map((group) => (
            <section key={group.year}>
              <div className="mb-3 flex items-baseline gap-2">
                <h2 className="font-display text-lg font-extrabold text-fg">{group.year}</h2>
                <span className="font-body text-xs text-fg-disabled">
                  {group.items.length} show{group.items.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {group.items.map((c) => (
                  <ConcertCard key={c.id} concert={c} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border-strong p-8 text-center">
          <p className="font-body text-sm text-fg-subtle">Nothing here yet.</p>
        </div>
      )}
    </div>
  )
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]"
    >
      {children}
    </button>
  )
}
