'use server'

import { getCurrentUser } from './auth'

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if product exists
    const product = global.db.data.products.find(p => p.id === productId)
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    
    // Check if item already in cart
    const existingCartItemIndex = global.db.data.cart.findIndex(
      item => item.username === currentUser.username && item.productId === productId
    )
    
    if (existingCartItemIndex > -1) {
      // Update existing item
      global.db.data.cart[existingCartItemIndex].quantity += quantity
    } else {
      // Add new item
      global.db.data.cart.push({
        username: currentUser.username,
        productId,
        quantity
      })
    }
    
    await global.db.write()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to add to cart' }
  }
}

export async function removeFromCart(productId: string) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.cart) {
      global.db.data.cart = []
      await global.db.write()
      return { success: true }
    }
    
    const initialLength = global.db.data.cart.length
    
    global.db.data.cart = global.db.data.cart.filter(
      item => !(item.username === currentUser.username && item.productId === productId)
    )
    
    if (global.db.data.cart.length === initialLength) {
      return { success: false, error: 'Item not found in cart' }
    }
    
    await global.db.write()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove from cart' }
  }
}

export async function getCart() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.cart) {
      global.db.data.cart = []
      await global.db.write()
      return { success: true, items: [] }
    }
    
    // Get all cart items for current user
    const cartItems = global.db.data.cart.filter(
      item => item.username === currentUser.username
    )
    
    // Get full product details for each cart item
    const cartProducts: any[] = []
    
    for (const item of cartItems) {
      const product = global.db.data.products.find(p => p.id === item.productId)
      if (product) {
        cartProducts.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        })
      }
    }
    
    return { success: true, items: cartProducts }
  } catch (error) {
    return { success: false, error: 'Failed to get cart' }
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.cart) {
      return { success: false, error: 'Cart not found' }
    }
    
    const cartItemIndex = global.db.data.cart.findIndex(
      item => item.username === currentUser.username && item.productId === productId
    )
    
    if (cartItemIndex === -1) {
      return { success: false, error: 'Cart item not found' }
    }
    
    global.db.data.cart[cartItemIndex].quantity = quantity
    await global.db.write()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update cart item' }
  }
}