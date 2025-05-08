import React from 'react'
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'

interface Blog {
  title: string
  detail: string
}

interface BlogListProps {
  blogs: Blog[]
}

const BlogList: React.FC<BlogListProps> = observer(({ blogs }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 50 });
  const itemHeight = 40;

  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const viewportHeight = containerRef.current.clientHeight;
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 10, blogs.length);
    
    setVisibleRange({ start: Math.max(0, startIndex - 10), end: endIndex });
  }, [blogs.length]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  React.useEffect(() => {
    handleScroll();
  }, [blogs.length, handleScroll]);

  const totalHeight = blogs.length * itemHeight;
  const visibleBlogs = blogs.slice(visibleRange.start, visibleRange.end);
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '300px', 
        borderRight: '1px solid #ccc',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${offsetY}px)` }}>
          {visibleBlogs.map((blog, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <div 
                key={actualIndex} 
                className="list-item" 
                style={{ 
                  height: `${itemHeight}px`, 
                  boxSizing: 'border-box', 
                  padding: '10px', 
                  borderBottom: '1px solid #eee', 
                  cursor: 'pointer',
                  backgroundColor: blogStore.selectedBlogIndex === actualIndex ? '#f0f0f0' : 'white',
                  fontWeight: blogStore.selectedBlogIndex === actualIndex ? 'bold' : 'normal',
                  transition: 'background-color 0.2s ease',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => blogStore.selectBlog(actualIndex)}
              >
                {blog.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
})

export default BlogList