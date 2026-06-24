import { useMemo } from 'react'
import { format } from 'date-fns'
import { BackHeader } from '@/components/layout/BackHeader'
import { Spinner } from '@/components/ui/Spinner'
import { useConcerts } from '@/features/concerts/hooks/useConcerts'
import { ConcertCard } from '@/features/concerts/components/ConcertCard'
import { getOnThisDay } from '@/features/concerts/utils'

export function OnThisDay() {
  const { data: concerts, isLoading } = useConcerts()
  const memories = useMemo(() => getOnThisDay(concerts ?? []), [concerts])

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title="On This Day" />
      <div className="px-6 pt-2">
        <p className="font-body text-sm text-fg-subtle">{format(new Date(), 'EEEE d MMMM')}</p>

        {isLoading ? (
          <div className="flex justify-center py-20 text-orange">
            <Spinner size={28} />
          </div>
        ) : memories.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3">
            {memories.map((c) => (
              <ConcertCard key={c.id} concert={c} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong p-8 text-center">
            <p className="font-body text-sm text-fg-subtle">
              No shows on this date yet — keep logging and they’ll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
