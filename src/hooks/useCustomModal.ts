import { useCallback, useState } from 'react'

type UseCustomModalReturnType = {
  showModal: () => void
  handleOk: () => void
  handleCancel: () => void
  afterClose: () => void
  isModalVisible: boolean
  isModalMounted: boolean
}

const useCustomModal = (): UseCustomModalReturnType => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalMounted, setIsModalMounted] = useState(false)

  const showModal = useCallback(() => {
    setIsModalMounted(true)
    setIsModalVisible(true)
  }, [])

  const handleOk = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const handleCancel = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const afterClose = useCallback(() => {
    // NOTE: Wait until closing animation is done, then set isModalMounted to false
    setIsModalMounted(false)
  }, [])

  return {
    showModal,
    handleOk,
    handleCancel,
    afterClose,
    isModalVisible,
    isModalMounted,
  }
}

export default useCustomModal
