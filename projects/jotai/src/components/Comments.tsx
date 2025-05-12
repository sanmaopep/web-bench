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

import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { blogCommentsAtom } from '../atoms/comments'
import CommentForm from './CommentForm'

interface CommentsProps {
  blogId: number
}

const Comments: React.FC<CommentsProps> = ({ blogId }) => {
  const comments = useAtomValue(blogCommentsAtom)

  return (
    <div className="comments-section">
      <h3 style={{ marginBottom: '15px' }}>Comments ({comments.length})</h3>

      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div
              key={index}
              style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #eee',
              }}
            >
              <div
                className="comment-author"
                style={{
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#555',
                }}
              >
                {comment.author}
              </div>
              <div className="comment-text">{comment.text}</div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#888',
                  marginTop: '8px',
                }}
              >
                {new Date(comment.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No comments yet. Be the first to comment!
        </p>
      )}

      <CommentForm blogId={blogId} />

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
        <p>Tip: Press Ctrl+Z (or Cmd+Z on Mac) to undo your last comment</p>
      </div>
    </div>
  )
}

export default Comments
