import { useState } from 'react'

import { DoubleRightOutlined } from '@ant-design/icons'
import { AuditOutlined } from '@ant-design/icons'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Button, Col, Divider, Modal, Popconfirm, Result, Row, Spin } from 'antd'

import { useGetApprovalRouteQuery } from 'api/approvalApi'
import useCustomModal from 'hooks/useCustomModal'

import ApproverSteps from 'components/ApproverSteps'
import HeaderTitle from 'components/HeaderTitle'
import PasscodeModal from 'components/PasscodeModal'

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'data' in error
}

const isSerializedError = (error: unknown): error is SerializedError => {
  return typeof error === 'object' && error !== null && 'message' in error
}

type ApprovalModalProps = {
  isOpen: boolean
  onClose: () => void
  afterClose: () => void
  documentId: string
  documentType: 'PR' | 'PO' | 'RECEIVE_PR'
  routeId?: string
  onSubmitAction?: ({ passcode }: { passcode: string }) => Promise<void>
  showSubmitButton?: boolean
  canEditNextApprover?: boolean
}

// Helper function to get button text and popconfirm content based on document type
const getActionContent = (documentType: 'PR' | 'PO' | 'RECEIVE_PR') => {
  switch (documentType) {
    case 'RECEIVE_PR':
      return {
        title: 'Receive Purchase Requisition',
        description: 'Are you sure you want to receive this PR. ?',
        buttonText: 'Confirm Receive',
      }
    case 'PO':
      return {
        title: 'Submit Purchase Order',
        description: 'Are you sure you want to submit this PO. ?',
        buttonText: 'Confirm Submit',
      }
    case 'PR':
    default:
      return {
        title: 'Submit Purchase Requisition',
        description: 'Are you sure you want to submit this PR. ?',
        buttonText: 'Confirm Submit',
      }
  }
}

const ApprovalModal = ({
  isOpen,
  onClose,
  afterClose,
  documentId,
  documentType,
  routeId,
  onSubmitAction,
  showSubmitButton = true,
  canEditNextApprover = false,
}: ApprovalModalProps) => {
  // Passcode modal state using useCustomModal hook
  const {
    showModal: showPasscodeModal,
    handleCancel: handlePasscodeModalCancel,
    afterClose: handlePasscodeAfterClose,
    isModalVisible: isPasscodeModalVisible,
    isModalMounted: isPasscodeModalMounted,
  } = useCustomModal()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passcodeError, setPasscodeError] = useState<string | undefined>(undefined)

  const {
    data: approvalRoute,
    isFetching,
    error,
  } = useGetApprovalRouteQuery(
    { documentId, documentType, ...(routeId && { routeId }) },
    {
      skip: !isOpen || !documentId || !documentType,
      refetchOnMountOrArgChange: true,
    },
  )
  const { currentData: receivingPrApprovalRouteData, isFetching: receivingPrApprovalRouteLoading } =
    useGetApprovalRouteQuery(
      {
        documentId: documentId,
        documentType: 'RECEIVE_PR',
      },
      {
        skip: !isOpen || !documentId || documentType !== 'PR',
        refetchOnMountOrArgChange: true,
      },
    )

  const handleSubmit = () => {
    showPasscodeModal()
  }

  const handlePasscodeConfirm = async (passcode: string) => {
    setIsSubmitting(true)
    setPasscodeError(undefined)

    try {
      // Call parent's submission handler
      if (onSubmitAction) {
        await onSubmitAction({ passcode })
      }

      // Success - close both modals
      handlePasscodeModalCancel()
      onClose()
    } catch (error) {
      let message = 'Submission failed. Please try again.'

      if (isFetchBaseQueryError(error)) {
        const data = error.data as { message?: string } | undefined
        if (typeof data?.message === 'string') {
          message = data.message
        }
      } else if (isSerializedError(error)) {
        if (typeof error.message === 'string') {
          message = error.message
        }
      } else if (error instanceof Error && typeof error.message === 'string') {
        message = error.message
      }

      setPasscodeError(message)
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasscodeCancel = () => {
    handlePasscodeModalCancel()
    setPasscodeError(undefined)
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle
            title="รายละเอียดสถานะการอนุมัติ / Approval Status Details"
            titlePreIcon={<AuditOutlined />}
          />
          <Divider style={{ marginBottom: 8 }} />
        </>
      }
      open={isOpen}
      onCancel={onClose}
      afterClose={afterClose}
      footer={
        !isFetching && (
          <Row gutter={[8, 8]} style={{ marginTop: 16 }} align="bottom" justify="end">
            <Col>
              <Button onClick={onClose}>Close</Button>
            </Col>
            {showSubmitButton && (
              <Col>
                <Popconfirm
                  title={getActionContent(documentType).title}
                  description={getActionContent(documentType).description}
                  onConfirm={handleSubmit}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">{getActionContent(documentType).buttonText}</Button>
                </Popconfirm>
              </Col>
            )}
          </Row>
        )
      }
      width="80%"
    >
      {isFetching || receivingPrApprovalRouteLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Result
          status="500"
          title="Error loading approval route data"
          subTitle="Please try again later."
        />
      ) : (
        <>
          {receivingPrApprovalRouteData && (
            <HeaderTitle title="Purchase Requisition" titlePostIcon={<DoubleRightOutlined />} />
          )}
          <ApproverSteps canEditNextApprover={canEditNextApprover} approvalRoute={approvalRoute} />
          {receivingPrApprovalRouteData && (
            <>
              <Divider style={{ marginBlockEnd: 8 }} />
              <div>
                <HeaderTitle title="Receive PR." titlePostIcon={<DoubleRightOutlined />} />
                <ApproverSteps
                  canEditNextApprover={false}
                  approvalRoute={receivingPrApprovalRouteData}
                />
              </div>
            </>
          )}
        </>
      )}

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

export default ApprovalModal
