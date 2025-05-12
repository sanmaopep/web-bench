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