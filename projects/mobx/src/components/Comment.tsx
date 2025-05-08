import React from 'react';
import { Comment as CommentType } from '../stores/comment';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const formattedDate = new Date(comment.timestamp).toLocaleString();
  
  return (
    <div style={{ 
      padding: '10px', 
      borderBottom: '1px solid #eee',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span className="comment-author" style={{ fontWeight: 'bold', color: '#2196F3' }}>
          {comment.author}
        </span>
        <span style={{ fontSize: '12px', color: '#999' }}>
          {formattedDate}
        </span>
      </div>
      <p className="comment-text" style={{ margin: '5px 0' }}>
        {comment.text}
      </p>
    </div>
  );
};

export default Comment;