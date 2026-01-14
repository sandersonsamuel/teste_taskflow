import fp from "fastify-plugin"
import fastifyJwt from "@fastify/jwt"
import { FastifyReply, FastifyRequest } from "fastify"
import fastifyCookie from "@fastify/cookie"

export default fp(async (app) => {

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET!,
  })

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
    sign: {
      expiresIn: "1h",
    },
  })

  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.cookies.token
      if (!token) return reply.status(401).send({ message: "Token não encontrado" })

      const decoded = app.jwt.verify(token) as { id: string }
      request.user = decoded
    } catch (err) {
      return reply.status(401).send({ message: "Não autorizado" })
    }
  })
})
