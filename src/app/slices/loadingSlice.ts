import { PersistPartial } from 'redux-persist/es/persistReducer'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type TLoadingState = {
  isLoading: boolean
  message?: string
}

const initialState: TLoadingState = {
  isLoading: false,
  message: undefined,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true
      state.message = action.payload
    },
    hideLoading: (state) => {
      state.isLoading = false
      state.message = undefined
    },
  },
})

export const { showLoading, hideLoading } = loadingSlice.actions

export const selectLoading = (state: { loading: TLoadingState } & PersistPartial) => state.loading

export default loadingSlice.reducer
