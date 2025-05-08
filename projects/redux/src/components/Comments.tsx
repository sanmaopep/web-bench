import React from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface CommentsProps {
  blogId: number;
}

const Comments: React.FC<CommentsProps> = ({ blogId }) => {
  const comments = useSelector((state: RootState) => 
    state.comment.comments.filter(comment => comment.blogId === blogId)
  );

  return (
    <div className="comments-section">
      <h3 className="comments-header">Comments</h3>
      
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Comment 
            key={`${comment.author}-${index}`}
            author={comment.author}
            text={comment.text}
          />
        ))
      ) : (
        <p className="no-comments">No comments yet</p>
      )}
      
      <CommentForm blogId={blogId} />
    </div>
  );
};

export default Comments;