import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import { listConcerts, getConcert } from '../api/concerts'

export function useConcerts() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['concerts', userId],
    queryFn: () => listConcerts(userId as string),
    enabled: !!userId,
  })
}

export function useConcert(id: string | undefined) {
  return useQuery({
    queryKey: ['concert', id],
    queryFn: () => getConcert(id as string),
    enabled: !!id,
  })
}
