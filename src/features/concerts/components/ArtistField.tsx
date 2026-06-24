import { Combobox } from '@/components/ui/Combobox'
import { searchArtists } from '../api/catalog'
import { SelectedChip } from './SelectedChip'
import type { ArtistRef } from '../schemas'

export function ArtistField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: ArtistRef | null
  onChange: (value: ArtistRef | null) => void
  error?: string
}) {
  if (value) {
    return (
      <div>
        <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
          {label}
        </span>
        <SelectedChip
          label={value.name}
          sublabel={value.id ? undefined : 'New artist'}
          onClear={() => onChange(null)}
        />
      </div>
    )
  }
  return (
    <Combobox
      label={label}
      placeholder="Search artist…"
      error={error}
      search={searchArtists}
      onSelect={(item) => onChange({ id: item.id, name: item.label })}
      onCreate={(text) => onChange({ name: text })}
    />
  )
}
