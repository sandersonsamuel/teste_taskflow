import { prisma } from "@/plugins/prisma";
import { beforeEach, describe, expect, it } from "vitest";
import taskService from '@/services/task'

const userTest = {
  name: "User test",
  email: `${crypto.randomUUID()}@example.com`,
  password: "123456"
}

describe("Integration: Update task (PUT)", () => {

  beforeEach(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
  })

  it("should update a task successfully", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const task = await prisma.task.create({
      data: {
        title: "Original Title",
        description: "Original Description",
        userId: user.id
      }
    })

    const updateData = {
      title: "Updated Title",
      description: "Updated Description"
    }

    const updatedTask = await taskService.update(task.id, updateData, user.id)

    expect(updatedTask.title).toBe(updateData.title)
    expect(updatedTask.description).toBe(updateData.description)
  })

  it("should update task status and priority", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const task = await prisma.task.create({
      data: {
        title: "Task",
        description: "Description",
        status: "PENDING",
        priority: "LOW",
        userId: user.id
      }
    })

    const updateData = {
      status: "COMPLETED" as const,
      priority: "HIGH" as const
    }

    const updatedTask = await taskService.update(task.id, updateData, user.id)

    expect(updatedTask.status).toBe("COMPLETED")
    expect(updatedTask.priority).toBe("HIGH")
  })

  it("should not update task from another user", async () => {
    const user1 = await prisma.user.create({
      data: userTest
    })

    const user2 = await prisma.user.create({
      data: {
        name: "User 2",
        email: `${crypto.randomUUID()}@example.com`,
        password: "123456"
      }
    })

    const task = await prisma.task.create({
      data: {
        title: "User 1 Task",
        description: "Description",
        userId: user1.id
      }
    })

    await expect(
      taskService.update(task.id, { title: "Hacked" }, user2.id)
    ).rejects.toMatchObject({
      message: "Unauthorized to update task",
      statusCode: 403
    })
  })

  it("should not update non-existent task", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    await expect(
      taskService.update("non-existent-id", { title: "Updated" }, user.id)
    ).rejects.toMatchObject({
      message: "Task not found",
      statusCode: 404
    })
  })

  it("should not update deleted task", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const task = await prisma.task.create({
      data: {
        title: "Task",
        description: "Description",
        userId: user.id,
        deletedAt: new Date()
      }
    })

    await expect(
      taskService.update(task.id, { title: "Updated" }, user.id)
    ).rejects.toMatchObject({
      message: "Task not found",
      statusCode: 404
    })
  })
})
