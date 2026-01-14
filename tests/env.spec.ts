import { describe, it, expect } from 'vitest'

describe("Env Check", () => {
    it("should have DATABASE_URL", () => {
        console.log("DATABASE_URL:", process.env.DATABASE_URL)
        expect(process.env.DATABASE_URL).toBeDefined()
    })
})
