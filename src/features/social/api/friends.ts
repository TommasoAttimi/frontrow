import { supabase } from '@/lib/supabase'
import type { FriendshipStatus } from '@/types/domain'

export interface FriendProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
}

export interface Friend {
  /** Friendship row id. */
  id: string
  status: FriendshipStatus
  created_at: string
  /** The other person in the friendship, relative to the current user. */
  profile: FriendProfile
}

export interface FriendRequest {
  /** Friendship row id. */
  id: string
  created_at: string
  /** Requester (incoming) or addressee (outgoing). */
  profile: FriendProfile
}

const PROFILE_SELECT = 'id, username, display_name, avatar_url'
const REQUESTER = `requester:profiles!friendships_requester_id_fkey(${PROFILE_SELECT})`
const ADDRESSEE = `addressee:profiles!friendships_addressee_id_fkey(${PROFILE_SELECT})`

type Row = {
  id: string
  status: FriendshipStatus
  created_at: string
  requester_id: string
  addressee_id: string
  requester: FriendProfile | null
  addressee: FriendProfile | null
}

/** Search public profiles by username, excluding the current user. */
export async function searchProfiles(
  query: string,
  currentUserId: string,
): Promise<FriendProfile[]> {
  const q = query.trim().replace(/^@/, '')
  if (!q) return []
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .ilike('username', `%${q}%`)
    .neq('id', currentUserId)
    .limit(10)
  if (error) throw error
  return data ?? []
}

/** Accepted friendships involving the current user, mapped to the other person. */
export async function listFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select(`id, status, created_at, requester_id, addressee_id, ${REQUESTER}, ${ADDRESSEE}`)
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return ((data ?? []) as Row[])
    .map((r) => {
      const profile = r.requester_id === userId ? r.addressee : r.requester
      if (!profile) return null
      return { id: r.id, status: r.status, created_at: r.created_at, profile }
    })
    .filter((f): f is Friend => f !== null)
}

/** Pending requests addressed to the current user. */
export async function listIncomingRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select(`id, created_at, ${REQUESTER}`)
    .eq('status', 'pending')
    .eq('addressee_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return ((data ?? []) as Pick<Row, 'id' | 'created_at' | 'requester'>[])
    .filter((r) => r.requester)
    .map((r) => ({ id: r.id, created_at: r.created_at, profile: r.requester as FriendProfile }))
}

/** Pending requests the current user has sent. */
export async function listOutgoingRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select(`id, created_at, ${ADDRESSEE}`)
    .eq('status', 'pending')
    .eq('requester_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return ((data ?? []) as Pick<Row, 'id' | 'created_at' | 'addressee'>[])
    .filter((r) => r.addressee)
    .map((r) => ({ id: r.id, created_at: r.created_at, profile: r.addressee as FriendProfile }))
}

/** The friendship row between two users, in either direction, if any. */
async function friendshipBetween(a: string, b: string) {
  const { data, error } = await supabase
    .from('friendships')
    .select('id, status, requester_id, addressee_id')
    .or(
      `and(requester_id.eq.${a},addressee_id.eq.${b}),and(requester_id.eq.${b},addressee_id.eq.${a})`,
    )
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * Send a friend request. If the other user already sent one, accept it
 * instead of creating a duplicate (the unique constraint is directional).
 */
export async function sendFriendRequest(
  currentUserId: string,
  targetId: string,
): Promise<void> {
  const existing = await friendshipBetween(currentUserId, targetId)
  if (existing) {
    if (existing.status === 'accepted') return
    if (existing.addressee_id === currentUserId) {
      await acceptRequest(existing.id)
      return
    }
    return // outgoing request already pending
  }
  const { error } = await supabase
    .from('friendships')
    .insert({ requester_id: currentUserId, addressee_id: targetId, status: 'pending' })
  if (error) throw error
}

export async function acceptRequest(friendshipId: string): Promise<void> {
  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
  if (error) throw error
}

/** Decline an incoming request or cancel an outgoing one — removes the row. */
export async function removeFriendship(friendshipId: string): Promise<void> {
  const { error } = await supabase.from('friendships').delete().eq('id', friendshipId)
  if (error) throw error
}
