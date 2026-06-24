import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { useProfile } from '@/features/auth/hooks/useProfile'
import { signOut } from '@/features/auth/api/auth'

export function Profile() {
  const { data: profile } = useProfile()
  const queryClient = useQueryClient()

  async function handleSignOut() {
    await signOut()
    queryClient.clear()
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col px-6 pt-10">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-dim font-display text-2xl font-extrabold text-orange">
          {(profile?.username ?? '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-xl font-extrabold text-fg">
            {profile?.display_name ?? profile?.username}
          </p>
          <p className="font-body text-sm text-fg-subtle">@{profile?.username}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-border-strong p-8 text-center">
        <p className="font-body text-sm text-fg-subtle">
          Profile editing, settings, privacy, and your shareable card arrive in later sprints.
        </p>
      </div>

      <div className="mt-auto pt-8">
        <Button variant="secondary" fullWidth onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
