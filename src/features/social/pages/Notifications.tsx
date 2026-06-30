import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { BackHeader } from '@/components/layout/BackHeader'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import type { Notification } from '@/types/domain'
import { useMarkAllRead, useNotifications } from '../hooks/useNotifications'

export function Notifications() {
  const navigate = useNavigate()
  const { data, isLoading } = useNotifications()
  const markAllRead = useMarkAllRead()
  const hasUnread = (data ?? []).some((n) => !n.read_at)

  // Clear the unread badge once the screen is opened.
  useEffect(() => {
    if (hasUnread) markAllRead.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnread])

  const list = data ?? []

  function handleClick(n: Notification) {
    const payload = (n.data ?? {}) as { concert_id?: string }
    if (payload.concert_id) navigate(`/show/${payload.concert_id}`)
    else navigate('/profile')
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader title="Notifications" />
      {isLoading ? (
        <div className="flex justify-center py-20 text-orange">
          <Spinner size={26} />
        </div>
      ) : list.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p className="font-display text-lg font-bold text-fg">All caught up</p>
          <p className="mt-2 font-body text-sm text-fg-subtle">
            Friend requests and concert tags will show up here.
          </p>
        </div>
      ) : (
        <ul className="px-4 py-3">
          {list.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => handleClick(n)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition active:scale-[0.99]',
                  n.read_at ? 'bg-transparent' : 'bg-orange/[0.06]',
                )}
              >
                <NotificationIcon type={n.type} />
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm leading-snug text-fg">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 font-body text-[13px] text-fg-subtle">{n.body}</p>
                  )}
                  <p className="mt-1 font-body text-[11px] text-fg-faint">
                    {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!n.read_at && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NotificationIcon({ type }: { type: string }) {
  const isBuddy = type.startsWith('buddy')
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-orange-dim text-orange">
      {isBuddy ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}
