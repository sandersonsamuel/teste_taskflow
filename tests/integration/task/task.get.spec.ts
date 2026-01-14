import { prisma } from "@/plugins/prisma";
import { beforeEach, describe, expect, it } from "vitest";
import taskService from '@/services/task'

const userTest = {
    name: "User test",
    email: `${crypto.randomUUID()}@example.com`,
    password: "123456"
}

describe("Integration: Get a task by id", () => {

    beforeEach(async () => {
        await prisma.task.deleteMany()
        await prisma.user.deleteMany()
    })

    it("should be able to get task by id", async () => {

        const user = await prisma.user.create({
            data: userTest
        })

        const task = await prisma.task.create({
            data: {
                title: "Task test",
                description: "Task test description",
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        const response = await taskService.getById(task.id)
        expect(response).toHaveProperty("id")
        expect(response.id).toBe(task.id)
    })

    it("should not be able to get task by id", async () => {
        await expect(
            taskService.getById("1")
        ).rejects.toMatchObject({
            message: "Task not found",
            statusCode: 404
        })
    })

    it("should be able to list tasks by userId", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        await prisma.task.create({
            data: {
                title: "Task test",
                description: "Task test description",
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        const response = await taskService.list({
            userId: user.id,
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc",
        })
        expect(response).toHaveProperty("tasks")
        expect(response).toHaveProperty("pagination")
        expect(response.tasks).toHaveLength(1)
        expect(response.pagination.total).toBe(1)
    })

    it("should not be able to get deleted task", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        const task = await prisma.task.create({
            data: {
                title: "Task test",
                description: "Task test description",
                userId: user.id,
                deletedAt: new Date()
            }
        })

        await expect(
            taskService.getById(task.id)
        ).rejects.toMatchObject({
            message: "Task not found",
            statusCode: 404
        })
    })

    it("should filter tasks by status", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        await prisma.task.createMany({
            data: [
                {
                    title: "Task 1",
                    description: "Description 1",
                    status: "PENDING",
                    userId: user.id
                },
                {
                    title: "Task 2",
                    description: "Description 2",
                    status: "IN_PROGRESS",
                    userId: user.id
                },
                {
                    title: "Task 3",
                    description: "Description 3",
                    status: "COMPLETED",
                    userId: user.id
                }
            ]
        })

        const response = await taskService.list({
            userId: user.id,
            status: "PENDING",
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(response.tasks).toHaveLength(1)
        expect(response.tasks[0].status).toBe("PENDING")
    })

    it("should filter tasks by priority", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        await prisma.task.createMany({
            data: [
                {
                    title: "Task 1",
                    description: "Description 1",
                    priority: "LOW",
                    userId: user.id
                },
                {
                    title: "Task 2",
                    description: "Description 2",
                    priority: "HIGH",
                    userId: user.id
                }
            ]
        })

        const response = await taskService.list({
            userId: user.id,
            priority: "HIGH",
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(response.tasks).toHaveLength(1)
        expect(response.tasks[0].priority).toBe("HIGH")
    })

    it("should paginate tasks correctly", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        await prisma.task.createMany({
            data: Array.from({ length: 5 }, (_, i) => ({
                title: `Task ${i + 1}`,
                description: `Description ${i + 1}`,
                userId: user.id
            }))
        })

        const page1 = await taskService.list({
            userId: user.id,
            page: 1,
            limit: 2,
            sortBy: "createdAt",
            order: "desc"
        })

        const page2 = await taskService.list({
            userId: user.id,
            page: 2,
            limit: 2,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(page1.tasks).toHaveLength(2)
        expect(page2.tasks).toHaveLength(2)
        expect(page1.pagination.total).toBe(5)
        expect(page1.pagination.totalPages).toBe(3)
        expect(page1.tasks[0].id).not.toBe(page2.tasks[0].id)
    })

    it("should order tasks correctly", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        const task1 = await prisma.task.create({
            data: {
                title: "A Task",
                description: "Description",
                userId: user.id
            }
        })

        const task2 = await prisma.task.create({
            data: {
                title: "B Task",
                description: "Description",
                userId: user.id
            }
        })

        const ascending = await taskService.list({
            userId: user.id,
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "asc"
        })

        const descending = await taskService.list({
            userId: user.id,
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(ascending.tasks[0].id).toBe(task1.id)
        expect(descending.tasks[0].id).toBe(task2.id)
    })

    it("should return empty list when no tasks exist", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        //padrao
        const response = await taskService.list({
            userId: user.id,
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(response.tasks).toHaveLength(0)
        expect(response.pagination.total).toBe(0)
        expect(response.pagination.totalPages).toBe(0)
    })

    it("should not list deleted tasks", async () => {
        const user = await prisma.user.create({
            data: userTest
        })

        await prisma.task.createMany({
            data: [
                {
                    title: "Active Task",
                    description: "Description",
                    userId: user.id
                },
                {
                    title: "Deleted Task",
                    description: "Description",
                    userId: user.id,
                    deletedAt: new Date()
                }
            ]
        })

        const response = await taskService.list({
            userId: user.id,
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(response.tasks).toHaveLength(1)
        expect(response.tasks[0].title).toBe("Active Task")
    })

    it("should only list tasks from the specified user", async () => {
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

        await prisma.task.createMany({
            data: [
                {
                    title: "User 1 Task",
                    description: "Description",
                    userId: user1.id
                },
                {
                    title: "User 2 Task",
                    description: "Description",
                    userId: user2.id
                }
            ]
        })

        const response = await taskService.list({
            userId: user1.id,
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc"
        })

        expect(response.tasks).toHaveLength(1)
        expect(response.tasks[0].title).toBe("User 1 Task")
    })
})