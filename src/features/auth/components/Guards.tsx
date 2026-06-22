import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProfile } from '../hooks/useProfile'
import { Spinner } from '@/components/ui/Spinner'

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center text-orange">
      <Spinner size={32} />
    </div>
  )
}

/** Signed in AND has a completed profile. The main app lives here. */
export function RequireProfile() {
  const session = useAuthStore((s) => s.session)
  const { data: profile, isLoading } = useProfile()
  if (!session) return <Navigate to="/" replace />
  if (isLoading) return <FullScreenLoader />
  if (!profile) return <Navigate to="/username" replace />
  return <Outlet />
}

/** Signed in but NO profile yet — the username-selection step. */
export function RequireOnboarding() {
  const session = useAuthStore((s) => s.session)
  const { data: profile, isLoading } = useProfile()
  if (!session) return <Navigate to="/" replace />
  if (isLoading) return <FullScreenLoader />
  if (profile) return <Navigate to="/home" replace />
  return <Outlet />
}

/** Public auth pages — bounce fully-onboarded users into the app. */
export function PublicOnly() {
  const session = useAuthStore((s) => s.session)
  const { data: profile, isLoading } = useProfile()
  if (session && isLoading) return <FullScreenLoader />
  if (session && profile) return <Navigate to="/home" replace />
  if (session && !profile) return <Navigate to="/username" replace />
  return <Outlet />
}
