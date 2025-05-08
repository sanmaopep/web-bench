import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  username: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  username: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.username = null;
      state.isAuthenticated = false;
    }
  }
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;