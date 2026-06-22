import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Spinner } from '@/components/ui/Spinner'

/**
 * Landing route for the Google OAuth redirect. Supabase parses the session from
 * the URL on client init; we wait for it to appear, then let the route guards
 * decide whether to send the user to /username or /home.
 */
export function OAuthCallback() {
  const session = useAuthStore((s) => s.session)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 6000)
    return () => clearTimeout(t)
  }, [])

  if (session) return <Navigate to="/home" replace />
  if (timedOut) return <Navigate to="/signin" replace />

  return (
    <div className="flex min-h-screen items-center justify-center text-orange">
      <Spinner size={32} />
    </div>
  )
}
