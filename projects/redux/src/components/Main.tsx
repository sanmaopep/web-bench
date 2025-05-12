// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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