import Fastify, { FastifyInstance } from 'fastify'
import path from 'path'
import fastifyCookie from '@fastify/cookie'
import fastifyView from '@fastify/view'
import fastifyAutoload from '@fastify/autoload'
import fastifyStatic from '@fastify/static'
import ejs from 'ejs'

const fastify: FastifyInstance = Fastify({ logger: true })

fastify.register(fastifyCookie)
fastify.register(fastifyView, {
  engine: { ejs },
  root: path.join(__dirname, 'views'),
})
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})
fastify.register(fastifyAutoload, {
  dir: path.join(__dirname, 'plugins')
})

const start = async () => {
  try {
    await fastify.listen({ port: parseInt(process.env.PORT || '3005', 10) })
    console.log(`App listening: http://localhost:${process.env.PORT || 3005}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
