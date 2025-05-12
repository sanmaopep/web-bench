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

'use client'

import { useState, useEffect } from 'react'
import './add-to-wishlist-button.css'

export default function AddToWishlistButton({ productId }: { productId: number }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function checkWishlist() {
      try {
        const response = await fetch(`/api/wishlist/check/${productId}`)
        const data = await response.json()
        setIsInWishlist(data.isInWishlist)
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }
    
    checkWishlist()
  }, [productId])

  const handleAddToWishlist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })
      
      const data = await response.json()
      if (data.success) {
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (data.success) {
        setIsInWishlist(false)
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      className={isInWishlist ? "remove-from-wishlist" : "add-to-wishlist"}
      onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
      disabled={isLoading}
    >
      {isLoading 
        ? 'Processing...' 
        : isInWishlist 
          ? 'Remove from Wishlist' 
          : 'Add to Wishlist'
      }
    </button>
  )
}