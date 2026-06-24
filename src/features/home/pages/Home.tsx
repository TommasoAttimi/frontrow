import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from '@/components/brand/Logo'
import { ConcertCardSkeleton } from '@/components/ui/Skeleton'
import { useProfile } from '@/features/auth/hooks/useProfile'
import { useConcerts } from '@/features/concerts/hooks/useConcerts'
import { ConcertCard } from '@/features/concerts/components/ConcertCard'
import { getConcertStats, getOnThisDay } from '@/features/concerts/utils'
import { StatsStrip } from '../components/StatsStrip'
import { OnThisDayWidget } from '../components/OnThisDayWidget'

export function Home() {
  const { data: profile } = useProfile()
  const { data: concerts, isLoading } = useConcerts()

  const stats = useMemo(() => getConcertStats(concerts ?? []), [concerts])
  const onThisDay = useMemo(() => getOnThisDay(concerts ?? []), [concerts])
  const recent = (concerts ?? []).slice(0, 4)

  return (
    <div className="px-6 pt-10">
      <Wordmark />
      <p className="mt-8 font-body text-sm text-fg-subtle">
        Welcome back, <span className="text-fg">@{profile?.username}</span>
      </p>

      {isLoading ? (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[72px] rounded-xl border border-border bg-card" />
            ))}
          </div>
          <ConcertCardSkeleton />
          <ConcertCardSkeleton />
        </div>
      ) : concerts && concerts.length > 0 ? (
        <div className="mt-6 space-y-6">
          <StatsStrip stats={stats} />
          <OnThisDayWidget concerts={onThisDay} />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
                Recent shows
              </h2>
              <Link to="/shows" className="font-body text-xs font-medium text-orange">
                See all
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recent.map((c) => (
                <ConcertCard key={c.id} concert={c} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border-strong p-8 text-center">
          <p className="font-display text-lg font-bold text-fg">Your front row awaits</p>
          <p className="mt-2 font-body text-sm text-fg-subtle">
            Tap the <span className="text-orange">＋</span> below to log your first show. 🎸
          </p>
        </div>
      )}
    </div>
  )
}
