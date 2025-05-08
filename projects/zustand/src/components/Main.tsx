import React from 'react'
import Blog from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import useBlogStore from '../stores/blog'

const Main = () => {
  const { blogs, filteredBlogs, selectedBlogIndex } = useBlogStore()
  const displayBlogs = filteredBlogs.length > 0 ? filteredBlogs : blogs
  
  return (
    <main style={{
      flex: 1,
      padding: '20px',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <div style={{ width: '300px', marginRight: '20px' }}>
        <Search />
        <BlogList blogs={displayBlogs} />
      </div>
      <div style={{ flex: 1 }}>
        {displayBlogs.length === 0 ? (
          <div>No Blog</div>
        ) : (
          <Blog {...displayBlogs[selectedBlogIndex]} selectedIndex={selectedBlogIndex} />
        )}
      </div>
    </main>
  )
}

export default Main