import { useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '@/components/layout/BackHeader'
import { Spinner } from '@/components/ui/Spinner'
import { ConcertForm } from '../components/ConcertForm'
import { useConcert } from '../hooks/useConcerts'
import { useUpdateConcert } from '../hooks/useConcertMutations'
import { concertToForm } from '../mappers'
import { toast } from '@/stores/useUIStore'
import type { ConcertFormValues } from '../schemas'

export function EditConcert() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useConcert(id)
  const update = useUpdateConcert(id as string)

  function onSubmit(values: ConcertFormValues) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success('Show updated')
        navigate(`/show/${id}`, { replace: true })
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not update show'),
    })
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title="Edit Show" />
      {isLoading || !data ? (
        <div className="flex justify-center py-20 text-orange">
          <Spinner size={28} />
        </div>
      ) : (
        <ConcertForm
          defaultValues={concertToForm(data)}
          submitLabel="Save changes"
          loading={update.isPending}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}
