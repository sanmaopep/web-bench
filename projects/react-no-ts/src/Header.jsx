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

import React, { useCallback } from 'react'
import { useBlog } from '../context/BlogContext'
import Tooltip from './Tooltip'
import { useFocusContext } from '../context/FocusContext'

function Header({ onAddClick, navigate }) {
  const { blogs, setBlogs } = useBlog();
  const { focusComment } = useFocusContext();

  const generateRandomBlogs = useCallback(() => {
    const generateRandomTitle = () => {
      return 'RandomBlog-' + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    };

    const newBlogs = Array.from({length: 100000}, () => ({
      title: generateRandomTitle(),
      detail: 'Random blog detail'
    }));

    setBlogs(prevBlogs => [...prevBlogs, ...newBlogs]);
  }, [setBlogs]);

  const handleFastComment = useCallback(() => {
    focusComment('Charming Blog!');
  }, [focusComment]);

  const handleGameClick = () => {
    navigate('/game');
  };

  return (
    <header style={{
      backgroundColor: '#4A90E2',
      padding: '20px',
      color: 'white',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1>Hello Blog</h1>
        <span className="blog-list-len" style={{
          backgroundColor: 'white',
          color: '#4A90E2',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '14px'
        }}>
          {blogs.length}
        </span>
      </div>
      <div style={{display: 'flex', gap: '10px'}}>
        <Tooltip text="Write a New Blog For everyone">
          <button 
            onClick={onAddClick}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              color: '#4A90E2', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Add Blog
          </button>
        </Tooltip>
        <button
          onClick={generateRandomBlogs}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#4A90E2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Random Blogs
        </button>
        <button
          onClick={handleFastComment}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ff3333'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ff4d4d'
          }}
        >
          Fast Comment
        </button>
        <button
          onClick={handleGameClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c5ce7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'transform 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
          }}
        >
          🎮
        </button>
      </div>
    </header>
  )
}

export default React.memo(Header)