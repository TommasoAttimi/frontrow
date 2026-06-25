// Server-side setlist.fm import. Keeps SETLISTFM_API_KEY off the client and
// normalizes the response into FrontRow's { title, is_encore, note } shape.
import { corsHeaders } from '../_shared/cors.ts'

interface SlSong {
  name?: string
  info?: string
  tape?: boolean
}
interface SlSet {
  encore?: number
  song?: SlSong[]
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('SETLISTFM_API_KEY')
    if (!apiKey) {
      return json(
        { error: 'setlist.fm is not configured. Add the SETLISTFM_API_KEY secret.' },
        400,
      )
    }

    const { artist, date } = await req.json().catch(() => ({}))
    if (!artist || !date) return json({ error: 'artist and date are required' }, 400)

    // FrontRow stores yyyy-MM-dd; setlist.fm expects dd-MM-yyyy.
    const [y, m, d] = String(date).split('-')
    const slDate = `${d}-${m}-${y}`
    const url =
      `https://api.setlist.fm/rest/1.0/search/setlists` +
      `?artistName=${encodeURIComponent(artist)}&date=${slDate}`

    const res = await fetch(url, {
      headers: { 'x-api-key': apiKey, Accept: 'application/json' },
    })
    if (res.status === 404) return json({ songs: [], setlistFmId: null })
    if (!res.ok) return json({ error: `setlist.fm returned ${res.status}` }, 502)

    const body = await res.json()
    const first = body?.setlist?.[0]
    const sets: SlSet[] = first?.sets?.set ?? []
    const songs: { title: string; is_encore: boolean; note: string | null }[] = []
    for (const s of sets) {
      const isEncore = s.encore != null
      for (const song of s.song ?? []) {
        if (!song?.name) continue
        songs.push({ title: song.name, is_encore: isEncore, note: song.info ?? null })
      }
    }

    return json({ songs, setlistFmId: first?.id ?? null })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'unknown error' }, 500)
  }
})
