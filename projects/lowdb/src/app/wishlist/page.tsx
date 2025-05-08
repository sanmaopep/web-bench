'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWishlist, removeFromWishlist } from '@/actions/wishlist'
import { useAuth } from '@/context/auth'
import './wishlist.css'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username) {
      router.push('/login')
      return
    }
    
    fetchWishlist()
  }, [auth, router])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const result = await getWishlist()
      if (result.success) {
        setWishlist(result.items)
      } else {
        alert(result.error || 'Failed to load wishlist')
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const result = await removeFromWishlist(productId)
      if (result.success) {
        // Update the wishlist state
        setWishlist(wishlist.filter(item => item.id !== productId))
      } else {
        alert(result.error || 'Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }
  
  const goToProductDetail = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  if (loading) {
    return <div className="wishlist-loading">Loading your wishlist...</div>
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty</p>
          <button onClick={() => router.push('/products')} className="browse-products-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlist.map(product => (
            <div className="wishlist-item" id={`wishlist_item_${product.id}`} key={product.id}>
              <img 
                className="wishlist-image" 
                src={product.image} 
                alt={product.name} 
                onClick={() => goToProductDetail(product.id)}
              />
              <div className="wishlist-info">
                <div className="wishlist-name" onClick={() => goToProductDetail(product.id)}>
                  {product.name}
                </div>
                <div className="wishlist-price">${product.price}</div>
                <button 
                  className="remove-from-wishlist"
                  onClick={() => handleRemoveFromWishlist(product.id)}
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