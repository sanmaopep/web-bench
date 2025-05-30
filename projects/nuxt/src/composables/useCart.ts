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

import { useState } from 'nuxt/app'

export const useCart = () => {
  const cartItems = useState('cartItems', () => [])

  const addToCart = async (productId: string) => {
    try {
      await $fetch('/api/cart', {
        method: 'POST',
        body: { productId, quantity: 1 },
      })
      // Trigger cart update
      await fetchCartItems()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      await $fetch(`/api/cart/${productId}`, { method: 'DELETE' })
      await fetchCartItems()
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      throw error
    }
  }

  const fetchCartItems = async () => {
    try {
      const response = await $fetch('/api/cart')
      cartItems.value = response.items || []
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
      cartItems.value = []
    }
  }

  const clearCart = async () => {
    try {
      await $fetch('/api/cart/clear', { method: 'POST' })
      cartItems.value = []
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    fetchCartItems,
    clearCart
  }
}