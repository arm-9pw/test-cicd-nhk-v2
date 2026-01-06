import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import './styles/main.css'

import { ConditionalProviders } from './components/ConditionalProviders'
import { routes } from './routes'
import './utils/dayjsConfig'

// Create router with ConditionalProviders as root wrapper
const router = createBrowserRouter([
  {
    element: (
      <ConditionalProviders>
        <Outlet />
      </ConditionalProviders>
    ),
    children: routes,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
