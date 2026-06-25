import { supabase } from '@/lib/supabase'
import type { TablesInsert } from '@/types/database'

export interface SetlistSong {
  id: string
  position: number
  title: string
  is_encore: boolean
  note: string | null
}

export interface SetlistSongInput {
  title: string
  is_encore: boolean
  note: string | null
}

export async function getSetlist(concertId: string): Promise<SetlistSong[]> {
  const { data, error } = await supabase
    .from('setlist_songs')
    .select('id, position, title, is_encore, note')
    .eq('concert_id', concertId)
    .order('position')
  if (error) throw error
  return data ?? []
}

/** Fetch a setlist from setlist.fm via the server-side Edge Function
 *  (keeps the API key off the client). Returns normalized songs. */
export async function importFromSetlistFm(params: {
  artist: string
  date: string
}): Promise<SetlistSongInput[]> {
  const { data, error } = await supabase.functions.invoke('setlist-import', {
    body: params,
  })
  if (error) {
    // FunctionsHttpError carries the Response in `context`; surface our message.
    let message = error.message ?? 'setlist.fm import failed'
    try {
      const ctx = (error as { context?: Response }).context
      const body = ctx && 'json' in ctx ? await ctx.json() : null
      if (body?.error) message = body.error
    } catch {
      /* keep generic message */
    }
    throw new Error(message)
  }
  return (data?.songs ?? []) as SetlistSongInput[]
}

/** Replace a concert's setlist with the given ordered songs. */
export async function saveSetlist(
  concertId: string,
  songs: SetlistSongInput[],
): Promise<void> {
  const del = await supabase.from('setlist_songs').delete().eq('concert_id', concertId)
  if (del.error) throw del.error
  if (songs.length === 0) return
  const rows: TablesInsert<'setlist_songs'>[] = songs.map((s, i) => ({
    concert_id: concertId,
    position: i + 1,
    title: s.title.trim(),
    is_encore: s.is_encore,
    note: s.note?.trim() || null,
  }))
  const { error } = await supabase.from('setlist_songs').insert(rows)
  if (error) throw error
}
