import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ErrorState {
  message: string
  isOpen: boolean
}

const initialState: ErrorState = {
  message: '',
  isOpen: false,
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload
      state.isOpen = true
    },
    clearError: (state) => {
      state.message = ''
      state.isOpen = false
    },
  },
})

export const { setError, clearError } = errorSlice.actions
export default errorSlice.reducer

export const selectError = (state: { error: ErrorState }) => state.error
