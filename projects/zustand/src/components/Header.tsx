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