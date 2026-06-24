import { useFieldArray, type Control } from 'react-hook-form'
import { Combobox } from '@/components/ui/Combobox'
import { searchArtists } from '../api/catalog'
import type { ConcertFormValues } from '../schemas'

const ROLE_OPTIONS = [
  { value: 'support', label: 'Support' },
  { value: 'special_guest', label: 'Special guest' },
  { value: 'opener', label: 'Opener' },
] as const

export function SupportActs({ control }: { control: Control<ConcertFormValues> }) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'supports',
  })

  return (
    <div>
      <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
        Support acts
      </span>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.02] p-2 pl-3"
          >
            <span className="min-w-0 flex-1 truncate font-body text-sm text-fg">
              {field.artist.name}
              {!field.artist.id && (
                <span className="text-fg-subtle"> · new</span>
              )}
            </span>
            <select
              value={field.role}
              onChange={(e) =>
                update(i, {
                  artist: field.artist,
                  role: e.target.value as (typeof ROLE_OPTIONS)[number]['value'],
                })
              }
              className="h-9 rounded-lg border border-border-strong bg-white/[0.04] px-2 font-body text-xs text-fg focus:border-orange focus:outline-none"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove support act"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-subtle transition hover:bg-white/10 hover:text-fg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <Combobox
          placeholder="Add support act…"
          search={searchArtists}
          onSelect={(item) =>
            append({ artist: { id: item.id, name: item.label }, role: 'support' })
          }
          onCreate={(text) => append({ artist: { name: text }, role: 'support' })}
        />
      </div>
    </div>
  )
}
