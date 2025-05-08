import React from 'react';
import { observer } from 'mobx-react-lite';
import commentStore from '../stores/comment';
import Comment from './Comment';

interface CommentListProps {
  blogId: number;
}

const CommentList: React.FC<CommentListProps> = observer(({ blogId }) => {
  const comments = commentStore.getCommentsForBlog(blogId);
  
  if (comments.length === 0) {
    return <div style={{ marginTop: '20px', color: '#999' }}>No comments yet</div>;
  }
  
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Comments ({comments.length})
      </h3>
      <div>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
});

export default CommentList;