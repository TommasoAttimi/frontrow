import { useEffect, useRef, useState } from 'react'
import { Input } from './Input'
import { Spinner } from './Spinner'

export interface ComboboxItem {
  id: string
  label: string
  sublabel?: string
}

interface ComboboxProps {
  search: (query: string) => Promise<ComboboxItem[]>
  onSelect: (item: ComboboxItem) => void
  onCreate?: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  allowCreate?: boolean
  autoFocus?: boolean
}

/** Search-or-create input: type to search a catalog, pick a result, or create. */
export function Combobox({
  search,
  onSelect,
  onCreate,
  placeholder,
  label,
  error,
  allowCreate = true,
  autoFocus,
}: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<ComboboxItem[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(search)
  searchRef.current = search

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        setItems(await searchRef.current(q))
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const q = query.trim()
  const hasExact = items.some((i) => i.label.toLowerCase() === q.toLowerCase())
  const showCreate = allowCreate && !!onCreate && q.length > 0 && !hasExact && !loading

  function choose(item: ComboboxItem) {
    onSelect(item)
    setQuery('')
    setItems([])
    setOpen(false)
  }

  function create() {
    onCreate?.(q)
    setQuery('')
    setItems([])
    setOpen(false)
  }

  return (
    <div className="relative">
      <Input
        label={label}
        error={error}
        value={query}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        trailing={loading ? <Spinner size={16} /> : undefined}
      />
      {open && q.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border-strong bg-surface py-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(item)}
                className="flex w-full flex-col items-start px-4 py-2.5 text-left transition hover:bg-white/[0.04]"
              >
                <span className="font-body text-sm text-fg">{item.label}</span>
                {item.sublabel && (
                  <span className="font-body text-xs text-fg-subtle">{item.sublabel}</span>
                )}
              </button>
            </li>
          ))}
          {showCreate && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={create}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition hover:bg-white/[0.04]"
              >
                <span className="font-body text-sm font-medium text-orange">
                  + Create “{q}”
                </span>
              </button>
            </li>
          )}
          {!loading && items.length === 0 && !showCreate && (
            <li className="px-4 py-2.5 font-body text-sm text-fg-subtle">No results</li>
          )}
        </ul>
      )}
    </div>
  )
}
