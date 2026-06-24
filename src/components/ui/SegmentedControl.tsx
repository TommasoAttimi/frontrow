import { cn } from '@/lib/utils/cn'

interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  label?: string
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className="w-full">
      {label && (
        <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
          {label}
        </span>
      )}
      <div className="flex gap-1 rounded-xl border border-border bg-white/[0.03] p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              'flex-1 rounded-lg py-2 font-body text-sm font-medium transition',
              value === o.value
                ? 'bg-orange text-white'
                : 'text-fg-subtle hover:text-fg-muted',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
