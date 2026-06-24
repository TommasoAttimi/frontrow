import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { ArtistField } from './ArtistField'
import { VenueField } from './VenueField'
import { SupportActs } from './SupportActs'
import { AccreditationSection } from './AccreditationSection'
import { concertFormSchema, type ConcertFormValues } from '../schemas'

export function ConcertForm({
  defaultValues,
  submitLabel,
  loading,
  onSubmit,
}: {
  defaultValues: ConcertFormValues
  submitLabel: string
  loading?: boolean
  onSubmit: (values: ConcertFormValues) => void
}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConcertFormValues>({
    resolver: zodResolver(concertFormSchema),
    defaultValues,
  })

  const type = watch('type')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 pb-28 pt-4">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SegmentedControl
            label="Type"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: 'concert', label: 'Concert' },
              { value: 'festival', label: 'Festival' },
            ]}
          />
        )}
      />

      {type === 'festival' && (
        <>
          <Input
            label="Festival name"
            placeholder="Glastonbury"
            {...register('festival_name')}
          />
          <p className="-mt-2 font-body text-xs text-fg-subtle">
            The full day → stage → set builder arrives in a later update. For now this
            saves as a festival with its headline details.
          </p>
        </>
      )}

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <SegmentedControl
            label="Status"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: 'attended', label: 'Attended' },
              { value: 'planned', label: 'Planned' },
              { value: 'wishlist', label: 'Wishlist' },
            ]}
          />
        )}
      />

      <Input label="Date" type="date" {...register('date')} error={errors.date?.message} />

      <Controller
        control={control}
        name="headliner"
        render={({ field }) => (
          <ArtistField
            label={type === 'festival' ? 'Headline act' : 'Headliner'}
            value={field.value}
            onChange={field.onChange}
            error={errors.headliner?.message as string | undefined}
          />
        )}
      />

      <SupportActs control={control} />

      <Controller
        control={control}
        name="venue"
        render={({ field }) => (
          <VenueField
            value={field.value}
            onChange={field.onChange}
            error={errors.venue?.message as string | undefined}
          />
        )}
      />

      <Input label="Tour name (optional)" placeholder="e.g. The Eras Tour" {...register('tour_name')} />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Ticket type" {...register('ticket_type')}>
          <option value="">—</option>
          <option value="GA">GA</option>
          <option value="Seated">Seated</option>
          <option value="VIP">VIP</option>
          <option value="Free">Free</option>
          <option value="Press">Press</option>
        </Select>
        <Input
          label="Price paid"
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="0.00"
          {...register('ticket_price_paid')}
        />
      </div>
      <Input
        label="Currency (optional)"
        placeholder="GBP"
        maxLength={3}
        className="uppercase"
        {...register('ticket_currency')}
      />

      <Textarea
        label="Personal note"
        placeholder="What made this night unforgettable?"
        {...register('personal_note')}
      />

      <AccreditationSection register={register} watch={watch} />

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[440px] border-t border-border bg-app/90 p-4 backdrop-blur">
        <Button type="submit" fullWidth loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
