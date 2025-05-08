import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { useBlogComments } from '../store/Comment'
import { showToast } from '../utils/toast'

interface CommentsProps {
  blogTitle: string
}

export interface CommentsRef {
  focusAndTypeComment: () => void
}

const Comments = forwardRef<CommentsRef, CommentsProps>(({ blogTitle }, ref) => {
  const [newComment, setNewComment] = useState('')
  const { addComment, comments } = useBlogComments(blogTitle)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    focusAndTypeComment: () => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        setNewComment('Charming Blog!')
      }
    }
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment(newComment)
      setNewComment('')
      showToast('New Comment Created Success!')
    }
  }

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="comment-item">
          <p>{comment}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter Your Comment"
        />
        <button type="submit" className="comment-btn">
          Submit Comment
        </button>
      </form>
    </div>
  )
})

export default Comments