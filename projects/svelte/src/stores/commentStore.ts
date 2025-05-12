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

import { writable } from 'svelte/store';

interface CommentStore {
  [blogTitle: string]: string[];
}

function createCommentStore() {
  const { subscribe, update } = writable<CommentStore>({});

  return {
    subscribe,
    addComment: (blogTitle: string, comment: string) => {
      update(store => {
        const comments = store[blogTitle] || [];
        return {
          ...store,
          [blogTitle]: [...comments, comment]
        };
      });
    },
    updateBlogTitle: (oldTitle: string, newTitle: string) => {
      update(store => {
        const comments = store[oldTitle] || [];
        const newStore = { ...store };
        delete newStore[oldTitle];
        newStore[newTitle] = comments;
        return newStore;
      });
    },
    deleteBlogComments: (blogTitle: string) => {
      update(store => {
        const newStore = { ...store };
        delete newStore[blogTitle];
        return newStore;
      });
    }
  };
}

export const comments = createCommentStore();
export const fastComment = writable('');