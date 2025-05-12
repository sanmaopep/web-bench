// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client'

import { useEffect, useState } from 'react'
import './product-comments.css'

interface Comment {
  id: number
  username: string
  rating: number
  comment: string
  createdAt: string
}

interface ProductCommentsProps {
  productId: number
  refreshTrigger: number
}

export default function ProductComments({ productId, refreshTrigger }: ProductCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState<number | null>(null)

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}/comments`)
        const data = await response.json()
        
        if (data.success) {
          setComments(data.comments)
          
          if (data.comments.length > 0) {
            const sum = data.comments.reduce((acc: number, comment: Comment) => acc + comment.rating, 0)
            setAverageRating(parseFloat((sum / data.comments.length).toFixed(1)))
          } else {
            setAverageRating(null)
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [productId, refreshTrigger])

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>
  }

  return (
    <div className="product-comments-container">
      {averageRating !== null && (
        <div className="product-average-rating">
          <span className="rating-value">{averageRating}</span>
          <span className="rating-star">★</span>
          <span className="rating-count">({comments.length} {comments.length === 1 ? 'review' : 'reviews'})</span>
        </div>
      )}
      
      {comments.length > 0 ? (
        <div className="comments-list">
          <h3 className="comments-title">Customer Reviews</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-username">{comment.username}</div>
                <div className="comment-rating">
                  {comment.rating}
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < comment.rating ? 'filled' : ''}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="comment-text">{comment.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-comments">No reviews yet. Be the first to leave a review!</p>
      )}
    </div>
  )
}