import TaskController from "@/controllers/task"
import { createTaskSchema, getTaskByIdSchema, getTasksQuerySchema, updateTaskSchema, deleteTaskSchema } from "@/schemas/task"
import { FastifyInstance } from "fastify"

export default async function (app: FastifyInstance) {
  app.post("/", {
    preValidation: [app.authenticate],
    schema: {
      body: createTaskSchema,
      tags: ["Task"],
      summary: "Create a new task",
    }
  }, TaskController.create)

  app.get("/", {
    preValidation: [app.authenticate],
    schema: {
      querystring: getTasksQuerySchema,
      tags: ["Task"],
      summary: "List tasks with filters and pagination",
    }
  }, TaskController.list)

  app.get("/:id", {
    preValidation: [app.authenticate],
    schema: {
      params: getTaskByIdSchema,
      tags: ["Task"],
      summary: "Get a task by id",
    }
  }, TaskController.getById)

  app.put("/:id", {
    preValidation: [app.authenticate],
    schema: {
      params: getTaskByIdSchema,
      body: updateTaskSchema,
      tags: ["Task"],
      summary: "Update a task by id",
    }
  }, TaskController.update)

  app.delete("/:id", {
    preValidation: [app.authenticate],
    schema: {
      params: deleteTaskSchema,
      tags: ["Task"],
      summary: "Delete a task by id",
    }
  }, TaskController.remove)
}