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

interface Comment {
  id?: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at?: string;
  username?: string;
}

const comment: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Add a preHandler hook to check authentication for API routes
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/comments')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        return reply.status(401).send({ success: false, error: 'Authentication required' });
      }
      
      try {
        const { username } = await getAuth(token);
        
        if (!username) {
          return reply.status(401).send({ success: false, error: 'Authentication required' });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(401).send({ success: false, error: 'Authentication required' });
      }
    }
  });

  // Add a new comment
  fastify.post('/api/comments', {
    schema: {
      body: {
        type: 'object',
        required: ['productId', 'rating', 'comment'],
        properties: {
          productId: { type: 'number' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          comment: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { productId, rating, comment } = request.body as { productId: number, rating: number, comment: string };
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    return new Promise<{ success: boolean, message?: string }>((resolve, reject) => {
      // First get the user_id
      db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (!user) {
          return resolve({ success: false, message: 'User not found' });
        }
        
        const userId = (user as { id: number }).id;
        
        // Check if user has purchased the product (completed order)
        const checkPurchaseSql = `
          SELECT 1 FROM orders o
          JOIN order_items oi ON oi.order_id = o.id
          WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'Finished'
          LIMIT 1
        `;
        
        db.get(checkPurchaseSql, [userId, productId], (err, hasPurchased) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!hasPurchased) {
            return resolve({ success: false, message: 'You must purchase this product before leaving a review' });
          }
          
          // Check if user already commented on this product
          db.get('SELECT 1 FROM comments WHERE user_id = ? AND product_id = ?', [userId, productId], (err, hasCommented) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            if (hasCommented) {
              return resolve({ success: false, message: 'You have already reviewed this product' });
            }
            
            // Add the comment
            const sql = `
              INSERT INTO comments (user_id, product_id, rating, comment, created_at) 
              VALUES (?, ?, ?, ?, datetime('now'))
            `;
            
            db.run(sql, [userId, productId, rating, comment], function(err) {
              if (err) {
                fastify.log.error(err);
                return reject(err);
              }
              
              resolve({ success: true, message: 'Comment added successfully' });
            });
          });
        });
      });
    });
  });

  // Get comments for a product
  fastify.get('/api/comments/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const token = request.cookies.TOKEN;
    
    let canComment = false;
    let hasCommented = false;
    let userId = null;
    
    // Check if user can comment (only if logged in)
    if (token) {
      try {
        const { username } = await getAuth(token);
        
        if (username) {
          // Get the user ID
          const user = await new Promise<any>((resolve, reject) => {
            db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
              if (err) reject(err);
              else resolve(user);
            });
          });
          
          if (user) {
            userId = user.id;
            
            // Check if user has purchased the product
            const hasPurchased = await new Promise<boolean>((resolve, reject) => {
              const purchaseSql = `
                SELECT 1 FROM orders o
                JOIN order_items oi ON oi.order_id = o.id
                WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'Finished'
                LIMIT 1
              `;
              
              db.get(purchaseSql, [userId, productId], (err, result) => {
                if (err) reject(err);
                else resolve(!!result);
              });
            });
            
            // Check if user has already commented
            const userHasCommented = await new Promise<boolean>((resolve, reject) => {
              db.get('SELECT 1 FROM comments WHERE user_id = ? AND product_id = ?', [userId, productId], (err, result) => {
                if (err) reject(err);
                else resolve(!!result);
              });
            });
            
            canComment = hasPurchased && !userHasCommented;
            hasCommented = userHasCommented;
          }
        }
      } catch (err) {
        fastify.log.error(err);
      }
    }
    
    return new Promise<{ success: boolean, comments: Comment[], averageRating: number, canComment: boolean, hasCommented: boolean }>((resolve, reject) => {
      // Get all comments for the product with usernames
      const commentsSql = `
        SELECT c.id, c.user_id, c.product_id, c.rating, c.comment, c.created_at, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.product_id = ?
        ORDER BY c.created_at DESC
      `;
      
      db.all(commentsSql, [productId], (err, comments) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        // Get the average rating
        const avgRatingSql = 'SELECT AVG(rating) as average FROM comments WHERE product_id = ?';
        
        db.get(avgRatingSql, [productId], (err, result) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          const averageRating = result ? (result as { average: number }).average || 0 : 0;
          
          resolve({ 
            success: true, 
            comments: comments as Comment[],
            averageRating,
            canComment,
            hasCommented
          });
        });
      });
    });
  });
};

export default comment;