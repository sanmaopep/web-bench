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

'use server'

import { getCurrentUser } from './auth'
import { v4 as uuidv4 } from 'uuid'

export async function createOrder() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const cartItems = global.db.data.cart.filter(
      item => item.username === currentUser.username
    )
    
    if (cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }
    
    // Get product details for cart items
    const orderItems: OrderItem[] = []
    let totalPrice = 0
    
    for (const item of cartItems) {
      const product = global.db.data.products.find(p => p.id === item.productId)
      if (product) {
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        })
        totalPrice += product.price * item.quantity
      }
    }
    
    if (orderItems.length === 0) {
      return { success: false, error: 'No valid products in cart' }
    }
    
    // Create new order
    const orderId = uuidv4()
    const newOrder = {
      id: orderId,
      username: currentUser.username,
      items: orderItems,
      totalPrice,
      status: 'Pending payment',
      createdAt: new Date().toISOString()
    }
    
    global.db.data.orders.push(newOrder)
    
    // Clear the user's cart
    global.db.data.cart = global.db.data.cart.filter(
      item => item.username !== currentUser.username
    )
    
    await global.db.write()
    
    return { success: true, orderId }
  } catch (error) {
    return { success: false, error: 'Failed to create order' }
  }
}

export async function getOrderById(orderId: string) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.orders) {
      return { success: false, error: 'Order not found' }
    }
    
    const order = global.db.data.orders.find(o => o.id === orderId)
    
    if (!order) {
      return { success: false, error: 'Order not found' }
    }
    
    // Only allow users to view their own orders, or admins to view any order
    if (order.username !== currentUser.username && currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }
    
    return { success: true, order }
  } catch (error) {
    return { success: false, error: 'Failed to fetch order' }
  }
}

export async function getUserOrders() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.orders) {
      global.db.data.orders = []
      await global.db.write()
      return { success: true, orders: [] }
    }
    
    // Get all orders for the current user
    const userOrders = global.db.data.orders.filter(
      order => order.username === currentUser.username
    )
    
    // Sort orders by creation date (newest first)
    userOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return { success: true, orders: userOrders }
  } catch (error) {
    return { success: false, error: 'Failed to fetch orders' }
  }
}