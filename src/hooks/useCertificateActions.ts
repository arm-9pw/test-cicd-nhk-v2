import { useCallback } from 'react'

import {
  useLazyGetCertificateStatusQuery,
  useRegenerateCertificateMutation,
  useRequestPasscodeEmailMutation,
} from 'api/certificateApi'
import { useAppDispatch } from 'app/hook'
import { setCertificateStatus } from 'app/slices/certificateSlice'
import { useNotification } from 'hooks/useNotification'

/**
 * Hook for passcode and certificate actions
 * Provides methods for requesting passcode email and regenerating certificate
 */
export const useCertificateActions = () => {
  const dispatch = useAppDispatch()
  const { openNotification } = useNotification()

  const [requestPasscodeEmailMutation, { isLoading: isRequestingPasscode }] =
    useRequestPasscodeEmailMutation()
  const [regenerateCertificateMutation, { isLoading: isRegenerating }] =
    useRegenerateCertificateMutation()
  const [fetchCertificateStatus] = useLazyGetCertificateStatusQuery()

  // Request existing passcode to be sent via email
  const requestPasscodeEmail = useCallback(async () => {
    try {
      const result = await requestPasscodeEmailMutation().unwrap()
      openNotification({
        type: 'success',
        title: 'Passcode Sent',
        description: result.message || 'Your passcode has been sent to your email',
      })
      return { success: true, message: result.message }
    } catch (error) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        'Failed to send passcode email. Please try again.'
      openNotification({
        type: 'error',
        title: 'Request Failed',
        description: errorMessage,
      })
      return { success: false, message: errorMessage }
    }
  }, [requestPasscodeEmailMutation, openNotification])

  // Regenerate certificate and passcode
  const regenerateCertificate = useCallback(async () => {
    try {
      const result = await regenerateCertificateMutation().unwrap()
      openNotification({
        type: 'success',
        title: 'Certificate Regenerated',
        description:
          result.message || 'Your certificate has been regenerated and passcode sent to your email',
      })

      // Refetch certificate status after successful regeneration
      const statusResult = await fetchCertificateStatus().unwrap()
      dispatch(setCertificateStatus(statusResult))

      return { success: true, message: result.message }
    } catch (error) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        'Failed to regenerate certificate. Please try again.'
      openNotification({
        type: 'error',
        title: 'Regeneration Failed',
        description: errorMessage,
      })
      return { success: false, message: errorMessage }
    }
  }, [regenerateCertificateMutation, fetchCertificateStatus, dispatch, openNotification])

  return {
    requestPasscodeEmail,
    regenerateCertificate,
    isRequestingPasscode,
    isRegenerating,
    isLoading: isRequestingPasscode || isRegenerating,
  }
}

export default useCertificateActions
