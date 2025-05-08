import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import './ProductRating.css'

interface Comment {
  id: number
  username: string
  productId: number
  rating: number
  text: string
  date: string
}

interface ProductRatingProps {
  productId: number
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [userCanComment, setUserCanComment] = useState<boolean>(false)
  const [userHasCommented, setUserHasCommented] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(5)
  const [commentText, setCommentText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchComments()
    if (isAuthenticated) {
      checkUserCanComment()
    }
  }, [productId, isAuthenticated])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/comments`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.comments)
        setAverageRating(data.averageRating)
        
        if (isAuthenticated && user) {
          const hasCommented = data.comments.some(
            (comment: Comment) => comment.username === user.username
          )
          setUserHasCommented(hasCommented)
        }
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkUserCanComment = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/can-comment`)
      const data = await response.json()
      
      if (data.success) {
        setUserCanComment(data.canComment)
      }
    } catch (err) {
      console.error('Error checking if user can comment:', err)
    }
  }

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim()) {
      setError('Please enter a comment')
      return
    }
    
    setError(null)
    
    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          text: commentText,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh comments
        fetchComments()
        // Reset form
        setCommentText('')
        setRating(5)
        setUserCanComment(false)
        setUserHasCommented(true)
      } else {
        setError(data.message || 'Failed to submit comment')
      }
    } catch (err) {
      setError('Error submitting comment')
    }
  }

  const renderStars = (value: number, total: number = 5) => {
    return Array.from({ length: total }, (_, i) => (
      <span key={i} className={`rating-star ${i < value ? 'filled' : ''}`}>★</span>
    ))
  }

  const renderCommentStars = (value: number, total: number = 5) => {
    return Array.from({ length: total }, (_, i) => (
      <span key={i} className={`comment-rating-star ${i < value ? '' : 'empty'}`}>★</span>
    ))
  }

  if (loading) return <div>Loading ratings...</div>

  return (
    <div className="product-rating-container">
      {/* Average Rating Display */}
      <div className="product-average-rating">
        <div className="rating-stars">
          {renderStars(Math.round(averageRating))}
        </div>
        <span className="rating-value">{averageRating.toFixed(1)}</span>
        <span className="rating-count">({comments.length} reviews)</span>
      </div>

      {/* Comments Section */}
      <div className="comment-section">
        <h2 className="comment-section-title">Customer Reviews</h2>
        
        {/* Comment Form */}
        {userCanComment && !userHasCommented && (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <div className="rate-input">
              <input 
                type="radio" 
                id="rate-5-star" 
                name="rating" 
                value="5" 
                checked={rating === 5}
                onChange={() => handleRatingChange(5)}
              />
              <label htmlFor="rate-5-star" className="rate-5-star">★</label>
              
              <input 
                type="radio" 
                id="rate-4-star" 
                name="rating" 
                value="4" 
                checked={rating === 4}
                onChange={() => handleRatingChange(4)}
              />
              <label htmlFor="rate-4-star" className="rate-4-star">★</label>
              
              <input 
                type="radio" 
                id="rate-3-star" 
                name="rating" 
                value="3" 
                checked={rating === 3}
                onChange={() => handleRatingChange(3)}
              />
              <label htmlFor="rate-3-star" className="rate-3-star">★</label>
              
              <input 
                type="radio" 
                id="rate-2-star" 
                name="rating" 
                value="2" 
                checked={rating === 2}
                onChange={() => handleRatingChange(2)}
              />
              <label htmlFor="rate-2-star" className="rate-2-star">★</label>
              
              <input 
                type="radio" 
                id="rate-1-star" 
                name="rating" 
                value="1" 
                checked={rating === 1}
                onChange={() => handleRatingChange(1)}
              />
              <label htmlFor="rate-1-star" className="rate-1-star">★</label>
            </div>
            
            {error && <div className="comment-form-error">{error}</div>}
            
            <textarea 
              className="comment-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts about this product..."
              required
            />
            
            <button type="submit" className="comment-submit-button">
              Submit Review
            </button>
          </form>
        )}
        
        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-username">{comment.username}</div>
                  <div className="comment-date">
                    {new Date(comment.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="comment-rating">
                  <div className="comment-rating-stars">
                    {renderCommentStars(comment.rating)}
                  </div>
                  <span className="comment-rating-value">{comment.rating}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments">No reviews yet. Be the first to review this product!</div>
        )}
      </div>
    </div>
  )
}

export default ProductRating