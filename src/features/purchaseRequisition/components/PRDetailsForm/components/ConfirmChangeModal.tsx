import React from 'react'

import { WarningOutlined } from '@ant-design/icons'
import { Divider, Modal } from 'antd'

import useCustomModal from 'hooks/useCustomModal'

// Using the actual color value instead of importing from constants/colors
const clrYellow = '#FAAD14'

interface ConfirmChangeModalProps {
  modalHook: ReturnType<typeof useCustomModal>
  onConfirm: () => void
  onCancel: () => void
  title?: React.ReactNode
  message?: string
}

/**
 * A generic confirmation modal component that warns users about the consequences of their changes
 * Shows a warning that changing the value will delete existing items and related data
 */
const ConfirmChangeModal: React.FC<ConfirmChangeModalProps> = ({
  modalHook,
  onConfirm,
  onCancel,
  title = 'คุณต้องการเปลี่ยน Budget Code หรือไม่?',
  message,
}) => {
  return (
    modalHook.isModalMounted && (
      <Modal
        title={
          <>
            <WarningOutlined style={{ color: clrYellow, marginRight: 8, fontSize: 22 }} />
            {title}
            <Divider style={{ margin: '10px 0' }} />
          </>
        }
        open={modalHook.isModalVisible}
        onOk={onConfirm}
        onCancel={onCancel}
        afterClose={modalHook.afterClose}
        okText="Confirm/ตกลง"
        cancelText="Cancel/ยกเลิก"
        cancelButtonProps={{
          type: 'primary',
          danger: true,
        }}
      >
        <p style={{ marginTop: 0, marginBottom: 20 }}>
          {message}
        </p>
      </Modal>
    )
  )
}

export default ConfirmChangeModal
