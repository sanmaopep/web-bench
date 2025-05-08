import React from 'react'

interface SearchProps {
  onSearch: (keyword: string) => void
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search Blogs"
      onChange={(e) => onSearch(e.target.value)}
      style={{ width: '200px', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
    />
  )
}

export default Search
