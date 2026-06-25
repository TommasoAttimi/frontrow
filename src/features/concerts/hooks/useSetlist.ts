import { useQuery } from '@tanstack/react-query'
import { getSetlist } from '../api/setlist'

export function useSetlist(concertId: string | undefined) {
  return useQuery({
    queryKey: ['setlist', concertId],
    queryFn: () => getSetlist(concertId as string),
    enabled: !!concertId,
  })
}
