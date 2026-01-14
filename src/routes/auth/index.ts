import { FastifyInstance } from "fastify"
import authController from "@/controllers/auth"
import { createUserSchema, loginSchema } from "@/schemas/user"

export default async function (app: FastifyInstance) {
  app.post("/register", {
    schema: {
      tags: ["Auth"],
      summary: "Register a new user",
      body: createUserSchema,
    }
  }, authController.register)

  app.post("/login", {
    schema: {
      tags: ["Auth"],
      summary: "Login a user",
      body: loginSchema,
    }
  }, authController.login)
}