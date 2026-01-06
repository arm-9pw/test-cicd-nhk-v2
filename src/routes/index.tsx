import { ReactElement } from 'react'

import ErrorPage from 'components/ErrorPage'
import EmailApproveFailedPage from 'features/EmailApprove/EmailApproveFailedPage'
import EmailApproveSuccessPage from 'features/EmailApprove/EmailApproveSuccessPage'
import IndexPage from 'features/IndexPage'
import Login from 'features/auth/LoginPage'

import Root from './layouts/DashboardLayout'
import PrivateRoute from './layouts/PrivateRoute'
import ProtectedRoute from './layouts/ProtectedRoute'
import { menuRoutes } from './menuRoutes'
import { subRoutes } from './subRoutes'

type TRoute = {
  path: string
  permission: string
  element: ReactElement
}

type TRoutes = {
  [key: string]: TRoute
}

const routeFormatter = (routes: TRoutes) => {
  return Object.values(routes).map((item) => ({
    path: item.path,
    element: <ProtectedRoute element={item.element} requiredPermission={item.permission} />,
  }))
}

// Export routes array for use in main.tsx
export const routes = [
  // Standalone routes - skip KeycloakProvider and AuthProvider only
  {
    path: '/approval-action',
    element: <EmailApproveSuccessPage />,
    handle: { standalone: true },
  },
  {
    path: '/email-approval-failed',
    element: <EmailApproveFailedPage />,
    handle: { standalone: true },
  },

  // Regular routes - these go through all providers
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <PrivateRoute element={<Root />} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      ...routeFormatter(menuRoutes),
      ...routeFormatter(subRoutes),
    ],
  },
]
