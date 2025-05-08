import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { addCommentAtom } from '../atoms/comments';
import { userAtom } from '../atoms/user';

interface CommentFormProps {
  blogId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId }) => {
  const [commentText, setCommentText] = useState('');
  const [, addComment] = useAtom(addCommentAtom);
  const [user] = useAtom(userAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment({ blogId, text: commentText });
      setCommentText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <textarea
          className="comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={user.isLoggedIn ? "Write a comment..." : "Log in to leave a comment or comment as Anonymous"}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
      </div>
      <button
        type="submit"
        className="comment-submit-btn"
        disabled={!commentText.trim()}
        style={{
          backgroundColor: '#2196f3',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: commentText.trim() ? 'pointer' : 'not-allowed',
          opacity: commentText.trim() ? 1 : 0.7
        }}
      >
        Comment
      </button>
    </form>
  );
};

export default CommentForm;