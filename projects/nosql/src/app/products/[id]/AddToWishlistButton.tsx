'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToWishlistButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleAdd = async () => {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })

    if (response.ok) {
      setAdded(true)
      router.refresh()
    }
  }

  return (
    <button className="add-to-wishlist" onClick={handleAdd} disabled={added}>
      {added ? '✓ Added to Wishlist' : 'Add to Wishlist'}
    </button>
  )
}
