import { prisma } from "@/plugins/prisma";
import { beforeEach, describe, expect, it } from "vitest";
import taskService from '@/services/task'

const userTest = {
  name: "User test",
  email: `${crypto.randomUUID()}@example.com`,
  password: "123456"
}

describe("Integration: Create task", () => {

  beforeEach(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
  })

  it("should create a task successfully", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const taskData = {
      title: "New Task",
      description: "Task description",
    }

    const task = await taskService.create(taskData, user.id)

    expect(task).toHaveProperty("id")
    expect(task.title).toBe(taskData.title)
    expect(task.description).toBe(taskData.description)
    expect(task.userId).toBe(user.id)
    expect(task.status).toBe("PENDING")
    expect(task.priority).toBe("MEDIUM")
  })

  it("should create a task with custom status and priority", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const taskData = {
      title: "Urgent Task",
      description: "Important task",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const
    }

    const task = await taskService.create(taskData, user.id)

    expect(task.status).toBe("IN_PROGRESS")
    expect(task.priority).toBe("HIGH")
  })

  it("should create a task with due date", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const dueDate = new Date(Date.now() + 86400000) // 1 dia

    const taskData = {
      title: "Task with deadline",
      description: "Task description",
      status: "PENDING" as const,
      dueDate
    }

    const task = await taskService.create(taskData, user.id)

    expect(task.dueDate).toEqual(dueDate)
  })
})
