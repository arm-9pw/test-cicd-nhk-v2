import { ReactNode, useEffect, useRef } from 'react'

import { useAppDispatch } from 'app/hook'

import keycloak from '../config/keycloak'
import { setAuth, setInitialized } from '../features/auth/authSlice'

interface KeycloakProviderProps {
  children: ReactNode
}

// const navigateToLogin = () => {
//   // This will navigate without a full page refresh
//   window.history.replaceState({}, '', '/login')
//   // Dispatch a custom event that your router can listen to
//   window.dispatchEvent(new Event('popstate'))
// }

const KeycloakProvider = ({ children }: KeycloakProviderProps) => {
  const dispatch = useAppDispatch()
  const isInitializedRef = useRef(false)

  useEffect(() => {
    const initKeycloak = async () => {
      if (isInitializedRef.current) return
      dispatch(setInitialized(false))
      isInitializedRef.current = true

      console.log('Initializing Keycloak...')
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        })
        console.log('Done initializing Keycloak')

        if (authenticated) {
          // if (window.self !== window.top) {
          //   // This code is running inside an iframe
          //   console.log('Running inside an iframe');
          // } else {
          //   // This code is running in the top-most window
          //   console.log('Running in the top window');
          // }
          dispatch(
            setAuth({
              isAuthenticated: true,
              user: null,
              permissions: [], // NOTE: User Permissions will be set in AuthProvider (which comes from user-info API)
            }),
          )
        } else {
          // if (window.self !== window.top) {
          //   // This code is running inside an iframe
          //   console.log('Running inside an iframe');
          // } else {
          //   // This code is running in the top-most window
          //   console.log('Running in the top window');
          // }
          dispatch(
            setAuth({
              isAuthenticated: false,
              user: null,
              permissions: [],
            }),
          )
        }
      } catch (error) {
        console.error('Error initializing Keycloak', error)
        dispatch(
          setAuth({
            isAuthenticated: false,
            user: null,
            permissions: [],
          }),
        )
      } finally {
        dispatch(setInitialized(true))
      }

      // try {
      //   console.log('Initializing Keycloak...')
      //   const authenticated = await keycloak.init({
      //     onLoad: 'check-sso',
      //     silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      //     pkceMethod: 'S256',
      //   })
      //   console.log('Done initializing Keycloak')

      //   if (authenticated) {
      //     dispatch(
      //       setAuth({
      //         isAuthenticated: true,
      //         user: keycloak.tokenParsed || null,
      //         permissions: [], // FIXME: Get user permissions
      //       }),
      //     )
      //   } else {
      //     dispatch(
      //       setAuth({
      //         isAuthenticated: false,
      //         user: null,
      //         permissions: [],
      //       }),
      //     )
      //     window.location.href = '/login'
      //   }
      // } catch (error) {
      //   console.error('Keycloak init error:', error)
      //   dispatch(
      //     setAuth({
      //       isAuthenticated: false,
      //       user: null,
      //       permissions: [],
      //     }),
      //   )
      //   // Redirect to frontend login page
      //   window.location.href = '/login'
      // } finally {
      //   dispatch(setInitialized(true))
      // }
    }

    initKeycloak()
  }, [dispatch])

  // Handle Keycloak events
  // useEffect(() => {
  //   keycloak.onTokenExpired = () => {
  //     keycloak
  //       .updateToken(70)
  //       .then((refreshed) => {
  //         if (refreshed) {
  //           dispatch(
  //             setAuth({
  //               isAuthenticated: true,
  //               user: keycloak.tokenParsed || null,
  //               permissions: [],
  //             }),
  //           )
  //         }
  //       })
  //       .catch(() => {
  //         dispatch(logout())
  //       })
  //   }

  //   keycloak.onAuthSuccess = () => {
  //     dispatch(
  //       setAuth({
  //         isAuthenticated: true,
  //         user: keycloak.tokenParsed || null,
  //         permissions: [],
  //       }),
  //     )
  //   }

  //   keycloak.onAuthLogout = () => {
  //     dispatch(logout())
  //   }

  //   return () => {
  //     keycloak.onTokenExpired = undefined
  //     keycloak.onAuthSuccess = undefined
  //     keycloak.onAuthLogout = undefined
  //   }
  // }, [dispatch])

  return <>{children}</>
}

export default KeycloakProvider
