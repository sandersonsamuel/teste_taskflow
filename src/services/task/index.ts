import { prisma } from "@/plugins/prisma";
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/task";
import { ListTasksParams, ListTasksWhere } from "@/types/task";
import { AppError } from "@/utils/errors";
import { Priority, TaskStatus } from "@prisma/client";

async function create({ title, description, status, dueDate, priority }: CreateTaskSchema, userId: string) {

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate,
      priority,
      userId
    }
  })

  return newTask
}

async function list({ userId, status, priority, sortBy, order, page, limit }: ListTasksParams) {
  const where: ListTasksWhere = {
    userId,
    deletedAt: null
  }

  if (status) {
    where.status = status as TaskStatus
  }

  if (priority) {
    where.priority = priority as Priority
  }

  //paraela
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: {
        [sortBy]: order
      },
      skip: (page - 1) * limit,
      take: limit
    }),

    prisma.task.count({ where })
  ])

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

async function getById(id: string) {
  const task = await prisma.task.findUnique({
    where: {
      id,
      deletedAt: null
    }
  })

  if (!task) {
    throw new AppError("Task not found", 404)
  }

  return task
}

async function update(id: string, data: UpdateTaskSchema, userId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id,
      deletedAt: null
    }
  })

  if (!task) {
    throw new AppError("Task not found", 404)
  }

  if (task.userId !== userId) {
    throw new AppError("Unauthorized to update task", 403)
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data
  })

  return updatedTask
}

async function remove(id: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id,
      deletedAt: null
    }
  })

  if (!task) {
    throw new AppError("Task not found", 404)
  }

  if (task.userId !== userId) {
    throw new AppError("Unauthorized to delete task", 403)
  }

  await prisma.task.update({
    where: { id },
    data: {
      deletedAt: new Date()
    }
  })

  return { message: "Task deleted successfully" }
}

export default {
  create,
  list,
  getById,
  update,
  remove
}