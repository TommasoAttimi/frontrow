import { format, parseISO } from 'date-fns'

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatConcertDate(iso: string): string {
  return format(parseISO(iso), 'EEE d MMM yyyy')
}

export function yearOf(iso: string): string {
  return iso.slice(0, 4)
}
