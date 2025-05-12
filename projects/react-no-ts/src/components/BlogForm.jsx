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
import { useBlog } from '../context/BlogContext';
import { showToast } from '../utils/toast';

function BlogForm({ isVisible, onClose, isEdit, initialTitle = '', initialDetail = '', onEdit }) {
  const { blogs } = useBlog();
  const [visibleCount, setVisibleCount] = useState(0);
  const [title, setTitle] = useState(initialTitle);
  const [detail, setDetail] = useState(initialDetail);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isVisible) {
      setVisibleCount(prev => prev + 1);
      setError('');
      if (isEdit) {
        setTitle(initialTitle);
        setDetail(initialDetail);
      }
    }
  }, [isVisible, isEdit, initialTitle, initialDetail]);

  if (!isVisible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isEdit) {
      const isDuplicate = blogs.some(blog => blog.title === title);
      if (isDuplicate) {
        setError('A blog with this title already exists');
        return;
      }

      window.dispatchEvent(new CustomEvent('blog-created', {
        detail: { title, detail }
      }));
      showToast('New Blog Created Successfully!');
    } else {
      const success = onEdit({ title, detail });
      if (!success) {
        setError('A blog with this title already exists');
        return;
      }
    }

    setTitle('');
    setDetail('');
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', 
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        position: 'relative'
      }}>
        <span className="visible-count" style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          fontSize: '14px',
          color: '#666'
        }}>
          {visibleCount}
        </span>

        <button 
          className="close-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            border: 'none',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px 10px'
          }}
        >
          ×
        </button>
        <h3 style={{
          marginTop: 0,
          marginBottom: '20px',
          color: '#333',
          textAlign: 'center'
        }}>
          {isEdit ? 'Edit Blog' : 'Create Blog'}
        </h3>
        {error && <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="title" style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: 'bold'
            }}>
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="detail" style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: 'bold'
            }}>
              Detail
            </label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              required
              rows="4"
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit" 
            className="submit-btn"
            style={{
              padding: '10px',
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#357ABD'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4A90E2'
            }}
          >
            {isEdit ? 'Update Blog' : 'Submit Blog'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogForm;