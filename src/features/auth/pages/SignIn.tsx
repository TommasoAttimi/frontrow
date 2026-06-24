import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BackHeader } from '@/components/layout/BackHeader'
import { GoogleButton } from '../components/GoogleButton'
import { signInWithEmail } from '../api/auth'
import { signInSchema, type SignInInput } from '../schemas'

export function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) })
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(values: SignInInput) {
    try {
      await signInWithEmail(values.email, values.password)
    } catch (err) {
      setError('password', {
        message: err instanceof Error ? err.message : 'Invalid email or password',
      })
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader />
      <div className="px-8 pb-10 pt-4">
        <h1 className="font-display text-[32px] font-extrabold leading-[1.1] tracking-[-0.8px] text-fg">
          Welcome back
        </h1>
        <p className="mt-2 font-body text-[15px] text-fg-faint">Pick up where you left off.</p>

        <div className="mt-6">
          <GoogleButton label="Continue with Google" />
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-body text-xs text-[#3a3a50]">or with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-fg-subtle"
              >
                <EyeIcon off={showPassword} />
              </button>
            }
            {...register('password')}
          />
          <Button type="submit" fullWidth loading={isSubmitting} className="mt-3">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-fg-subtle">
          New here?{' '}
          <Link to="/signup" className="font-medium text-orange">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      {off && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  )
}
