import { useMemo } from 'react'
import { useConcerts } from '@/features/concerts/hooks/useConcerts'
import { getConcertStats } from '@/features/concerts/utils'
import { StatsStrip } from '@/features/home/components/StatsStrip'

export function Stats() {
  const { data: concerts } = useConcerts()
  const stats = useMemo(() => getConcertStats(concerts ?? []), [concerts])

  return (
    <div className="px-6 pt-10">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-0.6px] text-fg">
        Stats
      </h1>
      <div className="mt-6">
        <StatsStrip stats={stats} />
      </div>
      <div className="mt-8 rounded-2xl border border-dashed border-border-strong p-8 text-center">
        <p className="font-body text-sm text-fg-subtle">
          Charts, top artists, and Year Wrapped arrive in Sprint 7.
        </p>
      </div>
    </div>
  )
}
