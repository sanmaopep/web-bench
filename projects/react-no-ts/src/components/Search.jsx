import React from 'react'

function Search({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search Blogs"
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: '200px',
        boxSizing: 'border-box',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
        fontSize: '14px'
      }}
    />
  )
}

export default React.memo(Search)