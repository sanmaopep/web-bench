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
import userStore from '../stores/user';

interface CommentFormProps {
  blogId: number;
}

const CommentForm: React.FC<CommentFormProps> = observer(({ blogId }) => {
  const [comment, setComment] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const author = userStore.isLoggedIn ? userStore.username : 'Anonymous';
    commentStore.addComment(blogId, comment, author);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <textarea
          className="comment-input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={userStore.isLoggedIn ? "Add a comment..." : "Login to add a comment with your username, or comment as Anonymous"}
          style={{ 
            width: '100%', 
            padding: '8px', 
            boxSizing: 'border-box',
            minHeight: '80px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      <button
        type="submit"
        className="comment-submit-btn"
        disabled={!comment.trim()}
        style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '8px 15px', 
          borderRadius: '4px', 
          cursor: comment.trim() ? 'pointer' : 'not-allowed',
          opacity: comment.trim() ? 1 : 0.7
        }}
      >
        Add Comment
      </button>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        Press Ctrl+Z (or Cmd+Z on Mac) to undo your last comment
      </div>
    </form>
  );
});

export default CommentForm;