import { cn } from '@/lib/utils/cn'

// Duotone gradient palette (135deg) taken from the design handoff.
const GRADIENTS: [string, string][] = [
  ['#1a1a2e', '#2d1b4e'],
  ['#1a2a1a', '#0d3020'],
  ['#2a1a1a', '#3d1515'],
  ['#1a2a3a', '#0a1a2a'],
  ['#3d1b4e', '#1b3d4e'],
  ['#1e1028', '#40183e'],
  ['#1b4e2a', '#4e1b1b'],
  ['#4e2a1b', '#1b4e3d'],
  ['#2e1a0a', '#0a1e2e'],
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// 45° diagonal stripe overlay (matches the SVG pattern in the handoff).
const STRIPES =
  'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 3px, transparent 3px 6px)'

/** Square gradient tile with initials — the signature artist/festival avatar. */
export function AvatarTile({
  name,
  size = 52,
  radius = 12,
  brand = false,
  className,
}: {
  name: string
  size?: number
  radius?: number
  brand?: boolean
  className?: string
}) {
  const [c1, c2] = GRADIENTS[hash(name) % GRADIENTS.length]
  const background = brand
    ? 'linear-gradient(135deg, #e8752a 0%, #c45520 100%)'
    : `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`

  return (
    <div
      aria-hidden="true"
      className={cn('relative flex shrink-0 items-center justify-center overflow-hidden', className)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background,
        border: brand ? '2px solid rgba(232,117,42,0.3)' : undefined,
      }}
    >
      {!brand && <div className="absolute inset-0" style={{ backgroundImage: STRIPES }} />}
      <span
        className="relative z-[1] font-display font-bold"
        style={{
          fontSize: Math.round(size * 0.26),
          color: brand ? '#fff' : 'rgba(255,255,255,0.35)',
        }}
      >
        {initialsOf(name)}
      </span>
    </div>
  )
}
