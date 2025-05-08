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
