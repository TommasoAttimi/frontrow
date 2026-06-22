import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/domain'

export async function fetchMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function checkUsernameAvailable(name: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('username_available', { name })
  if (error) throw error
  return data
}

export async function createProfile(input: {
  id: string
  username: string
}): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: input.id, username: input.username })
    .select('*')
    .single()
  if (error) throw error
  return data
}
