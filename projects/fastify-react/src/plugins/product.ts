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

interface Product {
  id?: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const productPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: Product }>('/api/products', async (request, reply) => {
    const { name, price, image, description, quantity } = request.body;
    
    return new Promise<{ success: boolean; data: { id: number } }>((resolve, reject) => {
      const stmt = db.prepare(
        'INSERT INTO products (name, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)'
      );
      
      stmt.run([name, price, image, description, quantity], function (err) {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({ 
          success: true, 
          data: { 
            id: this.lastID 
          } 
        });
      });
      
      stmt.finalize();
    });
  });

  fastify.get('/api/products', async (request, reply) => {
    return new Promise<{ success: boolean; products: Product[] }>((resolve, reject) => {
      db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          success: true,
          products: rows as Product[]
        });
      });
    });
  });

  fastify.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params;
    
    return new Promise<{ success: boolean; product: Product | null }>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          success: true,
          product: row as Product || null
        });
      });
    });
  });
};

export default fastifyPlugin(productPlugin);