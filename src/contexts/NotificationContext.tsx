import React, { useCallback } from 'react'
import { notification } from 'antd'
import { NotificationContext, NotificationType } from './NotificationContextDefinition'

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notiApi, contextHolder] = notification.useNotification()

  const openNotification = useCallback(
    ({
      title,
      description,
      type = 'error',
    }: {
      title: string
      description: string
      type?: NotificationType
    }) => {
      notiApi[type]({
        showProgress: true,
        pauseOnHover: true,
        message: title,
        description,
        placement: 'topRight',
      })
    },
    [notiApi],
  )

  return (
    <NotificationContext.Provider value={{ openNotification, contextHolder }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}
