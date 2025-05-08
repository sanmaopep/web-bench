import { configureStore } from '@reduxjs/toolkit'

export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: {},
})
