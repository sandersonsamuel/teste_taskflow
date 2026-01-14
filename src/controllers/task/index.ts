import { CreateTaskSchema, GetTasksQuerySchema, UpdateTaskSchema } from "@/schemas/task"
import { FastifyReply, FastifyRequest } from "fastify"
import taskService from "@/services/task"

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = request.body as CreateTaskSchema
  const userId = request.user.id

  const task = await taskService.create(body, userId)

  return reply.status(201).send(task)
}

const list = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as GetTasksQuerySchema
  const userId = request.user.id

  const result = await taskService.list({
    userId,
    status: query.status,
    priority: query.priority,
    sortBy: query.sortBy,
    order: query.order,
    page: query.page,
    limit: query.limit
  })

  return reply.status(200).send(result)
}

const getById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string }

  const task = await taskService.getById(id)

  return reply.status(200).send(task)
}

const update = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string }
  const body = request.body as UpdateTaskSchema
  const userId = request.user.id

  const task = await taskService.update(id, body, userId)

  return reply.status(200).send(task)
}

const remove = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string }
  const userId = request.user.id

  const result = await taskService.remove(id, userId)

  return reply.status(200).send(result)
}

export default {
  create,
  list,
  getById,
  update,
  remove
}