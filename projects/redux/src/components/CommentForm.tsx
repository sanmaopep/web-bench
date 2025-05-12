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