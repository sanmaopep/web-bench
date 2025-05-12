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

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
}

const wishlistPlugin: FastifyPluginAsync = async (fastify) => {
  // Middleware to check authentication for wishlist routes
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/wishlist')) {
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

  // Add a product to wishlist
  fastify.post<{ Body: { productId: number } }>('/api/wishlist', async (request, reply) => {
    const { productId } = request.body;
    const username = request.user.username;
    
    return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
      // Check if product exists
      db.get('SELECT id FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          reply.status(404);
          resolve({ success: false, message: 'Product not found' });
          return;
        }
        
        // Add to wishlist
        const stmt = db.prepare(
          'INSERT OR IGNORE INTO wishlist (username, product_id) VALUES (?, ?)'
        );
        
        stmt.run([username, productId], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          if (this.changes === 0) {
            resolve({ success: true, message: 'Product already in wishlist' });
          } else {
            resolve({ success: true });
          }
        });
        
        stmt.finalize();
      });
    });
  });

  // Get user's wishlist
  fastify.get('/api/wishlist', async (request, reply) => {
    const username = request.user.username;
    
    return new Promise<{ success: boolean; items: WishlistItem[] }>((resolve, reject) => {
      db.all(
        `SELECT w.id, w.product_id as productId, p.name, p.price, p.image 
         FROM wishlist w 
         JOIN products p ON w.product_id = p.id 
         WHERE w.username = ?`,
        [username],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            success: true,
            items: rows as WishlistItem[]
          });
        }
      );
    });
  });

  // Remove a product from wishlist
  fastify.delete<{ Params: { productId: string } }>('/api/wishlist/:productId', async (request, reply) => {
    const { productId } = request.params;
    const username = request.user.username;
    
    return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
      db.run(
        'DELETE FROM wishlist WHERE username = ? AND product_id = ?',
        [username, productId],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ success: true });
        }
      );
    });
  });

  // Check if a product is in the user's wishlist
  fastify.get<{ Params: { productId: string } }>('/api/wishlist/check/:productId', async (request, reply) => {
    const { productId } = request.params;
    const username = request.user.username;
    
    return new Promise<{ success: boolean; inWishlist: boolean }>((resolve, reject) => {
      db.get(
        'SELECT id FROM wishlist WHERE username = ? AND product_id = ?',
        [username, productId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            success: true,
            inWishlist: !!row
          });
        }
      );
    });
  });
};

export default fastifyPlugin(wishlistPlugin);