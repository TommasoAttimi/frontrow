export function SelectedChip({
  label,
  sublabel,
  onClear,
}: {
  label: string
  sublabel?: string
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-accent bg-orange-dim px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-medium text-fg">{label}</p>
        {sublabel && <p className="truncate font-body text-xs text-fg-subtle">{sublabel}</p>}
      </div>
      <button
        type="button"
        onClick={onClear}
        aria-label="Remove"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-fg-subtle transition hover:bg-white/10 hover:text-fg"
      >
        ✕
      </button>
    </div>
  )
}
