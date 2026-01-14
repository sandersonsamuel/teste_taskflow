import { PrismaClient } from "@prisma/client"
import "@fastify/jwt"

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient,
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: {
      id: string
    }
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string
    }
  }
}
