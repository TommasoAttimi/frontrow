import { Link } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import { useSetlist } from '../hooks/useSetlist'

export function SetlistTab({
  concertId,
  syncedFromSetlistFm,
}: {
  concertId: string
  syncedFromSetlistFm: boolean
}) {
  const { data: songs, isLoading } = useSetlist(concertId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-orange">
        <Spinner size={24} />
      </div>
    )
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-strong p-8 text-center">
        <p className="font-body text-sm text-fg-subtle">No setlist yet.</p>
        <Link
          to={`/show/${concertId}/setlist`}
          className="mt-4 inline-flex h-10 items-center rounded-xl bg-orange px-5 font-display text-sm font-bold text-white"
        >
          Add setlist
        </Link>
      </div>
    )
  }

  const main = songs.filter((s) => !s.is_encore)
  const encore = songs.filter((s) => s.is_encore)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        {syncedFromSetlistFm ? (
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[#f5a623] font-display text-[8px] font-extrabold text-white">
              sl
            </span>
            <span className="font-body text-[13px] text-fg-muted">Synced from setlist.fm</span>
          </div>
        ) : (
          <span className="font-body text-[13px] text-fg-subtle">{songs.length} songs</span>
        )}
        <Link
          to={`/show/${concertId}/setlist`}
          className="font-body text-xs font-medium text-orange"
        >
          Edit
        </Link>
      </div>

      <ol>
        {main.map((s) => (
          <SongRow key={s.id} n={s.position} title={s.title} note={s.note} />
        ))}
      </ol>

      {encore.length > 0 && (
        <>
          <div className="flex items-center gap-3 py-3.5 pb-1.5">
            <span className="h-px flex-1 bg-border-strong" />
            <span className="font-body text-[11px] uppercase tracking-[0.1em] text-fg-disabled">
              Encore
            </span>
            <span className="h-px flex-1 bg-border-strong" />
          </div>
          <ol>
            {encore.map((s) => (
              <SongRow key={s.id} n={s.position} title={s.title} note={s.note} encore />
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

function SongRow({
  n,
  title,
  note,
  encore,
}: {
  n: number
  title: string
  note: string | null
  encore?: boolean
}) {
  return (
    <li className="flex items-center gap-3.5 border-b border-white/[0.04] py-[11px]">
      <span className="w-5 flex-none text-right font-body text-[13px] tabular-nums text-fg-disabled">
        {n}
      </span>
      <p
        className={cn(
          'flex-1 font-display text-[15px] tracking-[-0.2px]',
          encore ? 'font-bold text-orange' : 'font-semibold text-fg',
        )}
      >
        {title}
      </p>
      {note && (
        <span className="flex h-[18px] flex-none items-center rounded-[5px] border border-orange/25 bg-orange/[0.14] px-[7px] font-body text-[9px] font-semibold text-orange">
          {note}
        </span>
      )}
    </li>
  )
}
