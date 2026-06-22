import { cn } from '@/lib/utils/cn'

/** Wristband mark (handoff Option B): dark tile + orange band + "FR" stub. */
export function Logo({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      role="img"
      aria-label="FrontRow"
    >
      <rect width="56" height="56" rx="14" fill="#111118" />
      <rect x="10" y="22" width="36" height="12" rx="3" fill="#e8752a" />
      <line
        x1="28"
        y1="22"
        x2="28"
        y2="34"
        stroke="#0d0c16"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <text
        x="18"
        y="31.5"
        fill="#fff"
        fontFamily="Syne, sans-serif"
        fontSize="9"
        fontWeight="800"
        textAnchor="middle"
      >
        F
      </text>
      <text
        x="37"
        y="31.5"
        fill="#fff"
        fontFamily="Syne, sans-serif"
        fontSize="9"
        fontWeight="800"
        textAnchor="middle"
      >
        R
      </text>
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn('font-display text-2xl font-extrabold tracking-[-0.5px] text-fg', className)}
    >
      Front<span className="text-orange">Row</span>
    </span>
  )
}
