import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BackHeader } from '@/components/layout/BackHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import { toast } from '@/stores/useUIStore'
import { useConcert } from '../hooks/useConcerts'
import { useSetlist } from '../hooks/useSetlist'
import { saveSetlist, importFromSetlistFm, type SetlistSongInput } from '../api/setlist'

interface Draft {
  key: string
  title: string
  is_encore: boolean
}

const key = () => crypto.randomUUID()

export function SetlistEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: concert } = useConcert(id)
  const { data: existing, isLoading } = useSetlist(id)

  const [songs, setSongs] = useState<Draft[]>([])
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (existing) {
      setSongs(
        existing.length > 0
          ? existing.map((s) => ({ key: s.id, title: s.title, is_encore: s.is_encore }))
          : [{ key: key(), title: '', is_encore: false }],
      )
    }
  }, [existing])

  const save = useMutation({
    mutationFn: () => {
      const cleaned: SetlistSongInput[] = songs
        .filter((s) => s.title.trim())
        .map((s) => ({ title: s.title, is_encore: s.is_encore, note: null }))
      return saveSetlist(id as string, cleaned)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setlist', id] })
      queryClient.invalidateQueries({ queryKey: ['concert', id] })
      toast.success('Setlist saved')
      navigate(`/show/${id}`, { replace: true })
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : 'Could not save setlist'),
  })

  function update(k: string, patch: Partial<Draft>) {
    setSongs((prev) => prev.map((s) => (s.key === k ? { ...s, ...patch } : s)))
  }
  function remove(k: string) {
    setSongs((prev) => prev.filter((s) => s.key !== k))
  }
  function move(k: string, dir: -1 | 1) {
    setSongs((prev) => {
      const i = prev.findIndex((s) => s.key === k)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }
  function addSong() {
    setSongs((prev) => [...prev, { key: key(), title: '', is_encore: false }])
  }

  async function handleImport() {
    if (!concert?.headliner?.name) {
      toast.error('Add a headliner first to import a setlist')
      return
    }
    setImporting(true)
    try {
      const imported = await importFromSetlistFm({
        artist: concert.headliner.name,
        date: concert.date,
      })
      if (imported.length === 0) {
        toast.info('No setlist found on setlist.fm for this show')
      } else {
        setSongs(imported.map((s) => ({ key: key(), title: s.title, is_encore: s.is_encore })))
        toast.success(`Imported ${imported.length} songs`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'setlist.fm import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title="Setlist" />
      {isLoading ? (
        <div className="flex justify-center py-20 text-orange">
          <Spinner size={28} />
        </div>
      ) : (
        <div className="px-6 pb-28 pt-4">
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] py-3 font-body text-[13px] text-fg-muted disabled:opacity-60"
          >
            {importing ? (
              <Spinner size={16} />
            ) : (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[#f5a623] font-display text-[8px] font-extrabold text-white">
                sl
              </span>
            )}
            Import from setlist.fm
          </button>

          <div className="space-y-2">
            {songs.map((s, i) => (
              <div
                key={s.key}
                className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.02] p-2 pl-3"
              >
                <span className="w-5 flex-none text-right font-body text-[13px] tabular-nums text-fg-disabled">
                  {i + 1}
                </span>
                <input
                  value={s.title}
                  onChange={(e) => update(s.key, { title: e.target.value })}
                  placeholder="Song title"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-border-strong bg-white/[0.04] px-3 font-body text-sm text-fg placeholder:text-fg-faint focus:border-orange focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => update(s.key, { is_encore: !s.is_encore })}
                  aria-pressed={s.is_encore}
                  className={cn(
                    'h-9 shrink-0 rounded-lg px-2 font-body text-[11px] font-semibold uppercase transition',
                    s.is_encore
                      ? 'bg-orange/20 text-orange'
                      : 'bg-white/[0.04] text-fg-disabled',
                  )}
                >
                  Enc
                </button>
                <div className="flex flex-none flex-col">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => move(s.key, -1)}
                    className="px-1 text-fg-subtle hover:text-fg"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => move(s.key, 1)}
                    className="px-1 text-fg-subtle hover:text-fg"
                  >
                    ▼
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Remove song"
                  onClick={() => remove(s.key)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-subtle transition hover:bg-white/10 hover:text-fg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSong}
            className="mt-3 w-full rounded-xl border border-dashed border-border-strong py-3 font-body text-sm font-medium text-fg-muted transition hover:text-fg"
          >
            + Add song
          </button>

          <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[440px] border-t border-border bg-app/90 p-4 backdrop-blur">
            <Button type="button" fullWidth loading={save.isPending} onClick={() => save.mutate()}>
              Save setlist
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
