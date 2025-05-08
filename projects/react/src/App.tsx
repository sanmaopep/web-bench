import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import Main, { MainRef } from './components/Main'
import BlogForm from './components/BlogForm'
import { BlogProvider } from './context/BlogContext'
import './App.css'

interface AppProps {
  navigate: (path: string) => void
}

const App: React.FC<AppProps> = ({ navigate }) => {
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [editMode, setEditMode] = useState(false)

  const handleShowBlogForm = useCallback(() => {
    setShowBlogForm(true)
    setEditMode(false)
    setVisibleCount((prevCount) => prevCount + 1)
  }, [])

  const handleEditBlog = useCallback(() => {
    setShowBlogForm(true)
    setEditMode(true)
    setVisibleCount((prevCount) => prevCount + 1)
  }, [])

  const mainRef = React.useRef<MainRef>(null)

  const handleFastComment = useCallback(() => {
    mainRef.current?.focusAndTypeComment()
  }, [])

  return (
    <div className="App">
      <Header
        onAddBlog={handleShowBlogForm}
        onFastComment={handleFastComment}
        navigate={navigate}
      />
      <Main ref={mainRef} onEditBlog={handleEditBlog} />
      {showBlogForm && (
        <BlogForm
          onClose={() => setShowBlogForm(false)}
          visibleCount={visibleCount}
          editMode={editMode}
        />
      )}
    </div>
  )
}

export default App
