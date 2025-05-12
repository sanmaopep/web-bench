// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
  
  if (req.url.startsWith('/admin')) {
    const token = req.cookies.TOKEN;
    if (!token) {
      return reply.redirect('/login');
    }
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