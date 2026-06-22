import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useUIStore'
import { checkUsernameAvailable, createProfile } from '../api/profile'
import { usernameSchema, type UsernameInput } from '../schemas'
import type { Profile } from '@/types/domain'

type Availability = 'idle' | 'checking' | 'available' | 'taken'

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/

export function UsernameSelect() {
  const userId = useAuthStore((s) => s.user?.id as string)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UsernameInput>({ resolver: zodResolver(usernameSchema), mode: 'onChange' })

  const username = watch('username')
  const [availability, setAvailability] = useState<Availability>('idle')

  // Debounced live availability check against the username_available RPC.
  useEffect(() => {
    if (!username || !USERNAME_RE.test(username)) {
      setAvailability('idle')
      return
    }
    setAvailability('checking')
    const t = setTimeout(async () => {
      try {
        const ok = await checkUsernameAvailable(username)
        setAvailability(ok ? 'available' : 'taken')
      } catch {
        setAvailability('idle')
      }
    }, 400)
    return () => clearTimeout(t)
  }, [username])

  const mutation = useMutation({
    mutationFn: (name: string) => createProfile({ id: userId, username: name }),
    onSuccess: (profile: Profile) => {
      queryClient.setQueryData(['profile', userId], profile)
      toast.success('Welcome to FrontRow')
      navigate('/home', { replace: true })
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : ''
      toast.error(/duplicate|unique/i.test(msg) ? 'That username is taken' : 'Could not save username')
      if (/duplicate|unique/i.test(msg)) setAvailability('taken')
    },
  })

  function onSubmit(values: UsernameInput) {
    if (availability === 'taken') return
    mutation.mutate(values.username)
  }

  const trailing =
    availability === 'checking' ? (
      <span className="text-fg-subtle">
        <Spinner size={16} />
      </span>
    ) : availability === 'available' ? (
      <span className="text-sm font-bold text-success">✓</span>
    ) : availability === 'taken' ? (
      <span className="text-sm font-bold text-error">✕</span>
    ) : null

  const liveError =
    availability === 'taken' ? 'That username is taken' : errors.username?.message

  const canSubmit =
    USERNAME_RE.test(username ?? '') && availability !== 'taken' && availability !== 'checking'

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-center px-6 py-12">
      <h1 className="font-display text-[28px] font-extrabold tracking-[-0.5px] text-fg">
        Pick your username
      </h1>
      <p className="mt-2 font-body text-sm text-fg-subtle">
        This is how friends will find and tag you. You can’t change it later.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="Username"
          placeholder="frontrow_fan"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          trailing={trailing}
          valid={availability === 'available'}
          error={liveError}
          hint={!liveError ? '3–20 letters, numbers, or underscores · shown as @username' : undefined}
          {...register('username')}
        />
        <Button type="submit" fullWidth loading={mutation.isPending} disabled={!canSubmit} className="mt-2">
          Continue
        </Button>
      </form>
    </div>
  )
}
