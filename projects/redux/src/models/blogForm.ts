import { createSlice } from '@reduxjs/toolkit';

interface BlogFormState {
  formVisible: boolean;
  isEditing: boolean;
}

const initialState: BlogFormState = {
  formVisible: false,
  isEditing: false
};

const blogFormSlice = createSlice({
  name: 'blogForm',
  initialState,
  reducers: {
    toggleFormVisibility: (state) => {
      state.formVisible = !state.formVisible;
      if (!state.formVisible) {
        state.isEditing = false;
      }
    },
    openEditForm: (state) => {
      state.formVisible = true;
      state.isEditing = true;
    }
  }
});

export const { toggleFormVisibility, openEditForm } = blogFormSlice.actions;
export default blogFormSlice.reducer;