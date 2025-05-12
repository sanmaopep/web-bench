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

import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { db } from '../libs/db';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

interface User {
  username: string;
  role: string;
  coin: number;
}

const adminPlugin: FastifyPluginAsync = async (fastify) => {
  // Middleware to check admin access
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/admin') || request.url.startsWith('/admin')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        if (request.url.startsWith('/api/admin')) {
          reply.status(401).send({ success: false, message: 'Not authenticated' });
        } else {
          reply.redirect('/login');
        }
        return;
      }
      
      try {
        const { payload } = await jose.jwtVerify(token, SECRET);
        const role = payload.role as string;
        
        if (role !== 'admin') {
          if (request.url.startsWith('/api/admin')) {
            reply.status(403).send({ success: false, message: 'Unauthorized' });
          } else {
            reply.redirect('/login');
          }
          return;
        }
      } catch (error) {
        if (request.url.startsWith('/api/admin')) {
          reply.status(401).send({ success: false, message: 'Invalid token' });
        } else {
          reply.redirect('/login');
        }
        return;
      }
    }
  });

  fastify.get('/api/admin/users', async (request, reply) => {
    return new Promise<{ success: boolean; users: User[] }>((resolve, reject) => {
      db.all('SELECT username, role, coin FROM users', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          success: true,
          users: rows as User[]
        });
      });
    });
  });
};

export default fastifyPlugin(adminPlugin);