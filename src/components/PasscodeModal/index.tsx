import React, { useState } from 'react'

import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Modal, Spin } from 'antd'

// const { Text } = Typography

type PasscodeModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (passcode: string) => void
  afterClose?: () => void
  isLoading?: boolean
  error?: string
}

const PasscodeModal = ({
  isOpen,
  onClose,
  onConfirm,
  afterClose,
  isLoading = false,
  error,
}: PasscodeModalProps) => {
  const [form] = Form.useForm()
  const [passcode, setPasscode] = useState('')

  const handleSubmit = () => {
    form.validateFields().then(() => {
      onConfirm(passcode)
    })
  }

  const handleCancel = () => {
    form.resetFields()
    setPasscode('')
    onClose()
  }

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasscode(e.target.value)
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LockOutlined />
          <span>Enter Your Passcode</span>
        </div>
      }
      open={isOpen}
      onCancel={isLoading ? undefined : handleCancel}
      afterClose={afterClose}
      footer={null}
      destroyOnClose
      centered
      width={400}
      closable={!isLoading}
      maskClosable={!isLoading}
    >
      <Spin spinning={isLoading} tip="Submitting...">
        <div style={{ padding: '16px 0' }}>
          {/* <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
            Please enter your passcode to confirm the submission of this Purchase Requisition.
          </Text> */}

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={isLoading}>
            <Form.Item
              name="passcode"
              label="Passcode"
              rules={[{ required: true, message: 'Please enter your passcode' }]}
            >
              <Input.Password
                placeholder="Enter your passcode"
                value={passcode}
                onChange={handlePasscodeChange}
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoFocus
                disabled={isLoading}
              />
            </Form.Item>

            <div
              style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}
            >
              <Button onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={!passcode.trim() || isLoading}
              >
                Confirm Submit
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

export default PasscodeModal
