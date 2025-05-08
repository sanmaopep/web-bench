import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Move } from './game';

export interface Blog {
  title: string;
  detail: string;
  author?: string;
  gameData?: {
    moveHistory: Move[];
  };
}

export interface BlogState {
  blogs: Blog[];
  selectedBlogIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [
    { title: 'Morning', detail: 'Morning My Friends' },
    { title: 'Travel', detail: 'I love traveling!' }
  ],
  selectedBlogIndex: 0,
  loading: false,
  error: null
};

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async () => {
    const response = await fetch('/api/blogs');
    const data = await response.json();
    return data.blogs;
  }
);

// Function to generate a random 12-digit number as a string
const generateRandomDigits = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    selectBlog: (state, action: PayloadAction<number>) => {
      state.selectedBlogIndex = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.push(action.payload);
      state.selectedBlogIndex = state.blogs.length - 1;
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs[state.selectedBlogIndex] = {
        ...state.blogs[state.selectedBlogIndex],
        ...action.payload
      };
    },
    deleteBlog: (state) => {
      state.blogs.splice(state.selectedBlogIndex, 1);
      state.selectedBlogIndex = state.blogs.length > 0 ? 0 : 0;
    },
    appendManyBlogs: (state, action: PayloadAction<number>) => {
      const count = action.payload;
      const newBlogs: Blog[] = [];
      
      for (let i = 0; i < count; i++) {
        const randomDigits = generateRandomDigits();
        newBlogs.push({
          title: `RandomBlog-${randomDigits}`,
          detail: `This is auto-generated blog number ${i + 1}`
        });
      }
      
      state.blogs = [...state.blogs, ...newBlogs];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload || state.blogs;
        state.selectedBlogIndex = 0;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blogs';
      });
  }
});

export const { selectBlog, addBlog, updateBlog, deleteBlog, appendManyBlogs } = blogSlice.actions;
export default blogSlice.reducer;