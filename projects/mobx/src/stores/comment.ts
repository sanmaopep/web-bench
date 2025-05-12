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

import { makeAutoObservable, action, runInAction } from 'mobx'
import userStore from './user';
import blogStore from './blog';

export interface Comment {
  id: string;
  blogId: number;
  text: string;
  author: string;
  timestamp: number;
}

class CommentStore {
  comments: Record<number, Comment[]> = {};
  commentHistory: Comment[] = [];

  constructor() {
    makeAutoObservable(this);
    this.registerUndoHandler();
  }

  registerUndoHandler() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        this.undoLastComment();
        e.preventDefault();
      }
    });
  }

  addComment = action((blogId: number, text: string, author: string) => {
    if (!this.comments[blogId]) {
      this.comments[blogId] = [];
    }
    
    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      blogId,
      text,
      author,
      timestamp: Date.now()
    };
    
    this.comments[blogId].push(newComment);
    this.commentHistory.push(newComment);
  });

  undoLastComment = action(() => {
    if (this.commentHistory.length === 0) return;

    const lastCommentIndex = this.commentHistory.findLastIndex(_comment => _comment.author === userStore?.username && _comment.blogId === blogStore.selectedBlogIndex);

    if (lastCommentIndex === -1) return;

    const lastComment = this.commentHistory[lastCommentIndex];
    
    const blogComments = this.comments[lastComment.blogId];
    if (!blogComments) return;
    const blogCommentsIndex = blogComments.findIndex(comment => comment.id === lastComment.id);

    if (blogCommentsIndex === -1) {
      return;
    }

    this.commentHistory.splice(lastCommentIndex, 1);
    blogComments.splice(blogCommentsIndex, 1);

  });

  getCommentsForBlog(blogId: number): Comment[] {
    return this.comments[blogId] || [];
  }
}

const commentStore = new CommentStore();
export default commentStore;