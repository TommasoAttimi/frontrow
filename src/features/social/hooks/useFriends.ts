import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  acceptRequest,
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
  removeFriendship,
  sendFriendRequest,
} from '../api/friends'

export function useFriends() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['friends', userId],
    queryFn: () => listFriends(userId as string),
    enabled: !!userId,
  })
}

export function useIncomingRequests() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['friend-requests', 'incoming', userId],
    queryFn: () => listIncomingRequests(userId as string),
    enabled: !!userId,
  })
}

export function useOutgoingRequests() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['friend-requests', 'outgoing', userId],
    queryFn: () => listOutgoingRequests(userId as string),
    enabled: !!userId,
  })
}

/** Invalidate every friendship-derived query after a mutation. */
function useInvalidateFriends() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['friends'] })
    queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
  }
}

export function useSendFriendRequest() {
  const userId = useAuthStore((s) => s.user?.id)
  const invalidate = useInvalidateFriends()
  return useMutation({
    mutationFn: (targetId: string) => sendFriendRequest(userId as string, targetId),
    onSuccess: invalidate,
  })
}

export function useAcceptRequest() {
  const invalidate = useInvalidateFriends()
  return useMutation({
    mutationFn: (friendshipId: string) => acceptRequest(friendshipId),
    onSuccess: invalidate,
  })
}

export function useRemoveFriendship() {
  const invalidate = useInvalidateFriends()
  return useMutation({
    mutationFn: (friendshipId: string) => removeFriendship(friendshipId),
    onSuccess: invalidate,
  })
}
