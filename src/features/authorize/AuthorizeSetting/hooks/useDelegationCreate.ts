import { useCreateDelegationMutation } from 'api/delegationApi'
import { CreateDelegationRequest } from 'api/delegationApi.types'
import { useNotification } from 'hooks/useNotification'

import { AuthorizationFormValues } from '../types'

export const useDelegationCreate = () => {
  const [createDelegation, { isLoading: isCreating }] = useCreateDelegationMutation()
  const { openNotification } = useNotification()

  const handleCreateDelegation = async (
    formData: AuthorizationFormValues,
    onSuccess?: () => void,
  ) => {
    try {
      const [activatedAt, expiredAt] = formData.authorizePeriod || []

      const requestData: CreateDelegationRequest = {
        delegateId: formData.delegateId,
        delegateName: formData.delegateName,
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

      await createDelegation(requestData).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Authorization created successfully',
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message
      console.error('Failed to create delegation:', errorMessage)
      openNotification({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to create authorization. Please try again.',
      })
    }
  }

  return {
    handleCreateDelegation,
    isCreating,
  }
}
