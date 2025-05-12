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
import CommentStore from "../store/Comment";

export function useDelete() {
  const { blogs, setBlogs, selectedBlog, setSelectedBlog } = useBlog();

  const handleDelete = () => {
    const updatedBlogs = blogs.filter(blog => blog.title !== selectedBlog.title);
    CommentStore.deleteComments(selectedBlog.title);
    setBlogs(updatedBlogs);
    setSelectedBlog(updatedBlogs[0] || { title: '', detail: '' });
  };

  return handleDelete;
}