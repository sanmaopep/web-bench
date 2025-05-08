import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Blog } from './blog';

interface SearchState {
  term: string;
  results: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  term: '',
  results: [],
  loading: false,
  error: null
};

export const searchBlogs = createAsyncThunk(
  'search/searchBlogs',
  async (keywords: string, { signal }) => {
    const controller = new AbortController();
    signal.addEventListener('abort', () => {
      controller.abort();
    });

    const response = await fetch(`/api/search_blogs?keywords=${encodeURIComponent(keywords)}`, {
      signal: controller.signal
    });
    
    const data = await response.json();
    return { results: data.blogs, term: keywords };
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.term = '';
      state.results = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBlogs.fulfilled, (state, action: PayloadAction<{results: Blog[], term: string}>) => {
        state.loading = false;
        state.results = action.payload.results;
        state.term = action.payload.term;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        if (action.error.name !== 'AbortError') {
          state.loading = false;
          state.error = action.error.message || 'Failed to search blogs';
        }
      });
  }
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;