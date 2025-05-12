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
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'
import routeStore from '../stores/route'
import userStore from '../stores/user'

const Header = observer(() => {
  const isLoading = blogStore.isLoading

  const handleAddManyBlogs = () => {
    blogStore.addManyBlogs(100000)
  }

  return (
    <header
      style={{
        backgroundColor: '#4CAF50',
        padding: '20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1>Hello Blog</h1>
        <span className="blog-list-len" style={{ marginLeft: '10px', fontSize: '14px' }}>
          ({blogStore.blogs.length})
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {userStore.isLoggedIn && (
          <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
            <span className="username" style={{ fontWeight: 'bold' }}>
              {userStore.username}
            </span>
            <button
              className="logout-btn"
              onClick={() => userStore.logout()}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px',
                fontSize: '16px',
              }}
            >
              👋
            </button>
          </div>
        )}
        <button
          disabled={isLoading}
          onClick={handleAddManyBlogs}
          style={{
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px',
          }}
        >
          🔀
        </button>
        <button
          disabled={isLoading}
          onClick={() => blogStore.toggleForm()}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px',
          }}
        >
          Add Blog
        </button>
        <button
          onClick={() => routeStore.navigate('/game')}
          style={{
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px',
          }}
        >
          🎮
        </button>
        <button
          onClick={() => routeStore.navigate('/rooms')}
          style={{
            backgroundColor: '#795548',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px',
          }}
        >
          🚪
        </button>
        {!userStore.isLoggedIn ? (
          <button
            onClick={() => routeStore.navigate('/login')}
            style={{
              backgroundColor: '#FFA500',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            🔑
          </button>
        ) : null}
      </div>
    </header>
  )
})

export default Header
