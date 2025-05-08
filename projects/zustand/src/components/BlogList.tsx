import React, { useRef, useState, useEffect } from 'react'
import useBlogStore from '../stores/blog'

interface Blog {
  title: string
  detail: string
}

interface BlogListProps {
  blogs: Blog[]
}

const ITEM_HEIGHT = 48; // Height of each item in pixels (including margin)

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const { selectedBlogIndex, setSelectedBlogIndex } = useBlogStore()
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
      
      const handleResize = () => {
        if (containerRef.current) {
          setContainerHeight(containerRef.current.clientHeight);
        }
      };

      // Add resize listener
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate which items should be visible
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT));
  const endIndex = Math.min(
    blogs.length - 1, 
    Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT)
  );

  // Create an array of visible items
  const visibleBlogs = blogs.slice(startIndex, endIndex + 1);

  // Calculate total height of the scrollable area
  const totalHeight = blogs.length * ITEM_HEIGHT;

  // Calculate offset for the visible items
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '300px', 
        marginRight: '20px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '400px', // Set a fixed height for the container
        overflowY: 'auto', // Enable vertical scrolling
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: `${offsetY}px`, width: '100%' }}>
          {visibleBlogs.map((blog, relativeIndex) => {
            const actualIndex = startIndex + relativeIndex;
            return (
              <div
                key={actualIndex}
                onClick={() => setSelectedBlogIndex(actualIndex)}
                className="list-item"
                style={{
                  height: `${ITEM_HEIGHT - 8}px`, // Account for margins
                  padding: '0 16px',
                  borderBottom: '1px solid #e0e0e0',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: actualIndex === selectedBlogIndex ? '#e3f2fd' : 'white',
                  color: actualIndex === selectedBlogIndex ? '#1976d2' : 'inherit',
                  fontWeight: actualIndex === selectedBlogIndex ? '600' : '400',
                  borderRadius: '4px',
                  margin: '4px 0',
                  transition: 'all 0.2s ease'
                }}
              >
                {blog.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default BlogList