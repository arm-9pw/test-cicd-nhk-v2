import { createContext } from 'react'

export type ModalType = 'info' | 'success' | 'error' | 'warning' | 'confirm'

export interface ModalOptions {
  title: string
  content: string | React.ReactNode
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
  width?: number
  centered?: boolean
}

export interface ModalContextType {
  openModal: (type: ModalType, options: ModalOptions) => void
  confirm: (options: ModalOptions) => void
}

// Create context with default values
export const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  confirm: () => {},
})
