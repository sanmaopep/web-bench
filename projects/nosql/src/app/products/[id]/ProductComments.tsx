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