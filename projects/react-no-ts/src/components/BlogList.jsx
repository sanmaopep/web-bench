import React, { useState, useRef, useEffect } from 'react';
import TruncatedTitle from './TruncatedTitle';

function BlogList({ blogs, selectedBlog, onSelectBlog }) {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const containerRef = useRef(null);
  const itemHeight = 40; // Height of each blog item
  const visibleItemsCount = Math.ceil(window.innerHeight / itemHeight); // Number of items visible in the viewport

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const newStartIndex = Math.floor(scrollTop / itemHeight);
        const newEndIndex = newStartIndex + visibleItemsCount + 1; // +1 for buffer

        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
      setEndIndex(visibleItemsCount + 1); // Initialize end index
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [visibleItemsCount]);

  const visibleBlogs = blogs.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      style={{
        width: '300px',
        borderRight: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 200px)',
        position: 'relative',
      }}
    >
      <div style={{ height: `${blogs.length * itemHeight}px` }}>
        {visibleBlogs.map((blog, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={blog.title}
              className="list-item"
              onClick={() => onSelectBlog(blog)}
              style={{
                height: `${itemHeight}px`,
                boxSizing: 'border-box',
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: selectedBlog?.title === blog.title ? '#4A90E2' : 'transparent',
                color: selectedBlog?.title === blog.title ? 'white' : '#333',
                transition: 'all 0.3s ease',
                fontWeight: selectedBlog?.title === blog.title ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: `${actualIndex * itemHeight}px`,
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (selectedBlog?.title !== blog.title) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedBlog?.title !== blog.title) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <TruncatedTitle title={blog.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(BlogList);