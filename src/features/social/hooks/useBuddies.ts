import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import { addBuddy, listBuddies, removeBuddy, respondToBuddy } from '../api/buddies'

export function useBuddies(concertId: string | undefined) {
  return useQuery({
    queryKey: ['buddies', concertId],
    queryFn: () => listBuddies(concertId as string),
    enabled: !!concertId,
  })
}

export function useAddBuddy(concertId: string) {
  const userId = useAuthStore((s) => s.user?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taggedUserId: string) =>
      addBuddy(concertId, userId as string, taggedUserId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buddies', concertId] }),
  })
}

export function useRemoveBuddy(concertId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (buddyId: string) => removeBuddy(buddyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buddies', concertId] }),
  })
}

export function useRespondToBuddy(concertId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ buddyId, status }: { buddyId: string; status: 'confirmed' | 'declined' }) =>
      respondToBuddy(buddyId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buddies', concertId] }),
  })
}
