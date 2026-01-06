import { createContext } from 'react'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface NotificationContextType {
  openNotification: (params: {
    title: string
    description: string
    type?: NotificationType
  }) => void
  contextHolder: React.ReactElement
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)
