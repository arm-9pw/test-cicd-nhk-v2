import React, { useEffect } from 'react'

import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Space } from 'antd'
import dayjs from 'dayjs'

import { useExtendDelegationMutation } from 'api/delegationApi'
import { DelegationType, ExtendDelegationRequest } from 'api/delegationApi.types'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'

import { gutter } from 'constants/index'

interface ExtendDelegationFormValues {
  newEndDateTime: dayjs.Dayjs
  reason: string
}

interface ExtendDelegationModalProps {
  open: boolean
  onCancel: () => void
  afterClose?: () => void
  selectedDelegation?: DelegationType
  isLoading?: boolean
}

const ExtendDelegationModal: React.FC<ExtendDelegationModalProps> = ({
  open,
  onCancel,
  afterClose,
  selectedDelegation,
  isLoading = false,
}) => {
  const [formRef] = Form.useForm()
  const [extendDelegation, { isLoading: isExtending }] = useExtendDelegationMutation()
  const { openNotification } = useNotification()

  // Set initial values when modal opens
  useEffect(() => {
    if (selectedDelegation && open) {
      const currentExpiredAt = selectedDelegation.expiredAt
        ? dayjs(selectedDelegation.expiredAt)
        : null

      formRef.setFieldsValue({
        newEndDateTime: currentExpiredAt
          ? currentExpiredAt.add(7, 'days').endOf('day')
          : dayjs().add(7, 'days').endOf('day'),
        reason: '',
      })
    } else if (!selectedDelegation && open) {
      formRef.resetFields()
    }
  }, [selectedDelegation, open, formRef])

  const handleSave = async () => {
    try {
      // Validate form first
      const values: ExtendDelegationFormValues = await formRef.validateFields()

      if (!selectedDelegation?.id) {
        throw new Error('No authorization selected')
      }

      const requestData: ExtendDelegationRequest = {
        delegationId: selectedDelegation.id,
        newEndDateTime: values.newEndDateTime.format('YYYY-MM-DDT23:59:59'),
        reason: values.reason,
      }

      await extendDelegation({
        id: selectedDelegation.id,
        body: requestData,
      }).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Authorization extended successfully',
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
      console.error('Failed to extend authorization:', errorMessage)
      openNotification({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to extend authorization. Please try again.',
      })
    }
  }

  const handleCancel = () => {
    formRef.resetFields()
    onCancel()
  }

  const getCurrentExpiryDate = () => {
    if (selectedDelegation?.expiredAt) {
      return dayjs(selectedDelegation.expiredAt).format('YYYY-MM-DD')
    }
    return 'N/A'
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle title="Extend Authorization" titlePreIcon={<ClockCircleOutlined />} />
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
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: 'var(--clr-white-700)',
                borderRadius: 6,
              }}
            >
              <strong>Current Expiry:</strong> {getCurrentExpiryDate()}
            </div>
          </Col>
          <Col span={24}>
            <Form.Item
              label="New End Date"
              name="newEndDateTime"
              rules={[
                { required: true, message: 'Please select new end date' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve()

                    const currentExpiry = selectedDelegation?.expiredAt
                      ? dayjs(selectedDelegation.expiredAt)
                      : dayjs()

                    if (value.isBefore(currentExpiry)) {
                      return Promise.reject(
                        new Error('New end date must be after current expiry date'),
                      )
                    }

                    return Promise.resolve()
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select new end date"
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  const currentExpiry = selectedDelegation?.expiredAt
                    ? dayjs(selectedDelegation.expiredAt)
                    : dayjs()
                  return current && current.isBefore(currentExpiry, 'day')
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Extension Reason"
              name="reason"
              rules={[
                { required: true, message: 'Please provide a reason for extension' },
                { max: 1000, message: 'Maximum 1000 characters allowed' },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter reason for extending this authorization"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={handleCancel} disabled={isExtending || isLoading}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={isExtending || isLoading}
              icon={<ClockCircleOutlined />}
            >
              Extend Authorization
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  )
}

export default ExtendDelegationModal
