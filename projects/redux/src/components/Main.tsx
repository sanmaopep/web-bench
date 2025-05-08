import React from 'react';
import { useSelector } from 'react-redux';
import './Main.css';
import Blog from './Blog';
import BlogList from './BlogList';
import Search from './Search';
import { RootState } from '../store';

const Main: React.FC = () => {
  const blogs = useSelector((state: RootState) => state.blog.blogs);
  const searchResults = useSelector((state: RootState) => state.search.results);
  const searchTerm = useSelector((state: RootState) => state.search.term);
  const selectedBlogIndex = useSelector((state: RootState) => state.blog.selectedBlogIndex);
  
  const displayBlogs = searchTerm ? searchResults : blogs;
  const selectedBlog = displayBlogs[selectedBlogIndex] || displayBlogs[0];

  return (
    <main className="main">
      <div>
        <Search />
        <BlogList blogs={displayBlogs} />
      </div>
      <div className="blog-content">
        {displayBlogs.length > 0 ? (
          <Blog 
            title={selectedBlog.title} 
            detail={selectedBlog.detail} 
            author={selectedBlog.author}
            id={selectedBlogIndex}
          />
        ) : (
          <div style={{ padding: '1rem' }}>No Blog</div>
        )}
      </div>
    </main>
  );
};

export default Main;