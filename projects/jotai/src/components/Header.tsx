import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { formVisibleAtom, blogAtom, appendManyBlogsAtom, loadingAtom } from '../atoms/blog'
import { navigateAtom } from '../atoms/route'
import { userAtom, logoutAtom } from '../atoms/user'

const Header = () => {
  const [, setVisible] = useAtom(formVisibleAtom)
  const [isLoading] = useAtom(loadingAtom)
  const blogs = useAtomValue(blogAtom)
  const [, navigate] = useAtom(navigateAtom)
  const [, appendManyBlogs] = useAtom(appendManyBlogsAtom)
  const [user] = useAtom(userAtom)
  const [, logout] = useAtom(logoutAtom)

  return (
    <header
      style={{
        backgroundColor: '#1a365d',
        padding: '20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h1>
        Hello Blog <span className="blog-list-len">({blogs.length})</span>
      </h1>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {user.isLoggedIn ? (
          <>
            <span className="username" style={{ fontSize: '16px' }}>
              {user.username}
            </span>
            <button
              className="logout-btn"
              onClick={() => logout()}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              👋
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            🔑
          </button>
        )}
        <button
          onClick={() => navigate('/rooms')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          🚪
        </button>
        <button
          onClick={() => navigate('/game')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          🎮
        </button>
        <button
          disabled={isLoading}
          onClick={() => appendManyBlogs()}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          🔀
        </button>
        <button
          disabled={isLoading}
          onClick={() => setVisible(true)}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Add Blog
        </button>
      </div>
    </header>
  )
}

export default Header
