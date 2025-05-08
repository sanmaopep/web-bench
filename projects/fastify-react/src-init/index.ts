import Fastify, { FastifyInstance } from 'fastify'
import path from 'path'
import fastifyCookie from '@fastify/cookie'
import fastifyAutoload from '@fastify/autoload'
import fastifyStatic from '@fastify/static'

const fastify: FastifyInstance = Fastify({ logger: true })

fastify.register(fastifyCookie)
fastify.register(fastifyAutoload, {
  dir: path.join(__dirname, 'plugins')
})
fastify.register(fastifyStatic, {
  // files in client will be compiled to public
  root: path.join(__dirname, 'public'),
})

fastify.setNotFoundHandler((req, reply) => {
  if(req.url.startsWith('/api')) {
    return reply.status(404).send({ message: 'API Not Found' })
  }
  // send index.html for all other routes, let react-router in client side to handle the rest
  return reply.sendFile('index.html')
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
