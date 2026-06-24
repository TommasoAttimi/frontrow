import type { ConcertStats } from '@/features/concerts/utils'

export function StatsStrip({ stats }: { stats: ConcertStats }) {
  const items = [
    { label: 'Shows', value: stats.shows },
    { label: 'Artists', value: stats.artists },
    { label: 'Venues', value: stats.venues },
    { label: 'Countries', value: stats.countries },
  ]
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((i) => (
        <div
          key={i.label}
          className="rounded-xl border border-border bg-card px-1 py-3 text-center"
        >
          <div className="font-display text-2xl font-extrabold leading-none text-fg">
            {i.value}
          </div>
          <div className="mt-1.5 font-body text-[10px] uppercase tracking-wide text-fg-subtle">
            {i.label}
          </div>
        </div>
      ))}
    </div>
  )
}
