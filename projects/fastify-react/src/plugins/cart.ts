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

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const cartPlugin: FastifyPluginAsync = async (fastify) => {
  // Middleware to check authentication for cart routes
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/cart')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        reply.status(401).send({ success: false, message: 'Not authenticated' });
        return;
      }
      
      try {
        const { payload } = await jose.jwtVerify(token, SECRET);
        request.user = { username: payload.username as string };
      } catch (error) {
        reply.status(401).send({ success: false, message: 'Invalid token' });
        return;
      }
    }
  });

  // Add a product to cart
  fastify.post<{ Body: { productId: number, quantity: number } }>('/api/cart', async (request, reply) => {
    const { productId, quantity } = request.body;
    const username = request.user.username;
    
    return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
      // Check if product exists and has enough quantity
      db.get('SELECT id, quantity FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          reply.status(404);
          resolve({ success: false, message: 'Product not found' });
          return;
        }
        
        const product = row as { id: number, quantity: number };
        
        // Check if product is already in cart
        db.get(
          'SELECT id, quantity FROM cart WHERE username = ? AND product_id = ?',
          [username, productId],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            
            if (row) {
              // Update existing cart item
              const cartItem = row as { id: number, quantity: number };
              const newQuantity = cartItem.quantity + quantity;
  
              db.run(
                'UPDATE cart SET quantity = ? WHERE id = ?',
                [newQuantity, cartItem.id],
                function(err) {
                  if (err) {
                    reject(err);
                    return;
                  }
                  
                  resolve({ success: true });
                }
              );
            } else {
              // Add new cart item
              const stmt = db.prepare(
                'INSERT INTO cart (username, product_id, quantity) VALUES (?, ?, ?)'
              );
              
              stmt.run([username, productId, quantity], function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                
                resolve({ success: true });
              });
              
              stmt.finalize();
            }
          }
        );
      });
    });
  });

  // Get user's cart
  fastify.get('/api/cart', async (request, reply) => {
    const username = request.user.username;
    
    return new Promise<{ success: boolean; items: CartItem[] }>((resolve, reject) => {
      db.all(
        `SELECT c.id, c.product_id as productId, p.name, p.price, p.image, c.quantity 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.username = ?`,
        [username],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            success: true,
            items: rows as CartItem[]
          });
        }
      );
    });
  });

  // Update cart item quantity
  fastify.put<{ Params: { productId: string }, Body: { quantity: number } }>('/api/cart/:productId', async (request, reply) => {
    const { productId } = request.params;
    const { quantity } = request.body;
    const username = request.user.username;
    
    if (quantity <= 0) {
      reply.status(400);
      return { success: false, message: 'Quantity must be at least 1' };
    }
    
    return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
      // Check if product exists and has enough quantity
      db.get('SELECT quantity FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          reply.status(404);
          resolve({ success: false, message: 'Product not found' });
          return;
        }
        
        const product = row as { quantity: number };
        
        if (product.quantity < quantity) {
          reply.status(400);
          resolve({ success: false, message: 'Not enough stock available' });
          return;
        }
        
        // Update cart item
        db.run(
          'UPDATE cart SET quantity = ? WHERE username = ? AND product_id = ?',
          [quantity, username, productId],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            
            if (this.changes === 0) {
              reply.status(404);
              resolve({ success: false, message: 'Cart item not found' });
              return;
            }
            
            resolve({ success: true });
          }
        );
      });
    });
  });

  // Remove a product from cart
  fastify.delete<{ Params: { productId: string } }>('/api/cart/:productId', async (request, reply) => {
    const { productId } = request.params;
    const username = request.user.username;
    
    return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
      db.run(
        'DELETE FROM cart WHERE username = ? AND product_id = ?',
        [username, productId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ success: true });
        }
      );
    });
  });
};

export default fastifyPlugin(cartPlugin);