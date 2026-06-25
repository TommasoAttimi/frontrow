import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/stores/useUIStore'
import { addConcertPhoto, removeConcertPhoto, setTicketScan } from '../api/photos'
import type { ConcertDetail } from '../api/concerts'

export function PhotosTab({ data }: { data: ConcertDetail }) {
  const queryClient = useQueryClient()
  const photoInput = useRef<HTMLInputElement>(null)
  const ticketInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['concert', data.id] })

  async function onAddPhotos(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    try {
      let photos = data.photos
      for (const file of Array.from(files)) {
        photos = await addConcertPhoto(file, data.user_id, data.id, photos)
      }
      await invalidate()
      toast.success('Photos added')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  async function onRemovePhoto(url: string) {
    try {
      await removeConcertPhoto(url, data.id, data.photos)
      await invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not remove photo')
    }
  }

  async function onAddTicket(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await setTicketScan(file, data.user_id, data.id)
      await invalidate()
      toast.success('Ticket added')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onAddPhotos(e.target.files)}
      />
      <input
        ref={ticketInput}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => onAddTicket(e.target.files)}
      />

      <div className="mb-3 flex items-center justify-between">
        <p className="font-body text-[13px] text-fg-faint">
          {data.photos.length} photo{data.photos.length === 1 ? '' : 's'}
          {data.ticket_scan_url ? ' · 1 ticket' : ''}
        </p>
        <button
          type="button"
          onClick={() => photoInput.current?.click()}
          disabled={busy}
          className="flex h-8 items-center gap-1.5 rounded-[9px] bg-orange px-3.5 font-body text-xs font-semibold text-white shadow-[0_2px_10px_rgba(232,117,42,0.3)] disabled:opacity-60"
        >
          {busy ? <Spinner size={13} /> : <span className="text-sm leading-none">+</span>}
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => photoInput.current?.click()}
          disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-white/10 bg-white/[0.02] text-fg-disabled"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="text-center font-body text-[11px] leading-[1.3]">
            Add concert
            <br />
            photos
          </span>
        </button>

        {data.photos.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-[14px]">
            <img src={url} alt="Concert" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemovePhoto(url)}
              aria-label="Remove photo"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-disabled">
          Tickets & Files
        </p>
        {data.ticket_scan_url && (
          <a
            href={data.ticket_scan_url}
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex items-center gap-3 rounded-[14px] border border-border bg-white/[0.03] p-3"
          >
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[11px] bg-white/[0.04]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M2 9a2 2 0 010 4v7h20v-7a2 2 0 010-4V3H2v6z"
                  stroke="#6a6882"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-body text-[13px] font-medium text-fg-muted">
                Ticket scan
              </p>
              <p className="font-body text-[11px] text-fg-disabled">Tap to view</p>
            </div>
          </a>
        )}
        <button
          type="button"
          onClick={() => ticketInput.current?.click()}
          disabled={busy}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] font-body text-[13px] text-fg-disabled disabled:opacity-60"
        >
          <span className="text-base leading-none">+</span>
          {data.ticket_scan_url ? 'Replace ticket scan' : 'Add ticket scan or file'}
        </button>
      </div>
    </div>
  )
}
