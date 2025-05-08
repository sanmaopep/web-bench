'use client'

import { useState } from 'react'

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
    setIsAdding(false)
  }

  return (
    <button 
      className="add-to-cart-button" 
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}