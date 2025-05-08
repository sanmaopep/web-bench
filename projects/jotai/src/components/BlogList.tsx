import React, { useMemo } from 'react'
import Blog from './Blog'
import { useAtom } from 'jotai'
import { blogAtom, selectedBlogAtom } from '../atoms/blog'

interface Blog {
  title: string
  detail: string
}

interface BlogListProps {
  blogs: Blog[]
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const [selectedIndex, setSelectedIndex] = useAtom(selectedBlogAtom)

  // Only render the visible items to prevent performance issues with large lists
  const visibleBlogs = useMemo(() => {
    // Show only the first 100 items by default
    return blogs.slice(0, 100);
  }, [blogs]);

  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc', paddingRight: '20px' }}>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Showing {visibleBlogs.length} of {blogs.length} blogs
      </div>
      {visibleBlogs.map((blog, index) => (
        <div 
          key={index} 
          className="list-item"
          onClick={() => setSelectedIndex(index)}
          style={{
            backgroundColor: selectedIndex === index ? '#e3f2fd' : 'white',
            color: selectedIndex === index ? '#1976d2' : 'inherit',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            margin: '4px 0',
            fontWeight: selectedIndex === index ? '600' : '400'
          }}
        >
          {blog.title}
        </div>
      ))}
    </div>
  )
}

export default BlogList