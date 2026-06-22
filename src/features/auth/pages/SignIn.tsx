import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Wordmark } from '@/components/brand/Logo'
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

  async function onSubmit(values: SignInInput) {
    try {
      await signInWithEmail(values.email, values.password)
      // Session set → route guards redirect into the app.
    } catch (err) {
      setError('password', {
        message: err instanceof Error ? err.message : 'Invalid email or password',
      })
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-center px-6 py-12">
      <Wordmark />
      <h1 className="mt-8 font-display text-[28px] font-extrabold tracking-[-0.5px] text-fg">
        Welcome back
      </h1>
      <p className="mt-2 font-body text-sm text-fg-subtle">
        Pick up where you left off.
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
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-body text-xs text-fg-faint">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton label="Sign in with Google" />

      <p className="mt-8 text-center font-body text-sm text-fg-subtle">
        New here?{' '}
        <Link to="/signup" className="font-medium text-orange">
          Create an account
        </Link>
      </p>
    </div>
  )
}
