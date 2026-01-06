import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../store'

interface TokenState {
  customToken: string | null
}

const initialState: TokenState = {
  customToken: null,
}

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setCustomToken: (state, action: PayloadAction<string | null>) => {
      state.customToken = action.payload
    },
    clearCustomToken: (state) => {
      state.customToken = null
    },
  },
})

export const { setCustomToken, clearCustomToken } = tokenSlice.actions

export const selectCustomToken = (state: RootState) => state.token.customToken

export default tokenSlice.reducer
