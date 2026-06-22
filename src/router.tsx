import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
  PublicOnly,
  RequireOnboarding,
  RequireProfile,
} from '@/features/auth/components/Guards'
import { OnboardingSplash } from '@/features/auth/pages/OnboardingSplash'
import { SignUp } from '@/features/auth/pages/SignUp'
import { SignIn } from '@/features/auth/pages/SignIn'
import { OAuthCallback } from '@/features/auth/pages/OAuthCallback'
import { UsernameSelect } from '@/features/auth/pages/UsernameSelect'
import { Home } from '@/features/home/pages/Home'

export const router = createBrowserRouter([
  {
    element: <PublicOnly />,
    children: [
      { path: '/', element: <OnboardingSplash /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/signup', element: <SignUp /> },
    ],
  },
  { path: '/auth/callback', element: <OAuthCallback /> },
  {
    element: <RequireOnboarding />,
    children: [{ path: '/username', element: <UsernameSelect /> }],
  },
  {
    element: <RequireProfile />,
    children: [{ path: '/home', element: <Home /> }],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
