import React, { useState, useEffect } from 'react'
import useBlogStore from '../stores/blog'

const Search = () => {
  const [keywords, setKeywords] = useState('')
  const { fetchSearchBlogs } = useBlogStore()

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSearchBlogs(keywords)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [keywords, fetchSearchBlogs])

  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Search Blogs"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        style={{
          width: '200px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          boxSizing: 'border-box'
        }}
      />
    </div>
  )
}

export default Search