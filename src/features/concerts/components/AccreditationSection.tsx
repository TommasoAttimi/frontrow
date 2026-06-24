import type { UseFormRegister, UseFormWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ConcertFormValues } from '../schemas'

export function AccreditationSection({
  register,
  watch,
}: {
  register: UseFormRegister<ConcertFormValues>
  watch: UseFormWatch<ConcertFormValues>
}) {
  const enabled = watch('is_accredited')

  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-4">
      <label className="flex cursor-pointer items-center justify-between">
        <span className="font-body text-sm font-medium text-fg">
          Press / accreditation
        </span>
        <input
          type="checkbox"
          {...register('is_accredited')}
          className="h-5 w-5 accent-orange"
        />
      </label>

      {enabled && (
        <div className="mt-4 space-y-3">
          <Select label="Type" {...register('accred_type')}>
            <option value="">Select…</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="press">Press</option>
            <option value="all_access">All access</option>
          </Select>
          <Input
            label="Publication / client"
            placeholder="NME, freelance…"
            {...register('accred_client')}
          />
          <label className="flex items-center gap-2 font-body text-sm text-fg-muted">
            <input
              type="checkbox"
              {...register('accred_photo_pit')}
              className="h-4 w-4 accent-orange"
            />
            Photo pit access
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-fg-muted">
            <input
              type="checkbox"
              {...register('accred_first_3_songs')}
              className="h-4 w-4 accent-orange"
            />
            First 3 songs rule
          </label>
        </div>
      )}
    </div>
  )
}
