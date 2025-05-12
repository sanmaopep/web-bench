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