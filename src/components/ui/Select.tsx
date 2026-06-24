import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, name, children, ...rest }, ref) => {
    const selectId = id ?? name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          name={name}
          ref={ref}
          className={cn(
            'h-[50px] w-full appearance-none rounded-lg border-[1.5px] border-border-strong bg-white/[0.04] px-4 font-body text-sm text-fg transition focus:border-orange focus:outline-none',
            "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path d=%22M2 4l4 4 4-4%22 fill=%22none%22 stroke=%22%238a88a0%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10",
            error && 'border-error',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        {error && (
          <p className="mt-[7px] font-body text-xs text-[#f87171]">{error}</p>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'
