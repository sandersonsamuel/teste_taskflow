import { Priority, TaskStatus } from "@prisma/client"

export interface ListTasksParams {
  userId: string
  status?: string
  priority?: string
  sortBy: "dueDate" | "createdAt"
  order: "asc" | "desc"
  page: number
  limit: number
}

export interface ListTasksWhere {
  userId: string
  deletedAt: null
  status?: TaskStatus
  priority?: Priority
}