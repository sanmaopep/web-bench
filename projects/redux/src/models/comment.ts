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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  blogId: number;
  author: string;
  text: string;
}

export interface CommentState {
  comments: Comment[];
}

const initialState: CommentState = {
  comments: [],
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    undoLastComment: (state, action: PayloadAction<{ blogId: number; author: string; }>) => {
      const lastIndex = state.comments.findLastIndex(
        comment => comment.blogId === action.payload.blogId && comment.author === action.payload.author
      );

      if(lastIndex !== -1) {
        state.comments.splice(lastIndex, 1);
      }
    }
  },
});

export const { addComment, undoLastComment } = commentSlice.actions;
export default commentSlice.reducer;