import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '@/components/layout/BackHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { ConcertForm } from '../components/ConcertForm'
import { FestivalForm } from '../components/FestivalForm'
import { useCreateConcert } from '../hooks/useConcertMutations'
import { useSaveFestival } from '../hooks/useFestivalMutations'
import { emptyFestivalDraft } from '../festival'
import { todayISO } from '@/lib/utils/dates'
import { toast } from '@/stores/useUIStore'
import type { ConcertFormValues } from '../schemas'
import type { FestivalDraft } from '../festival'

const EMPTY_CONCERT: ConcertFormValues = {
  type: 'concert',
  status: 'attended',
  date: todayISO(),
  headliner: null,
  supports: [],
  venue: null,
  festival_name: '',
  tour_name: '',
  ticket_type: '',
  ticket_price_paid: '',
  ticket_currency: '',
  personal_note: '',
  is_accredited: false,
  accred_type: '',
  accred_client: '',
  accred_photo_pit: false,
  accred_first_3_songs: false,
}

export function LogShow() {
  const navigate = useNavigate()
  const [type, setType] = useState<'concert' | 'festival'>('concert')
  const createConcert = useCreateConcert()
  const saveFestival = useSaveFestival()

  function onConcertSubmit(values: ConcertFormValues) {
    createConcert.mutate(values, {
      onSuccess: (concert) => {
        toast.success('Show logged')
        navigate(`/show/${concert.id}`, { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not save show'),
    })
  }

  function onFestivalSubmit(draft: FestivalDraft) {
    saveFestival.mutate(draft, {
      onSuccess: (id) => {
        toast.success('Festival logged')
        navigate(`/show/${id}`, { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not save festival'),
    })
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title="Log a Show" />
      <div className="px-6 pt-4">
        <SegmentedControl
          label="Type"
          value={type}
          onChange={setType}
          options={[
            { value: 'concert', label: 'Concert' },
            { value: 'festival', label: 'Festival' },
          ]}
        />
      </div>

      {type === 'concert' ? (
        <ConcertForm
          defaultValues={EMPTY_CONCERT}
          submitLabel="Save show"
          loading={createConcert.isPending}
          onSubmit={onConcertSubmit}
        />
      ) : (
        <FestivalForm
          initial={emptyFestivalDraft(todayISO())}
          submitLabel="Save festival"
          loading={saveFestival.isPending}
          onSubmit={onFestivalSubmit}
        />
      )}
    </div>
  )
}
