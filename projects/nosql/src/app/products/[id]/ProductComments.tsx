'use client'

import { useEffect, useState } from 'react'

interface Comment {
  username: string
  rating: number
  text: string
  createdAt: string
}

export default function ProductComments({ productId }: { productId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/products/${productId}/comments`)
      const data = await response.json()
      setComments(data)
      
      if (data.length > 0) {
        const avgRating = data.reduce((acc: number, curr: Comment) => acc + curr.rating, 0) / data.length
        setAverageRating(Math.round(avgRating * 10) / 10)
      }
    }

    fetchComments()
  }, [productId])

  return (
    <div className="product-comments">
      <div className="product-average-rating">{averageRating}</div>
      {comments.map((comment, index) => (
        <div key={index} className="comment-item">
          <div className="comment-username">{comment.username}</div>
          <div className="comment-rating">{comment.rating}</div>
          <div className="comment-text">{comment.text}</div>
        </div>
      ))}
    </div>
  )
}