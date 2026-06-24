import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, name, ...rest }, ref) => {
    const areaId = id ?? name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={areaId}
            className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted"
          >
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          name={name}
          ref={ref}
          className={cn(
            'min-h-[96px] w-full resize-y rounded-lg border-[1.5px] border-border-strong bg-white/[0.04] px-4 py-3 font-body text-sm text-fg placeholder:text-fg-faint transition focus:border-orange focus:outline-none',
            error && 'border-error bg-error/5',
            className,
          )}
          {...rest}
        />
        {error && (
          <p className="mt-[7px] font-body text-xs text-[#f87171]">{error}</p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
