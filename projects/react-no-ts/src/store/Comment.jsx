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

class CommentStore {
  constructor() {
    this.comments = new Map();
    this.listeners = new Set();
  }

  addComment(blogTitle, comment) {
    if (!this.comments.has(blogTitle)) {
      this.comments.set(blogTitle, []);
    }
    this.comments.get(blogTitle).push(comment);
    this.notify();
  }

  getComments(blogTitle) {
    return this.comments.get(blogTitle) || [];
  }

  updateBlogTitle(oldTitle, newTitle) {
    if (this.comments.has(oldTitle)) {
      const comments = this.comments.get(oldTitle);
      this.comments.set(newTitle, comments);
      this.comments.delete(oldTitle);
      this.notify();
    }
  }

  deleteComments(blogTitle) {
    this.comments.delete(blogTitle);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }
}

export default new CommentStore();