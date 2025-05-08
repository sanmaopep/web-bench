import React from 'react'
import { useAtom } from 'jotai'
import Blog from './Blog'
import BlogList from './BlogList'
import Search from './Search'
import { blogAtom, filteredBlogsAtom, searchKeywordsAtom } from '../atoms/blog'

const Main = () => {
  const [blogs] = useAtom(blogAtom)
  const [filteredBlogs] = useAtom(filteredBlogsAtom)
  const [searchKeywords] = useAtom(searchKeywordsAtom)
  
  const displayedBlogs = searchKeywords ? filteredBlogs : blogs

  return (
    <main style={{ 
      padding: '20px', 
      flex: 1, 
      display: 'flex', 
      gap: '20px' 
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px', borderRight: '1px solid #ccc', paddingRight: '20px' }}>
        <Search />
        <BlogList blogs={displayedBlogs} />
      </div>
      <Blog />
    </main>
  )
}

export default Main