import { DelegationType } from 'api/delegationApi.types'

import { AuthorizationFormValues } from '../types'

import { useDelegationCreate } from './useDelegationCreate'
import { useDelegationDelete } from './useDelegationDelete'
import { useDelegationUpdate } from './useDelegationUpdate'

interface UseDelegationActionsProps {
  selectedDelegation?: DelegationType
  onSuccess?: () => void
}

export const useDelegationActions = ({
  selectedDelegation,
  onSuccess,
}: UseDelegationActionsProps) => {
  const { handleCreateDelegation, isCreating } = useDelegationCreate()
  const { handleUpdateDelegation, isUpdating } = useDelegationUpdate()
  const { handleDeleteDelegation, isDeleting } = useDelegationDelete()

  const handleCreate = async (formData: AuthorizationFormValues) => {
    await handleCreateDelegation(formData, onSuccess)
  }

  const handleUpdate = async (formData: AuthorizationFormValues) => {
    if (!selectedDelegation) return
    await handleUpdateDelegation(formData, selectedDelegation)
  }

  const handleDelete = () => {
    if (!selectedDelegation) return
    handleDeleteDelegation(selectedDelegation, onSuccess)
  }

  const isLoading = isCreating || isUpdating || isDeleting

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
