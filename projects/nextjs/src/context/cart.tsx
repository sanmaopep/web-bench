'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth'

interface CartItem {
  product_id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  refreshCart: () => Promise<void>
  addToCart: (productId: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { auth } = useAuth()

  const fetchCart = async () => {
    if (!auth?.username) return
    const response = await fetch('/api/cart')
    const data = await response.json()
    if (data.success) {
      setCartItems(data.cart)
    }
  }

  const removeFromCart = async (productId: number) => {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
    const data = await response.json()
    if (data.success) {
      await fetchCart()
    }
  }

  const addToCart = async (productId: number) => {
    if (!auth) {
      return
    }
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
    const data = await response.json()
    if (data.success) {
      await fetchCart()
    }
  }

  const clearCart = async () => {
    setCartItems([])
    // You might want to add an API endpoint to clear the cart in the backend as well
  }

  useEffect(() => {
    if (auth?.username) {
      fetchCart()
    }
  }, [auth?.username])

  return (
    <CartContext.Provider
      value={{ cartItems, refreshCart: fetchCart, removeFromCart, addToCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
