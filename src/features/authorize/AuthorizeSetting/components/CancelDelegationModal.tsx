import React from 'react'

import { StopOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Row, Space } from 'antd'
import dayjs from 'dayjs'

import { useCancelDelegationMutation } from 'api/delegationApi'
import { CancelDelegationRequest, DelegationType } from 'api/delegationApi.types'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'

import { gutter } from 'constants/index'

interface CancelDelegationFormValues {
  cancelledAt: dayjs.Dayjs
  cancelledBy: string
  cancellationReason: string
}

interface CancelDelegationModalProps {
  open: boolean
  onCancel: () => void
  afterClose?: () => void
  selectedDelegation?: DelegationType
  isLoading?: boolean
}

const CancelDelegationModal: React.FC<CancelDelegationModalProps> = ({
  open,
  onCancel,
  afterClose,
  selectedDelegation,
  isLoading = false,
}) => {
  const [formRef] = Form.useForm()
  const [cancelDelegation, { isLoading: isCancelling }] = useCancelDelegationMutation()
  const { openNotification } = useNotification()

  const handleSave = async () => {
    try {
      // Validate form first
      const values: CancelDelegationFormValues = await formRef.validateFields()

      if (!selectedDelegation?.id) {
        throw new Error('No authorization selected')
      }

      const requestData: CancelDelegationRequest = {
        cancelledAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        cancelledBy: values.cancelledBy,
        cancellationReason: values.cancellationReason,
      }

      await cancelDelegation({
        id: selectedDelegation.id,
        body: requestData,
      }).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Authorization cancelled successfully',
      })

      formRef.resetFields()
      handleCancel()
    } catch (error) {
      // Handle validation errors
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // Form validation error - don't show notification, form will show field errors
        return
      }

      const errorMessage = (error as { data?: { message?: string } })?.data?.message
      console.error('Failed to cancel authorization:', errorMessage)
      openNotification({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to cancel authorization. Please try again.',
      })
    }
  }

  const handleCancel = () => {
    formRef.resetFields()
    onCancel()
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle title="Cancel Authorization" titlePreIcon={<StopOutlined />} />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={open}
      onCancel={handleCancel}
      afterClose={afterClose}
      footer={null}
    >
      <Form labelWrap layout="vertical" form={formRef}>
        <Row gutter={gutter}>
          <Col span={24}>
            <Form.Item
              label="Cancelled By (Email)"
              name="cancelledBy"
              rules={[
                {
                  required: true,
                  message: 'Please enter email of who cancelled the authorization',
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Cancellation Reason"
              name="cancellationReason"
              rules={[
                { required: true, message: 'Please provide a reason for cancellation' },
                { max: 1000, message: 'Maximum 1000 characters allowed' },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter reason for cancelling this authorization"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={handleCancel} disabled={isCancelling || isLoading}>
              Cancel
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleSave}
              loading={isCancelling || isLoading}
              icon={<StopOutlined />}
            >
              Cancel Authorization
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  )
}

export default CancelDelegationModal
