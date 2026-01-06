import React, { useEffect } from 'react'

import {
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Popconfirm, Radio } from 'antd'

import styles from './styles.module.css'

import { ApprovalRouteResponse, ApprovalStep } from 'api/approvalApi.types'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'
import PasscodeModal from 'components/PasscodeModal'
import usePasscodeSubmission from 'features/approvals/MyApprovals/components/ApproveRejectModal/hooks/usePasscodeSubmission'

// Import shared constants
import { DECISIONS } from '../../constants'
import ApprovalFlow from '../ApprovalFlow'

const { TextArea } = Input

interface ApproveRejectModalProps {
  modalHook: ReturnType<typeof useCustomModal>
  approvalRoute?: ApprovalRouteResponse
  isFetching?: boolean
  error?: unknown
  refreshPreviewSignedPdf?: () => void
}

/**
 * Modal component for approving or rejecting documents
 */
const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({
  modalHook,
  approvalRoute,
  isFetching,
  error,
  refreshPreviewSignedPdf,
}) => {
  const [form] = Form.useForm()

  // Find the active step that needs approval
  const activeStep = approvalRoute?.approvalSteps?.find((step: ApprovalStep) => step.active)

  // Use the passcode submission hook with real API integration
  const {
    isSubmitting,
    passcodeError,
    handleFormSubmit,
    handlePasscodeConfirm,
    passcodeModalHook: {
      handleCancel: handlePasscodeCancel,
      afterClose: handlePasscodeAfterClose,
      isModalVisible: isPasscodeModalVisible,
      isModalMounted: isPasscodeModalMounted,
    },
  } = usePasscodeSubmission({
    routeId: approvalRoute?.routeId || '',
    stepId: activeStep?.stepId || '',
    onSuccess: () => {
      modalHook.handleCancel()
      refreshPreviewSignedPdf?.()
    },
  })

  // Watch for changes to the decision field
  const decision = Form.useWatch('decision', form)

  // Re-validate remarks field when decision changes
  useEffect(() => {
    if (decision) {
      form.validateFields(['remarks']).catch(() => {
        // Validation errors are expected, no need to handle
      })
    }
  }, [decision, form])

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      handleFormSubmit(values)
    })
  }

  const handleCancel = () => {
    form.resetFields()
    modalHook.handleCancel()
  }

  // Reset form when modal closes
  const handleAfterClose = () => {
    form.resetFields()
    if (modalHook.afterClose) {
      modalHook.afterClose()
    }
  }

  return (
    <Modal
      title={
        <>
          <HeaderTitle
            title="การตัดสินใจอนุมัติ / Approval Decision"
            titlePreIcon={<AuditOutlined />}
          />
          <Divider style={{ margin: 16 }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={handleCancel}
      afterClose={handleAfterClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button key="cancel" onClick={handleCancel} icon={<StopOutlined />}>
            Cancel
          </Button>
          {decision === DECISIONS.REJECT ? (
            <Popconfirm
              title="Are you sure you want to reject?"
              description="This action cannot be undone."
              okText="Yes, Reject"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              onConfirm={handleSubmit}
            >
              <Button
                key="reject"
                type="primary"
                danger
                loading={isSubmitting}
                icon={<CloseCircleOutlined />}
              >
                Confirm Rejection
              </Button>
            </Popconfirm>
          ) : (
            <Button
              key="approve"
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              icon={<CheckCircleOutlined />}
              disabled={!decision}
            >
              Confirm Approval
            </Button>
          )}
        </div>
      }
      width={500}
      className={styles['approve-reject-modal']}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Approval Decision"
          name="decision"
          rules={[{ required: true, message: 'Please select a decision' }]}
        >
          <Radio.Group className={styles['decision-group']}>
            <Radio value={DECISIONS.APPROVE}>Approve</Radio>
            <Radio value={DECISIONS.REJECT}>Reject</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="remarks"
          label="Remarks"
          rules={[
            {
              required: decision === DECISIONS.REJECT,
              message: 'Please enter your remarks for rejection',
            },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Enter your remarks here"
            className={styles['remarks-textarea']}
          />
        </Form.Item>
      </Form>
      <ApprovalFlow approvalRoute={approvalRoute} isLoading={isFetching || false} error={error} />

      {/* Passcode Modal for approval/rejection confirmation */}
      {isPasscodeModalMounted && (
        <PasscodeModal
          isOpen={isPasscodeModalVisible}
          onClose={handlePasscodeCancel}
          onConfirm={handlePasscodeConfirm}
          afterClose={handlePasscodeAfterClose}
          isLoading={isSubmitting}
          error={passcodeError}
        />
      )}
    </Modal>
  )
}

export default ApproveRejectModal
