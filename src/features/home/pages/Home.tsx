import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Wordmark } from '@/components/brand/Logo'
import { useProfile } from '@/features/auth/hooks/useProfile'
import { signOut } from '@/features/auth/api/auth'

/**
 * Placeholder dashboard — confirms the full auth → profile flow works end to
 * end. Sprint 3 replaces this with the real Home (stats strip, recent shows).
 */
export function Home() {
  const { data: profile } = useProfile()
  const queryClient = useQueryClient()

  async function handleSignOut() {
    await signOut()
    queryClient.clear()
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-6 py-10">
      <Wordmark />
      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <p className="font-body text-sm text-fg-subtle">Signed in as</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-fg">
          @{profile?.username}
        </p>
      </div>
      <p className="mt-6 font-body text-sm text-fg-subtle">
        🎸 Your dashboard lands in Sprint 3. Auth is wired up and working.
      </p>
      <div className="mt-auto">
        <Button variant="secondary" fullWidth onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
