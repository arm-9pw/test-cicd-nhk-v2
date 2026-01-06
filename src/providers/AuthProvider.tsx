import { ReactNode, useEffect, useRef, useState } from 'react'

import { useGetUserInfoQuery } from 'api/authApi'
import { useLazyGetCertificateStatusQuery } from 'api/certificateApi'
import { useAppDispatch, useAppSelector } from 'app/hook'
import { setCertificateStatus } from 'app/slices/certificateSlice'
import { useNotification } from 'hooks/useNotification'

import LoadingPage from 'components/LoadingPage'
import {
  logout,
  selectIsAuthenticated,
  selectIsInitialized,
  setAuth,
} from 'features/auth/authSlice'

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isInitialized = useAppSelector(selectIsInitialized)
  const { openNotification } = useNotification()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const errorHandledRef = useRef(false)
  const certificateFetchedRef = useRef(false)

  // Check if we're already on the login page to prevent redirect loops
  const isLoginPage = window.location.pathname === '/login'

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useGetUserInfoQuery(undefined, {
    skip: !isAuthenticated || !isInitialized,
  })

  const [fetchCertificateStatus] = useLazyGetCertificateStatusQuery()

  useEffect(() => {
    if (userInfo && isAuthenticated) {
      dispatch(
        setAuth({
          isAuthenticated: true,
          permissions: userInfo.currentProgramList,
          user: userInfo,
        }),
      )

      // Fetch certificate status after user info is loaded
      if (!certificateFetchedRef.current) {
        certificateFetchedRef.current = true
        fetchCertificateStatus()
          .unwrap()
          .then((certStatus) => {
            dispatch(setCertificateStatus(certStatus))
          })
          .catch((error) => {
            console.error('Failed to fetch certificate status:', error)
          })
      }
    }
  }, [dispatch, isAuthenticated, userInfo, fetchCertificateStatus])

  useEffect(() => {
    // Only redirect if we're not already on the login page
    if (shouldRedirect && !isAuthenticated && !isLoginPage) {
      // Capture current location before redirecting
      const currentPath = window.location.pathname + window.location.search + window.location.hash
      const returnUrl = encodeURIComponent(currentPath)
      window.location.href = `/login?returnUrl=${returnUrl}`
    }
  }, [shouldRedirect, isAuthenticated, isLoginPage])

  // Handle error in useEffect instead of during render
  useEffect(() => {
    // Only handle the error if:
    // 1. There is an error
    // 2. It hasn't been handled yet
    // 3. User is authenticated
    // 4. We're not on the login page
    if (isError && !errorHandledRef.current && isAuthenticated && !isLoginPage) {
      errorHandledRef.current = true
      openNotification({
        title: 'Cannot get user information',
        description: 'please log in again',
        type: 'error',
      })
      dispatch(logout())
      setShouldRedirect(true)
    } else if (!isError) {
      // Reset the flag when there's no error
      errorHandledRef.current = false
    }
  }, [isError, openNotification, dispatch, isAuthenticated, isLoginPage])

  if (isAuthenticated && isInitialized && isLoading && !isLoginPage) {
    return <LoadingPage message="Loading user information..." />
  }

  // Don't return null for isError case here anymore
  // Let the useEffect handle the error and redirecting
  return <>{children}</>
}

export default AuthProvider
