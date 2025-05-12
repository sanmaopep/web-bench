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

import { Ref, ref, reactive, provide, inject, InjectionKey } from 'vue'

interface Blog {
  title: string
  detail: string
}

interface BlogContext {
  showForm: Ref<boolean>
  isEditing: Ref<boolean>
  blogs: Blog[]
  selectedBlog: Ref<Blog>
  addBlog: (blog: Blog) => void
  updateBlog: (blog: Blog) => void
  selectBlog: (blog: Blog) => void
  checkDuplicateTitle: (title: string) => boolean
}

const BlogKey: InjectionKey<BlogContext> = Symbol('BlogContext')

export function useBlogProvider() {
  const showForm = ref(false)
  const isEditing = ref(false)

  const blogs = reactive<Blog[]>([
    { title: 'Morning', detail: 'Morning My Friends' },
    { title: 'Travel', detail: 'I love traveling!' },
  ])

  const selectedBlog = ref<Blog>(blogs[0])

  const addBlog = (blog: Blog) => {
    blogs.push(blog)
    selectedBlog.value = blog
  }

  const updateBlog = (updatedBlog: Blog) => {
    const index = blogs.findIndex((blog) => blog.title === selectedBlog.value.title)
    if (index !== -1) {
      blogs[index] = updatedBlog
      selectedBlog.value = updatedBlog
    }
  }

  const selectBlog = (blog: Blog) => {
    selectedBlog.value = blog
  }

  const checkDuplicateTitle = (title: string) => {
    if (isEditing.value) {
      return blogs.some((blog) => blog.title === title && blog.title !== selectedBlog.value.title)
    }

    return blogs.some((blog) => blog.title === title)
  }

  const blogContext: BlogContext = {
    blogs,
    selectedBlog,
    selectBlog,
    addBlog,
    updateBlog,
    checkDuplicateTitle,
    showForm,
    isEditing,
  }

  provide(BlogKey, blogContext)

  return blogContext
}

export function useBlogContext() {
  const context = inject(BlogKey)
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider')
  }
  return context
}
