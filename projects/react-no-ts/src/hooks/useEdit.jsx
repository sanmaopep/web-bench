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

import { useBlog } from "../context/BlogContext";
import { useState } from "react";
import CommentStore from "../store/Comment";

export function useEdit() {
  const { blogs, setBlogs, selectedBlog, setSelectedBlog } = useBlog();
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  const handleEdit = (updatedBlog) => {
    const isDuplicate = blogs.some(blog => 
      blog.title === updatedBlog.title && blog.title !== selectedBlog.title
    );

    if (isDuplicate) {
      return false;
    }

    const updatedBlogs = blogs.map(blog =>
      blog.title === selectedBlog.title ? updatedBlog : blog
    );
    
    CommentStore.updateBlogTitle(selectedBlog.title, updatedBlog.title);
    setBlogs(updatedBlogs);
    setSelectedBlog(updatedBlog);
    return true;
  };

  return {
    isEditFormVisible,
    setIsEditFormVisible,
    handleEdit
  };
}