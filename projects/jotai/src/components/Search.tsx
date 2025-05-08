import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { searchKeywordsAtom, fetchFilteredBlogsAtom } from '../atoms/blog'

const Search: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [, setSearchKeywords] = useAtom(searchKeywordsAtom)
  const [, fetchFilteredBlogs] = useAtom(fetchFilteredBlogsAtom)

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchKeywords(inputValue)
      fetchFilteredBlogs(inputValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [inputValue])

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search Blogs"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: '200px',
          boxSizing: 'border-box',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          outline: 'none'
        }}
      />
    </div>
  )
}

export default Search