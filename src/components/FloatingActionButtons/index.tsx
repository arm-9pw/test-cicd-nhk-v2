import React from 'react'

import { CloseOutlined, PrinterOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'

import { useAppSelector } from 'app/hook'
import { selectLoading } from 'app/slices/loadingSlice'

type FloatingActionButtonsProps = {
  disabledAll?: boolean
  isShowPrint?: boolean
  onSave: () => void
  onPrint?: () => void
  onCancel?: () => void
  onSubmit?: () => void
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  disabledAll = false,
  isShowPrint = true,
  onSave,
  onCancel,
  onPrint,
  onSubmit,
}) => {
  const { isLoading } = useAppSelector(selectLoading)
  const disabled = disabledAll || isLoading

  const handlePrint = () => {
    // Implement print functionality
    if (onPrint) {
      onPrint()
      return
    }
  }

  const handleCancel = () => {
    // Implement cancel functionality
    if (onCancel) {
      onCancel()
      return
    }
  }

  const handleSave = () => {
    // Implement save functionality
    if (onSave) {
      onSave()
    }
  }

  const handleSubmit = () => {
    // Implement submit functionality
    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: '16px',
        padding: '16px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Space>
        {isShowPrint && (
          <Button icon={<PrinterOutlined />} onClick={handlePrint} disabled={disabled}>
            Print
          </Button>
        )}
        <Button icon={<CloseOutlined />} onClick={handleCancel} disabled={disabled}>
          Cancel
        </Button>
        <Button icon={<SaveOutlined />} onClick={handleSave} disabled={disabled}>
          Save
        </Button>
        <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit} disabled={disabled}>
          Submit
        </Button>
      </Space>
    </div>
  )
}

export default FloatingActionButtons
