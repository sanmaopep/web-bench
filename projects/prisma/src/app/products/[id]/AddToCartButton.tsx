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

import { useState } from 'react'
import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'
import './add-to-cart-button.css'

export default function AddToCartButton({ productId }: { productId: number }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = useAuth()
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!auth?.username) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })

      const data = await response.json()
      if (data.success) {
        // Reset quantity after successful add
        setQuantity(1)

        window.dispatchEvent(new CustomEvent('cart:updated'))
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="add-to-cart-container">
      <div className="quantity-selector">
        <button
          className="quantity-button decrease"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="quantity-value">{quantity}</span>
        <button className="quantity-button increase" onClick={incrementQuantity}>
          +
        </button>
      </div>
      <button className="add-to-cart-button" onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}
