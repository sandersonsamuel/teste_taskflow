import { prisma } from "@/plugins/prisma";
import { beforeEach, describe, expect, it } from "vitest";
import taskService from '@/services/task'

const userTest = {
  name: "User test",
  email: `${crypto.randomUUID()}@example.com`,
  password: "123456"
}

describe("Integration: Delete task (DELETE)", () => {

  beforeEach(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
  })

  it("should delete a task successfully (soft delete)", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const task = await prisma.task.create({
      data: {
        title: "Task to delete",
        description: "Description",
        userId: user.id
      }
    })

    const result = await taskService.remove(task.id, user.id)

    expect(result).toHaveProperty("message")

    const deletedTask = await prisma.task.findUnique({
      where: { id: task.id }
    })

    expect(deletedTask).not.toBeNull()
    expect(deletedTask?.deletedAt).not.toBeNull()
  })

  it("should not delete task from another user", async () => {
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
      taskService.remove(task.id, user2.id)
    ).rejects.toMatchObject({
      message: "Unauthorized to delete task",
      statusCode: 403
    })
  })

  it("should not delete non-existent task", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    await expect(
      taskService.remove("non-existent-id", user.id)
    ).rejects.toMatchObject({
      message: "Task not found",
      statusCode: 404
    })
  })

  it("should not delete already deleted task", async () => {
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
      taskService.remove(task.id, user.id)
    ).rejects.toMatchObject({
      message: "Task not found",
      statusCode: 404
    })
  })

  it("should not retrieve deleted task", async () => {
    const user = await prisma.user.create({
      data: userTest
    })

    const task = await prisma.task.create({
      data: {
        title: "Task",
        description: "Description",
        userId: user.id
      }
    })

    await taskService.remove(task.id, user.id)

    await expect(
      taskService.getById(task.id)
    ).rejects.toMatchObject({
      message: "Task not found",
      statusCode: 404
    })
  })
})
