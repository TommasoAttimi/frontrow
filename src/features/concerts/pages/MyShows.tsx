import { useMemo, useState } from 'react'
import { ConcertCardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { useConcerts } from '../hooks/useConcerts'
import { ConcertCard } from '../components/ConcertCard'
import { groupConcertsByYear } from '../utils'

type Filter = 'all' | 'concert' | 'festival'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'concert', label: 'Concerts' },
  { value: 'festival', label: 'Festivals' },
]

export function MyShows() {
  const { data: concerts, isLoading } = useConcerts()
  const [filter, setFilter] = useState<Filter>('all')

  const groups = useMemo(() => {
    const list = (concerts ?? []).filter((c) => filter === 'all' || c.type === filter)
    return groupConcertsByYear(list)
  }, [concerts, filter])

  return (
    <div className="px-6 pt-10">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-0.6px] text-fg">
        My Shows
      </h1>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'h-8 rounded-lg px-3 font-body text-[13px] font-medium transition',
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
        <div className="mt-6 space-y-3">
          <ConcertCardSkeleton />
          <ConcertCardSkeleton />
          <ConcertCardSkeleton />
        </div>
      ) : groups.length > 0 ? (
        <div className="mt-6 space-y-7">
          {groups.map((group) => (
            <section key={group.year}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-lg font-extrabold text-fg">{group.year}</h2>
                <span className="font-body text-xs text-fg-subtle">
                  {group.items.length} show{group.items.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {group.items.map((c) => (
                  <ConcertCard key={c.id} concert={c} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border-strong p-8 text-center">
          <p className="font-body text-sm text-fg-subtle">
            {filter === 'all'
              ? 'No shows logged yet.'
              : `No ${filter === 'concert' ? 'concerts' : 'festivals'} yet.`}
          </p>
        </div>
      )}
    </div>
  )
}
