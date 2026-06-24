import { parseISO, isBefore, startOfDay } from 'date-fns'
import type { ConcertListItem } from './api/concerts'

export interface ConcertStats {
  shows: number
  artists: number
  venues: number
  countries: number
}

/** Aggregate stats over attended shows only (planned/wishlist don't count). */
export function getConcertStats(concerts: ConcertListItem[]): ConcertStats {
  const attended = concerts.filter((c) => c.status === 'attended')
  const artists = new Set<string>()
  const venues = new Set<string>()
  const countries = new Set<string>()
  for (const c of attended) {
    if (c.headliner?.name) artists.add(c.headliner.name.toLowerCase())
    if (c.venue) venues.add(`${c.venue.name}|${c.venue.city}`.toLowerCase())
    if (c.venue?.country_name) countries.add(c.venue.country_name)
  }
  return {
    shows: attended.length,
    artists: artists.size,
    venues: venues.size,
    countries: countries.size,
  }
}

export interface YearGroup {
  year: string
  items: ConcertListItem[]
}

/** Group concerts by year, newest year first (items keep their incoming order). */
export function groupConcertsByYear(concerts: ConcertListItem[]): YearGroup[] {
  const map = new Map<string, ConcertListItem[]>()
  for (const c of concerts) {
    const year = c.date.slice(0, 4)
    const bucket = map.get(year)
    if (bucket) bucket.push(c)
    else map.set(year, [c])
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, items]) => ({ year, items }))
}

/** Past shows that fall on today's month/day (anniversaries). */
export function getOnThisDay(concerts: ConcertListItem[]): ConcertListItem[] {
  const now = new Date()
  const today = startOfDay(now)
  return concerts.filter((c) => {
    const d = parseISO(c.date)
    return (
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate() &&
      isBefore(d, today)
    )
  })
}
