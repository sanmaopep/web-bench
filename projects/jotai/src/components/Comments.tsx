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
