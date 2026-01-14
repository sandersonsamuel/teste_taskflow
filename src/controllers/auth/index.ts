import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserSchema, LoginSchema } from "@/schemas/user";
import AuthService from "@/services/auth";
import { AppError } from "@/utils/errors";

const register = async (request: FastifyRequest<{ Body: CreateUserSchema }>, reply: FastifyReply) => {

  try {
    const registerService = await AuthService.register(request.body)

    const { password, ...user } = registerService

    return reply.status(201).send({
      message: "Usuário cadastrado com sucesso",
      user
    })
  } catch (error) {

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    return reply.status(500).send({ message: "Internal server error" })
  }
}

const login = async (request: FastifyRequest<{ Body: LoginSchema }>, reply: FastifyReply) => {

  try {

    const loginService = await AuthService.login(request.body)

    const { password, ...user } = loginService

    const token = await reply.jwtSign({ id: user.id })

    reply.setCookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600
    }).send({
      message: "Usuário logado com sucesso",
      user
    })

  } catch (error) {

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    return reply.status(500).send({ message: "Internal server error" })
  }
}

export default {
  register,
  login
}