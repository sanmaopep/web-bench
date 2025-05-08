import React from 'react'
import Blog from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'

const Main = observer(() => {
  const selectedBlog = blogStore.selectedBlog
  return (
    <main style={{ padding: '20px', textAlign: 'left', display: 'flex' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc' }}>
        <Search />
        <BlogList
          blogs={blogStore.filteredBlogs.length > 0 ? blogStore.filteredBlogs : blogStore.blogs}
        />
      </div>
      <div style={{ flex: 1, paddingLeft: '20px' }}>
        {selectedBlog ? (
          <Blog 
            title={selectedBlog.title} 
            detail={selectedBlog.detail} 
            author={selectedBlog.author}
          />
        ) : (
          <div>No Blog</div>
        )}
      </div>
    </main>
  )
})

export default Main