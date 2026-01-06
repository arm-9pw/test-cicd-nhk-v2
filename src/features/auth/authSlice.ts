import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { UserInfoType } from 'api/authApi.types'

import { PermissionType } from './auth.types'
import { RootState } from 'app/store'

export type AuthStateType = {
  isAuthenticated: boolean
  isInitialized: boolean
  permissions?: PermissionType[]
  user: UserInfoType | null
  token?: string | null
}

const initialState: AuthStateType = {
  isAuthenticated: false,
  isInitialized: false,
  permissions: [],
  user: null,
}

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const loginSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setAuth: (state, action: PayloadAction<Omit<AuthStateType, 'isInitialized'>>) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.permissions = action.payload.permissions || state.permissions
      state.user = action.payload.user
      // state.token = action.payload.token
    },
    setUser: (state, action: PayloadAction<UserInfoType>) => {
      state.user = action.payload
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.permissions = []
      state.user = null
      // state.token = null
    },
  },
})

// Export the generated action creators for use in components
export const { setAuth, setInitialized, logout, setUser } = loginSlice.actions

// Export the slice reducer for use in the store configuration
export default loginSlice.reducer

export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectPermissions = (state: RootState) => state.auth.permissions
export const selectUser = (state: RootState) => state.auth.user
// export const selectToken = (state: RootState) => state.auth.token
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized
