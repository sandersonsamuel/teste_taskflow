import { z } from "zod/v4"

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
export type LoginSchema = z.infer<typeof loginSchema>