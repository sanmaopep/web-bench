import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { dbAll, dbGet, dbRun } from '../libs/db';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

interface Comment {
  id: number;
  username: string;
  productId: number;
  rating: number;
  text: string;
  date: string;
}

const commentsPlugin: FastifyPluginAsync = async (fastify) => {
  // Get all comments for a product
  fastify.get<{ Params: { id: string } }>('/api/products/:id/comments', async (request, reply) => {
    const { id } = request.params;
    
    try {
      const comments = await dbAll<Comment[]>(
        `SELECT * FROM comments WHERE product_id = ? ORDER BY date DESC`,
        [id]
      );
      
      // Calculate average rating
      let averageRating = 0;
      if (comments.length > 0) {
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        averageRating = totalRating / comments.length;
      }
      
      return {
        success: true,
        comments,
        averageRating
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to fetch comments' };
    }
  });

  // Check if user can comment on a product (has purchased the product and hasn't commented yet)
  fastify.get<{ Params: { id: string } }>('/api/products/:id/can-comment', async (request, reply) => {
    const { id } = request.params;
    const token = request.cookies.TOKEN;
    
    if (!token) {
      reply.status(401);
      return { success: false, message: 'Not authenticated', canComment: false };
    }
    
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      const username = payload.username as string;
      
      // Check if user has already commented on this product
      const existingComment = await dbGet<{ id: number }>(
        'SELECT id FROM comments WHERE username = ? AND product_id = ?',
        [username, id]
      );
      
      if (existingComment) {
        return { success: true, canComment: false, reason: 'already_commented' };
      }
      
      // Check if user has purchased this product
      const purchasedProduct = await dbGet<{ count: number }>(
        `SELECT COUNT(*) as count FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.username = ? AND oi.product_id = ? AND o.status = 'Finished'`,
        [username, id]
      );
      
      const hasPurchased = purchasedProduct?.count && purchasedProduct.count > 0;
      
      return {
        success: true,
        canComment: hasPurchased,
        reason: hasPurchased ? null : 'not_purchased'
      };
    } catch (error) {
      request.log.error(error);
      reply.status(401);
      return { success: false, message: 'Invalid token', canComment: false };
    }
  });

  // Add a comment to a product
  fastify.post<{ Params: { id: string }, Body: { rating: number, text: string } }>('/api/products/:id/comments', async (request, reply) => {
    const { id } = request.params;
    const { rating, text } = request.body;
    const token = request.cookies.TOKEN;
    
    if (!token) {
      reply.status(401);
      return { success: false, message: 'Not authenticated' };
    }
    
    if (rating < 1 || rating > 5) {
      reply.status(400);
      return { success: false, message: 'Rating must be between 1 and 5' };
    }
    
    if (!text.trim()) {
      reply.status(400);
      return { success: false, message: 'Comment text is required' };
    }
    
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      const username = payload.username as string;
      
      // Check if user has already commented on this product
      const existingComment = await dbGet<{ id: number }>(
        'SELECT id FROM comments WHERE username = ? AND product_id = ?',
        [username, id]
      );
      
      if (existingComment) {
        reply.status(400);
        return { success: false, message: 'You have already commented on this product' };
      }
      
      // Check if user has purchased this product
      const purchasedProduct = await dbGet<{ count: number }>(
        `SELECT COUNT(*) as count FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.username = ? AND oi.product_id = ? AND o.status = 'Finished'`,
        [username, id]
      );
      
      if (!purchasedProduct?.count || purchasedProduct.count === 0) {
        reply.status(403);
        return { success: false, message: 'You must purchase this product before commenting' };
      }
      
      // Add the comment
      await dbRun(
        'INSERT INTO comments (username, product_id, rating, text, date) VALUES (?, ?, ?, ?, ?)',
        [username, id, rating, text, new Date().toISOString()]
      );
      
      return { success: true };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to add comment' };
    }
  });
};

export default fastifyPlugin(commentsPlugin);