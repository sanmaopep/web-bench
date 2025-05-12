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

interface Product {
  id?: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const product: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/api/products', async (request, reply) => {
    const product = request.body as Product;
    
    return new Promise<{ success: boolean, data: { id: number } }>((resolve, reject) => {
      const sql = 'INSERT INTO products (name, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)';
      db.run(sql, [product.name, product.price, product.image, product.description, product.quantity], function(err) {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        resolve({ 
          success: true, 
          data: { 
            id: this.lastID 
          } 
        });
      });
    });
  });

  fastify.get('/api/products', async (request, reply) => {
    return new Promise<{ success: boolean, products: Product[] }>((resolve, reject) => {
      const sql = 'SELECT * FROM products';
      db.all(sql, [], (err, rows) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        resolve({ 
          success: true, 
          products: rows as Product[] 
        });
      });
    });
  });
  
  fastify.get('/api/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    return new Promise<{ success: boolean, product?: Product }>((resolve, reject) => {
      const sql = 'SELECT * FROM products WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (!row) {
          return resolve({ success: false });
        }
        
        resolve({ 
          success: true, 
          product: row as Product 
        });
      });
    });
  });
  
  fastify.get('/products', async (request, reply) => {
    return reply.view('products.ejs', { title: 'Our Products' });
  });
  
  fastify.get('/products/:product_id', async (request, reply) => {
    const { product_id } = request.params as { product_id: string };
    return reply.view('product-detail.ejs', { title: 'Product Detail', productId: product_id });
  });
};

export default product;