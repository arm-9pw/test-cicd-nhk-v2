import React, { useCallback } from 'react'

import { Modal } from 'antd'

import { ModalContext, ModalOptions, ModalType } from './ModalContextDefinition'

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Function to open any type of modal
  const openModal = useCallback((type: ModalType, options: ModalOptions) => {
    const { title, content, okText, cancelText, onOk, onCancel, width, centered } = options

    // Use the appropriate Modal method based on type
    Modal[type]({
      title,
      content,
      okText: okText || 'OK',
      cancelText: cancelText || 'Cancel',
      onOk,
      onCancel,
      width: width || 420,
      centered: centered !== undefined ? centered : true,
    })
  }, [])

  // Shorthand for confirm modals (most commonly used)
  const confirm = useCallback(
    (options: ModalOptions) => {
      openModal('confirm', options)
    },
    [openModal],
  )

  return <ModalContext.Provider value={{ openModal, confirm }}>{children}</ModalContext.Provider>
}
