'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './wishlist.css'
import { useAuth } from '@/context/auth'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(() => {
    if (!auth) {
      router.push('/login')
    } else {
      fetchWishlist()
    }
  }, [auth, router])

  const fetchWishlist = () => {
    fetch('/api/wishlist')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWishlist(data.wishlist)
        }
      })
  }

  const removeFromWishlist = async (productId: number) => {
    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
    const data = await response.json()
    if (data.success) {
      fetchWishlist()
    }
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      {wishlist.map((product) => (
        <div key={product.id} className="wishlist-item" id={`wishlist_item_${product.id}`}>
          <img className="wishlist-image" src={product.image} alt={product.name} />
          <div className="wishlist-name">{product.name}</div>
          <div className="wishlist-price">${product.price.toFixed(2)}</div>
          <button className="remove-from-wishlist" onClick={() => removeFromWishlist(product.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
