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