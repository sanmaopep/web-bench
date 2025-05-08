import React, { useState, useMemo, useCallback } from 'react'
import Blog from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import { useBlog } from '../context/BlogContext'

function Main() {
  const { blogs, selectedBlog, setSelectedBlog } = useBlog();
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [blogs, searchKeyword]);

  const handleSearch = useCallback((keyword) => {
    setSearchKeyword(keyword);
  }, []);

  const handleSelectBlog = useCallback((blog) => {
    setSelectedBlog(blog);
  }, [setSelectedBlog]);

  return (
    <main style={{
      padding: '20px',
      flex: 1,
      display: 'flex',
      gap: '20px',
      backgroundColor: '#fff'
    }}>
      <div>
        <Search onSearch={handleSearch} />
        <BlogList 
          blogs={filteredBlogs} 
          selectedBlog={selectedBlog}
          onSelectBlog={handleSelectBlog}
        />
      </div>
      <div style={{flex: 1}}>
        <Blog title={selectedBlog.title} detail={selectedBlog.detail} />
      </div>
    </main>
  )
}

export default React.memo(Main)