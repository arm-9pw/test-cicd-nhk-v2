import { useState } from 'react'

import { useUpdateStepApproverMutation } from 'api/approvalApi'
import { ApproverHierarchyItem } from 'api/approvalApi.types'
import { useNotification } from 'hooks/useNotification'

interface SelectedApprover {
  stepId: string
  approver: ApproverHierarchyItem
}

interface UseChangeApproverProps {
  routeId?: string
  onApproverChange?: (stepId: string, approver: ApproverHierarchyItem) => void
}

export const useChangeApprover = ({ routeId, onApproverChange }: UseChangeApproverProps) => {
  // Get notification hook
  const { openNotification } = useNotification()

  // Get update approver mutation
  const [updateStepApprover, { isLoading: isUpdatingApprover }] = useUpdateStepApproverMutation()

  // State to track selected approver
  const [selectedApprover, setSelectedApprover] = useState<SelectedApprover | null>(null)

  // Handle approver change
  const handleApproverChange = async (stepId: string, approver: ApproverHierarchyItem) => {
    if (!routeId) return

    try {
      // Optimistically update local state
      setSelectedApprover({
        stepId,
        approver,
      })

      // Call the API to update the approver
      await updateStepApprover({
        stepId,
        routeId,
        ...approver,
      }).unwrap()

      // Show success notification
      openNotification({
        type: 'success',
        title: 'Approver Updated',
        description: `Successfully updated approver to ${approver.primaryApproverName}`,
      })

      // Call the parent callback if provided
      if (onApproverChange) {
        onApproverChange(stepId, approver)
      }
    } catch (error) {
      console.error('Failed to update approver:', error)

      // Reset the dropdown to the original approver
      setSelectedApprover(null)

      // Show error notification
      openNotification({
        type: 'error',
        title: 'Update Failed',
        description: 'Failed to update approver. Please try again.',
      })
    }
  }

  return {
    selectedApprover,
    isUpdatingApprover,
    handleApproverChange,
  }
}
