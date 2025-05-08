'use client'

import { useState } from 'react'

export default function CommentForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch(`/api/products/${productId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating, text })
    })

    if (response.ok) {
      window.location.reload()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="rate-input">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`rate-${star}-star ${rating >= star ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            ⭐
          </span>
        ))}
      </div>
      <textarea 
        className="comment-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <button type="submit" className="comment-submit-button">
        Submit Comment
      </button>
    </form>
  )
}