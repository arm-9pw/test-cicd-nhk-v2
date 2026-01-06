import React from 'react'

import { CloseCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

import css from './ErrorModal.module.css'

import { useAppDispatch, useAppSelector } from 'app/hook'
import { clearError, selectError } from 'app/slices/errorSlice'

import HeaderTitle from 'components/HeaderTitle'

const ErrorModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const { message, isOpen } = useAppSelector(selectError)

  const handleOk = () => {
    dispatch(clearError())
  }

  const handleCancel = () => {
    dispatch(clearError())
  }

  return (
    <Modal
      title={
        <HeaderTitle title="Error" titlePreIcon={<CloseCircleOutlined />} />
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="OK"
      cancelText="Cancel"
      className={css['error-modal']}
    >
      <p>{message}</p>
    </Modal>
  )
}

export default ErrorModal
