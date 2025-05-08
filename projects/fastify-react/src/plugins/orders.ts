import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { runTransaction, TransactionSQL, dbAll, dbGet, dbRun, DynamicTransactionSQL } from '../libs/db';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

// Add declaration merging to extend FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      username: string;
    };
    referralInfo?: {
      referrer: string;
      referred: string;
    };
  }
}

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderItemDB {
  product_id: number;
  quantity: number;
}

const ordersPlugin: FastifyPluginAsync = async (fastify) => {
  // Middleware to check authentication for order routes
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/orders')) {
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

  // Create a new order
  fastify.post('/api/orders', async (request, reply) => {
    const username = request.user.username;
    
    try {
      // Get cart items
      const cartItems = await dbAll<CartItem[]>(
        `SELECT c.product_id, p.name, p.price, p.image, c.quantity 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.username = ?`,
        [username]
      );
      
      if (!cartItems || cartItems.length === 0) {
        reply.status(400);
        return { success: false, message: 'Cart is empty' };
      }
      
      // Calculate total price
      const totalPrice = cartItems.reduce((total: number, item: CartItem) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      let orderId = 0;
      
      // Prepare transaction SQL statements
      const transactionSQLs: (TransactionSQL | DynamicTransactionSQL)[] = [
        {
          sql: 'INSERT INTO orders (username, date, status, total_price) VALUES (?, ?, ?, ?)',
          deps: [username, new Date().toISOString(), 'Pending payment', totalPrice],
          afterCb: (lastID) => {
            orderId = lastID;
          }
        }
      ];
      
      // Add order items SQL
      for (const item of cartItems) {
        transactionSQLs.push(() => ({
          sql: 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          deps: [orderId, item.product_id, item.quantity, item.price]
        }));
      }
      
      // Add clear cart SQL
      transactionSQLs.push({
        sql: 'DELETE FROM cart WHERE username = ?',
        deps: [username]
      });
      
      // Run the transaction
      await runTransaction(transactionSQLs);
      
      return { success: true, orderId };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to create order' };
    }
  });

  // Get all user's orders
  fastify.get('/api/orders', async (request, reply) => {
    const username = request.user.username;
    
    try {
      const orders = await dbAll<any[]>(
        'SELECT id, date, status, total_price as totalPrice FROM orders WHERE username = ? ORDER BY date DESC',
        [username]
      );
      
      return {
        success: true,
        orders
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to fetch orders' };
    }
  });

  // Get order details
  fastify.get<{ Params: { id: string } }>('/api/orders/:id', async (request, reply) => {
    const { id } = request.params;
    const username = request.user.username;
    
    try {
      // Get order basic info
      const orderRow = await dbGet<{ id: number; date: string; status: string; totalPrice: number }>(
        'SELECT id, date, status, total_price as totalPrice FROM orders WHERE id = ? AND username = ?',
        [id, username]
      );
      
      if (!orderRow) {
        reply.status(404);
        return { success: false, message: 'Order not found' };
      }
      
      // Get order items
      const itemRows = await dbAll<OrderItem[]>(
        `SELECT oi.product_id as productId, p.name, oi.price, p.image, oi.quantity 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [id]
      );
      
      const order = {
        ...orderRow,
        items: itemRows
      };
      
      return {
        success: true,
        order
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to fetch order details' };
    }
  });

  // Pay for an order
  fastify.post<{ Params: { id: string } }>('/api/orders/:id/pay', async (request, reply) => {
    const { id } = request.params;
    const username = request.user.username;
    
    try {
      // Get order info
      const orderRow = await dbGet<{ id: number; status: string; totalPrice: number }>(
        'SELECT id, status, total_price as totalPrice FROM orders WHERE id = ? AND username = ?',
        [id, username]
      );
      
      if (!orderRow) {
        reply.status(404);
        return { success: false, message: 'Order not found' };
      }
      
      const order = orderRow;
      
      if (order.status !== 'Pending payment') {
        return { success: false, message: 'Order is not pending payment' };
      }
      
      // Check user coin balance
      const userRow = await dbGet<{ coin: number }>(
        'SELECT coin FROM users WHERE username = ?', 
        [username]
      );
      
      if (!userRow) {
        reply.status(404);
        return { success: false, message: 'User not found' };
      }
      
      if (userRow.coin < order.totalPrice) {
        // Update order status to Failed due to insufficient funds
        await dbRun(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['Failed', id]
        );
        
        return { 
          success: false, 
          message: 'Insufficient funds',
          status: 'Failed' 
        };
      }
      
      // Get order items to check product availability
      const itemRows = await dbAll<OrderItemDB[]>(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );
      
      // Check if all products have sufficient stock
      interface StockCheck {
        inStock: boolean;
        productId: number;
        quantity: number;
      }
      
      const stockChecks: StockCheck[] = [];
      for (const item of itemRows) {
        const productRow = await dbGet<{ quantity: number }>(
          'SELECT quantity FROM products WHERE id = ?',
          [item.product_id]
        );
        
        if (!productRow) {
          stockChecks.push({ 
            inStock: false, 
            productId: item.product_id, 
            quantity: item.quantity 
          });
          continue;
        }
        
        stockChecks.push({ 
          inStock: productRow.quantity >= item.quantity,
          productId: item.product_id,
          quantity: item.quantity
        });
      }
      
      const allInStock = stockChecks.every(check => check.inStock);
      
      if (!allInStock) {
        // Update order status to Failed due to out of stock
        await dbRun(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['Failed', id]
        );
        
        return { 
          success: false, 
          message: 'One or more products are out of stock',
          status: 'Failed'
        };
      }
      
      // Check if this is a referred user's first order
      const referral = await dbGet<{ referrer_username: string; first_order_rewarded: number }>(
        'SELECT referrer_username, first_order_rewarded FROM referrals WHERE referred_username = ?',
        [username]
      );

      // All verification passed, proceed with the transaction
      const paymentSQLs: TransactionSQL[] = [
        // Deduct coins from user
        {
          sql: 'UPDATE users SET coin = coin - ? WHERE username = ?',
          deps: [order.totalPrice, username]
        },
        // Update order status
        {
          sql: 'UPDATE orders SET status = ? WHERE id = ?',
          deps: ['Finished', id]
        }
      ];
      
      // Add statements to decrease product quantities
      for (const check of stockChecks) {
        paymentSQLs.push({
          sql: 'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          deps: [check.quantity, check.productId]
        });
      }
      
      // If this is a referred user's first order that hasn't been rewarded yet, add reward statements
      if (referral && !referral.first_order_rewarded) {
        const FIRST_ORDER_REWARD = 1888;
        
        // Add reward to referrer
        paymentSQLs.push({
          sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
          deps: [FIRST_ORDER_REWARD, referral.referrer_username]
        });
        
        // Update referral record to mark first order as rewarded
        paymentSQLs.push({
          sql: 'UPDATE referrals SET first_order_rewarded = 1 WHERE referrer_username = ? AND referred_username = ?',
          deps: [referral.referrer_username, username]
        });
        
        // Record the reward
        paymentSQLs.push({
          sql: 'INSERT INTO referral_rewards (referrer_username, referred_username, reward_amount, reward_type, date) VALUES (?, ?, ?, ?, ?)',
          deps: [referral.referrer_username, username, FIRST_ORDER_REWARD, 'order', new Date().toISOString()]
        });
      }
      
      // Execute the transaction
      await runTransaction(paymentSQLs);
      
      return { success: true };
    } catch (error) {
      request.log.error(error);
      
      // If any error occurs during payment, mark the order as failed
      try {
        await dbRun(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['Failed', id]
        );
      } catch (updateError) {
        console.error('Failed to update order status:', updateError);
      }
      
      reply.status(500);
      return { success: false, message: 'Payment processing failed' };
    }
  });

  // Request refund for an order
  fastify.post<{ Params: { id: string } }>('/api/orders/:id/refund', async (request, reply) => {
    const { id } = request.params;
    const username = request.user.username;
    
    try {
      // Get order info
      const orderRow = await dbGet<{ id: number; status: string }>(
        'SELECT id, status FROM orders WHERE id = ? AND username = ?',
        [id, username]
      );
      
      if (!orderRow) {
        reply.status(404);
        return { success: false, message: 'Order not found' };
      }
      
      if (orderRow.status !== 'Finished') {
        return { success: false, message: 'Only finished orders can be refunded' };
      }
      
      // Update order status to Refund Reviewing
      await dbRun(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['Refund Reviewing', id]
      );
      
      return { success: true };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to request refund' };
    }
  });

  // Admin: Get all orders (for admin order management)
  fastify.get('/api/admin/orders', async (request, reply) => {
    try {
      const orders = await dbAll<any[]>(
        'SELECT o.id, o.date, o.status, o.total_price as totalPrice, u.username FROM orders o JOIN users u ON o.username = u.username ORDER BY o.date DESC',
        []
      );
      
      return {
        success: true,
        orders
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to fetch orders' };
    }
  });

  // Admin: Approve refund
  fastify.post<{ Params: { id: string } }>('/api/admin/orders/:id/approve-refund', async (request, reply) => {
    const { id } = request.params;
    
    try {
      // Get order info
      const orderRow = await dbGet<{ id: number; status: string; username: string; totalPrice: number }>(
        'SELECT id, status, username, total_price as totalPrice FROM orders WHERE id = ?',
        [id]
      );
      
      if (!orderRow) {
        reply.status(404);
        return { success: false, message: 'Order not found' };
      }
      
      if (orderRow.status !== 'Refund Reviewing') {
        return { success: false, message: 'Order is not in refund reviewing status' };
      }
      
      // Process refund
      const refundSQLs: TransactionSQL[] = [
        // Refund coins to user
        {
          sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
          deps: [orderRow.totalPrice, orderRow.username]
        },
        // Update order status
        {
          sql: 'UPDATE orders SET status = ? WHERE id = ?',
          deps: ['Refund Passed', id]
        }
      ];
      
      // Execute the transaction
      await runTransaction(refundSQLs);
      
      return { success: true };
    } catch (error) {
      request.log.error(error);
      reply.status(500);
      return { success: false, message: 'Failed to approve refund' };
    }
  });
};

export default fastifyPlugin(ordersPlugin);