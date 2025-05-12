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