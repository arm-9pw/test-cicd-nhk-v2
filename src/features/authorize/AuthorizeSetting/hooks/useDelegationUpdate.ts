import { useUpdateDelegationMutation } from 'api/delegationApi'
import { DelegationType, UpdateDelegationRequest } from 'api/delegationApi.types'
import { useNotification } from 'hooks/useNotification'

import { AuthorizationFormValues } from '../types'

export const useDelegationUpdate = () => {
  const [updateDelegation, { isLoading: isUpdating }] = useUpdateDelegationMutation()
  const { openNotification } = useNotification()

  const handleUpdateDelegation = async (
    formData: AuthorizationFormValues,
    selectedDelegation: DelegationType,
    // onSuccess?: () => void,
  ) => {
    try {
      const [activatedAt, expiredAt] = formData.authorizePeriod || []

      const requestData: UpdateDelegationRequest = {
        id: selectedDelegation.id,
        delegatorId: selectedDelegation.delegatorId,
        delegatorName: selectedDelegation.delegatorName,
        delegatorPosition: selectedDelegation.delegatorPosition,
        delegatorEmail: selectedDelegation.delegatorEmail,
        delegatorSectionName: selectedDelegation.delegatorSectionName,
        delegatorSectionId: selectedDelegation.delegatorSectionId,
        delegatorSite: selectedDelegation.delegatorSite,
        delegateId: formData.delegateId,
        delegateName: formData.delegateName,
        delegatePosition: formData.delegatePosition,
        delegatePositionName: formData.delegatePositionName || formData.delegatePosition,
        delegatePositionCode: formData.delegatePositionCode || '',
        delegatePositionId: formData.delegatePositionId || '',
        delegateEmail: formData.delegateEmail,
        delegateSectionName: formData.delegateSectionName,
        delegateSectionId: formData.delegateSectionId,
        delegateSite: formData.delegateSite,
        reasonDetails: formData.reasonDetails || '',
        activatedAt: activatedAt?.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        expiredAt: expiredAt?.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        isActive: formData.isActive || false,
      }

      await updateDelegation({ id: selectedDelegation.id, body: requestData }).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Authorization updated successfully',
      })

      // if (onSuccess) {
      //   onSuccess()
      // }
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message
      console.error('Failed to update delegation:', errorMessage)
      openNotification({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to update authorization. Please try again.',
      })
    }
  }

  return {
    handleUpdateDelegation,
    isUpdating,
  }
}
