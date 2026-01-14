import { Priority, TaskStatus as PrismaTaskStatus } from "@prisma/client"
import z from "zod/v4";

const taskStatusEnum = z.enum(Object.values(PrismaTaskStatus))
const priorityEnum = z.enum(Object.values(Priority))

export const getTaskByIdSchema = z.object({
  id: z.cuid(),
})

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
  status: taskStatusEnum,
  priority: priorityEnum.optional(),
  dueDate: z.date().optional(),
}).refine((data) => {
  if (data.dueDate) {
    return data.dueDate.getTime() >= Date.now()
  }
  return true
}, {
  message: "Data de vencimento não pode ser menor que a data atual",
  path: ["dueDate"]
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  status: taskStatusEnum.optional(),
  priority: priorityEnum.optional(),
  dueDate: z.date().optional(),
}).refine((data) => {
  if (data.dueDate) {
    return data.dueDate.getTime() >= Date.now()
  }
  return true
}, {
  message: "Data de vencimento não pode ser menor que a data atual",
  path: ["dueDate"]
})

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>

export const deleteTaskSchema = z.object({
  id: z.cuid(),
})

export const getTasksQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: priorityEnum.optional(),
  sortBy: z.enum(["dueDate", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
})

export type GetTasksQuerySchema = z.infer<typeof getTasksQuerySchema>