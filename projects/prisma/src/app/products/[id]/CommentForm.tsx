'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './comment-form.css'

interface CommentFormProps {
  productId: number
  onCommentAdded: () => void
}

export default function CommentForm({ productId, onCommentAdded }: CommentFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    if (comment.trim() === '') {
      setError('Please enter a comment')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setRating(0)
        setComment('')
        onCommentAdded()
      } else {
        setError(data.message || 'Failed to submit comment')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      
      <div className="rate-input">
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={`rate-${value}-star ${rating >= value ? 'active' : ''}`}
            onClick={() => handleStarClick(value)}
          >
            ★
          </span>
        ))}
      </div>
      
      <textarea 
        className="comment-textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product..."
        rows={4}
      />
      
      {error && <p className="comment-error">{error}</p>}
      
      <button 
        type="submit" 
        className="comment-submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}