import React, { useState } from 'react'
import useCommentStore from '../stores/comment'
import useUserStore from '../stores/user'

interface CommentFormProps {
  blogId: number
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId }) => {
  const [text, setText] = useState('')
  const addComment = useCommentStore((state) => state.addComment)
  const { username, isLoggedIn } = useUserStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() && isLoggedIn && username) {
      addComment(blogId, {
        author: username,
        text: text.trim(),
        createdAt: new Date().toISOString()
      })
      setText('')
    }
  }

  if (!isLoggedIn) {
    return <div style={{ marginTop: '10px' }}>Please log in to comment</div>
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
      <textarea
        className="comment-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          minHeight: '80px',
          marginBottom: '10px'
        }}
      />
      <button
        type="submit"
        className="comment-submit-btn"
        disabled={!text.trim()}
        style={{
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Post Comment
      </button>
    </form>
  )
}

export default CommentForm