'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './wishlist.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function Wishlist() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/auth')
        if (!response.ok) {
          router.push('/login')
          return
        }
        fetchWishlist()
      } catch (error) {
        router.push('/login')
      }
    }

    async function fetchWishlist() {
      try {
        const response = await fetch('/api/wishlist')
        const data = await response.json()
        if (data.success) {
          setProducts(data.products || [])
        } else {
          setError('Failed to load wishlist')
        }
      } catch (error) {
        setError('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setProducts((prevProducts) => 
          prevProducts.filter(product => product.id !== productId)
        )
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  if (loading) return <div className="wishlist-loading">Loading...</div>
  if (error) return <div className="wishlist-error">{error}</div>

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      
      {products.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty</p>
          <button onClick={() => router.push('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-items">
          {products.map(product => (
            <div 
              className="wishlist-item" 
              id={`wishlist_item_${product.id}`}
              key={product.id}
            >
              <div className="wishlist-item-image" onClick={() => handleProductClick(product.id)}>
                <img 
                  className="wishlist-image" 
                  src={product.image} 
                  alt={product.name} 
                />
              </div>
              <div className="wishlist-details">
                <div 
                  className="wishlist-name" 
                  onClick={() => handleProductClick(product.id)}
                >
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