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