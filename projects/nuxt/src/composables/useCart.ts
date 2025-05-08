import { useState } from 'nuxt/app'

export const useCart = () => {
  const cartItems = useState('cartItems', () => [])

  const addToCart = async (productId: string) => {
    try {
      await $fetch('/api/cart', {
        method: 'POST',
        body: { productId, quantity: 1 },
      })
      // 触发购物车更新
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