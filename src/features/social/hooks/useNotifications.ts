import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import { listNotifications, markAllRead } from '../api/notifications'

export function useNotifications() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => listNotifications(userId as string),
    enabled: !!userId,
    // Poll so the bell badge stays roughly current without a realtime channel.
    refetchInterval: 60_000,
  })
}

/** Unread count for the home bell badge. */
export function useUnreadCount(): number {
  const { data } = useNotifications()
  return (data ?? []).filter((n) => !n.read_at).length
}

export function useMarkAllRead() {
  const userId = useAuthStore((s) => s.user?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markAllRead(userId as string),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] }),
  })
}
