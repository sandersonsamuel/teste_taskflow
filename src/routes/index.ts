import { FastifyInstance } from "fastify";
import taskRoutes from "./task";
import authRoutes from "./auth";

export async function routes(app: FastifyInstance) {
  app.register(taskRoutes, { prefix: '/tasks' })
  app.register(authRoutes, { prefix: '/auth' })
}