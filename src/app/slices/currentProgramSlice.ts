import { createSlice } from '@reduxjs/toolkit'

import { TElementAccess } from 'features/auth/auth.types'

type TCurrentProgramState = {
  code: string
  elementAccessList: TElementAccess[]
}

const initialState: TCurrentProgramState = {
  code: '',
  elementAccessList: [],
}

export const currentProgramSlice = createSlice({
  name: 'currentProgram',
  initialState,
  reducers: {
    setCurrentProgram: (state, action) => {
      state.code = action.payload.code
      state.elementAccessList = action.payload.elementAccessList
    },
    resetCurrentProgram: (state) => {
      state.code = ''
      state.elementAccessList = []
    },
  },
})

export const { setCurrentProgram, resetCurrentProgram } =
  currentProgramSlice.actions

export default currentProgramSlice.reducer

export const selectCurrentProgramCode = (state: {
  currentProgram: TCurrentProgramState
}) => state.currentProgram.code
export const selectCurrentProgramElementAccessList = (state: {
  currentProgram: TCurrentProgramState
}) => state.currentProgram.elementAccessList
