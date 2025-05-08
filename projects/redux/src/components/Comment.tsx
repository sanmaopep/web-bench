import React from 'react';
import './Comment.css';

interface CommentProps {
  author: string;
  text: string;
}

const Comment: React.FC<CommentProps> = ({ author, text }) => {
  return (
    <div className="comment">
      <div className="comment-author">{author || 'Anonymous'}</div>
      <p className="comment-text">{text}</p>
    </div>
  );
};

export default Comment;