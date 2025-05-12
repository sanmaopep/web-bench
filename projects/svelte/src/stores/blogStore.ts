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

import { writable, derived } from 'svelte/store';

export interface Blog {
  title: string;
  detail: string; 
}

const initialBlogs: Blog[] = [
  {
    title: 'Morning', 
    detail: 'Morning My Friends'
  },
  {
    title: 'Travel',
    detail: 'I love traveling!'
  }
];

const searchKeyword = writable('');

function createBlogStore() {
  const { subscribe, set, update } = writable<Blog[]>(initialBlogs);

  return {
    subscribe,
    addBlog: (blog: Blog) => {
      update(blogs => [...blogs, blog])
    },
    addBulkBlogs: (newBlogs: Blog[]) => {
      update(blogs => [...blogs, ...newBlogs])
    },
    deleteBlog: (title: string) => {
      update(blogs => blogs.filter(blog => blog.title !== title))
    },
    updateBlog: (oldTitle: string, newBlog: Blog) => {
      update(blogs => blogs.map(blog => 
        blog.title === oldTitle ? newBlog : blog
      ))
    },
    reset: () => set(initialBlogs)
  };
}

export const blogs = createBlogStore();

export const selectedBlog = writable<Blog>(initialBlogs[0]);

export const filteredBlogs = derived(
  [blogs, searchKeyword],
  ([$blogs, $searchKeyword]) => {
    if (!$searchKeyword) return $blogs;
    return $blogs.filter(blog => 
      blog.title.toLowerCase().includes($searchKeyword.toLowerCase()) ||
      blog.detail.toLowerCase().includes($searchKeyword.toLowerCase())
    );
  }
);

export const blogCount = derived(
  blogs, 
  $blogs => $blogs.length
);

export { searchKeyword };