import { fastify } from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifyCors } from '@fastify/cors'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { routes } from "./routes";
import prismaPlugin from "./plugins/prisma"
import jwtPlugin from "./plugins/jwt"
import rateLimit from "@fastify/rate-limit"

export const app = fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>()

app.register(prismaPlugin)
app.register(jwtPlugin)
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(rateLimit, {
  max: 20,
  timeWindow: "1 minute",
})

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  credentials: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

app.register(routes)