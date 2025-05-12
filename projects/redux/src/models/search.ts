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