import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RouteState {
  currentRoute: string;
}

const initialState: RouteState = {
  currentRoute: window.location.pathname
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    }
  }
});

export const { setRoute } = routeSlice.actions;
export default routeSlice.reducer;