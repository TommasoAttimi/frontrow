import { cn } from '@/lib/utils/cn'

/** Wristband mark (exact handoff SVG): dark tile, orange band, perforation, "FR". */
export function Logo({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-label="FrontRow"
    >
      <rect width="80" height="80" rx="18" fill="#111118" />
      <rect x="8" y="28" width="64" height="24" rx="12" fill="#e8752a" />
      <line
        x1="56"
        y1="28"
        x2="56"
        y2="52"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
      <text
        x="28"
        y="44"
        textAnchor="middle"
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="12"
        fill="white"
      >
        FR
      </text>
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-lg font-extrabold tracking-[-0.3px] text-fg',
        className,
      )}
    >
      FrontRow
    </span>
  )
}
