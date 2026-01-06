import { useState } from 'react'

import { useSubmitWithApprovalPOMutation } from 'api/poApi'
import { PurchaseOrderRespType } from 'api/poApi.types'
// import { useAppDispatch } from 'app/hook'
// import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

type ApprovalActionsProps = {
  poData?: PurchaseOrderRespType
  validatePO: () => Promise<void>
  updatePOForSubmission: () => Promise<void>
}

export const useApprovalActions = ({
  poData,
  validatePO,
  updatePOForSubmission,
}: ApprovalActionsProps) => {
  // const dispatch = useAppDispatch()
  const { openNotification } = useNotification()
  const approvalsModalHook = useCustomModal()
  const [submitWithApproval] = useSubmitWithApprovalPOMutation()
  const [showSubmitButton, setShowSubmitButton] = useState(true)
  const [canEditNextApprover, setCanEditNextApprover] = useState(false)
  const [documentType, setDocumentType] = useState<'PO'>('PO')

  // Handle submit with validation - validate first, then open modal
  const handleSubmitWithValidation = async () => {
    try {
      await validatePO()
    } catch (error) {
      // Validation failed, don't open modal
      console.error('Validation failed:', error)
      return
    }

    // Save changes before opening approval modal
    if (updatePOForSubmission) {
      try {
        await updatePOForSubmission()
      } catch (error) {
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'Failed to update PO. changes. Please try again.',
        })
        console.error('Failed to save PR changes:', error)
        return // Don't open modal if save fails
      }
    }

    setDocumentType('PO') // Set document type to PO
    setShowSubmitButton(true) // Show submit button for submission
    setCanEditNextApprover(true) // Allow editing next approver for new submissions
    approvalsModalHook.showModal() // Validation passed, open modal
  }

  // Handle check status - open modal without submit button
  const handleCheckStatus = () => {
    setDocumentType('PO') // Set document type to PO
    setShowSubmitButton(false) // Hide submit button for status check
    setCanEditNextApprover(false) // Don't allow editing next approver when just checking status
    approvalsModalHook.showModal()
  }

  // Handle submission action based on document type
  const handleSubmitAction = async ({ passcode }: { passcode: string }): Promise<void> => {
    if (!poData?.id) {
      throw new Error('Invalid PO ID.')
    }

    try {
      // dispatch(showLoading())

      // Define success messages for different document types
      const successMessages = {
        PO: {
          title: 'PO Submitted Successfully',
          description: 'Your Purchase Order has been submitted for approval.',
        },
      }

      // Use the provided function to update PO data for submission
      // This function will:
      // 1. Compose the update data
      // 2. Update the PO via API
      // [28 Nov 2025] NOTE: ไม่ต้องยิง save ก่อนอีกรอบแล้วเพราะยิง save ไปตั้งแต่ก่อนเปิด modal
      // await updatePOForSubmission()

      // Step 3: Submit with approval
      await submitWithApproval({ poid: poData.id.toString(), passcode }).unwrap()

      // Single place for success notifications
      openNotification({
        type: 'success',
        ...(successMessages[documentType] || successMessages['PO']),
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
      // dispatch(hideLoading())
    }
  }

  return {
    approvalsModalHook,
    showSubmitButton,
    canEditNextApprover,
    documentType,
    handleSubmitWithValidation,
    handleCheckStatus,
    handleSubmitAction,
  }
}

export default useApprovalActions
