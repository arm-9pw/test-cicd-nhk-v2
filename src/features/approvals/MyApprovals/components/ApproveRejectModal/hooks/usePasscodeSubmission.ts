import { useState } from 'react'

import { useApproveStepMutation, useRejectStepMutation } from 'api/approvalApi'
import { DecisionType } from 'api/approvalApi.types'
import useCustomModal from 'hooks/useCustomModal'

// Import the DECISIONS constant from a shared location
import { DECISIONS } from '../../../constants'

interface FormValues {
  decision: string
  remarks: string
}

interface UsePasscodeSubmissionProps {
  routeId: string
  stepId: string
  onSuccess: () => void
}

/**
 * Custom hook for handling passcode submission flow
 *
 * This hook manages the passcode modal state and validation logic
 */
const usePasscodeSubmission = ({ routeId, stepId, onSuccess }: UsePasscodeSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passcodeError, setPasscodeError] = useState<string | undefined>()
  const [formValues, setFormValues] = useState<FormValues | null>(null)

  // Passcode modal state using useCustomModal hook
  const passcodeModalHook = useCustomModal()

  // Initialize the API mutation hooks
  const [approveStep] = useApproveStepMutation()
  const [rejectStep] = useRejectStepMutation()

  // Submit with passcode validation
  const submitWithPasscode = async (values: FormValues, passcode?: string) => {
    setIsSubmitting(true)

    try {
      const requestBody = {
        routeId,
        stepId,
        decision: values.decision as DecisionType,
        comments: values.remarks,
        ...(passcode && { passcode }),
      }

      // Call the appropriate API endpoint based on the decision
      if (values.decision === DECISIONS.APPROVE) {
        await approveStep(requestBody).unwrap()
      } else {
        await rejectStep(requestBody).unwrap()
      }

      // Close modals on success
      passcodeModalHook.handleCancel()
      onSuccess()
    } catch (error) {
      console.error('API error:', error)
      setPasscodeError('An error occurred while processing your request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle passcode confirmation
  const handlePasscodeConfirm = (passcode: string) => {
    // Clear previous errors
    setPasscodeError(undefined)

    if (formValues) {
      // Submit with passcode directly to the API
      submitWithPasscode(formValues, passcode)
    }
  }

  // Handle form submission with passcode
  const handleFormSubmit = (values: FormValues) => {
    // Store form values for later submission
    setFormValues(values)
    
    // Always show passcode modal
    passcodeModalHook.showModal()
  }

  return {
    isSubmitting,
    passcodeError,
    handleFormSubmit,
    handlePasscodeConfirm,
    passcodeModalHook,
  }
}

export default usePasscodeSubmission
