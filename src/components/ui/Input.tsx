import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  valid?: boolean
  trailing?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, valid, trailing, className, id, name, ...rest }, ref) => {
    const inputId = id ?? name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            name={name}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'h-[50px] w-full rounded-lg border-[1.5px] border-border-strong bg-white/[0.04] px-4 font-body text-sm text-fg placeholder:text-fg-faint transition',
              'focus:border-orange focus:outline-none',
              valid && !error && 'border-success/40',
              error && 'border-error bg-error/5',
              trailing && 'pr-11',
              className,
            )}
            {...rest}
          />
          {trailing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
          )}
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
            className="mt-[7px] flex items-center gap-1.5 font-body text-xs text-[#f87171]"
          >
            {error}
          </p>
        ) : hint ? (
          <p className="mt-[7px] font-body text-xs text-fg-subtle">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
