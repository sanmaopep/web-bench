import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CommentForm.css';
import { addComment } from '../models/comment';
import { RootState } from '../store';

interface CommentFormProps {
  blogId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() && username) {
      dispatch(addComment({
        blogId,
        author: username,
        text: text.trim()
      }));
      setText('');
    }
  };

  if (!username) {
    return <p className="login-reminder">Please login to comment</p>;
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        required
      />
      <button 
        type="submit" 
        className="comment-submit-btn"
        disabled={!text.trim()}
      >
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;