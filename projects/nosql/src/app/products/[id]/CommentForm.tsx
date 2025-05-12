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