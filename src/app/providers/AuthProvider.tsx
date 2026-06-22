import { useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import { Spinner } from '@/components/ui/Spinner'

/**
 * Initializes the Supabase session once on mount and keeps the auth store in
 * sync with auth state changes. Children render only after the initial session
 * check resolves, so route guards never flash the wrong screen.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const ready = useAuthStore((s) => s.ready)
  const setSession = useAuthStore((s) => s.setSession)
  const setReady = useAuthStore((s) => s.setReady)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [setSession, setReady])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-orange">
        <Spinner size={32} />
      </div>
    )
  }
  return <>{children}</>
}
