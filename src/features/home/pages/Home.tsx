import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { differenceInCalendarDays, parseISO, format } from 'date-fns'
import { Logo, Wordmark } from '@/components/brand/Logo'
import { AvatarTile } from '@/components/ui/AvatarTile'
import { Badge } from '@/components/ui/Badge'
import { ConcertCardSkeleton } from '@/components/ui/Skeleton'
import { useProfile } from '@/features/auth/hooks/useProfile'
import { useConcerts } from '@/features/concerts/hooks/useConcerts'
import { ConcertCard } from '@/features/concerts/components/ConcertCard'
import { getConcertStats } from '@/features/concerts/utils'
import { useUnreadCount } from '@/features/social/hooks/useNotifications'
import type { ConcertListItem } from '@/features/concerts/api/concerts'

function greetingFor(date = new Date()): string {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Home() {
  const { data: profile } = useProfile()
  const { data: concerts, isLoading } = useConcerts()
  const unread = useUnreadCount()

  const stats = useMemo(() => getConcertStats(concerts ?? []), [concerts])
  const upNext = useMemo(
    () =>
      (concerts ?? [])
        .filter((c) => c.status === 'planned')
        .sort((a, b) => a.date.localeCompare(b.date))[0],
    [concerts],
  )
  const recent = useMemo(
    () => (concerts ?? []).filter((c) => c.status === 'attended').slice(0, 4),
    [concerts],
  )

  const name = profile?.display_name || profile?.username || ''
  const year = new Date().getFullYear()

  return (
    <div className="px-6 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={34} />
          <Wordmark />
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
            className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.05]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="#f0eeeb"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {unread > 0 && (
              <span className="absolute right-[7px] top-[7px] h-[7px] w-[7px] rounded-full border-[1.5px] border-app bg-orange" />
            )}
          </Link>
          <Link to="/profile" aria-label="Profile">
            <AvatarTile name={name || 'FR'} size={36} radius={10} brand />
          </Link>
        </div>
      </div>

      {/* Greeting */}
      <div className="mt-5">
        <p className="font-body text-sm text-fg-faint">{greetingFor()},</p>
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-fg">
          {name}.
        </h1>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-4">
          <div className="h-[68px] rounded-2xl border border-border bg-white/[0.03]" />
          <ConcertCardSkeleton />
          <ConcertCardSkeleton />
        </div>
      ) : concerts && concerts.length > 0 ? (
        <>
          {/* Stats strip */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-white/[0.03] px-5 py-3.5">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-disabled">
              {year} so far
            </span>
            <div className="flex gap-5">
              <Stat value={stats.shows} label="shows" />
              <Stat value={stats.artists} label="artists" />
              <Stat value={stats.countries} label="countries" />
            </div>
          </div>

          {upNext && (
            <section className="mt-5">
              <SectionHeader title="Up Next" />
              <UpNextCard concert={upNext} />
            </section>
          )}

          <section className="mt-5">
            <SectionHeader title="Recently Logged" to="/shows" />
            <div className="flex flex-col gap-2.5">
              {recent.map((c) => (
                <ConcertCard key={c.id} concert={c} />
              ))}
            </div>
          </section>
        </>
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-xl font-extrabold tracking-[-0.5px] text-orange">{value}</p>
      <p className="mt-px font-body text-[10px] uppercase tracking-[0.05em] text-fg-disabled">
        {label}
      </p>
    </div>
  )
}

function SectionHeader({ title, to }: { title: string; to?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-disabled">
        {title}
      </p>
      {to && (
        <Link to={to} className="font-body text-xs text-orange">
          See all
        </Link>
      )}
    </div>
  )
}

function UpNextCard({ concert }: { concert: ConcertListItem }) {
  const days = differenceInCalendarDays(parseISO(concert.date), new Date())
  const away = days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days away`
  const title =
    concert.type === 'festival' && concert.festival_name
      ? concert.festival_name
      : (concert.headliner?.name ?? 'Untitled show')

  return (
    <Link
      to={`/show/${concert.id}`}
      className="relative block overflow-hidden rounded-[20px] border border-orange/[0.18] bg-orange/[0.07] p-[18px]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-orange opacity-[0.12]"
        style={{ filter: 'blur(60px)' }}
      />
      <div className="relative mb-2.5 flex items-start justify-between">
        {concert.type === 'festival' ? (
          <Badge tone="orange" className="border border-orange/35">
            Festival
          </Badge>
        ) : (
          <span />
        )}
        <span className="flex h-[26px] items-center rounded-lg bg-orange/20 px-2.5 font-body text-[11px] font-semibold text-orange">
          {away}
        </span>
      </div>
      <h3 className="relative font-display text-[22px] font-extrabold tracking-[-0.4px] text-fg">
        {title}
      </h3>
      <div className="relative mt-1.5 flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#6a6882" strokeWidth="2.2" />
          <circle cx="12" cy="10" r="3" stroke="#6a6882" strokeWidth="2.2" />
        </svg>
        <span className="font-body text-[13px] text-fg-faint">
          {concert.venue
            ? [concert.venue.name, concert.venue.city].filter(Boolean).join(' · ')
            : format(parseISO(concert.date), 'd MMM yyyy')}
        </span>
      </div>
    </Link>
  )
}
