import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { blogListAtom, formVisibleAtom, selectedBlogAtom, editBlogAtom } from '../atoms/blog'
import { userAtom } from '../atoms/user'

const BlogForm: React.FC = () => {
  const [isVisible, setVisible] = useAtom(formVisibleAtom)
  const [blogs, setBlogs] = useAtom(blogListAtom)
  const [, setSelectedIndex] = useAtom(selectedBlogAtom)
  const [editIndex, setEditIndex] = useAtom(editBlogAtom)
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [user] = useAtom(userAtom)

  useEffect(() => {
    if (editIndex !== null) {
      setTitle(blogs[editIndex].title)
      setDetail(blogs[editIndex].detail)
    }
  }, [editIndex, blogs])

  if (!isVisible) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isDuplicate = blogs.some((blog, index) => blog.title === title && index !== editIndex)
    if (isDuplicate) {
      setTitleError(true)
      return
    }
    
    if (editIndex !== null) {
      const updatedBlogs = [...blogs]
      updatedBlogs[editIndex] = { 
        title, 
        detail,
        author: blogs[editIndex].author || (user.isLoggedIn ? user.username : undefined)
      }
      setBlogs(updatedBlogs)
    } else {
      const newBlog = { 
        title, 
        detail,
        author: user.isLoggedIn ? user.username : undefined
      }
      setBlogs([...blogs, newBlog])
      setSelectedIndex(blogs.length)
    }
    
    setVisible(false)
    setTitle('')
    setDetail('')
    setTitleError(false)
    setEditIndex(null)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
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
        <button 
          className="close-btn"
          onClick={() => {
            setVisible(false)
            setEditIndex(null)
          }}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '20px' }}>{editIndex !== null ? 'Edit Blog' : 'Create Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input 
              id="title"
              type="text" 
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleError(false)
              }}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: titleError ? '1px solid red' : '1px solid #ddd' 
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="detail" style={{ display: 'block', marginBottom: '5px' }}>Detail</label>
            <textarea 
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              style={{ width: '100%', height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <button 
            type="submit"
            className="submit-btn"
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              float: 'right'
            }}
          >
            {editIndex !== null ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BlogForm