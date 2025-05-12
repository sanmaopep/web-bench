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

export async function addToWishlist(productId: string) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if product is already in wishlist
    const existingWishlistItem = global.db.data.wishlist.find(
      item => item.username === currentUser.username && item.productId === productId
    )
    
    if (existingWishlistItem) {
      return { success: true, message: 'Product already in wishlist' }
    }
    
    // Add product to wishlist
    global.db.data.wishlist.push({
      username: currentUser.username,
      productId
    })
    
    await global.db.write()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to add to wishlist' }
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.wishlist) {
      return { success: false, error: 'Wishlist not found' }
    }
    
    const initialLength = global.db.data.wishlist.length
    
    global.db.data.wishlist = global.db.data.wishlist.filter(
      item => !(item.username === currentUser.username && item.productId === productId)
    )
    
    if (global.db.data.wishlist.length === initialLength) {
      return { success: false, error: 'Item not found in wishlist' }
    }
    
    await global.db.write()
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove from wishlist' }
  }
}

export async function getWishlist() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    if (!global.db.data.wishlist) {
      global.db.data.wishlist = []
      await global.db.write()
      return { success: true, items: [] }
    }
    
    // Get all wishlist items for current user
    const wishlistItems = global.db.data.wishlist.filter(
      item => item.username === currentUser.username
    )
    
    // Get product details for each wishlist item
    const wishlistProducts: Product[] = []
    
    for (const item of wishlistItems) {
      const product = global.db.data.products.find(p => p.id === item.productId)
      if (product) {
        wishlistProducts.push(product)
      }
    }
    
    return { success: true, items: wishlistProducts }
  } catch (error) {
    return { success: false, error: 'Failed to get wishlist' }
  }
}