'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import './wishlist.css'

interface WishlistItem {
  id: number
  product: {
    id: number
    name: string
    price: number
    image: string
    description: string
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username) {
      router.push('/login')
      return
    }

    async function fetchWishlist() {
      try {
        const response = await fetch('/api/wishlist')
        const data = await response.json()
        
        if (data.success) {
          setWishlistItems(data.wishlist)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [auth, router])

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (data.success) {
        setWishlistItems(wishlistItems.filter(item => item.product.id !== productId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <button onClick={() => router.push('/products')} className="browse-products-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map(item => (
            <div 
              key={item.id} 
              className="wishlist-item" 
              id={`wishlist_item_${item.product.id}`}
            >
              <img 
                className="wishlist-image" 
                src={item.product.image} 
                alt={item.product.name} 
                onClick={() => router.push(`/products/${item.product.id}`)}
              />
              <div className="wishlist-details">
                <div className="wishlist-name">{item.product.name}</div>
                <div className="wishlist-price">${item.product.price}</div>
                <button 
                  className="remove-from-wishlist"
                  onClick={() => handleRemoveFromWishlist(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}