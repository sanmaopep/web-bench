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

import { atom } from 'jotai'
import {userAtom} from './user'

export interface Blog {
  title: string
  detail: string
  author?: string
  gameHistory?: string
}

export const blogListAtom = atom<Blog[]>([])
export const blogAtom = atom((get) => get(blogListAtom))
export const selectedBlogAtom = atom<number>(0)
export const formVisibleAtom = atom<boolean>(false)
export const loadingAtom = atom<boolean>(false)
export const editBlogAtom = atom<number | null>(null)
export const searchKeywordsAtom = atom('')
export const filteredBlogsAtom = atom<Blog[]>([])
export const selectedBlogInfoAtom = atom((get) => {
  const selectedBlog = get(selectedBlogAtom)
  const blogList = get(searchKeywordsAtom) ? get(filteredBlogsAtom) : get(blogListAtom)
  return blogList[selectedBlog]
})
export const blogsAsyncAtom = atom(null, async (get, set) => {
  set(loadingAtom, true)
  const response = await fetch('/api/blogs')
  const data = await response.json()
  set(blogListAtom, data.blogs)
  set(loadingAtom, false)
})
export const fetchFilteredBlogsAtom = atom(null, async (get, set, keywords: string) => {
  if (keywords) {
    const response = await fetch(`/api/search_blogs?keywords=${encodeURIComponent(keywords)}`)
    const data = await response.json()
    set(filteredBlogsAtom, data.blogs)
    set(selectedBlogAtom, 0)
  } else {
    set(filteredBlogsAtom, [])
  }
})

export const appendManyBlogsAtom = atom(null, (get, set) => {
  const currentBlogs = get(blogListAtom)
  const newBlogs: Blog[] = Array(100000).fill(null).map(() => ({
    title: `RandomBlog-${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
    detail: 'Auto-generated blog post'
  }))
  
  set(blogListAtom, [...currentBlogs, ...newBlogs])
})

export const shareGameToBlogAtom = atom(null, (get, set, payload: { title: string, description: string, gameHistory: string }) => {
  const { title, description, gameHistory } = payload;
  const currentBlogs = get(blogListAtom);
  const user = get(userAtom);
  
  const newBlog: Blog = {
    title,
    detail: description,
    author: user.isLoggedIn ? user.username : 'Anonymous',
    gameHistory
  };
  
  set(blogListAtom, [newBlog, ...currentBlogs]);
})