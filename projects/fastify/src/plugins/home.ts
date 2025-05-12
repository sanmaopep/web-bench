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

import { FastifyPluginAsync } from 'fastify'
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

const home: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    const token = request.cookies.TOKEN;
    let username = null;
    let userRole = null;
    
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        username = payload.username;
        userRole = payload.role;
      } catch (err) {
        fastify.log.error(err);
      }
    }
    
    return reply.view('home.ejs', { 
      title: 'Shopping Mart',
      username,
      userRole
    })
  })

  fastify.get('/login', async (request, reply) => {
    return reply.view('login.ejs', { title: 'Login' })
  })
}

export default home