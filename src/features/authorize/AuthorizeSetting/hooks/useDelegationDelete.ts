import { useDeleteDelegationMutation } from 'api/delegationApi'
import { DelegationType } from 'api/delegationApi.types'
import { useNotification } from 'hooks/useNotification'

export const useDelegationDelete = () => {
  const [deleteDelegation, { isLoading: isDeleting }] = useDeleteDelegationMutation()
  const { openNotification } = useNotification()

  const handleDeleteDelegation = async (selectedDelegation: DelegationType, onSuccess?: () => void) => {
    try {
      await deleteDelegation(selectedDelegation.id).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Authorization deleted successfully',
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message
      console.error('Failed to delete delegation:', errorMessage)
      openNotification({
        type: 'error',
        title: 'Error',
        description: errorMessage || 'Failed to delete authorization. Please try again.',
      })
    }
  }

  return {
    handleDeleteDelegation,
    isDeleting,
  }
}
