import { useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '@/components/layout/BackHeader'
import { Spinner } from '@/components/ui/Spinner'
import { ConcertForm } from '../components/ConcertForm'
import { FestivalForm } from '../components/FestivalForm'
import { useConcert } from '../hooks/useConcerts'
import { useUpdateConcert } from '../hooks/useConcertMutations'
import { useSaveFestival } from '../hooks/useFestivalMutations'
import { concertToForm } from '../mappers'
import { festivalToDraft } from '../festival'
import { toast } from '@/stores/useUIStore'
import type { ConcertFormValues } from '../schemas'
import type { FestivalDraft } from '../festival'

export function EditConcert() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useConcert(id)
  const updateConcert = useUpdateConcert(id as string)
  const saveFestival = useSaveFestival(id as string)

  function onConcertSubmit(values: ConcertFormValues) {
    updateConcert.mutate(values, {
      onSuccess: () => {
        toast.success('Show updated')
        navigate(`/show/${id}`, { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not update show'),
    })
  }

  function onFestivalSubmit(draft: FestivalDraft) {
    saveFestival.mutate(draft, {
      onSuccess: () => {
        toast.success('Festival updated')
        navigate(`/show/${id}`, { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not update festival'),
    })
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title={data?.type === 'festival' ? 'Edit Festival' : 'Edit Show'} />
      {isLoading || !data ? (
        <div className="flex justify-center py-20 text-orange">
          <Spinner size={28} />
        </div>
      ) : data.type === 'festival' ? (
        <FestivalForm
          initial={festivalToDraft(data)}
          submitLabel="Save changes"
          loading={saveFestival.isPending}
          onSubmit={onFestivalSubmit}
        />
      ) : (
        <ConcertForm
          defaultValues={concertToForm(data)}
          submitLabel="Save changes"
          loading={updateConcert.isPending}
          onSubmit={onConcertSubmit}
        />
      )}
    </div>
  )
}
