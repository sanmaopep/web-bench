import React from 'react'
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'
import userStore from '../stores/user'
import { renderMarkdown } from '../utils/markdown'

const BlogForm = observer(() => {
  const [title, setTitle] = React.useState('')
  const [detail, setDetail] = React.useState('')
  const [error, setError] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  React.useEffect(() => {
    if (blogStore.editMode) {
      const blog = blogStore.blogs[blogStore.selectedBlogIndex]
      setTitle(blog.title)
      setDetail(blog.detail)
    } else {
      setTitle('')
      setDetail('')
    }
  }, [blogStore.formVisible, blogStore.editMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isDuplicate = blogStore.blogs.some((blog, index) => 
      blog.title === title && (!blogStore.editMode || index !== blogStore.selectedBlogIndex)
    )
    if (isDuplicate) {
      setError(true)
      return
    }
    
    if (blogStore.editMode) {
      blogStore.updateBlog(blogStore.selectedBlogIndex, { 
        title, 
        detail, 
        author: blogStore.blogs[blogStore.selectedBlogIndex].author 
      })
    } else {
      blogStore.addBlog({ 
        title, 
        detail, 
        author: userStore.isLoggedIn ? userStore.username : undefined 
      })
      blogStore.selectBlog(blogStore.blogs.length - 1)
    }
    
    setTitle('')
    setDetail('')
    setError(false)
    blogStore.toggleForm()
    blogStore.setEditMode(false)
  }

  if (!blogStore.formVisible) return null

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
        width: '600px',
        position: 'relative'
      }}>
        <button 
          className="close-btn" 
          onClick={() => {
            blogStore.toggleForm()
            blogStore.setEditMode(false)
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '20px' }}>{blogStore.editMode ? 'Edit Blog' : 'Create Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input 
              id="title"
              type="text" 
              value={title} 
              onChange={(e) => {
                setTitle(e.target.value)
                setError(false)
              }}
              className={error ? 'error' : ''}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required
            />
            {error && <p style={{ color: 'red', marginTop: '5px' }}>Title already exists</p>}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label htmlFor="detail">Detail (Supports Markdown)</label>
              <button 
                type="button" 
                onClick={() => setShowPreview(!showPreview)}
                style={{ 
                  backgroundColor: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  padding: '5px 10px', 
                  borderRadius: '4px', 
                  cursor: 'pointer'
                }}
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {!showPreview ? (
              <textarea 
                id="detail"
                value={detail} 
                onChange={(e) => setDetail(e.target.value)} 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '200px' }}
                required
              />
            ) : (
              <div 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  boxSizing: 'border-box', 
                  minHeight: '200px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                  overflow: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(detail) }}
              />
            )}
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              padding: '10px 15px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
})

export default BlogForm