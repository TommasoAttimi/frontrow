import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '@/components/layout/BackHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useConcert } from '../hooks/useConcerts'
import { useDeleteConcert } from '../hooks/useConcertMutations'
import { formatConcertDate } from '@/lib/utils/dates'
import { toast } from '@/stores/useUIStore'
import type { ConcertDetail as ConcertDetailData } from '../api/concerts'

const TABS = ['Info', 'Setlist', 'Photos', 'Notes'] as const
type Tab = (typeof TABS)[number]

const ROLE_LABEL: Record<string, string> = {
  headliner: 'Headliner',
  support: 'Support',
  special_guest: 'Special guest',
  opener: 'Opener',
}

export function ConcertDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useConcert(id)
  const del = useDeleteConcert()
  const [tab, setTab] = useState<Tab>('Info')

  function handleDelete() {
    if (!id) return
    if (!window.confirm('Delete this show? This cannot be undone.')) return
    del.mutate(id, {
      onSuccess: () => {
        toast.success('Show deleted')
        navigate('/home', { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not delete show'),
    })
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[440px]">
        <BackHeader />
        <div className="flex justify-center py-20 text-orange">
          <Spinner size={28} />
        </div>
      </div>
    )
  }

  const title =
    data.type === 'festival' && data.festival_name
      ? data.festival_name
      : (data.headliner?.name ?? 'Untitled show')

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] pb-10">
      <BackHeader
        right={
          <Link
            to={`/show/${id}/edit`}
            className="px-2 font-body text-sm font-medium text-orange"
          >
            Edit
          </Link>
        }
      />

      {/* Hero */}
      <div className="px-6 pt-2">
        <span className="font-body text-xs uppercase tracking-[0.08em] text-fg-subtle">
          {data.type}
          {data.status !== 'attended' ? ` · ${data.status}` : ''}
        </span>
        <h1 className="mt-1 font-display text-[28px] font-extrabold leading-tight tracking-[-0.5px] text-fg">
          {title}
        </h1>
        <p className="mt-2 font-body text-sm text-fg-muted">
          {data.venue
            ? [data.venue.name, data.venue.city, data.venue.country_name]
                .filter(Boolean)
                .join(' · ')
            : '—'}
        </p>
        <p className="mt-1 font-body text-sm text-fg-subtle">
          {formatConcertDate(data.date)}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-border px-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? 'border-b-2 border-orange px-3 py-2 font-body text-sm font-semibold text-fg'
                : 'border-b-2 border-transparent px-3 py-2 font-body text-sm text-fg-subtle'
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-6 py-5">
        {tab === 'Info' && <InfoTab data={data} />}
        {tab === 'Setlist' && <Placeholder text="Setlist tracking arrives in Sprint 5." />}
        {tab === 'Photos' && <Placeholder text="Photo uploads arrive in Sprint 5." />}
        {tab === 'Notes' && (
          <p className="whitespace-pre-wrap font-body text-sm text-fg-muted">
            {data.personal_note || 'No notes yet.'}
          </p>
        )}
      </div>

      <div className="px-6">
        <Button variant="destructive" fullWidth loading={del.isPending} onClick={handleDelete}>
          Delete show
        </Button>
      </div>
    </div>
  )
}

function InfoTab({ data }: { data: ConcertDetailData }) {
  const lineup = [...data.lineup].sort((a, b) => a.billing_order - b.billing_order)
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
          Lineup
        </h2>
        <ul className="space-y-1.5">
          {lineup.map((l) => (
            <li
              key={l.artist.id}
              className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
            >
              <span className="font-body text-sm text-fg">{l.artist.name}</span>
              <span className="font-body text-xs text-fg-subtle">
                {ROLE_LABEL[l.role] ?? l.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {(data.tour_name || data.ticket_type || data.ticket_price_paid != null) && (
        <section className="space-y-2">
          {data.tour_name && <Row label="Tour" value={data.tour_name} />}
          {data.ticket_type && <Row label="Ticket" value={data.ticket_type} />}
          {data.ticket_price_paid != null && (
            <Row
              label="Paid"
              value={`${data.ticket_price_paid}${data.ticket_currency ? ` ${data.ticket_currency}` : ''}`}
            />
          )}
        </section>
      )}

      {data.accred_type && (
        <section>
          <h2 className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
            Accreditation
          </h2>
          <div className="space-y-2">
            <Row label="Type" value={data.accred_type} />
            {data.accred_client && <Row label="Client" value={data.accred_client} />}
            <Row label="Photo pit" value={data.accred_photo_pit ? 'Yes' : 'No'} />
            <Row label="First 3 songs" value={data.accred_first_3_songs ? 'Yes' : 'No'} />
          </div>
        </section>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <span className="font-body text-sm text-fg-subtle">{label}</span>
      <span className="font-body text-sm text-fg">{value}</span>
    </div>
  )
}

function Placeholder({ text }: { text: string }) {
  return <p className="py-8 text-center font-body text-sm text-fg-subtle">{text}</p>
}
