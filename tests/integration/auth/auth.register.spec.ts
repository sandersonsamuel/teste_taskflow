import { prisma } from '@/plugins/prisma'
import authService from '@/services/auth'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

const userTest = {
  name: "User test",
  email: `${crypto.randomUUID()}@example.com`,
  password: "123456"
}

describe("Integration: Register user", () => {

    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    it("should be able to create a user", async () => {

        const user = await authService.register(userTest)

        expect(user).toHaveProperty("id")
        expect(user.name).toBe(userTest.name)
        expect(user.email).toBe(userTest.email)
        await expect(compare(userTest.password, user.password)).resolves.toBe(true)

        const userInDB = await prisma.user.findUnique({
            where: {
                email: userTest.email
            }
        })

        expect(userInDB).not.toBeNull()
    })

    it("should not allow duplicate user", async () => {

        await authService.register(userTest)

        await expect(
            authService.register(userTest)
        ).rejects.toMatchObject({
            message: "User already exists",
            statusCode: 409
        })

        const countUsersInDB = await prisma.user.count()

        expect(countUsersInDB).toBe(1)

    })
})