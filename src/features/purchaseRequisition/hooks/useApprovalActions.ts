import { useState } from 'react'

import { useCalculateApprovalRouteMutation } from 'api/approvalApi'
import { useSubmitForReceivingMutation } from 'api/prApi'
import { PurchaseRequisitionRespType } from 'api/prApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import { convertCurrencyToBaht } from 'utils/generalHelpers'

type ApprovalActionsProps = {
  prData?: PurchaseRequisitionRespType
  validatePRData: () => Promise<boolean>
  handlePRSubmissionWithPasscode?: ({ passcode }: { passcode: string }) => Promise<void>
  submitPRUpdate?: () => Promise<void>
  exchangeRates: {
    source: number | null
    destination: number | null
  }
}

export const useApprovalActions = ({
  prData,
  validatePRData,
  handlePRSubmissionWithPasscode,
  submitPRUpdate,
  exchangeRates,
}: ApprovalActionsProps) => {
  const dispatch = useAppDispatch()
  const { openNotification } = useNotification()
  const [calculateApprovalRoute] = useCalculateApprovalRouteMutation()
  const [submitForReceiving] = useSubmitForReceivingMutation()
  const approvalsModalHook = useCustomModal()
  const [showSubmitButton, setShowSubmitButton] = useState(true)
  const [canEditNextApprover, setCanEditNextApprover] = useState(false)
  const [documentType, setDocumentType] = useState<'PR' | 'RECEIVE_PR'>('PR')

  // Handle submit with validation - validate first, then open modal
  const handleSubmitWithValidation = async () => {
    if (!(await validatePRData())) {
      return // Validation failed, don't open modal
    }

    // Save changes before opening approval modal
    if (submitPRUpdate) {
      try {
        await submitPRUpdate()
      } catch (error) {
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'Failed to update PR. changes. Please try again.',
        })
        console.error('Failed to save PR changes:', error)
        return // Don't open modal if save fails
      }
    }

    setDocumentType('PR') // Set document type to PR
    setShowSubmitButton(true) // Show submit button for submission
    setCanEditNextApprover(true) // Allow editing next approver for new submissions
    approvalsModalHook.showModal() // Validation passed, open modal
  }

  // Handle check status - open modal without submit button
  const handleCheckStatus = () => {
    setDocumentType('PR') // Set document type to PR
    setShowSubmitButton(false) // Hide submit button for status check
    setCanEditNextApprover(false) // Don't allow editing next approver when just checking status
    approvalsModalHook.showModal()
  }

  // Handle receive PR - calculate approval route and open modal
  const handleReceivePR = async () => {
    if (!prData?.id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR data or ID.',
      })
      return
    }

    const monetaryBaht = convertCurrencyToBaht({
      amount: prData.itemGrandTotal,
      exchangeRateSource: exchangeRates.source ?? 0,
      exchangeRateDestination: exchangeRates.destination ?? 0,
    })

    try {
      dispatch(showLoading())

      // Call the calculate approval route API
      await calculateApprovalRoute({
        documentId: prData.id.toString(),
        documentType: 'RECEIVE_PR',
        documentNumber: prData.prNo,
        totalAmount: monetaryBaht,
      }).unwrap()

      // If successful, open the approval modal
      setDocumentType('RECEIVE_PR')
      setShowSubmitButton(true)
      setCanEditNextApprover(true) // Allow editing next approver for receiving PR
      approvalsModalHook.showModal()
    } catch (error) {
      console.error('Failed to calculate approval route for PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to prepare PR for receiving',
        description: 'Unable to calculate approval route. Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  // Handle submission action based on document type
  const handleSubmitAction = async ({ passcode }: { passcode: string }): Promise<void> => {
    if (!prData?.id) {
      throw new Error('Invalid PR ID.')
    }

    try {
      // dispatch(showLoading())

      // Define success messages for different document types
      const successMessages = {
        PR: {
          title: 'PR Submitted Successfully',
          description: 'Your Purchase Requisition has been submitted for approval.',
        },
        RECEIVE_PR: {
          title: 'PR Received Successfully',
          description: 'Your Purchase Requisition has been submitted for receiving.',
        },
      }

      if (documentType === 'RECEIVE_PR') {
        // For receiving PR, use the submitForReceiving endpoint
        await submitForReceiving({ prid: prData.id.toString(), passcode }).unwrap()
      } else {
        // For regular PR submission, use the provided handler
        if (!handlePRSubmissionWithPasscode) {
          throw new Error('PR submission handler not provided.')
        }
        await handlePRSubmissionWithPasscode({ passcode })
      }

      // Single place for success notifications
      openNotification({
        type: 'success',
        ...(successMessages[documentType] || successMessages['PR']),
      })
    } catch (error) {
      // Single place for error notifications
      console.error(`Failed to submit ${documentType}:`, error)
      openNotification({
        type: 'error',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit. Please try again.',
      })
      throw error // Re-throw to keep modal open
    } finally {
      dispatch(hideLoading())
    }
  }

  return {
    approvalsModalHook,
    showSubmitButton,
    canEditNextApprover,
    documentType,
    handleSubmitWithValidation,
    handleCheckStatus,
    handleReceivePR,
    handleSubmitAction,
  }
}

export default useApprovalActions
