import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Wordmark } from '@/components/brand/Logo'
import { useProfile } from '@/features/auth/hooks/useProfile'
import { signOut } from '@/features/auth/api/auth'
import { useConcerts } from '@/features/concerts/hooks/useConcerts'
import { ConcertCard } from '@/features/concerts/components/ConcertCard'

export function Home() {
  const { data: profile } = useProfile()
  const { data: concerts, isLoading } = useConcerts()
  const queryClient = useQueryClient()

  async function handleSignOut() {
    await signOut()
    queryClient.clear()
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] px-6 pb-10 pt-10">
      <div className="flex items-center justify-between">
        <Wordmark />
        <button
          type="button"
          onClick={handleSignOut}
          className="font-body text-sm text-fg-subtle"
        >
          Sign out
        </button>
      </div>

      <p className="mt-8 font-body text-sm text-fg-subtle">
        Welcome back, <span className="text-fg">@{profile?.username}</span>
      </p>
      <p className="font-display text-2xl font-extrabold text-fg">
        {concerts?.length
          ? `${concerts.length} show${concerts.length === 1 ? '' : 's'} logged`
          : 'Your front row awaits'}
      </p>

      <div className="mt-6">
        <Link to="/log">
          <Button fullWidth>+ Log a Show</Button>
        </Link>
      </div>

      <h2 className="mb-3 mt-10 font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
        Recent shows
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-10 text-orange">
          <Spinner size={24} />
        </div>
      ) : concerts && concerts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {concerts.map((c) => (
            <ConcertCard key={c.id} concert={c} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-strong p-8 text-center">
          <p className="font-body text-sm text-fg-subtle">
            No shows yet. Log your first one above. 🎸
          </p>
        </div>
      )}
    </div>
  )
}
