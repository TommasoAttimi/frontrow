import { z } from 'zod'

export const signUpSchema = z.object({
  username: z
    .string()
    .regex(/^[A-Za-z0-9_]{3,20}$/, '3–20 letters, numbers, or underscores'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})

export const usernameSchema = z.object({
  username: z
    .string()
    .regex(/^[A-Za-z0-9_]{3,20}$/, '3–20 letters, numbers, or underscores'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type UsernameInput = z.infer<typeof usernameSchema>
