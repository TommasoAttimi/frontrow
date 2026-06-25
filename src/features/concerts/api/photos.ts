import { supabase } from '@/lib/supabase'

const BUCKET = 'concert-photos'

async function uploadToBucket(file: File, userId: string, concertId: string): Promise<string> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const path = `${userId}/${concertId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function pathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`
  const i = url.indexOf(marker)
  return i === -1 ? null : url.slice(i + marker.length)
}

export async function addConcertPhoto(
  file: File,
  userId: string,
  concertId: string,
  currentPhotos: string[],
): Promise<string[]> {
  const url = await uploadToBucket(file, userId, concertId)
  const photos = [...currentPhotos, url]
  const { error } = await supabase.from('concerts').update({ photos }).eq('id', concertId)
  if (error) throw error
  return photos
}

export async function removeConcertPhoto(
  url: string,
  concertId: string,
  currentPhotos: string[],
): Promise<string[]> {
  const photos = currentPhotos.filter((p) => p !== url)
  const { error } = await supabase.from('concerts').update({ photos }).eq('id', concertId)
  if (error) throw error
  const path = pathFromPublicUrl(url)
  if (path) await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
  return photos
}

export async function setTicketScan(
  file: File,
  userId: string,
  concertId: string,
): Promise<string> {
  const url = await uploadToBucket(file, userId, concertId)
  const { error } = await supabase
    .from('concerts')
    .update({ ticket_scan_url: url })
    .eq('id', concertId)
  if (error) throw error
  return url
}
