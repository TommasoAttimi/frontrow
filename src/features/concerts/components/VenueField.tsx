import { useState } from 'react'
import { Combobox } from '@/components/ui/Combobox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { COUNTRIES, countryName } from '@/lib/constants/countries'
import { searchVenues } from '../api/catalog'
import { SelectedChip } from './SelectedChip'
import type { VenueRef } from '../schemas'

export function VenueField({
  value,
  onChange,
  error,
}: {
  value: VenueRef | null
  onChange: (value: VenueRef | null) => void
  error?: string
}) {
  const [newName, setNewName] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  const Label = (
    <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
      Venue
    </span>
  )

  if (value) {
    return (
      <div>
        {Label}
        <SelectedChip
          label={value.name}
          sublabel={
            value.id
              ? value.country_name ?? undefined
              : [value.city, value.country_name].filter(Boolean).join(', ') || 'New venue'
          }
          onClear={() => onChange(null)}
        />
      </div>
    )
  }

  if (newName !== null) {
    return (
      <div>
        {Label}
        <div className="space-y-3 rounded-xl border border-border bg-white/[0.02] p-3">
          <p className="font-body text-sm text-fg">
            New venue: <span className="font-semibold">{newName}</span>
          </p>
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="London"
          />
          <Select
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select country…</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              onClick={() => {
                setNewName(null)
                setCity('')
                setCountry('')
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!city || !country}
              onClick={() =>
                onChange({
                  name: newName,
                  city,
                  country,
                  country_name: countryName(country),
                })
              }
            >
              Add venue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Combobox
      label="Venue"
      placeholder="Search venue…"
      error={error}
      search={searchVenues}
      onSelect={(item) =>
        onChange({ id: item.id, name: item.label, country_name: item.sublabel })
      }
      onCreate={(text) => setNewName(text)}
    />
  )
}
