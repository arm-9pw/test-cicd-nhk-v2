import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from 'app/hook'

import { logout as appLogout } from 'features/auth/authSlice'

import keycloak from '../config/keycloak'
import {
  selectAuth,
  selectIsAuthenticated,
  selectIsInitialized,
  selectUser,
} from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isInitialized = useAppSelector(selectIsInitialized)
  const user = useAppSelector(selectUser)

  const login = useCallback((redirectUri?: string) => {
    return keycloak.login({
      redirectUri: redirectUri || window.location.origin,
    })
  }, [])

  const logout = useCallback(() => {
    dispatch(appLogout())
    return keycloak.logout({
      redirectUri: window.location.origin,
    })
  }, [dispatch])

  return {
    ...auth,
    isAuthenticated,
    isInitialized,
    user,
    login,
    logout,
  }
}

export default useAuth
