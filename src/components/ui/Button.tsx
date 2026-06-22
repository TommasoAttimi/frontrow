import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  loading?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl transition active:scale-[0.97] disabled:cursor-not-allowed select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-orange text-white font-display font-bold text-base shadow-[0_4px_20px_rgba(232,117,42,0.35)] disabled:bg-orange-mid disabled:text-white/40 disabled:shadow-none',
  secondary:
    'bg-white/[0.06] border border-border-strong text-fg-muted font-body font-medium text-[15px]',
  destructive: 'bg-error text-white font-display font-bold text-base',
  ghost: 'text-fg-muted font-body font-medium text-[15px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', fullWidth, loading, className, children, disabled, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        base,
        variants[variant],
        fullWidth ? 'h-[54px] w-full' : 'h-11 px-5',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner size={18} /> : children}
    </button>
  ),
)
Button.displayName = 'Button'
