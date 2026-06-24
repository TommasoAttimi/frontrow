import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

const itemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex w-16 flex-col items-center justify-center gap-1 font-body text-[10px] font-medium transition',
    isActive ? 'text-orange' : 'text-[#3a3a50]',
  )

export function BottomNav() {
  const navigate = useNavigate()
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30"
    >
      <div className="mx-auto flex h-20 max-w-[440px] items-center justify-around border-t border-white/[0.06] bg-app px-2 pb-[10px]">
        <NavLink to="/home" className={itemClass}>
          <HomeIcon />
          Home
        </NavLink>
        <NavLink to="/shows" className={itemClass}>
          <ShowsIcon />
          My Shows
        </NavLink>

        <button
          type="button"
          onClick={() => navigate('/log')}
          aria-label="Log a show"
          className="flex h-[50px] w-[50px] -translate-y-3 items-center justify-center rounded-[15px] bg-orange text-white shadow-[0_4px_20px_rgba(232,117,42,0.4)] transition active:scale-95"
        >
          <PlusIcon />
        </button>

        <NavLink to="/stats" className={itemClass}>
          <StatsIcon />
          Stats
        </NavLink>
        <NavLink to="/profile" className={itemClass}>
          <ProfileIcon />
          Profile
        </NavLink>
      </div>
    </nav>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  )
}
function ShowsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  )
}
function StatsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M5 21V11M12 21V4M19 21v-6" />
    </svg>
  )
}
function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
