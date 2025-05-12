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

import { ref, computed } from 'vue'

interface Comment {
  blogTitle: string
  text: string
}

class CommentStore {
  private static instance: CommentStore
  private comments = ref<Comment[]>([])

  private constructor() {}

  static getInstance(): CommentStore {
    if (!CommentStore.instance) {
      CommentStore.instance = new CommentStore()
    }
    return CommentStore.instance
  }

  addComment(blogTitle: string, text: string) {
    this.comments.value.push({ blogTitle, text })
  }

  getComments(blogTitle: string) {
    return computed(() => this.comments.value.filter((comment) => comment.blogTitle === blogTitle))
      .value
  }

  deleteCommentsForBlog(blogTitle: string) {
    this.comments.value = this.comments.value.filter((comment) => comment.blogTitle !== blogTitle)
  }

  updateBlogTitle(oldTitle: string, newTitle: string) {
    this.comments.value.forEach((comment) => {
      if (comment.blogTitle === oldTitle) {
        comment.blogTitle = newTitle
      }
    })
  }
}

export const useCommentStore = () => CommentStore.getInstance()
