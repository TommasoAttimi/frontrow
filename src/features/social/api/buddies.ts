import { supabase } from '@/lib/supabase'
import type { BuddyStatus } from '@/types/domain'
import type { FriendProfile } from './friends'

export interface Buddy {
  /** concert_buddies row id. */
  id: string
  tagged_user_id: string
  status: BuddyStatus
  created_at: string
  profile: FriendProfile
}

const PROFILE_SELECT = 'id, username, display_name, avatar_url'
const TAGGED = `tagged:profiles!concert_buddies_tagged_user_id_fkey(${PROFILE_SELECT})`

type Row = {
  id: string
  tagged_user_id: string
  status: BuddyStatus
  created_at: string
  tagged: FriendProfile | null
}

/** Everyone tagged on a concert (visible to the owner and the tagged users). */
export async function listBuddies(concertId: string): Promise<Buddy[]> {
  const { data, error } = await supabase
    .from('concert_buddies')
    .select(`id, tagged_user_id, status, created_at, ${TAGGED}`)
    .eq('concert_id', concertId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return ((data ?? []) as Row[])
    .filter((r) => r.tagged)
    .map((r) => ({
      id: r.id,
      tagged_user_id: r.tagged_user_id,
      status: r.status,
      created_at: r.created_at,
      profile: r.tagged as FriendProfile,
    }))
}

export async function addBuddy(
  concertId: string,
  ownerId: string,
  taggedUserId: string,
): Promise<void> {
  const { error } = await supabase
    .from('concert_buddies')
    .insert({
      concert_id: concertId,
      owner_id: ownerId,
      tagged_user_id: taggedUserId,
      status: 'pending',
    })
  if (error) throw error
}

export async function removeBuddy(buddyId: string): Promise<void> {
  const { error } = await supabase.from('concert_buddies').delete().eq('id', buddyId)
  if (error) throw error
}

/** Tagged user confirms or declines that they were there. */
export async function respondToBuddy(
  buddyId: string,
  status: 'confirmed' | 'declined',
): Promise<void> {
  const { error } = await supabase
    .from('concert_buddies')
    .update({ status })
    .eq('id', buddyId)
  if (error) throw error
}
