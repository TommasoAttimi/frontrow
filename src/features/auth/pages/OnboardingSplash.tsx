import { Link } from 'react-router-dom'
import { Logo, Wordmark } from '@/components/brand/Logo'

const FEATURES = [
  {
    title: 'Concerts & festivals, full setlists',
    sub: 'Tickets, photos, support acts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 18V5l12-2v13"
          stroke="#e8752a"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="18" r="3" stroke="#e8752a" strokeWidth="1.8" />
        <circle cx="18" cy="16" r="3" stroke="#e8752a" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Track gigs across the globe',
    sub: 'Countries, cities & venues mapped',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#e8752a" strokeWidth="1.8" />
        <path d="M2 12h20" stroke="#e8752a" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
          stroke="#e8752a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Your Year Wrapped',
    sub: 'Stats, top artists & best moments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="#e8752a" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function OnboardingSplash() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden">
      {/* background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-orange opacity-[0.1]"
        style={{ filter: 'blur(110px)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-60px] top-40 h-[180px] w-[180px] rounded-full bg-orange opacity-[0.06]"
        style={{ filter: 'blur(80px)' }}
      />

      <div className="relative flex items-center gap-2.5 px-8 pt-9">
        <Logo size={32} />
        <Wordmark className="text-lg" />
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-8">
        <h1 className="font-display text-[46px] font-extrabold leading-[1.04] tracking-[-1.5px] text-fg">
          Every show,
          <br />
          every
          <br />
          <span className="text-orange">moment.</span>
        </h1>
        <p className="mt-4 max-w-[290px] font-body text-base leading-[1.55] text-fg-faint">
          Your personal live music diary. Log every concert, festival, and memory.
        </p>
      </div>

      <div className="relative flex flex-col gap-3.5 px-8 pb-7">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-orange/[0.18] bg-orange/10">
              {f.icon}
            </div>
            <div>
              <p className="font-body text-sm font-medium leading-[1.3] text-[#d8d6e2]">{f.title}</p>
              <p className="mt-0.5 font-body text-xs text-fg-disabled">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col gap-3 px-8 pb-9">
        <Link
          to="/signup"
          className="flex h-14 items-center justify-center rounded-2xl bg-orange font-display text-base font-bold tracking-[-0.2px] text-white shadow-[0_8px_28px_rgba(232,117,42,0.35)] transition active:scale-[0.98]"
        >
          Get Started
        </Link>
        <Link
          to="/signin"
          className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-body text-base font-medium text-fg-muted transition active:scale-[0.98]"
        >
          I already have an account
        </Link>
      </div>
    </div>
  )
}
