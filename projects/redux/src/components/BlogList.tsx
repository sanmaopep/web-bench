import React, { useCallback, memo } from 'react';
import './BlogList.css';
import { Blog as BlogType } from '../models/blog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectBlog } from '../models/blog';

interface BlogListProps {
  blogs: BlogType[];
}

const BlogItem = memo(({ blog, index, isSelected, onSelect }: { 
  blog: BlogType; 
  index: number; 
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div 
      className={`list-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {blog.title}
    </div>
  );
});

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const dispatch = useDispatch();
  const selectedBlogIndex = useSelector((state: RootState) => state.blog.selectedBlogIndex);

  const handleSelectBlog = useCallback((index: number) => {
    dispatch(selectBlog(index));
  }, [dispatch]);

  // Limit visible blogs to prevent rendering too many items
  const visibleBlogs = blogs.slice(0, 100);

  return (
    <div className="blog-list">
      {visibleBlogs.map((blog, index) => (
        <BlogItem 
          key={`${blog.title}-${index}`}
          blog={blog}
          index={index}
          isSelected={selectedBlogIndex === index}
          onSelect={() => handleSelectBlog(index)}
        />
      ))}
      {blogs.length > 100 && (
        <div className="list-more-info">
          Showing 100 of {blogs.length} blogs
        </div>
      )}
    </div>
  );
};

export default BlogList;