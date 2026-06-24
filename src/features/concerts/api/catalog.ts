import { supabase } from '@/lib/supabase'
import type { ComboboxItem } from '@/components/ui/Combobox'
import type { Artist, Venue } from '@/types/domain'

// ---------- Artists ----------
export async function searchArtists(query: string): Promise<ComboboxItem[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('id, name, origin_country')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(8)
  if (error) throw error
  return (data ?? []).map((a) => ({
    id: a.id,
    label: a.name,
    sublabel: a.origin_country ?? undefined,
  }))
}

export async function createArtist(name: string): Promise<Artist> {
  const { data, error } = await supabase
    .from('artists')
    .insert({ name })
    .select('*')
    .single()
  if (error) throw error
  return data
}

// ---------- Venues ----------
export async function searchVenues(query: string): Promise<ComboboxItem[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, city, country_name')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(8)
  if (error) throw error
  return (data ?? []).map((v) => ({
    id: v.id,
    label: v.name,
    sublabel: [v.city, v.country_name].filter(Boolean).join(', '),
  }))
}

export async function createVenue(input: {
  name: string
  city: string
  country: string
  country_name: string
}): Promise<Venue> {
  const { data, error } = await supabase
    .from('venues')
    .insert(input)
    .select('*')
    .single()
  if (error) throw error
  return data
}
