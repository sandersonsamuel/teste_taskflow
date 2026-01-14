import { app } from '@/app'
import { describe, it, expect } from 'vitest'
import request from 'supertest'

const userTest = {
  name: "Usuário teste",
  email: `usuario-${Date.now()}@teste.com`,
  password: "123456",
}

describe('Task flow', () => {

  it('should be able log in and create a task.', async () => {

    const agent = request.agent(app.server)

    //registro
    await agent
      .post("/auth/register")
      .send(userTest).expect(201)

    //login
    const login = await agent
      .post("/auth/login")
      .send({
        email: userTest.email,
        password: userTest.password,
      }).expect(200)

    const cookies = login.headers['set-cookie']

    expect(cookies).toBeDefined()

    //criar tarefa
    const task = await agent
      .post("/tasks")
      .send({
        title: "Tarefa teste",
        description: "Descrição da tarefa teste",
      }).expect(201)

    expect(task.body.id).toBeDefined()
    expect(task.body.title).toBe("Tarefa teste")
  })
})

