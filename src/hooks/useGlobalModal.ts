import { useContext } from 'react'
import { ModalContext } from '../contexts/ModalContextDefinition'

export const useGlobalModal = () => {
  const context = useContext(ModalContext)
  
  if (!context) {
    throw new Error('useGlobalModal must be used within a ModalProvider')
  }
  
  return context
}
