import { Navigate, useLocation } from 'react-router-dom'

import { useAppSelector } from 'app/hook'

import LoadingPage from 'components/LoadingPage'
import { selectIsAuthenticated, selectIsInitialized } from 'features/auth/authSlice'

// import { adminUser } from 'mocks/user'

type TPrivateRouteProps = {
  element: React.ReactNode
}

const PrivateRoute = ({ element }: TPrivateRouteProps) => {
  // const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isInitialized = useAppSelector(selectIsInitialized)
  const location = useLocation()

  // useEffect(() => {
  //   // FIXME: Do check user auth every time if the user is still logged in
  //   if (isAuthenticated) {
  //     dispatch(setAuth(adminUser))
  //   }
  // }, [dispatch, isAuthenticated])

  if (!isInitialized) return <LoadingPage />

  if (!isAuthenticated) {
    // Capture the current location (pathname + search + hash) to redirect back after login
    const returnUrl = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />
  }

  return element
}

export default PrivateRoute
