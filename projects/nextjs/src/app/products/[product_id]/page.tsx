'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import '../products.css'
import { useAuth } from '@/context/auth'
import { useCart } from '@/context/cart'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

interface Comment {
  id: number
  username: string
  rating: number
  comment: string
}

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [canComment, setCanComment] = useState(false)
  const { product_id } = useParams()
  const { addToCart } = useCart()
  const { auth } = useAuth()

  useEffect(() => {
    fetch(`/api/products/${product_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product)
        }
        setLoading(false)
      })

    fetch(`/api/products/${product_id}/comments`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setComments(data.comments)
          setCanComment(data.canComment)
        }
      })
  }, [product_id, auth])

  const addToWishlist = async () => {
    if (!auth) {
      return
    }
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id }),
    })
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/products/${product_id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: userRating, comment: userComment }),
    })
    const data = await response.json()
    if (data.success) {
      setComments([
        ...comments,
        { id: Date.now(), username: auth!.username!, rating: userRating, comment: userComment },
      ])
      setUserRating(0)
      setUserComment('')
      setCanComment(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product Not Found</div>
  }

  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
      : 0

  return (
    <div className="product-detail">
      <img className="product-image" src={product.image} alt={product.name} />
      <h1 className="product-name">{product.name}</h1>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-quantity">In Stock: {product.quantity}</p>
      <p className="product-description">{product.description}</p>
      <button className="add-to-wishlist" onClick={addToWishlist}>
        Add to Wishlist
      </button>
      <button className="add-to-cart-button" onClick={() => addToCart(product.id)}>
        Add to Cart
      </button>

      <div className="product-average-rating">{averageRating.toFixed(1)}</div>

      {canComment && (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <div className="rate-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`rate-${star}-star${star <= userRating ? ' active' : ''}`}
                onClick={() => setUserRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className="comment-textarea"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Write your comment here..."
          />
          <button type="submit" className="comment-submit-button">
            Submit Comment
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <span className="comment-username">{comment.username}</span>
            <span className="comment-rating">{comment.rating}</span>
            <p className="comment-text">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
