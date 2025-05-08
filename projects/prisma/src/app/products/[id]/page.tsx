'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../products.css'
import './product-detail.css'
import AddToWishlistButton from '@/components/AddToWishlistButton'
import AddToCartButton from './AddToCartButton'
import ProductComments from './ProductComments'
import CommentForm from './CommentForm'
import { useAuth } from '@/context/auth'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [canComment, setCanComment] = useState(false)
  const [hasCommented, setHasCommented] = useState(false)
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0)
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setProduct(data.data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  useEffect(() => {
    if (!auth?.username || !product) return

    async function checkCommentEligibility() {
      try {
        const response = await fetch(`/api/products/${product.id}/comments/eligibility`)
        const data = await response.json()
        
        setCanComment(data.canComment)
        setHasCommented(data.hasCommented)
      } catch (error) {
        console.error('Error checking comment eligibility:', error)
      }
    }

    checkCommentEligibility()
  }, [product, auth])

  const handleCommentAdded = () => {
    setCommentsRefreshTrigger(prev => prev + 1)
    setHasCommented(true)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product Not Found</div>
  }

  return (
    <div className="product-detail-container">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <ProductComments productId={product.id} refreshTrigger={commentsRefreshTrigger} />
        <p className="product-price">${product.price}</p>
        <p className="product-quantity">Quantity: {product.quantity} left</p>
        <p className="product-description">{product.description}</p>
        {auth?.username && (
          <>
            <AddToCartButton productId={product.id} />
            <AddToWishlistButton productId={product.id} />
          </>
        )}
        <button onClick={() => router.back()} className="back-button">
          Back to Products
        </button>
      </div>
      
      <div className="product-comments-section">
        {auth?.username && canComment && !hasCommented && (
          <CommentForm productId={product.id} onCommentAdded={handleCommentAdded} />
        )}
      </div>
    </div>
  )
}