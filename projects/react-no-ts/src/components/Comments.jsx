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

import React, { useState, useEffect, useRef } from 'react';
import CommentStore from '../store/Comment';
import { showToast } from '../utils/toast';
import { useFocusContext } from '../context/FocusContext';

function Comments({ blogTitle }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const commentRef = useRef(null);
  const { registerCommentRef } = useFocusContext();

  useEffect(() => {
    registerCommentRef({
      ref: commentRef,
      setValue: setComment
    });
  }, [registerCommentRef]);

  useEffect(() => {
    setComments(CommentStore.getComments(blogTitle));

    const handleCommentsUpdate = () => {
      setComments(CommentStore.getComments(blogTitle));
    };

    CommentStore.subscribe(handleCommentsUpdate);
    return () => CommentStore.unsubscribe(handleCommentsUpdate);
  }, [blogTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      CommentStore.addComment(blogTitle, comment);
      setComment('');
      showToast('New Comment Created Successfully!');
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Comments</h3>
      <div style={{ marginBottom: '20px' }}>
        {comments.map((comment, index) => (
          <div 
            key={index}
            className="comment-item"
            style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {comment}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          ref={commentRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter Your Comment"
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
        <button
          type="submit"
          className="comment-btn"
          style={{
            padding: '8px 16px',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-end',
            fontWeight: 'bold'
          }}
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
}

export default Comments;