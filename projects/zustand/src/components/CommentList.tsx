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

import React, { useEffect } from 'react'
import useCommentStore from '../stores/comment'
import useUserStore from '../stores/user'
import { useShallow } from 'zustand/react/shallow'
interface CommentListProps {
  blogId: number
}

const CommentList: React.FC<CommentListProps> = ({ blogId }) => {
  const comments = useCommentStore(
    useShallow((state) => state.comments.filter((comment) => comment.blogId === blogId))
  )
  const { username } = useUserStore()

  // Handle undo (Ctrl+Z or Command+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        useCommentStore.getState().undoLastComment(blogId, username)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [blogId, username])

  if (comments.length === 0) {
    return <div style={{ marginTop: '10px', fontStyle: 'italic' }}>No comments yet</div>
  }

  return (
    <div style={{ marginTop: '10px' }}>
      {comments.map((comment, index) => (
        <div
          key={index}
          style={{
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <div className="comment-author" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {comment.author}
          </div>
          <div className="comment-text">{comment.text}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList
