import { useNavigate } from 'react-router-dom'
import { BackHeader } from '@/components/layout/BackHeader'
import { ConcertForm } from '../components/ConcertForm'
import { useCreateConcert } from '../hooks/useConcertMutations'
import { todayISO } from '@/lib/utils/dates'
import { toast } from '@/stores/useUIStore'
import type { ConcertFormValues } from '../schemas'

const EMPTY: ConcertFormValues = {
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
  const create = useCreateConcert()

  function onSubmit(values: ConcertFormValues) {
    create.mutate(values, {
      onSuccess: (concert) => {
        toast.success('Show logged')
        navigate(`/show/${concert.id}`, { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not save show'),
    })
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title="Log a Show" />
      <ConcertForm
        defaultValues={EMPTY}
        submitLabel="Save show"
        loading={create.isPending}
        onSubmit={onSubmit}
      />
    </div>
  )
}
