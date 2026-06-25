import { useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { useConcerts } from '@/features/concerts/hooks/useConcerts'
import { getConcertStats } from '@/features/concerts/utils'

export function Stats() {
  const { data: concerts } = useConcerts()
  const stats = useMemo(() => getConcertStats(concerts ?? []), [concerts])

  const items = [
    { value: stats.shows, label: 'Shows' },
    { value: stats.artists, label: 'Artists' },
    { value: stats.venues, label: 'Venues' },
    { value: stats.countries, label: 'Countries' },
  ]

  return (
    <div className="px-6 pt-4">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-0.6px] text-fg">Stats</h1>

      <div className="mt-6 flex overflow-hidden rounded-2xl border border-border bg-white/[0.03]">
        {items.map((s, i) => (
          <div
            key={s.label}
            className={cn('flex-1 px-2 py-4 text-center', i < items.length - 1 && 'border-r border-border')}
          >
            <p className="font-display text-2xl font-extrabold tracking-[-0.5px] text-orange">
              {s.value}
            </p>
            <p className="mt-1 font-body text-[10px] uppercase tracking-[0.04em] text-fg-disabled">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-border-strong p-8 text-center">
        <p className="font-body text-sm text-fg-subtle">
          Charts, top artists, and Year Wrapped arrive in Sprint 7.
        </p>
      </div>
    </div>
  )
}
