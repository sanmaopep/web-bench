import React, { useState, useEffect } from 'react'
import useBlogStore from '../stores/blog'

const BlogForm = () => {
  const { formVisible, setFormVisible, blogs, addBlog, updateBlog, selectedBlogIndex, isEditing, setEditing } = useBlogStore()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [titleError, setTitleError] = useState(false)

  useEffect(() => {
    if (isEditing && selectedBlogIndex !== -1) {
      setTitle(blogs[selectedBlogIndex].title)
      setDetail(blogs[selectedBlogIndex].detail)
    }
  }, [isEditing, selectedBlogIndex, blogs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isDuplicate = blogs.some((blog, index) => 
      blog.title === title && (isEditing ? index !== selectedBlogIndex : true)
    )
    if (isDuplicate) {
      setTitleError(true)
      return
    }
    if (title && detail) {
      if (isEditing) {
        updateBlog(selectedBlogIndex, { title, detail })
      } else {
        addBlog({ title, detail })
      }
      setTitle('')
      setDetail('')
      setFormVisible(false)
      setTitleError(false)
      setEditing(false)
    }
  }

  if (!formVisible) return null

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
            setFormVisible(false)
            setEditing(false)
          }}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        <h2 style={{ marginTop: '0' }}>{isEditing ? 'Edit Blog' : 'Create Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '8px' }}>Title</label>
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
                border: `1px solid ${titleError ? 'red' : '#ccc'}`
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="detail" style={{ display: 'block', marginBottom: '8px' }}>Detail</label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                minHeight: '100px'
              }}
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BlogForm