import { prisma } from "@/plugins/prisma";
import authService from "@/services/auth";
import { beforeEach, describe, expect, it } from "vitest";

const userTest = {
  name: "User test",
  email: `${crypto.randomUUID()}@example.com`,
  password: "123456"
}


describe("Integration: Login user", () => {

    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    it("should be able to login", async () => {

        const user = await authService.register(userTest)

        const response = await authService.login({
            email: userTest.email,
            password: userTest.password
        })

        expect(response).toHaveProperty("id")
        expect(response.id).toBe(user.id)
        expect(response.name).toBe(user.name)
        expect(response.email).toBe(user.email)
    })

    it("should not login with non-existing email", async () => {
        await expect(
            authService.login({
                email: "test@example.com",
                password: "123456"
            })
        ).rejects.toMatchObject({
            message: "Invalid credentials",
            statusCode: 401
        })
    })

    it("should not login with wrong password", async () => {
        await authService.register(userTest)

        await expect(
            authService.login({
                email: userTest.email,
                password: "password"
            })
        ).rejects.toMatchObject({
            message: "Invalid credentials",
            statusCode: 401
        })
    })
})