import bcrypt from "bcryptjs"
import { prisma } from "@/plugins/prisma"
import { CreateUserSchema, LoginSchema } from "@/schemas/user"
import { AppError } from "@/utils/errors"

async function register({ email, password, name }: CreateUserSchema) {
  const userExists = await prisma.user.findUnique({
    where: { email }
  })

  if (userExists) {
    throw new AppError("User already exists", 409)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash
    }
  })
}

async function login({ email, password }: LoginSchema) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new AppError("Invalid credentials", 401)
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new AppError("Invalid credentials", 401)
  }

  return user
}

export default {
  register,
  login
}
