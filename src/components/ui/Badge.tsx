import { cn } from '@/lib/utils/cn'

type Tone = 'orange' | 'green' | 'neutral'

const tones: Record<Tone, string> = {
  orange: 'bg-orange/20 text-orange',
  green: 'bg-success/15 text-success',
  neutral: 'bg-white/[0.06] text-fg-subtle',
}

export function Badge({
  children,
  tone = 'orange',
  className,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.05em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
