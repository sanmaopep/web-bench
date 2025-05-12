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

import { create } from 'zustand'

interface Comment {
  blogId: number
  author: string
  text: string
  createdAt: string
}

interface CommentStore {
  comments: Comment[]
  addComment: (blogId: number, comment: Omit<Comment, 'blogId'>) => void
  undoLastComment: (blogId: number, username: string) => void
}

const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  addComment: (blogId, comment) => set((state) => ({
    comments: [...state.comments, { blogId, ...comment }]
  })),
  undoLastComment: (blogId:number, username: string) => set((state) => {
    // Find the last comment for this blog
    const reversedComments = [...state.comments].reverse()
    const lastCommentIndex = reversedComments.findIndex(comment => comment.blogId === blogId && comment.author === username)
    
    if (lastCommentIndex === -1) return state
    
    // Remove the last comment
    const actualIndex = state.comments.length - 1 - lastCommentIndex
    return {
      comments: state.comments.filter((_, index) => index !== actualIndex)
    }
  })
}))

export default useCommentStore