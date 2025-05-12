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
import db from '../libs/db';
import { getAuth } from './auth';

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  coin: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Add a preHandler hook for all admin routes to check admin privileges
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/admin')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        return reply.redirect('/login');
      }
      
      try {
          const { role } = await getAuth(token);
        
        if (role !== 'admin') {
          return reply.redirect('/login');
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.redirect('/login');
      }
    }
  });

  fastify.get('/admin/products', async (request, reply) => {
    return new Promise<void>((resolve, reject) => {
      const sql = 'SELECT * FROM products';
      db.all(sql, [], (err, products) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        return reply.view('admin-products.ejs', { 
          title: 'Admin - Product Management',
          products: products as Product[]
        });
      });
    });
  });

  fastify.get('/admin/users', async (request, reply) => {
    return new Promise<void>((resolve, reject) => {
      const sql = 'SELECT id, username, role, coin FROM users';
      db.all(sql, [], (err, users) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        return reply.view('admin-users.ejs', { 
          title: 'Admin - User Management',
          users: users as User[]
        });
      });
    });
  });
};

export default admin;