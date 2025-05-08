'use client'

import { useEffect, useState } from 'react'
import './product-detail.css'
import { useParams, useRouter } from 'next/navigation'
import './product-comments.css'

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
  productId: number
  rating: number
  comment: string
  createdAt: string
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [inWishlist, setInWishlist] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [userComment, setUserComment] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [canComment, setCanComment] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [currentUsername, setCurrentUsername] = useState('')
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth')
        if (response.ok) {
          const userData = await response.json()
          setIsLoggedIn(true)
          setCurrentUsername(userData.username)
        }
      } catch (error) {
        setIsLoggedIn(false)
      }
    }

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.data)
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    async function checkWishlist() {
      try {
        const response = await fetch('/api/wishlist')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.products) {
            const isInWishlist = data.products.some(
              (p: any) => p.id === Number(params.id)
            )
            setInWishlist(isInWishlist)
          }
        }
      } catch (error) {
        console.error('Failed to check wishlist:', error)
      }
    }

    async function fetchComments() {
      try {
        const response = await fetch(`/api/products/${params.id}/comments`)
        const data = await response.json()
        if (data.success) {
          setComments(data.comments)
          
          // Calculate average rating
          if (data.comments.length > 0) {
            const total = data.comments.reduce((sum: number, comment: Comment) => sum + comment.rating, 0)
            setAverageRating(parseFloat((total / data.comments.length).toFixed(1)))
          }
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }

    async function checkCanComment() {
      if (!isLoggedIn) {
        setCanComment(false)
        return
      }
      
      try {
        // Check if user has purchased the product
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.orders) {
            // Find any finished orders
            const finishedOrders = data.orders.filter((order: any) => order.status === 'Finished')
            
            for (const order of finishedOrders) {
              // Fetch order details to check items
              const orderResponse = await fetch(`/api/orders/${order.id}`)
              const orderData = await orderResponse.json()
              
              if (orderData.success && orderData.order.items) {
                // Check if the product is in this order
                const hasPurchased = orderData.order.items.some(
                  (item: any) => item.productId === Number(params.id)
                )
                
                if (hasPurchased) {
                  // Check if user has already commented
                  const hasCommented = comments.some(
                    comment => comment.username === currentUsername
                  )
                  
                  setCanComment(!hasCommented)
                  return
                }
              }
            }
          }
        }
        setCanComment(false)
      } catch (error) {
        console.error('Failed to check if user can comment:', error)
        setCanComment(false)
      }
    }

    checkAuth()
    fetchProduct()
    checkWishlist()
    fetchComments()
    
    // We'll check if user can comment after we know they're logged in
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        checkCanComment()
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [params.id, isLoggedIn, currentUsername])
  
  // Check if user can comment whenever comments change
  useEffect(() => {
    if (isLoggedIn && currentUsername && comments.length > 0) {
      const hasCommented = comments.some(
        comment => comment.username === currentUsername
      )
      setCanComment(!hasCommented && canComment)
    }
  }, [comments, isLoggedIn, currentUsername, canComment])

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product?.id }),
      })

      if (response.ok) {
        setInWishlist(true)
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    }
  }

  const handleRemoveFromWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product?.id }),
      })

      if (response.ok) {
        setInWishlist(false)
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    if (!product || addingToCart) return

    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      })

      if (response.ok) {
        // Dispatch event to refresh cart
        window.dispatchEvent(new Event('refreshCart'))
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }
  
  const handleRatingClick = (rating: number) => {
    setUserRating(rating)
  }
  
  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating)
  }
  
  const handleRatingLeave = () => {
    setHoveredRating(0)
  }
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userRating) {
      setCommentError('Please select a rating')
      return
    }
    
    if (!userComment.trim()) {
      setCommentError('Please enter a comment')
      return
    }
    
    setSubmittingComment(true)
    setCommentError('')
    
    try {
      const response = await fetch(`/api/products/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Add new comment to list
        setComments([data.comment, ...comments])
        
        // Reset form
        setUserComment('')
        setUserRating(0)
        
        // Recalculate average rating
        const total = comments.reduce((sum, comment) => sum + comment.rating, 0) + data.comment.rating
        setAverageRating(parseFloat((total / (comments.length + 1)).toFixed(1)))
        
        // User can no longer comment
        setCanComment(false)
      } else {
        setCommentError(data.error || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
      setCommentError('Failed to submit comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product Not Found</div>
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-detail-info">
        <h1 className="product-name">{product.name}</h1>
        {comments.length > 0 && (
          <div className="product-average-rating">
            ⭐ {averageRating}
          </div>
        )}
        <p className="product-price">${product.price}</p>
        <p className="product-quantity">In Stock: {product.quantity}</p>
        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
        {isLoggedIn && (
          <div className="product-actions">
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <div className="wishlist-actions">
              {inWishlist ? (
                <button
                  className="remove-from-wishlist"
                  onClick={handleRemoveFromWishlist}
                >
                  Remove from Wishlist
                </button>
              ) : (
                <button
                  className="add-to-wishlist"
                  onClick={handleAddToWishlist}
                >
                  Add to Wishlist
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="product-comments-section">
        <h2>Customer Reviews</h2>
        
        {canComment && (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <h3>Leave a Review</h3>
            
            <div className="rate-input" onMouseLeave={handleRatingLeave}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={`rate-${star}-star ${star <= (hoveredRating || userRating) ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                >
                  ★
                </span>
              ))}
            </div>
            
            <textarea 
              className="comment-textarea"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              required
            ></textarea>
            
            {commentError && <p className="comment-error">{commentError}</p>}
            
            <button 
              type="submit" 
              className="comment-submit-button"
              disabled={submittingComment}
            >
              {submittingComment ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        
        {comments.length > 0 ? (
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-rating">{comment.rating}</span>
                </div>
                <p className="comment-text">{comment.comment}</p>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">No reviews yet. Be the first to leave a review!</p>
        )}
      </div>
    </div>
  )
}