import { useNavigate } from 'react-router-dom'

export function BackHeader({
  title,
  onBack,
  right,
}: {
  title?: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-border bg-app/80 px-3 backdrop-blur">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition hover:bg-white/[0.05]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {title && <h1 className="font-display text-lg font-bold text-fg">{title}</h1>}
      {right && <div className="ml-auto">{right}</div>}
    </header>
  )
}
