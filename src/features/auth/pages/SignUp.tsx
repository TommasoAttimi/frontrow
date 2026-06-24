import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BackHeader } from '@/components/layout/BackHeader'
import { GoogleButton } from '../components/GoogleButton'
import { signUpWithEmail } from '../api/auth'
import { checkUsernameAvailable, createProfile } from '../api/profile'
import { signUpSchema, type SignUpInput } from '../schemas'

export function SignUp() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })
  const [showPassword, setShowPassword] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const queryClient = useQueryClient()

  async function onSubmit(values: SignUpInput) {
    try {
      const available = await checkUsernameAvailable(values.username)
      if (!available) {
        setError('username', { message: 'That username is taken' })
        return
      }
      const data = await signUpWithEmail(values.email, values.password, values.username)
      if (data.session && data.user) {
        // Email confirmation off → we have a session; create the profile now.
        const profile = await createProfile({ id: data.user.id, username: values.username })
        queryClient.setQueryData(['profile', data.user.id], profile)
        // Route guards redirect to /home once the profile query is populated.
      } else {
        setCheckEmail(true)
      }
    } catch (err) {
      setError('email', {
        message: err instanceof Error ? err.message : 'Sign-up failed',
      })
    }
  }

  if (checkEmail) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[440px]">
        <BackHeader />
        <div className="px-8 pt-4">
          <h1 className="font-display text-[28px] font-extrabold tracking-[-0.5px] text-fg">
            Check your email
          </h1>
          <p className="mt-3 font-body text-sm text-fg-subtle">
            We sent a confirmation link. Tap it to finish creating your account, then
            sign in.
          </p>
          <Link to="/signin" className="mt-6 inline-block font-body text-sm font-medium text-orange">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px]">
      <BackHeader />
      <div className="px-8 pb-10 pt-4">
        <h1 className="font-display text-[32px] font-extrabold leading-[1.1] tracking-[-0.8px] text-fg">
          Create your
          <br />
          account
        </h1>
        <p className="mt-2 font-body text-[15px] text-fg-faint">
          Start logging your live music story.
        </p>

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
            label="Username"
            leading={<span className="font-body text-sm">@</span>}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="username"
            error={errors.username?.message}
            {...register('username')}
          />
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center font-body text-[11px] leading-[1.5] text-[#3a3a50]">
          By continuing you agree to FrontRow's{' '}
          <span className="text-fg-faint underline">Terms</span> &{' '}
          <span className="text-fg-faint underline">Privacy Policy</span>
        </p>

        <p className="mt-6 text-center font-body text-sm text-fg-subtle">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-orange">
            Sign in
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
