import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Combobox } from '@/components/ui/Combobox'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { toast } from '@/stores/useUIStore'
import { todayISO } from '@/lib/utils/dates'
import { searchArtists } from '../api/catalog'
import { VenueField } from './VenueField'
import {
  newDay,
  newStage,
  newPerf,
  type DayDraft,
  type FestivalDraft,
  type StageDraft,
} from '../festival'
import type { ArtistRole } from '@/types/domain'

const ROLE_OPTIONS = [
  { value: 'headliner', label: 'Headliner' },
  { value: 'support', label: 'Support' },
  { value: 'special_guest', label: 'Special guest' },
  { value: 'opener', label: 'Opener' },
] as const

export function FestivalForm({
  initial,
  submitLabel,
  loading,
  onSubmit,
}: {
  initial: FestivalDraft
  submitLabel: string
  loading?: boolean
  onSubmit: (draft: FestivalDraft) => void
}) {
  const [draft, setDraft] = useState<FestivalDraft>(initial)

  const mapDays = (fn: (days: DayDraft[]) => DayDraft[]) =>
    setDraft((d) => ({ ...d, days: fn(d.days) }))
  const mapDay = (dayKey: string, fn: (day: DayDraft) => DayDraft) =>
    mapDays((days) => days.map((d) => (d.key === dayKey ? fn(d) : d)))
  const mapStage = (dayKey: string, stageKey: string, fn: (s: StageDraft) => StageDraft) =>
    mapDay(dayKey, (d) => ({
      ...d,
      stages: d.stages.map((s) => (s.key === stageKey ? fn(s) : s)),
    }))

  function handleSubmit() {
    if (!draft.festival_name.trim()) return toast.error('Add a festival name')
    const hasAct = draft.days.some((d) =>
      d.stages.some((s) => s.performances.some((p) => p.artist)),
    )
    if (!draft.days.every((d) => d.date)) return toast.error('Each day needs a date')
    if (!hasAct) return toast.error('Add at least one act')
    onSubmit(draft)
  }

  return (
    <div className="flex flex-col gap-5 px-6 pb-28 pt-4">
      <Input
        label="Festival name"
        placeholder="Glastonbury"
        value={draft.festival_name}
        onChange={(e) => setDraft((d) => ({ ...d, festival_name: e.target.value }))}
      />

      <SegmentedControl
        label="Status"
        value={draft.status}
        onChange={(status) => setDraft((d) => ({ ...d, status }))}
        options={[
          { value: 'attended', label: 'Attended' },
          { value: 'planned', label: 'Planned' },
          { value: 'wishlist', label: 'Wishlist' },
        ]}
      />

      <VenueField value={draft.venue} onChange={(venue) => setDraft((d) => ({ ...d, venue }))} />

      <div className="space-y-4">
        <span className="block font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
          Days
        </span>

        {draft.days.map((day, dayIndex) => (
          <div key={day.key} className="rounded-2xl border border-border bg-white/[0.02] p-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-fg">Day {dayIndex + 1}</span>
              <input
                type="date"
                value={day.date}
                onChange={(e) =>
                  mapDay(day.key, (d) => ({ ...d, date: e.target.value }))
                }
                className="ml-auto h-9 rounded-lg border-[1.5px] border-border-strong bg-white/[0.04] px-3 font-body text-sm text-fg focus:border-orange focus:outline-none"
              />
              {draft.days.length > 1 && (
                <button
                  type="button"
                  aria-label="Remove day"
                  onClick={() => mapDays((days) => days.filter((d) => d.key !== day.key))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle transition hover:bg-white/10 hover:text-fg"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="mt-3 space-y-3">
              {day.stages.map((stage) => (
                <div key={stage.key} className="rounded-xl border border-border bg-white/[0.02] p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={stage.stage_name}
                      placeholder="Stage name (e.g. Pyramid)"
                      onChange={(e) =>
                        mapStage(day.key, stage.key, (s) => ({ ...s, stage_name: e.target.value }))
                      }
                      className="h-9 flex-1 rounded-lg border-[1.5px] border-border-strong bg-white/[0.04] px-3 font-body text-sm text-fg placeholder:text-fg-faint focus:border-orange focus:outline-none"
                    />
                    {day.stages.length > 1 && (
                      <button
                        type="button"
                        aria-label="Remove stage"
                        onClick={() =>
                          mapDay(day.key, (d) => ({
                            ...d,
                            stages: d.stages.filter((s) => s.key !== stage.key),
                          }))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-fg-subtle transition hover:bg-white/10 hover:text-fg"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="mt-2 space-y-2">
                    {stage.performances.map((perf) => (
                      <div
                        key={perf.key}
                        className="rounded-lg border border-border bg-white/[0.02] p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate font-body text-sm text-fg">
                            {perf.artist?.name}
                            {perf.artist && !perf.artist.id && (
                              <span className="text-fg-subtle"> · new</span>
                            )}
                          </span>
                          <select
                            value={perf.role}
                            onChange={(e) =>
                              mapStage(day.key, stage.key, (s) => ({
                                ...s,
                                performances: s.performances.map((p) =>
                                  p.key === perf.key
                                    ? { ...p, role: e.target.value as ArtistRole }
                                    : p,
                                ),
                              }))
                            }
                            className="h-8 rounded-lg border border-border-strong bg-white/[0.04] px-2 font-body text-xs text-fg focus:border-orange focus:outline-none"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            aria-label="Remove act"
                            onClick={() =>
                              mapStage(day.key, stage.key, (s) => ({
                                ...s,
                                performances: s.performances.filter((p) => p.key !== perf.key),
                              }))
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-subtle transition hover:bg-white/10 hover:text-fg"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="time"
                            value={perf.start_time}
                            onChange={(e) =>
                              mapStage(day.key, stage.key, (s) => ({
                                ...s,
                                performances: s.performances.map((p) =>
                                  p.key === perf.key ? { ...p, start_time: e.target.value } : p,
                                ),
                              }))
                            }
                            className="h-8 rounded-lg border border-border-strong bg-white/[0.04] px-2 font-body text-xs text-fg focus:border-orange focus:outline-none"
                          />
                          <span className="text-fg-faint">–</span>
                          <input
                            type="time"
                            value={perf.end_time}
                            onChange={(e) =>
                              mapStage(day.key, stage.key, (s) => ({
                                ...s,
                                performances: s.performances.map((p) =>
                                  p.key === perf.key ? { ...p, end_time: e.target.value } : p,
                                ),
                              }))
                            }
                            className="h-8 rounded-lg border border-border-strong bg-white/[0.04] px-2 font-body text-xs text-fg focus:border-orange focus:outline-none"
                          />
                          <label className="ml-auto flex items-center gap-1.5 font-body text-xs text-fg-muted">
                            <input
                              type="checkbox"
                              checked={perf.attended}
                              onChange={(e) =>
                                mapStage(day.key, stage.key, (s) => ({
                                  ...s,
                                  performances: s.performances.map((p) =>
                                    p.key === perf.key ? { ...p, attended: e.target.checked } : p,
                                  ),
                                }))
                              }
                              className="h-4 w-4 accent-orange"
                            />
                            Attended
                          </label>
                        </div>
                      </div>
                    ))}

                    <Combobox
                      placeholder="Add act…"
                      search={searchArtists}
                      onSelect={(item) =>
                        mapStage(day.key, stage.key, (s) => ({
                          ...s,
                          performances: [...s.performances, newPerf({ id: item.id, name: item.label })],
                        }))
                      }
                      onCreate={(text) =>
                        mapStage(day.key, stage.key, (s) => ({
                          ...s,
                          performances: [...s.performances, newPerf({ name: text })],
                        }))
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => mapDay(day.key, (d) => ({ ...d, stages: [...d.stages, newStage()] }))}
                className="font-body text-sm font-medium text-orange"
              >
                + Add stage
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            mapDays((days) => [
              ...days,
              newDay(days[days.length - 1]?.date || todayISO()),
            ])
          }
          className="w-full rounded-xl border border-dashed border-border-strong py-3 font-body text-sm font-medium text-fg-muted transition hover:text-fg"
        >
          + Add day
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[440px] border-t border-border bg-app/90 p-4 backdrop-blur">
        <Button type="button" fullWidth loading={loading} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
