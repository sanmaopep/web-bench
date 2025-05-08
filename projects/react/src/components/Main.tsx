import React, { useState, useMemo, useRef, useImperativeHandle, forwardRef } from 'react'
import Blog, { BlogRef } from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import { useBlogContext } from '../context/BlogContext'

interface MainProps {
  onEditBlog: () => void
}

export interface MainRef {
  focusAndTypeComment: () => void
}

const Main = forwardRef<MainRef, MainProps>(({ onEditBlog }, ref) => {
  const { blogs, selectedBlog, setSelectedBlog } = useBlogContext()
  const [searchKeyword, setSearchKeyword] = useState('')

  const blogRef = useRef<BlogRef>(null)
  useImperativeHandle(ref, () => ({
    focusAndTypeComment: () => blogRef.current?.focusAndTypeComment(),
  }))

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => blog.title.toLowerCase().includes(searchKeyword.toLowerCase()))
  }, [blogs, searchKeyword])

  const selectedBlogData = blogs.find((blog) => blog.title === selectedBlog) || blogs[0]

  return (
    <main style={{ display: 'flex' }}>
      <div style={{ marginRight: 20 }}>
        <Search onSearch={setSearchKeyword} />
        <BlogList
          blogs={filteredBlogs}
          selectedBlog={selectedBlog}
          onSelectBlog={setSelectedBlog}
        />
      </div>
      <div style={{ flex: 2, overflow: 'hidden' }}>
        {selectedBlogData && (
          <>
            <Blog
              ref={blogRef}
              title={selectedBlogData.title}
              detail={selectedBlogData.detail}
              onEdit={onEditBlog}
            />
          </>
        )}
      </div>
    </main>
  )
})

export default Main
