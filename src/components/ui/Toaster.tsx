import { useUIStore, type ToastVariant } from '@/stores/useUIStore'
import { Spinner } from './Spinner'
import { cn } from '@/lib/utils/cn'

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-success/30',
  error: 'border-error/30',
  info: 'border-orange/30',
  neutral: 'border-border-strong',
  loading: 'border-border-strong',
}

const iconBg: Record<ToastVariant, string> = {
  success: 'bg-success/12 text-success',
  error: 'bg-error/12 text-error',
  info: 'bg-orange-dim text-orange',
  neutral: 'bg-white/10 text-fg-muted',
  loading: 'bg-white/10 text-orange',
}

function Glyph({ variant }: { variant: ToastVariant }) {
  if (variant === 'loading') return <Spinner size={14} />
  const symbol =
    variant === 'success' ? '✓' : variant === 'error' ? '!' : variant === 'info' ? 'i' : '•'
  return <span className="text-xs font-bold">{symbol}</span>
}

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts)
  const dismiss = useUIStore((s) => s.dismissToast)

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.variant === 'error' ? 'alert' : 'status'}
          onClick={() => dismiss(t.id)}
          className={cn(
            'pointer-events-auto flex items-center gap-3 rounded-[14px] border bg-surface px-4 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
            variantStyles[t.variant],
          )}
        >
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
              iconBg[t.variant],
            )}
          >
            <Glyph variant={t.variant} />
          </span>
          <p className="font-body text-sm text-fg">{t.message}</p>
        </div>
      ))}
    </div>
  )
}
