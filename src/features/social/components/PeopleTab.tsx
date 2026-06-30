import { useMemo } from 'react'
import { AvatarTile } from '@/components/ui/AvatarTile'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useUIStore'
import { cn } from '@/lib/utils/cn'
import type { BuddyStatus } from '@/types/domain'
import { useFriends } from '../hooks/useFriends'
import { useAddBuddy, useBuddies, useRemoveBuddy, useRespondToBuddy } from '../hooks/useBuddies'

const STATUS: Record<BuddyStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-white/[0.06] text-fg-faint' },
  confirmed: { label: 'Confirmed', className: 'bg-success/[0.12] text-success' },
  declined: { label: 'Declined', className: 'bg-white/[0.04] text-fg-disabled' },
}

export function PeopleTab({ concertId, ownerId }: { concertId: string; ownerId: string }) {
  const userId = useAuthStore((s) => s.user?.id)
  const isOwner = userId === ownerId

  const buddies = useBuddies(concertId)
  const friends = useFriends()
  const add = useAddBuddy(concertId)
  const remove = useRemoveBuddy(concertId)
  const respond = useRespondToBuddy(concertId)

  const taggedIds = useMemo(
    () => new Set((buddies.data ?? []).map((b) => b.tagged_user_id)),
    [buddies.data],
  )
  const addable = useMemo(
    () => (friends.data ?? []).filter((f) => !taggedIds.has(f.profile.id)),
    [friends.data, taggedIds],
  )

  if (buddies.isLoading) {
    return (
      <div className="flex justify-center py-8 text-orange">
        <Spinner size={22} />
      </div>
    )
  }

  const list = buddies.data ?? []

  return (
    <div className="space-y-7">
      {/* Tagged people */}
      <div>
        <SectionLabel>Buddies · {list.length}</SectionLabel>
        {list.length === 0 ? (
          <p className="py-4 text-center font-body text-sm text-fg-subtle">
            {isOwner
              ? 'Tag friends who were there with you.'
              : 'No one has been tagged yet.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((b) => {
              const name = b.profile.display_name || b.profile.username
              const meTagged = b.tagged_user_id === userId
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] p-2.5"
                >
                  <AvatarTile name={name} size={40} radius={11} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-medium text-fg">{name}</p>
                    <p className="truncate font-body text-xs text-fg-faint">@{b.profile.username}</p>
                  </div>
                  {/* Tagged user can confirm/decline their own pending tag */}
                  {meTagged && b.status === 'pending' ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          respond.mutate(
                            { buddyId: b.id, status: 'confirmed' },
                            { onSuccess: () => toast.success('Confirmed') },
                          )
                        }
                        className="flex h-8 items-center rounded-lg bg-orange px-3 font-body text-[13px] font-semibold text-white active:scale-[0.97]"
                      >
                        I was there
                      </button>
                      <button
                        type="button"
                        aria-label="Decline tag"
                        onClick={() => respond.mutate({ buddyId: b.id, status: 'declined' })}
                        className="flex h-8 items-center rounded-lg border border-border-strong bg-white/[0.05] px-3 font-body text-[13px] font-medium text-fg-muted active:scale-[0.97]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          'flex h-7 items-center rounded-lg px-2.5 font-body text-[11px] font-semibold',
                          STATUS[b.status].className,
                        )}
                      >
                        {STATUS[b.status].label}
                      </span>
                      {isOwner && (
                        <button
                          type="button"
                          aria-label="Remove buddy"
                          onClick={() => remove.mutate(b.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-strong bg-white/[0.05] text-fg-muted active:scale-[0.97]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Owner: tag a friend */}
      {isOwner && (
        <div>
          <SectionLabel>Tag a friend</SectionLabel>
          {friends.isLoading ? (
            <div className="flex justify-center py-6 text-orange">
              <Spinner size={20} />
            </div>
          ) : (friends.data ?? []).length === 0 ? (
            <p className="py-4 text-center font-body text-sm text-fg-subtle">
              Add friends from your profile to tag them here.
            </p>
          ) : addable.length === 0 ? (
            <p className="py-4 text-center font-body text-sm text-fg-subtle">
              All your friends are already tagged.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {addable.map((f) => {
                const name = f.profile.display_name || f.profile.username
                return (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] p-2.5"
                  >
                    <AvatarTile name={name} size={36} radius={10} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-medium text-fg">{name}</p>
                      <p className="truncate font-body text-xs text-fg-faint">
                        @{f.profile.username}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        add.mutate(f.profile.id, {
                          onSuccess: () => toast.success(`Tagged ${name}`),
                          onError: (err) =>
                            toast.error(
                              err instanceof Error ? err.message : 'Could not tag buddy',
                            ),
                        })
                      }
                      className="flex h-8 shrink-0 items-center rounded-lg border border-orange/30 bg-orange-dim px-3 font-body text-[13px] font-semibold text-orange active:scale-[0.97]"
                    >
                      + Tag
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-disabled">
      {children}
    </p>
  )
}
