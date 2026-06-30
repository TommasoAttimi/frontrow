import { AvatarTile } from '@/components/ui/AvatarTile'
import { Combobox, type ComboboxItem } from '@/components/ui/Combobox'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useUIStore'
import { searchProfiles, type FriendProfile } from '../api/friends'
import {
  useAcceptRequest,
  useFriends,
  useIncomingRequests,
  useRemoveFriendship,
  useSendFriendRequest,
} from '../hooks/useFriends'

export function FriendsTab() {
  const userId = useAuthStore((s) => s.user?.id)
  const friends = useFriends()
  const incoming = useIncomingRequests()
  const send = useSendFriendRequest()
  const accept = useAcceptRequest()
  const remove = useRemoveFriendship()

  async function search(q: string): Promise<ComboboxItem[]> {
    if (!userId) return []
    const results = await searchProfiles(q, userId)
    return results.map((p) => ({
      id: p.id,
      label: p.display_name || p.username,
      sublabel: `@${p.username}`,
    }))
  }

  function handleSelect(item: ComboboxItem) {
    send.mutate(item.id, {
      onSuccess: () => toast.success(`Request sent to ${item.label}`),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : 'Could not send request'),
    })
  }

  const requests = incoming.data ?? []
  const list = friends.data ?? []

  return (
    <div className="space-y-7">
      {/* Add friends */}
      <div>
        <SectionLabel>Add friends</SectionLabel>
        <Combobox
          search={search}
          onSelect={handleSelect}
          allowCreate={false}
          placeholder="Search by @username"
        />
      </div>

      {/* Incoming requests */}
      {requests.length > 0 && (
        <div>
          <SectionLabel>Requests · {requests.length}</SectionLabel>
          <div className="flex flex-col gap-2">
            {requests.map((r) => (
              <Row key={r.id} profile={r.profile}>
                <button
                  type="button"
                  onClick={() =>
                    accept.mutate(r.id, {
                      onSuccess: () => toast.success('Friend added'),
                    })
                  }
                  className="flex h-8 items-center rounded-lg bg-orange px-3 font-body text-[13px] font-semibold text-white active:scale-[0.97]"
                >
                  Accept
                </button>
                <button
                  type="button"
                  aria-label="Decline request"
                  onClick={() => remove.mutate(r.id)}
                  className="flex h-8 items-center rounded-lg border border-border-strong bg-white/[0.05] px-3 font-body text-[13px] font-medium text-fg-muted active:scale-[0.97]"
                >
                  Ignore
                </button>
              </Row>
            ))}
          </div>
        </div>
      )}

      {/* Friends */}
      <div>
        <SectionLabel>Friends · {list.length}</SectionLabel>
        {friends.isLoading ? (
          <div className="flex justify-center py-8 text-orange">
            <Spinner size={22} />
          </div>
        ) : list.length === 0 ? (
          <p className="py-6 text-center font-body text-sm text-fg-subtle">
            No friends yet. Search above to connect.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((f) => (
              <Row key={f.id} profile={f.profile}>
                <button
                  type="button"
                  aria-label="Remove friend"
                  onClick={() => {
                    if (window.confirm(`Remove @${f.profile.username}?`)) remove.mutate(f.id)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong bg-white/[0.05] text-fg-muted active:scale-[0.97]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </Row>
            ))}
          </div>
        )}
      </div>
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

function Row({ profile, children }: { profile: FriendProfile; children: React.ReactNode }) {
  const name = profile.display_name || profile.username
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] p-2.5">
      <AvatarTile name={name} size={40} radius={11} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-medium text-fg">{name}</p>
        <p className="truncate font-body text-xs text-fg-faint">@{profile.username}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  )
}
