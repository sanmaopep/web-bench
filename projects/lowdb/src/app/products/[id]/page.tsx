'use client'

import { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import './product-detail.css'
import './comments.css'
import './comment-form.css'
import { addToWishlist } from '@/actions/wishlist'
import { addToCart } from '@/actions/cart'
import { useAuth } from '@/context/auth'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

interface Comment {
  id: string
  username: string
  productId: string
  rating: number
  text: string
  createdAt: string
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [userHasPurchased, setUserHasPurchased] = useState(false)
  const [userHasCommented, setUserHasCommented] = useState(false)
  const [rating, setRating] = useState(5)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()

        if (data.success && data.data) {
          setProduct(data.data)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true)
        const response = await fetch(`/api/products/${params.id}/comments`)
        const data = await response.json()

        if (data.success) {
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setLoadingComments(false)
      }
    }

    fetchComments()
  }, [params.id])

  useEffect(() => {
    const checkUserPurchaseAndComment = async () => {
      if (!auth?.username || !product) return

      try {
        // Check if user has purchased the product
        const response = await fetch('/api/orders')
        const data = await response.json()

        if (data.success) {
          const hasPurchased = data.orders.some((order: any) => 
            order.status === 'Finished' && 
            order.items.some((item: any) => item.productId === params.id)
          )
          setUserHasPurchased(hasPurchased)
        }

        // Check if user has already commented
        const hasCommented = comments.some(comment => comment.username === auth.username)
        setUserHasCommented(hasCommented)
      } catch (error) {
        console.error('Error checking user purchase status:', error)
      }
    }

    checkUserPurchaseAndComment()
  }, [auth?.username, product, comments, params.id])

  const handleAddToWishlist = async () => {
    if (!auth?.username) {
      router.push('/login')
      return
    }

    setAddingToWishlist(true)
    try {
      const result = await addToWishlist(params.id)
      if (result.success) {
        alert('Added to wishlist successfully!')
      } else {
        alert(result.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      alert('An error occurred while adding to wishlist')
    } finally {
      setAddingToWishlist(false)
    }
  }

  const handleAddToCart = async () => {
    if (!auth?.username) {
      router.push('/login')
      return
    }

    if (!product) return

    setAddingToCart(true)
    try {
      const result = await addToCart(params.id, 1)

      if (result.success) {
        alert('Added to cart successfully!')
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        alert(result.error || 'Failed to add to cart')
      }
    } catch (error) {
      alert('An error occurred while adding to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!auth?.username) {
      router.push('/login')
      return
    }

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/products/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          text: commentText
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add the new comment to the list
        setComments([...comments, data.comment])
        setCommentText('')
        setUserHasCommented(true)
        alert('Your comment has been posted successfully!')
      } else {
        alert(data.error || 'Failed to post comment')
      }
    } catch (error) {
      alert('An error occurred while posting your comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0
    
    const sum = comments.reduce((total, comment) => total + comment.rating, 0)
    return (sum / comments.length).toFixed(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product Not Found</div>
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="product-detail-container">
      <div className="product-detail-image-container">
        <img className="product-image" src={product.image} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <h1 className="product-name">
          {product.name}
          {comments.length > 0 && (
            <span className="product-average-rating">{averageRating}</span>
          )}
        </h1>
        <p className="product-price">${product.price}</p>
        <p className="product-quantity">In Stock: {product.quantity}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button
            className="add-to-wishlist"
            onClick={handleAddToWishlist}
            disabled={addingToWishlist}
          >
            {addingToWishlist ? 'Adding...' : 'Add to Wishlist'}
          </button>
          <button className="add-to-cart-button" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="product-comments-section">
        <h2>Customer Reviews {comments.length > 0 && `(${comments.length})`}</h2>
        
        {userHasPurchased && !userHasCommented && (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <h3>Share your experience with this product</h3>
            
            <div className="rate-input">
              <input 
                type="radio" 
                id="rate-5-star" 
                name="rating" 
                value="5" 
                checked={rating === 5}
                onChange={() => setRating(5)}
              />
              <label htmlFor="rate-5-star" className="rate-5-star">★</label>
              
              <input 
                type="radio" 
                id="rate-4-star" 
                name="rating" 
                value="4" 
                checked={rating === 4}
                onChange={() => setRating(4)}
              />
              <label htmlFor="rate-4-star" className="rate-4-star">★</label>
              
              <input 
                type="radio" 
                id="rate-3-star" 
                name="rating" 
                value="3" 
                checked={rating === 3}
                onChange={() => setRating(3)}
              />
              <label htmlFor="rate-3-star" className="rate-3-star">★</label>
              
              <input 
                type="radio" 
                id="rate-2-star" 
                name="rating" 
                value="2" 
                checked={rating === 2}
                onChange={() => setRating(2)}
              />
              <label htmlFor="rate-2-star" className="rate-2-star">★</label>
              
              <input 
                type="radio" 
                id="rate-1-star" 
                name="rating" 
                value="1" 
                checked={rating === 1}
                onChange={() => setRating(1)}
              />
              <label htmlFor="rate-1-star" className="rate-1-star">★</label>
            </div>
            
            <textarea 
              className="comment-textarea"
              placeholder="Write your review here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
            
            <button 
              type="submit" 
              className="comment-submit-button"
              disabled={submittingComment || !commentText.trim()}
            >
              {submittingComment ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        
        {loadingComments ? (
          <div>Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-rating">{comment.rating}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-date">{formatDate(comment.createdAt)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments-message">No reviews yet. Be the first to review this product!</div>
        )}
      </div>
    </div>
  )
}