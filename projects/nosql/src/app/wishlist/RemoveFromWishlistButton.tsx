'use client'

import { useRouter } from 'next/navigation'

export default function RemoveFromWishlistButton({ productId }: { productId: string }) {
  const router = useRouter()

  const handleRemove = async () => {
    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button className="remove-from-wishlist" onClick={handleRemove}>
      Remove
    </button>
  )
}