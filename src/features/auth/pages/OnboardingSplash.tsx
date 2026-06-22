import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/brand/Logo'

export function OnboardingSplash() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-between overflow-hidden px-6 pb-10 pt-20">
      {/* dot-grid glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(232,117,42,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(120% 60% at 50% 0%, black 30%, transparent 75%)',
        }}
      />

      <div className="relative">
        <Logo size={64} />
        <h1 className="mt-10 font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.6px] text-fg">
          Every show.
          <br />
          Every moment.
        </h1>
        <p className="mt-4 max-w-[300px] font-body text-[15px] leading-relaxed text-fg-subtle">
          Log every concert and festival you attend. Track your history, relive
          the nights, and never forget a setlist.
        </p>
      </div>

      <div className="relative flex flex-col gap-3">
        <Link to="/signup">
          <Button fullWidth>Get started</Button>
        </Link>
        <p className="text-center font-body text-sm text-fg-subtle">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-orange">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
