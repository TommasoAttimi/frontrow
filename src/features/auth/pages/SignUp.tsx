import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Wordmark } from '@/components/brand/Logo'
import { GoogleButton } from '../components/GoogleButton'
import { signUpWithEmail } from '../api/auth'
import { signUpSchema, type SignUpInput } from '../schemas'

export function SignUp() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })
  const [checkEmail, setCheckEmail] = useState(false)

  async function onSubmit(values: SignUpInput) {
    try {
      const data = await signUpWithEmail(values.email, values.password)
      // Email confirmation ON → no session yet. Routing handles the session case.
      if (!data.session) setCheckEmail(true)
    } catch (err) {
      setError('email', {
        message: err instanceof Error ? err.message : 'Sign-up failed',
      })
    }
  }

  if (checkEmail) {
    return (
      <AuthShell>
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.5px] text-fg">
          Check your email
        </h1>
        <p className="mt-3 font-body text-sm text-fg-subtle">
          We sent you a confirmation link. Tap it to finish creating your account,
          then come back and sign in.
        </p>
        <Link to="/signin" className="mt-6 inline-block font-body text-sm font-medium text-orange">
          Back to sign in
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <Wordmark />
      <h1 className="mt-8 font-display text-[28px] font-extrabold tracking-[-0.5px] text-fg">
        Create your account
      </h1>
      <p className="mt-2 font-body text-sm text-fg-subtle">
        Start logging the shows you live for.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
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
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>

      <Divider />
      <GoogleButton label="Sign up with Google" />

      <p className="mt-8 text-center font-body text-sm text-fg-subtle">
        Already have an account?{' '}
        <Link to="/signin" className="font-medium text-orange">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-center px-6 py-12">
      {children}
    </div>
  )
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="font-body text-xs text-fg-faint">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
