import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { useMatches } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import { ConfigProvider } from 'antd'

import { persistor, store } from '../../app/store'
import { ModalProvider } from '../../contexts/ModalContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import AuthProvider from '../../providers/AuthProvider'
import KeycloakProvider from '../../providers/KeycloakProvider'
import { theme } from '../../styles/theme'

type ConditionalProvidersProps = {
  children: ReactNode
}

// Type for route handle with standalone flag
type RouteHandleWithStandalone = {
  standalone?: boolean
}

export const ConditionalProviders = ({ children }: ConditionalProvidersProps) => {
  const matches = useMatches()

  // Check if any matched route has standalone: true in its handle
  const isStandalone = matches.some((match) => {
    const handle = match.handle as RouteHandleWithStandalone | undefined
    return handle?.standalone === true
  })

  // Base providers (always included)
  const baseProviders = (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider theme={theme}>
          <NotificationProvider>
            <ModalProvider>{children}</ModalProvider>
          </NotificationProvider>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  )

  // If standalone route, skip KeycloakProvider and AuthProvider
  if (isStandalone) {
    return baseProviders
  }

  // Otherwise, wrap with all providers including Keycloak and Auth
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <KeycloakProvider>
          <ConfigProvider theme={theme}>
            <NotificationProvider>
              <ModalProvider>
                <AuthProvider>{children}</AuthProvider>
              </ModalProvider>
            </NotificationProvider>
          </ConfigProvider>
        </KeycloakProvider>
      </PersistGate>
    </Provider>
  )
}
