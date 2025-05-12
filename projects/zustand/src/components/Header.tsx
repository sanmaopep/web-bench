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

import React from 'react'
import useBlogStore from '../stores/blog'
import useUserStore from '../stores/user'
import { navigate } from '../stores/route'

const Header = () => {
  const loading = useBlogStore((state) => state.isLoading)
  const setFormVisible = useBlogStore((state) => state.setFormVisible)
  const blogs = useBlogStore((state) => state.blogs)
  const { username, isLoggedIn, logout } = useUserStore()

  const handleLoginNavigate = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    logout()
  }

  const handleGameNavigate = () => {
    navigate('/game')
  }

  const handleRoomsNavigate = () => {
    navigate('/rooms')
  }

  const handleBulkAdd = () => {
    const batch = []
    for (let i = 0; i < 100000; i++) {
      batch.push({
        title: `RandomBlog-${Math.random().toString().slice(2, 14).padEnd(12, '0').slice(0, 12)}`,
        detail: 'Sample blog content',
      })
    }
    if (batch.length > 0) {
      useBlogStore.getState().bulkAddBlogs(batch)
    }
  }

  const handleHomeNavigate = () => {
    navigate('/')
  }

  return (
    <header
      style={{
        backgroundColor: '#1a365d',
        color: 'white',
        padding: '1rem',
        fontSize: '24px',
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <span onClick={handleHomeNavigate} style={{ cursor: 'pointer' }}>Hello Blog</span>
        <span className="blog-list-len" style={{ marginLeft: '10px', fontSize: '16px' }}>
          ({blogs.length} posts)
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <span className="username" style={{ marginRight: '10px' }}>{username}</span>
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              👋
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginNavigate}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🔑
          </button>
        )}
        <button
          onClick={handleGameNavigate}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🎮
        </button>
        <button
          onClick={handleRoomsNavigate}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🚪
        </button>
        <button
          disabled={loading}
          onClick={handleBulkAdd}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔀
        </button>
        <button
          disabled={loading}
          onClick={() => setFormVisible(true)}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Blog
        </button>
      </div>
    </header>
  )
}

export default Header