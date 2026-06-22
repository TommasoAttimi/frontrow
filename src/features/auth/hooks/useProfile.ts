import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import { fetchMyProfile } from '../api/profile'

export function useProfile() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchMyProfile(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  })
}
